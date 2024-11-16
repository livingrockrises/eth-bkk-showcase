// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.27;

/* solhint-disable reason-string */
/* solhint-disable no-inline-assembly */

import { BasePaymasterCustom } from "./BasePaymasterCustom.sol";
import "account-abstraction/contracts/core/UserOperationLib.sol";
import "account-abstraction/contracts/core/Helpers.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import { SignatureCheckerLib } from "solady/src/utils/SignatureCheckerLib.sol";
import { SafeTransferLib } from "solady/src/utils/SafeTransferLib.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { IEntryPoint } from "account-abstraction/contracts/interfaces/IEntryPoint.sol";
import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";

contract TokenPaymasterWithPYTH is BasePaymasterCustom, ReentrancyGuard {
    using UserOperationLib for PackedUserOperation;
    using SignatureCheckerLib for address;

    uint256 public unaccountedGas;
    uint256 public priceMarkup;
    address public pyth;
    address public usdc;
    bytes32 public ethUsdPriceId;
    bytes32 public usdcUsdPriceId;

    uint256 private constant _UNACCOUNTED_GAS_LIMIT = 100_000;
    uint256 private constant _PRICE_DENOMINATOR = 1e6;
    uint256 private constant _NATIVE_TOKEN_DECIMALS = 1e18;
    uint256 private constant PAYMASTER_PRICE_UPDATE_OFFSET = UserOperationLib.PAYMASTER_DATA_OFFSET;

    event TokensWithdrawn(
        address indexed token, address indexed to, uint256 indexed amount, address actor
    );

    event UpdatedUnaccountedGas(uint256 oldUnaccountedGas, uint256 newUnaccountedGas);

    event TokensRefunded(
        address indexed userOpSender,
        address indexed token,
        uint256 refundAmount,
        bytes32 indexed userOpHash
    );

    event PaidGasInTokens(
        address indexed userOpSender,
        uint256 tokenCharge,
        uint256 tokenPrice,
        bytes32 indexed userOpHash
    );

    /**
     * @notice Throws when trying to withdraw multiple tokens, but each token doesn't have a
     * corresponding amount
     */
    error TokensAndAmountsLengthMismatch();

    /**
     * @notice Throws when trying to withdraw to address(0)
     */
    error CanNotWithdrawToZeroAddress();

    /**
     * @notice Throws when trying to set an unaccounted gas value that is too high
     */
    error UnaccountedGasTooHigh();

    constructor(
        address owner,
        IEntryPoint _entryPoint,
        uint256 _priceMarkup,
        address _pyth,
        address _usdc,
        bytes32 _ethUsdPriceId,
        bytes32 _usdcUsdPriceId,
        uint256 unaccountedGasArg
    )
        BasePaymasterCustom(owner, _entryPoint)
    {
        priceMarkup = _priceMarkup;
        pyth = _pyth;
        usdc = _usdc;
        ethUsdPriceId = _ethUsdPriceId;
        usdcUsdPriceId = _usdcUsdPriceId;
        unaccountedGas = unaccountedGasArg;
    }


    receive() external payable {}

    /**
     * @dev pull tokens out of paymaster in case they were sent to the paymaster at any point.
     * @param token the token deposit to withdraw
     * @param target address to send to
     * @param amount amount to withdraw
     */
    function withdrawERC20(
        IERC20 token,
        address target,
        uint256 amount
    )
        external
        payable
        onlyOwner
        nonReentrant
    {
        _withdrawERC20(token, target, amount);
    }

    /**
     * @dev pull tokens out of paymaster in case they were sent to the paymaster at any point.
     * @param token the token deposit to withdraw
     * @param target address to send to
     */
    function withdrawERC20Full(
        IERC20 token,
        address target
    )
        external
        payable
        onlyOwner
        nonReentrant
    {
        uint256 amount = token.balanceOf(address(this));
        _withdrawERC20(token, target, amount);
    }

    /**
     * @dev pull multiple tokens out of paymaster in case they were sent to the paymaster at any
     * point.
     * @param token the tokens deposit to withdraw
     * @param target address to send to
     * @param amount amounts to withdraw
     */
    function withdrawMultipleERC20(
        IERC20[] calldata token,
        address target,
        uint256[] calldata amount
    )
        external
        payable
        onlyOwner
        nonReentrant
    {
        if (token.length != amount.length) {
            revert TokensAndAmountsLengthMismatch();
        }
        unchecked {
            for (uint256 i; i < token.length;) {
                _withdrawERC20(token[i], target, amount[i]);
                ++i;
            }
        }
    }

    /**
     * @dev Set a new unaccountedEPGasOverhead value.
     * @param newUnaccountedGas The new value to be set as the unaccounted gas value
     * @notice only to be called by the owner of the contract.
     */
    function setUnaccountedGas(uint256 newUnaccountedGas) external payable onlyOwner {
        if (newUnaccountedGas > _UNACCOUNTED_GAS_LIMIT) {
            revert UnaccountedGasTooHigh();
        }
        uint256 oldUnaccountedGas = unaccountedGas;
        assembly ("memory-safe") {
            sstore(unaccountedGas.slot, newUnaccountedGas)
        }
        emit UpdatedUnaccountedGas(oldUnaccountedGas, newUnaccountedGas);
    }

    function _validatePaymasterUserOp(
        PackedUserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost
    )
        internal
        override
        returns (bytes memory context, uint256 validationData)
    {
        (bytes[] memory priceUpdate) =
            abi.decode(userOp.paymasterAndData[PAYMASTER_PRICE_UPDATE_OFFSET:], (bytes[]));

        uint256 updateFee = IPyth(pyth).getUpdateFee(priceUpdate);
        IPyth(pyth).updatePriceFeeds{ value: updateFee }(priceUpdate);

        PythStructs.Price memory ethUsdPrice = IPyth(pyth).getPriceNoOlderThan(ethUsdPriceId, 60);
        PythStructs.Price memory usdcUsdPrice = IPyth(pyth).getPriceNoOlderThan(usdcUsdPriceId, 60);

        uint256 ethPrice18Decimals = (uint256(uint64(ethUsdPrice.price)) * (10 ** 18))
            / (10 ** uint8(uint32(-1 * ethUsdPrice.expo)));

        uint256 usdcPrice18Decimals = (uint256(uint64(usdcUsdPrice.price)) * (10 ** 18))
            / (10 ** uint8(uint32(-1 * usdcUsdPrice.expo)));

        uint256 tokenPrice =
            (ethPrice18Decimals / usdcPrice18Decimals) * (10 ** ERC20(usdc).decimals());

        // callGasLimit + paymasterPostOpGas
        uint256 maxPenalty = (
            (
                uint128(uint256(userOp.accountGasLimits))
                    + uint128(
                        bytes16(
                            userOp.paymasterAndData[_PAYMASTER_POSTOP_GAS_OFFSET:_PAYMASTER_DATA_OFFSET]
                        )
                    )
            ) * 10 * userOp.unpackMaxFeePerGas()
        ) / 100;

        uint256 tokenAmount;

        {
            // Calculate token amount to precharge
            uint256 maxFeePerGas = UserOperationLib.unpackMaxFeePerGas(userOp);
            tokenAmount = (
                (maxCost + maxPenalty + updateFee + (unaccountedGas * maxFeePerGas)) * priceMarkup
                    * tokenPrice
            ) / (_NATIVE_TOKEN_DECIMALS * _PRICE_DENOMINATOR);
        }

        // Transfer full amount to this address. Unused amount will be refunded in postOP
        SafeTransferLib.safeTransferFrom(usdc, userOp.sender, address(this), tokenAmount);

        context = abi.encode(
            userOp.sender,
            tokenAmount - ((maxPenalty * tokenPrice) / _NATIVE_TOKEN_DECIMALS),
            tokenPrice,
            updateFee,
            userOpHash
        );

        validationData = 0;
    }

    function _postOp(
        PostOpMode,
        bytes calldata context,
        uint256 actualGasCost,
        uint256 actualUserOpFeePerGas
    )
        internal
        override
    {
        // Decode context data
        (
            address userOpSender,
            uint256 prechargedAmount,
            uint256 tokenPrice,
            uint256 updateFee,
            bytes32 userOpHash
        ) = abi.decode(context, (address, uint256, uint256, uint256, bytes32));

        // Calculate the actual cost in tokens based on the actual gas cost and the token price
        uint256 actualTokenAmount = (
            (actualGasCost + updateFee + (unaccountedGas * actualUserOpFeePerGas)) * priceMarkup
                * tokenPrice
        ) / (_NATIVE_TOKEN_DECIMALS * _PRICE_DENOMINATOR);
        if (prechargedAmount > actualTokenAmount) {
            // If the user was overcharged, refund the excess tokens
            uint256 refundAmount = prechargedAmount - actualTokenAmount;
            SafeTransferLib.safeTransfer(usdc, userOpSender, refundAmount);
            emit TokensRefunded(userOpSender, usdc, refundAmount, userOpHash);
        }

        // Todo: Review events and what we need to emit.
        emit PaidGasInTokens(userOpSender, actualTokenAmount, tokenPrice, userOpHash);
    }

    function _withdrawERC20(IERC20 token, address target, uint256 amount) private {
        if (target == address(0)) revert CanNotWithdrawToZeroAddress();
        SafeTransferLib.safeTransfer(address(token), target, amount);
        emit TokensWithdrawn(address(token), target, amount, msg.sender);
    }
}
