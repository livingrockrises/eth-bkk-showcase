import dotenv from 'dotenv'
import { ethers } from 'ethers'
import { defaultAbiCoder, toUtf8Bytes } from 'ethers/lib/utils'
import { Address } from 'viem'

import { Options } from '@layerzerolabs/lz-v2-utilities'

import artifact from '../artifacts/contracts/MyOAppRead.sol/MyOAppRead.json'
import artifact2 from '../artifacts/contracts/Verifier.sol/Verifier.json'

dotenv.config()

// Configuration
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL // Sepolia RPC URL
const BASE_SEPOLIA_RPC_URL = process.env.BASE_SEPOLIA_RPC_URL // Base Sepolia RPC URL
const PRIVATE_KEY = process.env.PRIVATE_KEY as Address
const LZ_ENDPOINTS = {
    sepolia: process.env.SEPOLIA_LZ_ENDPOINT, // LayerZero endpoint for Sepolia
    baseSepolia: process.env.BASE_SEPOLIA_LZ_ENDPOINT, // LayerZero endpoint for Base Sepolia
}
const EID_A = 40161 // Endpoint ID for MyOAppRead A
const EID_B = 40245 // Endpoint ID for MyOAppRead B
const CHANNEL_ID = 4294967295
const APP_LABEL = 1

const MY_OAPP_BYTECODE = artifact.bytecode
const MY_OAPP_ABI = artifact.abi

const Verifier_ByteCode = artifact2.bytecode
const Verifier_Abi = artifact2.abi

// Ensure environment variables are loaded
if (!SEPOLIA_RPC_URL || !BASE_SEPOLIA_RPC_URL || !PRIVATE_KEY || !LZ_ENDPOINTS.sepolia || !LZ_ENDPOINTS.baseSepolia) {
    throw new Error('Environment variables are not properly set.')
}

// Helper function to deploy a contract
async function deployContract(
    wallet: ethers.Wallet,
    abi: any,
    bytecode: string,
    ...args: any[]
): Promise<ethers.Contract> {
    console.log('Deploying contract...')
    const factory = new ethers.ContractFactory(abi, bytecode, wallet)
    const contract = await factory.deploy(...args)
    await contract.deployed()
    console.log(`Deployed contract at: ${contract.address}`)
    return contract
}

// Deploy MyOAppReadA to Sepolia
async function deployOnSepolia() {
    console.log('Deploying MyOAppReadA on Sepolia...')
    const provider = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

    const myOAppReadA = await deployContract(
        wallet,
        MY_OAPP_ABI,
        MY_OAPP_BYTECODE,
        LZ_ENDPOINTS.sepolia,
        wallet.address,
        'oAppRead-A'
    )

    const myOAppReadV = await deployContract(wallet, Verifier_Abi, Verifier_ByteCode)
    console.log(`Verifier A deployed at: ${myOAppReadV.address}`)
    // set in MyOAppReadA
    await myOAppReadA.setVerifier(myOAppReadV.address);
    console.log(`MyOAppReadA deployed at: ${myOAppReadA.address}`)
    return myOAppReadA
}

