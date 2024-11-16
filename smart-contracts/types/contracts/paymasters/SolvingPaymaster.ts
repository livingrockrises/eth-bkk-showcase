/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export type PackedUserOperationStruct = {
  sender: AddressLike;
  nonce: BigNumberish;
  initCode: BytesLike;
  callData: BytesLike;
  accountGasLimits: BytesLike;
  preVerificationGas: BigNumberish;
  gasFees: BytesLike;
  paymasterAndData: BytesLike;
  signature: BytesLike;
};

export type PackedUserOperationStructOutput = [
  sender: string,
  nonce: bigint,
  initCode: string,
  callData: string,
  accountGasLimits: string,
  preVerificationGas: bigint,
  gasFees: string,
  paymasterAndData: string,
  signature: string
] & {
  sender: string;
  nonce: bigint;
  initCode: string;
  callData: string;
  accountGasLimits: string;
  preVerificationGas: bigint;
  gasFees: string;
  paymasterAndData: string;
  signature: string;
};

export declare namespace SolvingPaymaster {
  export type WithdrawRequestStruct = {
    signature: BytesLike;
    asset: AddressLike;
    amount: BigNumberish;
    nonce: BigNumberish;
    expiry: BigNumberish;
  };

  export type WithdrawRequestStructOutput = [
    signature: string,
    asset: string,
    amount: bigint,
    nonce: bigint,
    expiry: bigint
  ] & {
    signature: string;
    asset: string;
    amount: bigint;
    nonce: bigint;
    expiry: bigint;
  };
}

export interface SolvingPaymasterInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "addStake"
      | "deposit"
      | "entryPoint"
      | "getDeposit"
      | "getHash"
      | "isValidWithdrawSignature"
      | "owner"
      | "postOp"
      | "renounceOwnership"
      | "transferOwnership"
      | "unlockStake"
      | "validatePaymasterUserOp"
      | "verifyingSigner"
      | "withdrawStake"
      | "withdrawTo"
      | "withdrawTokenExcess"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;

  encodeFunctionData(
    functionFragment: "addStake",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "deposit", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "entryPoint",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getDeposit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getHash",
    values: [PackedUserOperationStruct, SolvingPaymaster.WithdrawRequestStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "isValidWithdrawSignature",
    values: [PackedUserOperationStruct, SolvingPaymaster.WithdrawRequestStruct]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "postOp",
    values: [BigNumberish, BytesLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "unlockStake",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "validatePaymasterUserOp",
    values: [PackedUserOperationStruct, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "verifyingSigner",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawStake",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawTo",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawTokenExcess",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(functionFragment: "addStake", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "entryPoint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getDeposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getHash", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isValidWithdrawSignature",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "postOp", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unlockStake",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validatePaymasterUserOp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "verifyingSigner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawStake",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdrawTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawTokenExcess",
    data: BytesLike
  ): Result;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface SolvingPaymaster extends BaseContract {
  connect(runner?: ContractRunner | null): SolvingPaymaster;
  waitForDeployment(): Promise<this>;

  interface: SolvingPaymasterInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  addStake: TypedContractMethod<
    [unstakeDelaySec: BigNumberish],
    [void],
    "payable"
  >;

  deposit: TypedContractMethod<[], [void], "payable">;

  entryPoint: TypedContractMethod<[], [string], "view">;

  getDeposit: TypedContractMethod<[], [bigint], "view">;

  getHash: TypedContractMethod<
    [
      userOp: PackedUserOperationStruct,
      withdrawRequest: SolvingPaymaster.WithdrawRequestStruct
    ],
    [string],
    "view"
  >;

  isValidWithdrawSignature: TypedContractMethod<
    [
      userOp: PackedUserOperationStruct,
      withdrawRequest: SolvingPaymaster.WithdrawRequestStruct
    ],
    [boolean],
    "view"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  postOp: TypedContractMethod<
    [
      mode: BigNumberish,
      context: BytesLike,
      actualGasCost: BigNumberish,
      actualUserOpFeePerGas: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  unlockStake: TypedContractMethod<[], [void], "nonpayable">;

  validatePaymasterUserOp: TypedContractMethod<
    [
      userOp: PackedUserOperationStruct,
      userOpHash: BytesLike,
      maxCost: BigNumberish
    ],
    [[string, bigint] & { context: string; validationData: bigint }],
    "nonpayable"
  >;

  verifyingSigner: TypedContractMethod<[], [string], "view">;

  withdrawStake: TypedContractMethod<
    [withdrawAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  withdrawTo: TypedContractMethod<
    [withdrawAddress: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  withdrawTokenExcess: TypedContractMethod<
    [token: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addStake"
  ): TypedContractMethod<[unstakeDelaySec: BigNumberish], [void], "payable">;
  getFunction(
    nameOrSignature: "deposit"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "entryPoint"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getDeposit"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getHash"
  ): TypedContractMethod<
    [
      userOp: PackedUserOperationStruct,
      withdrawRequest: SolvingPaymaster.WithdrawRequestStruct
    ],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "isValidWithdrawSignature"
  ): TypedContractMethod<
    [
      userOp: PackedUserOperationStruct,
      withdrawRequest: SolvingPaymaster.WithdrawRequestStruct
    ],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "postOp"
  ): TypedContractMethod<
    [
      mode: BigNumberish,
      context: BytesLike,
      actualGasCost: BigNumberish,
      actualUserOpFeePerGas: BigNumberish
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "unlockStake"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "validatePaymasterUserOp"
  ): TypedContractMethod<
    [
      userOp: PackedUserOperationStruct,
      userOpHash: BytesLike,
      maxCost: BigNumberish
    ],
    [[string, bigint] & { context: string; validationData: bigint }],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "verifyingSigner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "withdrawStake"
  ): TypedContractMethod<[withdrawAddress: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdrawTo"
  ): TypedContractMethod<
    [withdrawAddress: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "withdrawTokenExcess"
  ): TypedContractMethod<[token: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;

  filters: {
    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
  };
}
