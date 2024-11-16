// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.27;

import { Test } from "forge-std/src/Test.sol";
import { TokenPaymasterWithPYTH } from "../../../../../contracts/paymasters/TokenPaymasterWithPYTH.sol";
import { IPyth } from "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import { PythStructs } from "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IEntryPoint } from "account-abstraction/contracts/interfaces/IEntryPoint.sol";
import { UserOperationLib } from "account-abstraction/contracts/core/UserOperationLib.sol";
import { PackedUserOperation } from "account-abstraction/contracts/interfaces/PackedUserOperation.sol";

contract PYTHBasedTPMTest is Test {
    using UserOperationLib for PackedUserOperation;

    TokenPaymasterWithPYTH public paymaster;
    IPyth public pyth;
    IERC20 public usdc;
    address public constant ENTRY_POINT = 0x0000000071727De22E5E9d8BAf0edAc6f37da032;
    bytes32 public constant ETH_USD_PRICE_ID = 0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace;
    bytes32 public constant USDC_USD_PRICE_ID = 0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a;

    address public sender;
    uint256 public constant PRICE_MARKUP = 1100000; // 1.1x markup
    uint256 public constant UNACCOUNTED_GAS = 50000;

    function setUp() public {
        // Fork Base mainnet
        uint256 forkId = vm.createFork("https://developer-access-mainnet.base.org");
        vm.selectFork(forkId);

        // Setup contracts
        pyth = IPyth(0x8250f4aF4B972684F7b336503E2D6dFeDeB1487a);
        usdc = IERC20(0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913);

        // Setup test account
        sender = makeAddr("sender");
        deal(address(usdc), sender, 1000 * 1e6); // Give sender 1000 USDC

        paymaster = new TokenPaymasterWithPYTH(
            sender,
            IEntryPoint(ENTRY_POINT),
            PRICE_MARKUP,
            address(pyth),
            address(usdc),
            ETH_USD_PRICE_ID,
            USDC_USD_PRICE_ID,
            UNACCOUNTED_GAS
        );

        vm.deal(address(paymaster), 1000 ether);
        vm.startPrank(sender);
        usdc.approve(address(paymaster), type(uint256).max);
        vm.stopPrank();
    }

    function testValidatePaymasterUserOp() public {
        // Create price update data
        bytes[] memory priceUpdateData = new bytes[](1);
        priceUpdateData[0] = hex"504e41550100000003b801000000040d0090534fc2d2cedf26aa58299603e65779cf39c0d6f4695e9c358aca7ae381b9916dbb57a1053ecd2738c38f6c1d3043aabd29e4055a7badc5a763e0ab17639bda01024fd8438ff6ec737a5024ebca673156565c367fff0e9906b825dd561143a2a983704f203f816ab656ce991aba817341f9a6927be38a57c63f8f2d55d07c48aa4a00049e170791644dfe58821a8628e044aebe97e2f69f4f114beff4f42c71a0da13b75dc95abf7d5b57338d873813c670866c17b604912f7fb867a69af8556a92063e00066457f4b5c5ded33116149cffdf73dc5288ef8dfd01c568e758373439b0db1ed13bee992b700484347841878470b2ad889cd114601ae4515f68c80dc2f21734c201087faef73ca7b74a526f109b6d9205fed961552b40a8c69456029349d688c8a8861b99797b72e5b9e82f12de5b32cef1060165273dcf104ce3d4638b95d313a8dc010a663d8d2b36bf8bf24d732cff69694be858a6725f59027f5e46642a452ae6a87a3e9e5f23788ded32daf3c4e74528243ca5d42593b3edd3aa05ec412fce894d16000b8198c6fd978ca63794c660b05cab524575fe3873eeb71a3dddc779b865afbceb44a6161a8b6bf88d377e938b1ba956b89b39e45657b9f06e4b1658abc88b2c0e010c6559735b3ab49442ed60aa6d49d122ee06a6700935814663f5854528341f7fd16d8f3634da10ea1c442a710f01609ea3ea6c9f87f93e07aaadb16bf84a888d8a010df055535b975f481175db928ccc064c1923cf9d06e944d039385a0f4faa0f1c57224ac829145c065c43188c266b2fdc7760d2fc2192ac1e25d9713e1f15d5b894000edfa0badb5f63f9ed31d68d5249c31dab8ba92eab16f4d2476af52b561f2401510b5813df4457e32e879592ab907b83520aad9d196d24a3d805fc3019bab7e370000f431fc876406ec92c2a658f4d743a2a62ec39f3a553c2191c9970ca0bb6c3843d66531d58620d527bf6c5a4b5a1917a0f76daf280ce676564ab69808fa076c1150010a95b0aec61a992751a2df21e628e1562474a82eff84c74cbcda8ed15576023522c485aa10878508bbf8b814bf2d02c677d05cb0bf6b9ef02da8f97026f2b0bdd0111dc368ab295064f5f22ad96d209e0e79a9a49e36cf28bbeb5002be08a0fa26eb85150bd3ffeac1061d962445049c5e0e976b0292e7b2e2989a20505d30ba8551500673918e600000000001ae101faedac5851e32b9b23b5f9411a8c2bac4aae3ed4dd7b811dd1a72ea4aa71000000000596040c014155575600000000000aa2ceae0000271068f656f7c36c1c2e58a53dac5cd3ad1375cfe65902005500ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace00000049711f15bc000000000b8fc208fffffff800000000673918e600000000673918e6000000498bfbd630000000000beacd160bc6cb1a872cda46472711b1282947eccb178e66dcabed91477af753e0d3af891b69da836aea504ccf895a9c0d41d6af681a40b189bf75625daaabc32257dfdab2ae467996a2873c52b1baf544e2b0640292f96f1b5e19333596a672dc35c11d03c828a42f5e72a32f01c21ffbfac965a1756c11054536c7bb389334ce47ff866f5db8d830ee1dbbcf8d86ce7dc6e76693070a48aa40c9a0ed102f4417b0637281e13e4b1d19a743a5ce5acb27e8788900b3aac1e8d26f057a5694dfa47e59b061d3359bc9f6cd262161e843f23f5d2a7d27c45cb3be8597023ebd6cf9005500eaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a0000000005f5cd5b0000000000018691fffffff800000000673918e600000000673918e60000000005f5cd5e0000000000018f970b9bd8bce87ae32a2fe839d34937b1be9264019aa1c0a255b0fa10bbc59621e4bb72f001f21f0144115c0c47e0f5715d7472e29eb82c1c981fe14edd14409bc31e460f0d0b842f7de875cf8f35e1022f55138538b8701770132dd4f3453c84ca88a7bdd2d769d101caf54dd5ec14c0f64e92223b4a16c63ae3de56baa7c9ef0c1afcd4a8a2c4ff8fcabe2cbdfc713dd27ff5e7b3cfd5d9af987ee3d0dca226506e92f2a71f305ef271fe9957f3067f5f78d4771191544026aec27cbb138e0aa813acb45a6d6fe69e7f61e843f23f5d2a7d27c45cb3be8597023ebd6cf9";

        // Create UserOperation
        PackedUserOperation memory userOp = PackedUserOperation({
            sender: sender,
            nonce: 0,
            initCode: "",
            callData: "",
            accountGasLimits: bytes32(abi.encodePacked(uint128(1000000), uint128(1000000))),
            preVerificationGas: 21000,
            gasFees: bytes32(abi.encodePacked(uint128(1000000000), uint128(1000000000))), // maxFeePerGas, maxPriorityFeePerGas
            paymasterAndData: abi.encodePacked(
                abi.encodePacked(
                    address(paymaster),
                    uint128(50000), // validationGas
                    uint128(50000) // postOpGas
            ), abi.encode(priceUpdateData)),
            signature: ""
        });

        bytes32 userOpHash = keccak256("userOpHash");
        uint256 maxCost = 1e17; // 0.1 ETH worth of gas

        vm.mockCall(
            address(pyth),
            abi.encodeWithSelector(IPyth.getUpdateFee.selector),
            abi.encode(0.01 ether)
        );

        vm.mockCall(
            address(pyth),
            abi.encodeWithSelector(IPyth.getPriceNoOlderThan.selector, ETH_USD_PRICE_ID, 60),
            abi.encode(PythStructs.Price(1800 * 1e8, 0, -8, 0)) // ETH = $1800
        );

        vm.mockCall(
            address(pyth),
            abi.encodeWithSelector(IPyth.getPriceNoOlderThan.selector, USDC_USD_PRICE_ID, 60),
            abi.encode(PythStructs.Price(1e8, 0, -8, 0)) // USDC = $1
        );

        vm.startPrank(ENTRY_POINT);

        (bytes memory context, uint256 validationData) = paymaster.validatePaymasterUserOp(
            userOp,
            userOpHash,
            maxCost
        );

        vm.stopPrank();

        // Verify validation was successful
        assertEq(validationData, 0, "Validation should succeed");
        assertTrue(context.length > 0, "Context should not be empty");
    }
}

// Helper contract to expose internal function
contract TokenPaymasterWithPYTHExposed is TokenPaymasterWithPYTH {
    constructor(
        address _owner,
        address _entryPoint,
        address _pyth,
        address _usdc,
        bytes32 _ethUsdPriceId,
        bytes32 _usdcUsdPriceId,
        uint256 _priceMarkup,
        uint256 _unaccountedGas
    ) TokenPaymasterWithPYTH(
        _owner,
        IEntryPoint(_entryPoint),
        _priceMarkup,
        _pyth,
        _usdc,
        _ethUsdPriceId,
        _usdcUsdPriceId,
        _unaccountedGas
    ) {}

    function exposed_validatePaymasterUserOp(
        PackedUserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost
    ) external returns (bytes memory context, uint256 validationData) {
        return _validatePaymasterUserOp(userOp, userOpHash, maxCost);
    }
}