// Deploy MyOAppReadB to Base Sepolia
async function deployOnBaseSepolia() {
    console.log('Deploying MyOAppReadB on Base Sepolia...')
    const provider = new ethers.providers.JsonRpcProvider(BASE_SEPOLIA_RPC_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

    const myOAppReadB = await deployContract(
        wallet,
        MY_OAPP_ABI,
        MY_OAPP_BYTECODE,
        LZ_ENDPOINTS.baseSepolia,
        wallet.address,
        'oAppRead-B'
    )

    const myOAppReadV = await deployContract(wallet, Verifier_Abi, Verifier_ByteCode)
    console.log(`Verifier B deployed at: ${myOAppReadV.address}`)
    // set in MyOAppReadA
    await myOAppReadB.setVerifier(myOAppReadV.address);

    console.log(`MyOAppReadB deployed at: ${myOAppReadB.address}`)
    return myOAppReadB
}
function toHex32Bytes(value: any) {
    const hexValue = BigInt(value).toString(16).padStart(64, '0'); // Ensure 64 characters (32 bytes)
    return `0x${hexValue}`;
}

// Configure peers and test communication
async function configureAndTest(myOAppReadAAddress: string, myOAppReadBAddress: string) {
    // console.log('Configuring peers...')

    // Set up providers and wallets for each network
    const sepoliaProvider = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL)
    const baseSepoliaProvider = new ethers.providers.JsonRpcProvider(BASE_SEPOLIA_RPC_URL)
    const sepoliaWallet = new ethers.Wallet(PRIVATE_KEY, sepoliaProvider)
    const baseSepoliaWallet = new ethers.Wallet(PRIVATE_KEY, baseSepoliaProvider)

    // Attach contracts with appropriate providers
    const myOAppReadA = new ethers.Contract(myOAppReadAAddress, MY_OAPP_ABI, sepoliaWallet)
    const myOAppReadB = new ethers.Contract(myOAppReadBAddress, MY_OAPP_ABI, baseSepoliaWallet)

    // // Configure peers
    // await myOAppReadA.setPeer(EID_B, ethers.utils.zeroPad(myOAppReadB.address, 32))
    // console.log(`Peer set for EID ${EID_B} in MyOAppReadA: ${myOAppReadB.address}`)

    // await myOAppReadB.setPeer(EID_A, ethers.utils.zeroPad(myOAppReadA.address, 32))
    // console.log(`Peer set for EID ${EID_A} in MyOAppReadB: ${myOAppReadA.address}`)

    // // Enable read channel for MyOAppReadA
    // console.log('Enabling read channel on Sepolia...')
    // await myOAppReadA.setReadChannel(CHANNEL_ID, true)
    // console.log(`Read channel ${CHANNEL_ID} enabled for MyOAppReadA.`)

    // await myOAppReadB.setReadChannel(CHANNEL_ID, true)
    // console.log(`Read channel ${CHANNEL_ID} enabled for MyOAppReadB.`)

    // console.log('Peers configured successfully.')
    // // add a delay for 5 secs
    // await new Promise((resolve) => setTimeout(resolve, 10000))

    // const helloWorldMessage = 'Hello world'

    const myOAppReadBInterface = new ethers.utils.Interface(MY_OAPP_ABI);

    // Example proof and public signals
    const pi_a = [
        '2887297253311923561562833019841490711676138170662893693659684828338819603339',
        '16128343286467703659101880235433615914212265378931294924295561783622194669736',
    ].map(toHex32Bytes)

    const pi_b = [
        [
            '1874116033774124704842427713336667111254538799444680702451548358234341064579',
            '13806072136004683405143060491211744750701794143385329744949574326760575578047',
        ],
        [
            '3985206610750261901413716576862620789583947599366245080202869718522383232671',
            '8626038746243459570271219956559502690514418132894472650397992849892326958721',
        ],
    ].map((innerArray) => innerArray.map((value) => toHex32Bytes(value)))

    const pi_c = [
        '17746959570229670660992616179958812204275771862318025017449519294865631051574',
        '1960753033554187134118279590885844219899717447561330793113827730331714178316',
    ].map(toHex32Bytes)

    const publicSignals = [
        '1750258006025672438718065500325530202465412338198526256',
        '194431099128553488897829795505376474179211309036566',
    ].map(toHex32Bytes)

    const callData = myOAppReadBInterface.encodeFunctionData('verifyProof', [pi_a, pi_b, pi_c, publicSignals])
    // await 10 secs
    // await new Promise((resolve) => setTimeout(resolve, 10000))

    // Step 2: Estimate Native Fee
    console.log('Estimating native fee...')
    const currentBlockNum = await baseSepoliaProvider.getBlockNumber()
    const evmReadRequest = {
        appRequestLabel: APP_LABEL,
        targetEid: EID_A,
        isBlockNum: true,
        blockNumOrTimestamp: currentBlockNum,
        confirmations: 1,
        to: myOAppReadA.address,
        callData: callData, // Add the message in the read request
    }

    const evmComputeRequest = {
        computeSetting: 1,
        targetEid: EID_A,
        isBlockNum: true,
        blockNumOrTimestamp: currentBlockNum,
        confirmations: 1,
        to: myOAppReadA.address,
    }

    // await new Promise((resolve) => setTimeout(resolve, 10000))
    const options = Options.newOptions().addExecutorLzReadOption(500000, 100, 0).toHex().toString()

    const [nativeFee] = await myOAppReadB.quote(
        CHANNEL_ID,
        APP_LABEL,
        [evmReadRequest],
        evmComputeRequest,
        options,
        false
    )
    console.log('Estimated native fee:', ethers.utils.formatEther(nativeFee))

    // Step 3: Set Response and Send Message
    const responseMessage = 'Test read message.'
    // console.log('Setting response message...')

    // await myOAppReadB.setReadResponse(
    //     myOAppReadA.address,
    //     defaultAbiCoder.encode(['bytes'], [toUtf8Bytes(responseMessage)])
    // )

    console.log('Sending message...')
    const tx = await myOAppReadB.send(CHANNEL_ID, APP_LABEL, [evmReadRequest], evmComputeRequest, options, {
        value: (Number(nativeFee) * 2).toString(),
    })

    console.log('Message sent, transaction hash:', tx.hash)

    const receipt = await tx.wait()
    console.log('Transaction confirmed, hash:', receipt.transactionHash)

    // Step 4: Verify the Data State
    console.log('Verifying data states...')
    const dataA = await myOAppReadA.data()
    console.log('Data in MyOAppReadA:', ethers.utils.toUtf8String(dataA))
    const dataB = await myOAppReadB.data()
    console.log('Data in MyOAppReadB:', ethers.utils.toUtf8String(dataB))
}

// Main function to deploy and test
async function main() {
    // const myOAppReadA = await deployOnSepolia()
    // const myOAppReadB = await deployOnBaseSepolia()
    // // Deployverifier contract on both

    const myOAppReadA = { address: '0x243B4e190C2dE6ede18b04E5e1412A448fD28292' }
    const myOAppReadB = { address: '0xB0d58E2d42A003e5a5CfCf3766aa7cf4Ea2281c6' }

    // Create instances of contracts to configure and test
    const sepoliaProvider = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL)
    const baseSepoliaProvider = new ethers.providers.JsonRpcProvider(BASE_SEPOLIA_RPC_URL)
    const sepoliaWallet = new ethers.Wallet(PRIVATE_KEY, sepoliaProvider)
    const baseSepoliaWallet = new ethers.Wallet(PRIVATE_KEY, baseSepoliaProvider)

    const myOAppReadAContract = new ethers.Contract(myOAppReadA.address, MY_OAPP_ABI, sepoliaWallet)
    const myOAppReadBContract = new ethers.Contract(myOAppReadB.address, MY_OAPP_ABI, baseSepoliaWallet)

    await configureAndTest(myOAppReadAContract.address, myOAppReadBContract.address)
}

main().catch((error) => {
    console.error('Error:', error.message || error)
    process.exit(1)
})
