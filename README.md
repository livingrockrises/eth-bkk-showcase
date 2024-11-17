# eth-bkk-showcase
## Project Description
Cross-chain implementations are push-based where users start with a fragmented balance on one chain and “push” their tokens to another.

The wallet works by taking transaction from the User By locking his funds from source chain in a Time Lock contract and funding the destination chain using Paymaster. Once the paymaster funds the destination chain address of the user, it sends across the zk proof of the transaction through layerZero to TL contract which sends the money to paymaster as well as unlocks remaining amount to the user.

## How it works

1. Alice goes to the NFT mint site, and wants to insta buy
2. Alice clicks mint button the paymaster service checks locked userBalance on all vaults across chains and sends back a special_signature
paymasterAndData ****will be set to whatever paymaster service application/user opts into just like today, the data however includes the special_signature provided by the paymaster
3. This userOp is sent to bundler → entrypoint
4. Entrypoint calls validateUserOp() on the SCW and does the usual operations
5. When Entrypoint calls validatePaymasterUserOp(……special_signature)
6. Post the usual validations, the paymaster validates the signature and sets a map(address⇒amount) to allow userOp.sender withdraw the amount (which will be the SCW)
7. The SCW will then leveraging the withdrawGasExcess method pull funds from the paymaster and execute the userOp that buys the NFT
8. In the postOp operation mapping(address⇒amount) set earlier will be deleted to ensure no double spends an execution proof will be sent by the sender contract on L1 to an L2 or multiple L2s via the native-rollup-connections execution proof is simply a proof to convince chainA of some execution that happened on chainB using ZK PROOF.
9. Funds will be then deducted from the userVault and given to paymaster

## How it's Made
We used Chains Like Base Sepolia and Sepolia, We use 44337 methodologies to send tractions by abstraction the account layer leverages the existing Account Abstraction standard a - an innovative approach to allow users to leverage their assets held on-chain. For chain Abstraction , with locked, the assets remain usable via the smart-account on any chain at any time. This one-time step required-to onboard as a part of deposit to SCW workflow, it is not required every-time before the assets are used.. Paymaster checks(offchain) if there are sufficient funds with Alice in her chain abstracted balance and authorizes usage of paymaster funds via a special_signature UserOp is sent to bundler with paymasterAndData containing the special_signature that allows the SCW to pull funds from the paymaster’s pool of liquidity on BASE UserOp is normally executed onchain leveraging the paymaster funds, SCW leverages withdrawGasExcess(special_signature) to pull funds from paymaster Paymaster can now debit the respective funds from Alice’s chain abstracted balance in custody of smart-wallets (whichever chain or multiple-chains that they are on)

### ZK Proof:
We used Snark and Circom to create a secure way to prove and verify transaction. We have used Partners like LayerZero, Base, Pyth.

### LayerZERO:
Using LayerZERO for commuting ZK proofs from Paymaster on destination chain to TL contract.

### PYTH
PYTH Based USDC Paymaster (smart-contracts/contracts/paymasters/TokenPaymasterWithPyth.sol) is deployed on Base Sepolia.
test cases on base mainnet fork under smart-contracts/test/foundry/unit/main/PYTHBasedTPM.Base.t.sol

It uses Hermes to get price update data and sends it to the paymaster as part of paymasterAndData.

UserOpSender are set of scripts to send user operations to the bundler. This uses Biconomy Nexus account as Smart Account. First it approves the PYTH token paymaster (Deployed on base sepolia at 0x1dd38a1830692A64C6765A060a91bC801Ef3C406) which allows users to pay in test USDC token.





