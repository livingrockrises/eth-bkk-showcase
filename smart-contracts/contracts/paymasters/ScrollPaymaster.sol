// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.27;

/* solhint-disable reason-string */
/* solhint-disable no-inline-assembly */

import { BasePaymasterCustom } from "./BasePaymasterCustom.sol";

// Multi purpose paymaster making user of L1SLoad.
// This paymaster can check if user holds Abracadabra NFT on L1 and decides to sponsor gas

// Or, it can check locked deposits on L1 and front the required funds to the smart account. (make
// update to withdrawable and SA pulls the tokens)
// Upon successful execution of above, it may pass Zk proof as message to L1 locking contract to
// claim the funds.

// WIP
// TODO
// contract ScrollPaymaster is BasePaymasterCustom { }
