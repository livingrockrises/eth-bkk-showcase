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

export type OriginStruct = {
  srcEid: BigNumberish;
  sender: BytesLike;
  nonce: BigNumberish;
};

export type OriginStructOutput = [
  srcEid: bigint,
  sender: string,
  nonce: bigint
] & { srcEid: bigint; sender: string; nonce: bigint };

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

export type MessagingFeeStruct = {
  nativeFee: BigNumberish;
  lzTokenFee: BigNumberish;
};

export type MessagingFeeStructOutput = [
  nativeFee: bigint,
  lzTokenFee: bigint
] & { nativeFee: bigint; lzTokenFee: bigint };

export type MessagingReceiptStruct = {
  guid: BytesLike;
  nonce: BigNumberish;
  fee: MessagingFeeStruct;
};

export type MessagingReceiptStructOutput = [
  guid: string,
  nonce: bigint,
  fee: MessagingFeeStructOutput
] & { guid: string; nonce: bigint; fee: MessagingFeeStructOutput };

export declare namespace SolvingPaymaster {
  export type EvmReadRequestStruct = {
    appRequestLabel: BigNumberish;
    targetEid: BigNumberish;
    isBlockNum: boolean;
    blockNumOrTimestamp: BigNumberish;
    confirmations: BigNumberish;
    to: AddressLike;
  };

  export type EvmReadRequestStructOutput = [
    appRequestLabel: bigint,
    targetEid: bigint,
    isBlockNum: boolean,
    blockNumOrTimestamp: bigint,
    confirmations: bigint,
    to: string
  ] & {
    appRequestLabel: bigint;
    targetEid: bigint;
    isBlockNum: boolean;
    blockNumOrTimestamp: bigint;
    confirmations: bigint;
    to: string;
  };

  export type EvmComputeRequestStruct = {
    computeSetting: BigNumberish;
    targetEid: BigNumberish;
    isBlockNum: boolean;
    blockNumOrTimestamp: BigNumberish;
    confirmations: BigNumberish;
    to: AddressLike;
  };

