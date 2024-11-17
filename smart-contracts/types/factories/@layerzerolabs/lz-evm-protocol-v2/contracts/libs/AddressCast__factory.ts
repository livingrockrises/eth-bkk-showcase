/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../../common";
import type {
  AddressCast,
  AddressCastInterface,
} from "../../../../../@layerzerolabs/lz-evm-protocol-v2/contracts/libs/AddressCast";

const _abi = [
  {
    inputs: [],
    name: "AddressCast_InvalidAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "AddressCast_InvalidSizeForAddress",
    type: "error",
  },
] as const;

const _bytecode =
  "0x6080806040523460175760109081601c823930815050f35b5f80fdfe5f80fdfea164736f6c634300081b000a";

type AddressCastConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AddressCastConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AddressCast__factory extends ContractFactory {
  constructor(...args: AddressCastConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      AddressCast & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): AddressCast__factory {
    return super.connect(runner) as AddressCast__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AddressCastInterface {
    return new Interface(_abi) as AddressCastInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): AddressCast {
    return new Contract(address, _abi, runner) as unknown as AddressCast;
  }
}
