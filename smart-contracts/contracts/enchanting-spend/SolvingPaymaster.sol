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
import { OApp, Origin, MessagingFee } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { OAppRead } from "@layerzerolabs/oapp-evm/contracts/oapp/OAppRead.sol";
import { MessagingReceipt } from "@layerzerolabs/oapp-evm/contracts/oapp/OAppSender.sol";
import { IOAppMapper } from "@layerzerolabs/oapp-evm/contracts/oapp/interfaces/IOAppMapper.sol";
import { IOAppReducer } from "@layerzerolabs/oapp-evm/contracts/oapp/interfaces/IOAppReducer.sol";
import { ReadCodecV1, EVMCallComputeV1, EVMCallRequestV1 } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/ReadCodecV1.sol";

/**
 * Paymaster that fronts funds based on a signature/ proof.
 */
contract SolvingPaymaster is BasePaymaster, OAppRead, IOAppMapper, IOAppReducer {
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

    struct EvmReadRequest {
        uint16 appRequestLabel;
        uint32 targetEid;
        bool isBlockNum;
        uint64 blockNumOrTimestamp;
        uint16 confirmations;
        address to;
    }

    struct EvmComputeRequest {
        uint8 computeSetting;
        uint32 targetEid;
        bool isBlockNum;
        uint64 blockNumOrTimestamp;
        uint16 confirmations;
        address to;
    }

    uint8 internal constant COMPUTE_SETTING_MAP_ONLY = 0;
    uint8 internal constant COMPUTE_SETTING_REDUCE_ONLY = 1;
    uint8 internal constant COMPUTE_SETTING_MAP_REDUCE = 2;
    uint8 internal constant COMPUTE_SETTING_NONE = 3;

    string public identifier;
    bytes public data = abi.encode("Nothing received yet.");

    /// @notice Track the amount of native asset and ERC20 tokens available to be withdrawn per
    /// user.
    mapping(address user => mapping(address token => uint256 amount)) internal _withdrawable;

    /// @dev Mappings keeping track of already used nonces per user to prevent replays of withdraw
    /// requests.
    mapping(uint256 nonce => mapping(address user => bool used)) internal _nonceUsed;

    event MessageReceived(uint32 srcEid, bytes32 guid, bytes payload);

    /// @notice Thrown when trying to withdraw funds but nothing is available.
    error NoExcess();

    /// @notice Thrown when trying to replay a withdraw request with the same nonce.
    ///
    /// @param nonce The already used nonce.
    error InvalidNonce(uint256 nonce);

    constructor(IEntryPoint _entryPoint, address _verifyingSigner, address _lzEndpoint, string memory _identifier) OAppRead(_lzEndpoint, msg.sender) BasePaymaster(_entryPoint) {
        verifyingSigner = _verifyingSigner;
        identifier = _identifier;
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
        (WithdrawRequest memory withdrawRequest, uint[2] memory pi_a, uint[2][2] memory pi_b, uint[2] memory pi_c, uint[2] memory publicSignals) =
            abi.decode(userOp.paymasterAndData[VALID_WITHDRAW_REQUEST_OFFSET:], (WithdrawRequest, uint[2], uint[2][2], uint[2], uint[2]));

        uint256 withdrawAmount = withdrawRequest.amount;

        if (_nonceUsed[withdrawRequest.nonce][userOp.sender]) {
            revert InvalidNonce(withdrawRequest.nonce);
        }

        _nonceUsed[withdrawRequest.nonce][userOp.sender] = true;

        bool sigFailed = !isValidWithdrawSignature(userOp, withdrawRequest);

        validationData = (sigFailed ? 1 : 0) | (uint256(withdrawRequest.expiry) << 160);

        _withdrawable[userOp.sender][withdrawRequest.asset] += withdrawAmount; // - maxCost (eth gas // converted in token terms)

        //  more details like the proof is to be given to postOp.
        context = abi.encode(userOp.sender, withdrawRequest, pi_a, pi_b, pi_c, publicSignals);
    }

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
        (address account, WithdrawRequest memory withdrawRequest, uint[2] memory pi_a, uint[2][2] memory pi_b, uint[2] memory pi_c, uint[2] memory publicSignals) =
            abi.decode(context, (address, WithdrawRequest, uint[2], uint[2][2], uint[2], uint[2]));

        // Compute the total remaining funds available for the user accout.
        uint256 withdrawable = _withdrawable[account][withdrawRequest.asset]; // + (maxGasCost -// actualGasCost); // can convert to token terms
        // Send the all remaining funds to the user accout.
        // Would wipe if not done via withdrawAccess
        delete _withdrawable[account][withdrawRequest.asset];

        // Create a single read request
        EvmReadRequest[] memory requests = new EvmReadRequest[](1);
        requests[0] = EvmReadRequest({
            appRequestLabel: 0,
            targetEid: 0,
            isBlockNum: false,
            blockNumOrTimestamp: 0,
            confirmations: 0,
            to: address(this)
        });

        // Create compute request
        EvmComputeRequest memory computeRequest = EvmComputeRequest({
            computeSetting: COMPUTE_SETTING_NONE,
            targetEid: 0,
            isBlockNum: false,
            blockNumOrTimestamp: 0,
            confirmations: 0,
            to: address(this)
        });

        // Send the proof to the destination chain
        send(0, 0, requests, computeRequest, bytes(""));
    }

    /**
     * @notice Send a read command in loopback through channelId
     * @param _channelId Read Channel ID to be used for the message.
     * @param _appLabel The application label to use for the message.
     * @param _requests An array of `EvmReadRequest` structs containing the read requests to be made.
     * @param _computeRequest A `EvmComputeRequest` struct containing the compute request to be made.
     * @param _options Message execution options (e.g., for sending gas to destination).
     * @dev Encodes the message as bytes and sends it using the `_lzSend` internal function.
     * @return receipt A `MessagingReceipt` struct containing details of the message sent.
     */
    function send(
        uint32 _channelId,
        uint16 _appLabel,
        EvmReadRequest[] memory _requests,
        EvmComputeRequest memory _computeRequest,
        bytes memory _options
    ) public payable returns (MessagingReceipt memory receipt) {
        bytes memory cmd = buildCmd(_appLabel, _requests, _computeRequest);
        receipt = _lzSend(_channelId, cmd, _options, MessagingFee(msg.value, 0), payable(msg.sender));
    }

    /**
     * @dev Internal function override to handle incoming messages from another chain.
     * @param payload The encoded message payload being received. This is the resolved command from the DVN
     *
     * @dev The following params are unused in the current implementation of the OApp.
     * @dev _origin A struct containing information about the message sender.
     * @dev _guid A unique global packet identifier for the message.
     * @dev _executor The address of the Executor responsible for processing the message.
     * @dev _extraData Arbitrary data appended by the Executor to the message.
     *
     * Decodes the received payload and processes it as per the business logic defined in the function.
     */
    function _lzReceive(
        Origin calldata /*_origin*/,
        bytes32 /*_guid*/,
        bytes calldata payload,
        address /*_executor*/,
        bytes calldata /*_extraData*/
    ) internal override {
        revert("Not implemented");
    }

       /**
     * @notice Builds the command to be sent
     * @param appLabel The application label to use for the message.
     * @param _readRequests An array of `EvmReadRequest` structs containing the read requests to be made.
     * @param _computeRequest A `EvmComputeRequest` struct containing the compute request to be made.
     * @return cmd The encoded command to be sent to to the channel.
     */
    function buildCmd(
        uint16 appLabel,
        EvmReadRequest[] memory _readRequests,
        EvmComputeRequest memory _computeRequest
    ) public pure returns (bytes memory) {
        require(_readRequests.length > 0, "LzReadCounter: empty requests");
        // build read requests
        EVMCallRequestV1[] memory readRequests = new EVMCallRequestV1[](_readRequests.length);
        for (uint256 i = 0; i < _readRequests.length; i++) {
            EvmReadRequest memory req = _readRequests[i];
            readRequests[i] = EVMCallRequestV1({
                appRequestLabel: req.appRequestLabel,
                targetEid: req.targetEid,
                isBlockNum: req.isBlockNum,
                blockNumOrTimestamp: req.blockNumOrTimestamp,
                confirmations: req.confirmations,
                to: req.to,
                callData: abi.encodeWithSelector(this.myInformation.selector)
            });
        }

        require(_computeRequest.computeSetting <= COMPUTE_SETTING_NONE, "LzReadCounter: invalid compute type");
        EVMCallComputeV1 memory evmCompute = EVMCallComputeV1({
            computeSetting: _computeRequest.computeSetting,
            targetEid: _computeRequest.computeSetting == COMPUTE_SETTING_NONE ? 0 : _computeRequest.targetEid,
            isBlockNum: _computeRequest.isBlockNum,
            blockNumOrTimestamp: _computeRequest.blockNumOrTimestamp,
            confirmations: _computeRequest.confirmations,
            to: _computeRequest.to
        });
        bytes memory cmd = ReadCodecV1.encode(appLabel, readRequests, evmCompute);

        return cmd;
    }

     function myInformation() public view returns (bytes memory) {
        return abi.encodePacked("_id:", identifier, "_blockNumber:", block.number);
    }

    function lzMap(bytes calldata _request, bytes calldata _response) external pure returns (bytes memory) {
        uint16 requestLabel = ReadCodecV1.decodeRequestV1AppRequestLabel(_request);
        return abi.encodePacked(_response, "_mapped_requestLabel:", requestLabel);
    }

    function lzReduce(bytes calldata _cmd, bytes[] calldata _responses) external pure returns (bytes memory) {
        uint16 appLabel = ReadCodecV1.decodeCmdAppLabel(_cmd);
        bytes memory concatenatedResponses;

        for (uint256 i = 0; i < _responses.length; i++) {
            concatenatedResponses = abi.encodePacked(concatenatedResponses, _responses[i]);
        }
        return abi.encodePacked(concatenatedResponses, "_reduced_appLabel:", appLabel);
    }
}
