import { EndpointId } from '@layerzerolabs/lz-definitions'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'
import { base } from 'viem/chains'

const sepoliaContract: OmniPointHardhat = {
    eid: EndpointId.SEPOLIA_V2_TESTNET,
    contractName: 'MyOApp',
}

const baseContract: OmniPointHardhat = {
    eid: EndpointId.BASESEP_TESTNET,
    contractName: 'MyOApp',
}


const config: OAppOmniGraphHardhat = {
    contracts: [
        {
            contract: baseContract,
            /**
             * This config object is optional.
             * The callerBpsCap refers to the maximum fee (in basis points) that the contract can charge.
             */

            // config: {
            //     callerBpsCap: BigInt(300),
            // },
        },
        {
            contract: sepoliaContract,
        },
    ],
    connections: [
        {
            from: baseContract,
            to: sepoliaContract,
        },
        {
            from: sepoliaContract,
            to: baseContract,
        },
    ],
}

export default config
