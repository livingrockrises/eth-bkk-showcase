import { createNexusClient } from "@biconomy/sdk";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { encodeAbiParameters, http, parseEther } from "viem";
import dotenv from "dotenv";
import { getPriceFeedUpdateData } from "../utils/getPriceFeedUpdateData.js";
import { ethers } from "ethers";

dotenv.config();

const privateKey = "0xdacb0364209dc856bfd319b68b1ebed818e147dbfbb4b7a6e3b131eed1fbad93";
const bundlerUrl = "https://bundler.biconomy.io/api/v3/84532/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44";

export const payWithUsdcPaymaster = async () => {
    const account = privateKeyToAccount(privateKey)
    const nexusClient = await createNexusClient({
        signer: account,
        chain: baseSepolia,
        transport: http(),
        bundlerTransport: http(bundlerUrl),
    });
    const address = nexusClient.account.address;
    console.log("address", address)
    try {
        const op = await nexusClient.prepareUserOperation({ calls: [{to : '0xf5715961C550FC497832063a98eA34673ad7C816', value: parseEther('0.0001')}] });
        console.log('op', op)

        const priceFeedUpdateData = await getPriceFeedUpdateData()
        console.log('priceFeedUpdateData', priceFeedUpdateData)

        const abiCoder = new ethers.AbiCoder();

        const encodedPaymasterData = abiCoder.encode(
            ["bytes[]"], // ABI type for the priceUpdateArray
            [priceFeedUpdateData]
        );
        console.log('encodedPaymasterData', encodedPaymasterData)

        op.paymaster = '0x1dd38a1830692A64C6765A060a91bC801Ef3C406' // ERC20Paymaster
        op.paymasterVerificationGasLimit = 1000000
        op.paymasterPostOpGasLimit = 1000000
        op.paymasterData = encodedPaymasterData

        const signature = await nexusClient.account.signUserOperation(op)
        console.log('signature', signature)
        op.signature = signature

        const hash = await nexusClient.sendTransaction(op)
        console.log("Transaction hash: ", hash);
        const receipt = await nexusClient.waitForTransactionReceipt({ hash });
        return {address , hash};
    }
    catch (error) {
        console.log(error)
    }
}

payWithUsdcPaymaster().then(() => process.exit(0)).catch(err => {
    console.log(err)
    process.exit(1)
})