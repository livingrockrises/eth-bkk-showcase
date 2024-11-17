/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IOAppMapper,
  IOAppMapperInterface,
} from "../../../../../../@layerzerolabs/oapp-evm/contracts/oapp/interfaces/IOAppMapper";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_request",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "_response",
        type: "bytes",
      },
    ],
    name: "lzMap",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IOAppMapper__factory {
  static readonly abi = _abi;
  static createInterface(): IOAppMapperInterface {
    return new Interface(_abi) as IOAppMapperInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): IOAppMapper {
    return new Contract(address, _abi, runner) as unknown as IOAppMapper;
  }
}
