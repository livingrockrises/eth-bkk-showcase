// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.27;

import { Test } from "forge-std/src/Test.sol";
import { IPyth } from "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import { PythStructs } from "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";
import { console2 } from "forge-std/src/console2.sol";
import { IERC20 } from "forge-std/src/interfaces/IERC20.sol";

contract PythBaseTest is Test {
    IPyth public pyth;
    bytes32 public constant ETH_USD_PRICE_ID =
        0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace;
    bytes32 public constant USDC_USD_PRICE_ID =
        0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a;
    IERC20 public usdc;

    function setUp() public {
        // Base mainnet Pyth address
        usdc = IERC20(0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913);
        pyth = IPyth(0x8250f4aF4B972684F7b336503E2D6dFeDeB1487a);
        uint256 forkId = vm.createFork("https://developer-access-mainnet.base.org");
        vm.selectFork(forkId);
    }

    function testGetPriceFeeds() public view {
        PythStructs.Price memory ethUsdPrice = pyth.getPriceNoOlderThan(ETH_USD_PRICE_ID, 6000);
        PythStructs.Price memory usdcUsdPrice = pyth.getPriceNoOlderThan(USDC_USD_PRICE_ID, 6000);

        console2.log("ETH Price:", ethUsdPrice.price);
        console2.log("USDC Price:", usdcUsdPrice.price);

        // Convert prices to 18 decimals for easier comparison
        uint256 ethPrice18Decimals = (uint256(uint64(ethUsdPrice.price)) * (10 ** 18))
            / (10 ** uint8(uint32(-1 * ethUsdPrice.expo)));
        uint256 usdcPrice18Decimals = (uint256(uint64(usdcUsdPrice.price)) * (10 ** 18))
            / (10 ** uint8(uint32(-1 * usdcUsdPrice.expo)));

        console2.log("ETH Price 18 Decimals:", ethPrice18Decimals);
        console2.log("USDC Price 18 Decimals:", usdcPrice18Decimals);

        uint256 oneETHInUsdcWei =
            (ethPrice18Decimals / usdcPrice18Decimals) * (10 ** IERC20(usdc).decimals());
        console2.log("One ETH in USDC Wei amount:", oneETHInUsdcWei);

        // Basic sanity checks
        assertGt(ethPrice18Decimals, 0, "ETH price should be greater than 0");
        assertGt(usdcPrice18Decimals, 0, "USDC price should be greater than 0");
        assertApproxEqRel(usdcPrice18Decimals, 1e18, 0.1e18, "USDC price should be close to $1");
    }
}
