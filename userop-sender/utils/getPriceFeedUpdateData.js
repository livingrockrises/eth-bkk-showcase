import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";

const ETH_USD_ID = "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace"
const USDC_USD_ID = "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a"

export const abi = [
    {
      type: "constructor",
      inputs: [
        {
          name: "_pyth",
          type: "address",
          internalType: "address",
        },
        {
          name: "_ethUsdPriceId",
          type: "bytes32",
          internalType: "bytes32",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "mint",
      inputs: [],
      outputs: [],
      stateMutability: "payable",
    },
    {
      type: "function",
      name: "updateAndMint",
      inputs: [
        {
          name: "pythPriceUpdate",
          type: "bytes[]",
          internalType: "bytes[]",
        },
      ],
      outputs: [],
      stateMutability: "payable",
    },
    {
      type: "error",
      name: "InsufficientFee",
      inputs: [],
    },
  ];

export const getPriceFeedUpdateData = async () => {
    const connection = new EvmPriceServiceConnection(
        "https://hermes.pyth.network"
      );
      const priceIds = [ETH_USD_ID, USDC_USD_ID];
      const priceFeedUpdateData = await connection.getPriceFeedsUpdateData(
        priceIds
      );
      console.log("Retrieved Pyth price update:");
      console.log(priceFeedUpdateData);
      return priceFeedUpdateData
}

