// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/src/Test.sol";
import "../../../../../contracts/TimeLockVault.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock Token", "MTK") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }
}

contract TimeLockVaultTest is Test {
    TimelockVault public vault;
    MockERC20 public token;
    address public user;
    uint256 constant INITIAL_BALANCE = 1000 * 10 ** 18;

    function setUp() public {
        vault = new TimelockVault();
        token = new MockERC20();
        user = address(0x1);

        // Setup initial token balance for user
        token.transfer(user, INITIAL_BALANCE);
        vm.startPrank(user);
        token.approve(address(vault), type(uint256).max);
        vm.stopPrank();
    }

    function testDeposit() public {
        uint256 depositAmount = 100 * 10 ** 18;

        vm.startPrank(user);
        vault.deposit(address(token), depositAmount);

        (uint256 amount, uint256 unlockTime) = vault.deposits(address(token), user);
        assertEq(amount, depositAmount);
        assertEq(unlockTime, block.timestamp + 1 days);
        assertEq(token.balanceOf(address(vault)), depositAmount);
        vm.stopPrank();
    }

    function testFailDepositZeroAmount() public {
        vm.prank(user);
        vault.deposit(address(token), 0);
    }

    function testFailDepositInvalidToken() public {
        vm.prank(user);
        vault.deposit(address(0), 100 * 10 ** 18);
    }

    function testWithdraw() public {
        uint256 depositAmount = 100 * 10 ** 18;

        vm.startPrank(user);
        vault.deposit(address(token), depositAmount);

        // Fast forward past lock period
        vm.warp(block.timestamp + 1 days + 1);

        uint256 balanceBefore = token.balanceOf(user);
        vault.withdraw(address(token), depositAmount);
        uint256 balanceAfter = token.balanceOf(user);

        assertEq(balanceAfter - balanceBefore, depositAmount);
        vm.stopPrank();
    }

    function testFailWithdrawBeforeLockPeriod() public {
        uint256 depositAmount = 100 * 10 ** 18;

        vm.startPrank(user);
        vault.deposit(address(token), depositAmount);

        // Try to withdraw before lock period ends
        vault.withdraw(address(token), depositAmount);
        vm.stopPrank();
    }

    function testFailWithdrawTooMuch() public {
        uint256 depositAmount = 100 * 10 ** 18;

        vm.startPrank(user);
        vault.deposit(address(token), depositAmount);

        vm.warp(block.timestamp + 1 days + 1);
        vault.withdraw(address(token), depositAmount + 1);
        vm.stopPrank();
    }

    function testMultipleDepositsAndWithdrawals() public {
        uint256 firstDeposit = 50 * 10 ** 18;
        uint256 secondDeposit = 30 * 10 ** 18;

        vm.startPrank(user);

        // First deposit
        vault.deposit(address(token), firstDeposit);

        // Second deposit
        vault.deposit(address(token), secondDeposit);

        (uint256 amount,) = vault.deposits(address(token), user);
        assertEq(amount, firstDeposit + secondDeposit);

        // Fast forward and withdraw partial amount
        vm.warp(block.timestamp + 1 days + 1);
        vault.withdraw(address(token), 40 * 10 ** 18);

        (amount,) = vault.deposits(address(token), user);
        assertEq(amount, 40 * 10 ** 18);
        vm.stopPrank();
    }
}
