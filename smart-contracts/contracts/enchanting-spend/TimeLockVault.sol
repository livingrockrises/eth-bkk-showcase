// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Verifier.sol";
import { OApp, Origin, MessagingFee } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { OAppRead } from "@layerzerolabs/oapp-evm/contracts/oapp/OAppRead.sol";
import { MessagingReceipt } from "@layerzerolabs/oapp-evm/contracts/oapp/OAppSender.sol";
import { IOAppMapper } from "@layerzerolabs/oapp-evm/contracts/oapp/interfaces/IOAppMapper.sol";
import { IOAppReducer } from "@layerzerolabs/oapp-evm/contracts/oapp/interfaces/IOAppReducer.sol";
import { ReadCodecV1, EVMCallComputeV1, EVMCallRequestV1 } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/ReadCodecV1.sol";

contract TimelockVault is ReentrancyGuard, Ownable, OAppRead, IOAppMapper, IOAppReducer {
    using SafeERC20 for IERC20;

    // Struct to track deposit details
    struct Deposit {
        uint256 amount;
        uint256 unlockTime;
    }

    struct WithdrawalRequest {
        address token;
        uint256 amount;
        address to;
        uint256 requestSubmittedTimestamp;
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

    // Delay period for withdrawals (1 day in seconds)
    uint256 public constant LOCK_PERIOD = 1 days;

    // Mapping from token address => user address => deposit details
    mapping(address => mapping(address => Deposit)) public deposits;

    mapping(address user => WithdrawalRequest request) internal _requests;

    address public immutable solvingPaymaster;

    address public immutable lzEndpoint;

    string public identifier;

    Verifier private immutable _verifier;

    // Events
    event Deposited(address indexed token, address indexed user, uint256 amount);
    event Withdrawn(address indexed token, address indexed user, uint256 amount);
    event LockPeriodUpdated(uint256 newPeriod);
    event WithdrawalRequestSubmitted(address indexed withdrawAddress, address indexed token, uint256 indexed amount, address actor);
    event MessageReceived(uint32 srcEid, bytes32 guid, bytes payload);

    constructor(address aSolvingPaymaster, address aLzEndpoint, address aVerifier, string memory _identifier) Ownable(msg.sender) OAppRead(aLzEndpoint, msg.sender) {
        solvingPaymaster = aSolvingPaymaster;
        lzEndpoint = aLzEndpoint;
        identifier = _identifier;
        _verifier = Verifier(aVerifier);
    }

    modifier onlySolvingPaymaster() {
        require(msg.sender == solvingPaymaster, "Only the solving paymaster can call this function");
        _;
    }

    modifier onlyLzEndpoint() {
        require(msg.sender == lzEndpoint, "Only the lzEndpoint can call this function");
        _;
    }

    /**
     * @notice Deposits tokens into the vault
     * @param token The ERC20 token address to deposit
     * @param amount The amount of tokens to deposit
     */
    function deposit(address token, uint256 amount) external nonReentrant {
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");

        // Update deposit info
        deposits[token][msg.sender].amount += amount;
        deposits[token][msg.sender].unlockTime = block.timestamp + LOCK_PERIOD;

        // Transfer tokens from user to vault
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        emit Deposited(token, msg.sender, amount);
    }

    /**
     * @notice Withdraws tokens from the vault after lock period
     * @param token The ERC20 token address to withdraw
     * @param amount The amount of tokens to withdraw
     */
    function withdraw(address token, uint256 amount) external nonReentrant {
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");

        Deposit storage userDeposit = deposits[token][msg.sender];
        require(userDeposit.amount >= amount, "Insufficient balance");
        require(block.timestamp >= userDeposit.unlockTime, "Tokens are still locked");

        // Update deposit amount
        userDeposit.amount -= amount;

        // Transfer tokens to user
        IERC20(token).safeTransfer(msg.sender, amount);

        emit Withdrawn(token, msg.sender, amount);
    }

    /**
     * @dev Submit a withdrawal request for the paymasterId (Dapp Depositor address)
     * @param withdrawAddress address to send the funds to
     * @param amount amount to withdraw
     */
    /**
     * @notice Submit a withdrawal request for ERC20 tokens
     * @param token The ERC20 token address to withdraw
     * @param withdrawAddress address to send the tokens to
     * @param amount amount of tokens to withdraw
     */
    function submitTokenWithdrawalRequest(
        address token,
        address withdrawAddress,
        uint256 amount
    ) external {
        require(token != address(0), "Invalid token address");
        require(withdrawAddress != address(0), "Cannot withdraw to zero address");
        require(amount > 0, "Amount must be greater than 0");

        Deposit storage userDeposit = deposits[token][msg.sender];
        require(userDeposit.amount >= amount, "Insufficient balance");

        _requests[msg.sender] = WithdrawalRequest({
            token: token,
            amount: amount,
            to: withdrawAddress,
            requestSubmittedTimestamp: block.timestamp
        });

        emit WithdrawalRequestSubmitted(withdrawAddress, token, amount, msg.sender);
    }

    /**
     * @notice Execute a withdrawal request for ERC20 tokens
     * @param token The ERC20 token address to withdraw
     * @param paymasterId The address that submitted the withdrawal request
     */
    function executeTokenWithdrawalRequest(address token, address paymasterId) external nonReentrant {
        require(token != address(0), "Invalid token address");

        WithdrawalRequest memory req = _requests[paymasterId];
        require(req.requestSubmittedTimestamp != 0, "No request submitted");

        uint256 clearanceTimestamp = req.requestSubmittedTimestamp + LOCK_PERIOD;
        require(block.timestamp >= clearanceTimestamp, "Request not cleared yet");

        Deposit storage userDeposit = deposits[token][paymasterId];
        uint256 withdrawAmount = req.amount > userDeposit.amount ? userDeposit.amount : req.amount;
        require(withdrawAmount > 0, "Cannot withdraw zero amount");

        // Update deposit amount
        userDeposit.amount -= withdrawAmount;

        // Clear the request
        delete _requests[paymasterId];

        // Transfer tokens to withdrawal address
        IERC20(token).safeTransfer(req.to, withdrawAmount);

        emit Withdrawn(token, req.to, withdrawAmount);
    }

    /**
     * @notice Returns the deposited amount and unlock time for a user's deposit
     * @param token The ERC20 token address
     * @param user The user address
     */
    function getDeposit(address token, address user)
        external
        view
        returns (uint256 amount, uint256 unlockTime)
    {
        Deposit memory userDeposit = deposits[token][user];
        return (userDeposit.amount, userDeposit.unlockTime);
    }

    /**
     * @notice Checks if a withdrawal is possible for a given amount
     * @param token The ERC20 token address
     * @param amount The amount to check
     */
    function canWithdraw(address token, uint256 amount)
        external
        view
        returns (bool)
    {
        Deposit memory userDeposit = deposits[token][msg.sender];
        return userDeposit.amount >= amount &&
               block.timestamp >= userDeposit.unlockTime;
    }

    /**
     * @dev Called when data is received from the protocol. It overrides the equivalent function in the parent contract.
     * Protocol messages are defined as packets, comprised of the following parameters.
     * @param _origin A struct containing information about where the packet came from.
     * @param _guid A global unique identifier for tracking the packet.
     * @param payload Encoded message.
     */
    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata payload,
        address,  // Executor address as specified by the OApp.
        bytes calldata  // Any extra data or options to trigger on receipt.
    ) internal override {

        emit MessageReceived(0, 0, payload);
         (
            uint[2] memory pi_a,
            uint[2][2] memory pi_b,
            uint[2] memory pi_c,
            uint[2] memory publicSignals,
            address token,
            uint256 amount
        ) = abi.decode(payload, (uint[2], uint[2][2], uint[2], uint[2], address, uint256));

        bool _validProof = _verifier.verifyProof(pi_a, pi_b, pi_c, publicSignals);
        require(_validProof, "Invalid proof");
        // send funds to the paymaster address
        IERC20(token).safeTransfer(solvingPaymaster, amount);
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
