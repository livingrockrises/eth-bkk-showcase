// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TimelockVault is ReentrancyGuard, Ownable {
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

    // Delay period for withdrawals (1 day in seconds)
    uint256 public constant LOCK_PERIOD = 1 days;

    // Mapping from token address => user address => deposit details
    mapping(address => mapping(address => Deposit)) public deposits;

    mapping(address user => WithdrawalRequest request) internal _requests;

    // Events
    event Deposited(address indexed token, address indexed user, uint256 amount);
    event Withdrawn(address indexed token, address indexed user, uint256 amount);
    event LockPeriodUpdated(uint256 newPeriod);
    event WithdrawalRequestSubmitted(
        address indexed withdrawAddress,
        address indexed token,
        uint256 indexed amount,
        address actor
    );

    constructor() Ownable(msg.sender) { }

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
    )
        external
    {
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
    function executeTokenWithdrawalRequest(
        address token,
        address paymasterId
    )
        external
        nonReentrant
    {
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
    function getDeposit(
        address token,
        address user
    )
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
    function canWithdraw(address token, uint256 amount) external view returns (bool) {
        Deposit memory userDeposit = deposits[token][msg.sender];
        return userDeposit.amount >= amount && block.timestamp >= userDeposit.unlockTime;
    }
}
