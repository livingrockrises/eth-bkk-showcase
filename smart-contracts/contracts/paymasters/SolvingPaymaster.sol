// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

/* solhint-disable reason-string */
/* solhint-disable no-inline-assembly */

import "account-abstraction/contracts/core/BasePaymaster.sol";
import "account-abstraction/contracts/core/UserOperationLib.sol";
import "account-abstraction/contracts/core/Helpers.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import { SignatureCheckerLib } from "solady/src/utils/SignatureCheckerLib.sol";
import { SafeTransferLib } from "solady/src/utils/SafeTransferLib.sol";

/**
 * Paymaster that fronts funds based on a signature/ proof.
 */
contract SolvingPaymaster is BasePaymaster {
    using UserOperationLib for PackedUserOperation;

    address public immutable verifyingSigner;

    uint256 private constant VALID_WITHDRAW_REQUEST_OFFSET = PAYMASTER_DATA_OFFSET;

    // Note: can create more offsets

    /// @notice Signed withdraw request allowing accounts to withdraw funds from this contract.
    struct WithdrawRequest {
        /// @dev The signature associated with this withdraw request.
        bytes signature;
        /// @dev The asset to withdraw.
        address asset;
        /// @dev The requested amount to withdraw.
        uint256 amount;
        /// @dev Unique nonce used to prevent replays.
        uint256 nonce;
        /// @dev The maximum expiry the withdraw request remains valid for.
        uint48 expiry;
    }

    /// @notice Track the amount of native asset and ERC20 tokens available to be withdrawn per
    /// user.
    mapping(address user => mapping(address token => uint256 amount)) internal _withdrawable;

    /// @dev Mappings keeping track of already used nonces per user to prevent replays of withdraw
    /// requests.
    mapping(uint256 nonce => mapping(address user => bool used)) internal _nonceUsed;

    /// @notice Thrown when trying to withdraw funds but nothing is available.
    error NoExcess();

    /// @notice Thrown when trying to replay a withdraw request with the same nonce.
    ///
    /// @param nonce The already used nonce.
    error InvalidNonce(uint256 nonce);

    constructor(IEntryPoint _entryPoint, address _verifyingSigner) BasePaymaster(_entryPoint) {
        verifyingSigner = _verifyingSigner;
    }

    /**
     * return the hash we're going to sign off-chain (and validate on-chain)
     * this method is called by the off-chain service, to sign the request.
     * it is called on-chain from the validatePaymasterUserOp, to validate the signature.
     * note that this signature covers all fields of the UserOperation, except the
     * "paymasterAndData",
     * which will carry the signature itself.
     */
    function getHash(
        PackedUserOperation calldata userOp,
        WithdrawRequest memory withdrawRequest
    )
        public
        view
        returns (bytes32)
    {
        //can't use userOp.hash(), since it contains also the paymasterAndData itself.
        address sender = userOp.getSender();
        return keccak256(
            abi.encode(
                sender,
                userOp.nonce,
                keccak256(userOp.initCode),
                keccak256(userOp.callData),
                userOp.accountGasLimits,
                uint256(
                    bytes32(
                        userOp.paymasterAndData[
                            PAYMASTER_VALIDATION_GAS_OFFSET:PAYMASTER_DATA_OFFSET
                        ]
                    )
                ),
                userOp.preVerificationGas,
                userOp.gasFees,
                block.chainid,
                address(this),
                withdrawRequest.asset,
                withdrawRequest.amount,
                withdrawRequest.nonce,
                withdrawRequest.expiry
            )
        );
    }

    /// @notice Returns whether the `withdrawRequest` signature is valid for the given `account`.
    ///
    /// @dev Does not validate nonce or expiry.
    ///
    /// @param userOp          The user operation.
    /// @param withdrawRequest The withdraw request.
    ///
    /// @return `true` if the signature is valid, else `false`.
    function isValidWithdrawSignature(
        PackedUserOperation calldata userOp,
        WithdrawRequest memory withdrawRequest
    )
        public
        view
        returns (bool)
    {
        return SignatureCheckerLib.isValidSignatureNow(
            verifyingSigner, getHash(userOp, withdrawRequest), withdrawRequest.signature
        );
    }

    /**
     * verify our external signer signed this request.
     * the "paymasterAndData" is expected to be the paymaster and a signature over the entire
     * request params
     * paymasterAndData[:20] : address(this)
     * paymasterAndData[20:84] : abi.encode(validUntil, validAfter)
     * paymasterAndData[84:] : signature
     */
    function _validatePaymasterUserOp(
        PackedUserOperation calldata userOp,
        bytes32, /*userOpHash*/
        uint256 requiredPreFund
    )
        internal
        override
        returns (bytes memory context, uint256 validationData)
    {
        (requiredPreFund);

        // Todo: We would also be adding proof here.
        WithdrawRequest memory withdrawRequest =
            abi.decode(userOp.paymasterAndData[VALID_WITHDRAW_REQUEST_OFFSET:], (WithdrawRequest));

        uint256 withdrawAmount = withdrawRequest.amount;

        if (_nonceUsed[withdrawRequest.nonce][userOp.sender]) {
            revert InvalidNonce(withdrawRequest.nonce);
        }

        _nonceUsed[withdrawRequest.nonce][userOp.sender] = true;

        bool sigFailed = !isValidWithdrawSignature(userOp, withdrawRequest);

        validationData = (sigFailed ? 1 : 0) | (uint256(withdrawRequest.expiry) << 160);

        _withdrawable[userOp.sender][withdrawRequest.asset] += withdrawAmount; // - maxCost (eth gas
            // converted in token terms)

        // Maybe more details like the proof is to be given to postOp.
        context = abi.encode(userOp.sender, withdrawRequest);
    }

    // function parsePaymasterAndData(bytes calldata paymasterAndData) public pure returns (uint48
    // validUntil, uint48 validAfter, bytes calldata signature) {
    //     // implement later
    // }

    /// @notice Allows the sender to withdraw any available ERC20 tokens associated with their
    /// account.
    ///
    /// @dev Can be called back during the `UserOperation` execution to sponsor funds for non-gas
    /// related
    ///      use cases (e.g., swap or mint).
    /// @param token The ERC20 token address to withdraw
    function withdrawTokenExcess(address token) external {
        require(token != address(0), "Invalid token address");
        uint256 amount = _withdrawable[msg.sender][token];
        if (amount == 0) revert NoExcess();
        delete _withdrawable[msg.sender][token];
        _withdraw(token, msg.sender, amount);
    }

    /// @notice Withdraws funds from this contract.
    ///
    /// @dev Callers MUST validate that the withdraw is legitimate before calling this method as
    ///      no validation is performed here.
    ///
    /// @param asset  The asset to withdraw.
    /// @param to     The beneficiary address.
    /// @param amount The amount to withdraw.
    function _withdraw(address asset, address to, uint256 amount) internal {
        if (asset == address(0)) {
            SafeTransferLib.safeTransferETH(to, amount);
        } else {
            SafeTransferLib.safeTransfer(asset, to, amount);
        }
    }

    function _postOp(
        PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost,
        uint256 actualUserOpFeePerGas
    )
        internal
        virtual
        override
    {
        (mode, context, actualGasCost, actualUserOpFeePerGas);

        // Todo: Get withdrawn information from context.
        // Todo: Get Proof from context.
        (address account, WithdrawRequest memory withdrawRequest) =
            abi.decode(context, (address, WithdrawRequest));

        // Compute the total remaining funds available for the user accout.
        uint256 withdrawable = _withdrawable[account][withdrawRequest.asset]; // + (maxGasCost -
            // actualGasCost); // can convert to token terms
        // Send the all remaining funds to the user accout.
        // Would wipe if not done via withdrawAccess
        delete _withdrawable[account][withdrawRequest.asset];

        // Todo: Pass on the proof and withdrawn information to LzSend.
    }
}
