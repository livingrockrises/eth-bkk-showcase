# eth-bkk-showcase


## 1

Spend funds on other chains based on escrow lock, zk proof and layer zero.



## 2

PYTH Based USDC Paymaster (smart-contracts/contracts/paymasters/TokenPaymasterWithPyth.sol) is deployed on Base Sepolia.
test cases on base mainnet fork under smart-contracts/test/foundry/unit/main/PYTHBasedTPM.Base.t.sol

It uses Hermes to get price update data and sends it to the paymaster as part of paymasterAndData.

UserOpSender are set of scripts to send user operations to the bundler. This uses Biconomy Nexus account as Smart Account. First it approves the PYTH token paymaster (Deployed on base sepolia at 0x1dd38a1830692A64C6765A060a91bC801Ef3C406) which allows users to pay in test USDC token.





