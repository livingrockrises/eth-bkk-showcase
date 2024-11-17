// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.27;

/* solhint-disable reason-string */
/* solhint-disable no-inline-assembly */

import { BasePaymasterCustom } from "./BasePaymasterCustom.sol";
import { IEntryPoint } from "account-abstraction/contracts/interfaces/IEntryPoint.sol";
import { PackedUserOperation } from "account-abstraction/contracts/core/UserOperationLib.sol";

interface IL1Blocks {
function latestBlockNumber() external view returns (uint256);
}

// Multi purpose paymaster making user of L1SLoad.
// This paymaster can check if user holds Abracadabra NFT on L1 and decides to sponsor gas

// Or, it can check locked deposits on L1 and front the required funds to the smart account. (make
// update to withdrawable and SA pulls the tokens)
// Upon successful execution of above, it may pass Zk proof as message to L1 locking contract to
// claim the funds.


contract ScrollPaymaster is BasePaymasterCustom {
    // This precompile returns the latest block accesible by L2, it is not mandatory to use this precompile but it can help to keep track of the L2 progress
address constant L1_BLOCKS_ADDRESS = 0x5300000000000000000000000000000000000001;
// This is the L1SLOAD precompile address
    address constant L1_SLOAD_ADDRESS = 0x0000000000000000000000000000000000000101;
    // The number varaiable is stored at the slot 0
    uint256 constant L1_NUMBER_SLOT = 0;

    address public nft;
    uint256 public slotToRead;
    constructor(IEntryPoint _entryPoint, address _nftContract, uint256 _slotToRead) BasePaymasterCustom(msg.sender, _entryPoint) {
        nft = _nftContract;
        slotToRead = _slotToRead;
    }

    // Again, this function is for reference only. It returns the latest L1 block number red by L2
    function latestL1BlockNumber() public view returns (uint256) {
        uint256 l1BlockNum = IL1Blocks(L1_BLOCKS_ADDRESS).latestBlockNumber();
        return l1BlockNum;
    }

    function updateSlotToRead(uint256 _slotToRead) public onlyOwner {
        slotToRead = _slotToRead;
    }

    // Returns the number read from L1
    function retrieveFromL1(address _user) internal view returns(uint) {
        uint mappingArraySlot = uint(
            keccak256(
                abi.encodePacked(
                    keccak256(abi.encodePacked(_user,
                    uint256(0))
                )
            )
        )) + 0;

        // The precompile expects the contract address number and an array of slots. In this case we only query one, the slot 0
        bytes memory input = abi.encodePacked(nft, mappingArraySlot);
        bool success;
        bytes memory ret;
        // We can access any piece of state of L1 through a staticcall, this makes it simple and cheap
        (success, ret) = L1_SLOAD_ADDRESS.staticcall(input);
        if (!success) {
            revert("L1SLOAD failed");
        }
        return abi.decode(ret, (uint256));
    }

    function _validatePaymasterUserOp(PackedUserOperation calldata userOp, bytes32 /*userOpHash*/, uint256 requiredPreFund)
    internal view override returns (bytes memory context, uint256 validationData) {
        (requiredPreFund);
        // check if user holds the nft
        uint256 balance = retrieveFromL1(userOp.sender);
        if (balance > 0) {
            return (bytes(""), 0);
        }
        return (bytes(""), 1);
    }
}