  export type EvmComputeRequestStructOutput = [
    computeSetting: bigint,
    targetEid: bigint,
    isBlockNum: boolean,
    blockNumOrTimestamp: bigint,
    confirmations: bigint,
    to: string
  ] & {
    computeSetting: bigint;
    targetEid: bigint;
    isBlockNum: boolean;
    blockNumOrTimestamp: bigint;
    confirmations: bigint;
    to: string;
  };

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
      | "allowInitializePath"
      | "buildCmd"
      | "data"
      | "deposit"
      | "endpoint"
      | "entryPoint"
      | "getDeposit"
      | "getHash"
      | "identifier"
      | "isComposeMsgSender"
      | "isValidWithdrawSignature"
      | "lzMap"
      | "lzReceive"
      | "lzReduce"
      | "myInformation"
      | "nextNonce"
      | "oAppVersion"
      | "owner"
      | "peers"
      | "postOp"
      | "renounceOwnership"
      | "send"
      | "setDelegate"
      | "setPeer"
      | "setReadChannel"
      | "transferOwnership"
      | "unlockStake"
      | "validatePaymasterUserOp"
      | "verifyingSigner"
      | "withdrawStake"
      | "withdrawTo"
      | "withdrawTokenExcess"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "MessageReceived"
      | "OwnershipTransferred"
      | "PeerSet"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "addStake",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "allowInitializePath",
    values: [OriginStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "buildCmd",
    values: [
      BigNumberish,
      SolvingPaymaster.EvmReadRequestStruct[],
      SolvingPaymaster.EvmComputeRequestStruct
    ]
  ): string;
  encodeFunctionData(functionFragment: "data", values?: undefined): string;
  encodeFunctionData(functionFragment: "deposit", values?: undefined): string;
  encodeFunctionData(functionFragment: "endpoint", values?: undefined): string;
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
    functionFragment: "identifier",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isComposeMsgSender",
    values: [OriginStruct, BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isValidWithdrawSignature",
    values: [PackedUserOperationStruct, SolvingPaymaster.WithdrawRequestStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "lzMap",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "lzReceive",
    values: [OriginStruct, BytesLike, BytesLike, AddressLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "lzReduce",
    values: [BytesLike, BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "myInformation",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "nextNonce",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "oAppVersion",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "peers", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "postOp",
    values: [BigNumberish, BytesLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "send",
    values: [
      BigNumberish,
      BigNumberish,
      SolvingPaymaster.EvmReadRequestStruct[],
      SolvingPaymaster.EvmComputeRequestStruct,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setDelegate",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setPeer",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setReadChannel",
    values: [BigNumberish, boolean]
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
  decodeFunctionResult(
    functionFragment: "allowInitializePath",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "buildCmd", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "data", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "endpoint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "entryPoint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getDeposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getHash", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "identifier", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isComposeMsgSender",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isValidWithdrawSignature",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "lzMap", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lzReceive", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lzReduce", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "myInformation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "nextNonce", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "oAppVersion",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "peers", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "postOp", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "send", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setDelegate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setPeer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setReadChannel",
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

export namespace MessageReceivedEvent {
  export type InputTuple = [
    srcEid: BigNumberish,
    guid: BytesLike,
    payload: BytesLike
  ];
  export type OutputTuple = [srcEid: bigint, guid: string, payload: string];
  export interface OutputObject {
    srcEid: bigint;
    guid: string;
    payload: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
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

export namespace PeerSetEvent {
  export type InputTuple = [eid: BigNumberish, peer: BytesLike];
  export type OutputTuple = [eid: bigint, peer: string];
  export interface OutputObject {
    eid: bigint;
    peer: string;
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

  allowInitializePath: TypedContractMethod<
    [origin: OriginStruct],
    [boolean],
    "view"
  >;

  buildCmd: TypedContractMethod<
    [
      appLabel: BigNumberish,
      _readRequests: SolvingPaymaster.EvmReadRequestStruct[],
      _computeRequest: SolvingPaymaster.EvmComputeRequestStruct
    ],
    [string],
    "view"
  >;

  data: TypedContractMethod<[], [string], "view">;

  deposit: TypedContractMethod<[], [void], "payable">;

  endpoint: TypedContractMethod<[], [string], "view">;

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

  identifier: TypedContractMethod<[], [string], "view">;

  isComposeMsgSender: TypedContractMethod<
    [arg0: OriginStruct, arg1: BytesLike, _sender: AddressLike],
    [boolean],
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

  lzMap: TypedContractMethod<
    [_request: BytesLike, _response: BytesLike],
    [string],
    "view"
  >;

  lzReceive: TypedContractMethod<
    [
      _origin: OriginStruct,
      _guid: BytesLike,
      _message: BytesLike,
      _executor: AddressLike,
      _extraData: BytesLike
    ],
    [void],
    "payable"
  >;

  lzReduce: TypedContractMethod<
    [_cmd: BytesLike, _responses: BytesLike[]],
    [string],
    "view"
  >;

  myInformation: TypedContractMethod<[], [string], "view">;

  nextNonce: TypedContractMethod<
    [arg0: BigNumberish, arg1: BytesLike],
    [bigint],
    "view"
  >;

  oAppVersion: TypedContractMethod<
    [],
    [[bigint, bigint] & { senderVersion: bigint; receiverVersion: bigint }],
    "view"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  peers: TypedContractMethod<[eid: BigNumberish], [string], "view">;

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

  send: TypedContractMethod<
    [
      _channelId: BigNumberish,
      _appLabel: BigNumberish,
      _requests: SolvingPaymaster.EvmReadRequestStruct[],
      _computeRequest: SolvingPaymaster.EvmComputeRequestStruct,
      _options: BytesLike
    ],
    [MessagingReceiptStructOutput],
    "payable"
  >;

  setDelegate: TypedContractMethod<
    [_delegate: AddressLike],
    [void],
    "nonpayable"
  >;

  setPeer: TypedContractMethod<
    [_eid: BigNumberish, _peer: BytesLike],
    [void],
    "nonpayable"
  >;

  setReadChannel: TypedContractMethod<
    [_channelId: BigNumberish, _active: boolean],
    [void],
    "nonpayable"
  >;

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
    nameOrSignature: "allowInitializePath"
  ): TypedContractMethod<[origin: OriginStruct], [boolean], "view">;
  getFunction(
    nameOrSignature: "buildCmd"
  ): TypedContractMethod<
    [
      appLabel: BigNumberish,
      _readRequests: SolvingPaymaster.EvmReadRequestStruct[],
      _computeRequest: SolvingPaymaster.EvmComputeRequestStruct
    ],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "data"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "deposit"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "endpoint"
  ): TypedContractMethod<[], [string], "view">;
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
    nameOrSignature: "identifier"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "isComposeMsgSender"
  ): TypedContractMethod<
    [arg0: OriginStruct, arg1: BytesLike, _sender: AddressLike],
    [boolean],
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
    nameOrSignature: "lzMap"
  ): TypedContractMethod<
    [_request: BytesLike, _response: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "lzReceive"
  ): TypedContractMethod<
    [
      _origin: OriginStruct,
      _guid: BytesLike,
      _message: BytesLike,
      _executor: AddressLike,
      _extraData: BytesLike
    ],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "lzReduce"
  ): TypedContractMethod<
    [_cmd: BytesLike, _responses: BytesLike[]],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "myInformation"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "nextNonce"
  ): TypedContractMethod<
    [arg0: BigNumberish, arg1: BytesLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "oAppVersion"
  ): TypedContractMethod<
    [],
    [[bigint, bigint] & { senderVersion: bigint; receiverVersion: bigint }],
    "view"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "peers"
  ): TypedContractMethod<[eid: BigNumberish], [string], "view">;
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
    nameOrSignature: "send"
  ): TypedContractMethod<
    [
      _channelId: BigNumberish,
      _appLabel: BigNumberish,
      _requests: SolvingPaymaster.EvmReadRequestStruct[],
      _computeRequest: SolvingPaymaster.EvmComputeRequestStruct,
      _options: BytesLike
    ],
    [MessagingReceiptStructOutput],
    "payable"
  >;
  getFunction(
    nameOrSignature: "setDelegate"
  ): TypedContractMethod<[_delegate: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setPeer"
  ): TypedContractMethod<
    [_eid: BigNumberish, _peer: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setReadChannel"
  ): TypedContractMethod<
    [_channelId: BigNumberish, _active: boolean],
    [void],
    "nonpayable"
  >;
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
    key: "MessageReceived"
  ): TypedContractEvent<
    MessageReceivedEvent.InputTuple,
    MessageReceivedEvent.OutputTuple,
    MessageReceivedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "PeerSet"
  ): TypedContractEvent<
    PeerSetEvent.InputTuple,
    PeerSetEvent.OutputTuple,
    PeerSetEvent.OutputObject
  >;

  filters: {
    "MessageReceived(uint32,bytes32,bytes)": TypedContractEvent<
      MessageReceivedEvent.InputTuple,
      MessageReceivedEvent.OutputTuple,
      MessageReceivedEvent.OutputObject
    >;
    MessageReceived: TypedContractEvent<
      MessageReceivedEvent.InputTuple,
      MessageReceivedEvent.OutputTuple,
      MessageReceivedEvent.OutputObject
    >;

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

    "PeerSet(uint32,bytes32)": TypedContractEvent<
      PeerSetEvent.InputTuple,
      PeerSetEvent.OutputTuple,
      PeerSetEvent.OutputObject
    >;
    PeerSet: TypedContractEvent<
      PeerSetEvent.InputTuple,
      PeerSetEvent.OutputTuple,
      PeerSetEvent.OutputObject
    >;
  };
}