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
} from "../../../common";

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

export interface TimelockVaultInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "LOCK_PERIOD"
      | "allowInitializePath"
      | "canWithdraw"
      | "deposit"
      | "deposits"
      | "endpoint"
      | "executeTokenWithdrawalRequest"
      | "getDeposit"
      | "identifier"
      | "isComposeMsgSender"
      | "lzEndpoint"
      | "lzMap"
      | "lzReceive"
      | "lzReduce"
      | "myInformation"
      | "nextNonce"
      | "oAppVersion"
      | "owner"
      | "peers"
      | "renounceOwnership"
      | "setDelegate"
      | "setPeer"
      | "setReadChannel"
      | "solvingPaymaster"
      | "submitTokenWithdrawalRequest"
      | "transferOwnership"
      | "withdraw"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Deposited"
      | "LockPeriodUpdated"
      | "MessageReceived"
      | "OwnershipTransferred"
      | "PeerSet"
      | "WithdrawalRequestSubmitted"
      | "Withdrawn"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "LOCK_PERIOD",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "allowInitializePath",
    values: [OriginStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "canWithdraw",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "deposits",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "endpoint", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "executeTokenWithdrawalRequest",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getDeposit",
    values: [AddressLike, AddressLike]
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
    functionFragment: "lzEndpoint",
    values?: undefined
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
    functionFragment: "renounceOwnership",
    values?: undefined
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
    functionFragment: "solvingPaymaster",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "submitTokenWithdrawalRequest",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [AddressLike, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "LOCK_PERIOD",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "allowInitializePath",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "canWithdraw",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposits", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "endpoint", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "executeTokenWithdrawalRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getDeposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "identifier", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isComposeMsgSender",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "lzEndpoint", data: BytesLike): Result;
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
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
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
    functionFragment: "solvingPaymaster",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "submitTokenWithdrawalRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}

export namespace DepositedEvent {
  export type InputTuple = [
    token: AddressLike,
    user: AddressLike,
    amount: BigNumberish
  ];
  export type OutputTuple = [token: string, user: string, amount: bigint];
  export interface OutputObject {
    token: string;
    user: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace LockPeriodUpdatedEvent {
  export type InputTuple = [newPeriod: BigNumberish];
  export type OutputTuple = [newPeriod: bigint];
  export interface OutputObject {
    newPeriod: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
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

export namespace WithdrawalRequestSubmittedEvent {
  export type InputTuple = [
    withdrawAddress: AddressLike,
    token: AddressLike,
    amount: BigNumberish,
    actor: AddressLike
  ];
  export type OutputTuple = [
    withdrawAddress: string,
    token: string,
    amount: bigint,
    actor: string
  ];
  export interface OutputObject {
    withdrawAddress: string;
    token: string;
    amount: bigint;
    actor: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WithdrawnEvent {
  export type InputTuple = [
    token: AddressLike,
    user: AddressLike,
    amount: BigNumberish
  ];
  export type OutputTuple = [token: string, user: string, amount: bigint];
  export interface OutputObject {
    token: string;
    user: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface TimelockVault extends BaseContract {
  connect(runner?: ContractRunner | null): TimelockVault;
  waitForDeployment(): Promise<this>;

  interface: TimelockVaultInterface;

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

  LOCK_PERIOD: TypedContractMethod<[], [bigint], "view">;

  allowInitializePath: TypedContractMethod<
    [origin: OriginStruct],
    [boolean],
    "view"
  >;

  canWithdraw: TypedContractMethod<
    [token: AddressLike, amount: BigNumberish],
    [boolean],
    "view"
  >;

  deposit: TypedContractMethod<
    [token: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  deposits: TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [[bigint, bigint] & { amount: bigint; unlockTime: bigint }],
    "view"
  >;

  endpoint: TypedContractMethod<[], [string], "view">;

  executeTokenWithdrawalRequest: TypedContractMethod<
    [token: AddressLike, paymasterId: AddressLike],
    [void],
    "nonpayable"
  >;

  getDeposit: TypedContractMethod<
    [token: AddressLike, user: AddressLike],
    [[bigint, bigint] & { amount: bigint; unlockTime: bigint }],
    "view"
  >;

  identifier: TypedContractMethod<[], [string], "view">;

  isComposeMsgSender: TypedContractMethod<
    [arg0: OriginStruct, arg1: BytesLike, _sender: AddressLike],
    [boolean],
    "view"
  >;

  lzEndpoint: TypedContractMethod<[], [string], "view">;

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

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

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

  solvingPaymaster: TypedContractMethod<[], [string], "view">;

  submitTokenWithdrawalRequest: TypedContractMethod<
    [token: AddressLike, withdrawAddress: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  withdraw: TypedContractMethod<
    [token: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "LOCK_PERIOD"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "allowInitializePath"
  ): TypedContractMethod<[origin: OriginStruct], [boolean], "view">;
  getFunction(
    nameOrSignature: "canWithdraw"
  ): TypedContractMethod<
    [token: AddressLike, amount: BigNumberish],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "deposit"
  ): TypedContractMethod<
    [token: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "deposits"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [[bigint, bigint] & { amount: bigint; unlockTime: bigint }],
    "view"
  >;
  getFunction(
    nameOrSignature: "endpoint"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "executeTokenWithdrawalRequest"
  ): TypedContractMethod<
    [token: AddressLike, paymasterId: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getDeposit"
  ): TypedContractMethod<
    [token: AddressLike, user: AddressLike],
    [[bigint, bigint] & { amount: bigint; unlockTime: bigint }],
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
    nameOrSignature: "lzEndpoint"
  ): TypedContractMethod<[], [string], "view">;
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
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
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
    nameOrSignature: "solvingPaymaster"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "submitTokenWithdrawalRequest"
  ): TypedContractMethod<
    [token: AddressLike, withdrawAddress: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<
    [token: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "Deposited"
  ): TypedContractEvent<
    DepositedEvent.InputTuple,
    DepositedEvent.OutputTuple,
    DepositedEvent.OutputObject
  >;
  getEvent(
    key: "LockPeriodUpdated"
  ): TypedContractEvent<
    LockPeriodUpdatedEvent.InputTuple,
    LockPeriodUpdatedEvent.OutputTuple,
    LockPeriodUpdatedEvent.OutputObject
  >;
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
  getEvent(
    key: "WithdrawalRequestSubmitted"
  ): TypedContractEvent<
    WithdrawalRequestSubmittedEvent.InputTuple,
    WithdrawalRequestSubmittedEvent.OutputTuple,
    WithdrawalRequestSubmittedEvent.OutputObject
  >;
  getEvent(
    key: "Withdrawn"
  ): TypedContractEvent<
    WithdrawnEvent.InputTuple,
    WithdrawnEvent.OutputTuple,
    WithdrawnEvent.OutputObject
  >;

  filters: {
    "Deposited(address,address,uint256)": TypedContractEvent<
      DepositedEvent.InputTuple,
      DepositedEvent.OutputTuple,
      DepositedEvent.OutputObject
    >;
    Deposited: TypedContractEvent<
      DepositedEvent.InputTuple,
      DepositedEvent.OutputTuple,
      DepositedEvent.OutputObject
    >;

    "LockPeriodUpdated(uint256)": TypedContractEvent<
      LockPeriodUpdatedEvent.InputTuple,
      LockPeriodUpdatedEvent.OutputTuple,
      LockPeriodUpdatedEvent.OutputObject
    >;
    LockPeriodUpdated: TypedContractEvent<
      LockPeriodUpdatedEvent.InputTuple,
      LockPeriodUpdatedEvent.OutputTuple,
      LockPeriodUpdatedEvent.OutputObject
    >;

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

    "WithdrawalRequestSubmitted(address,address,uint256,address)": TypedContractEvent<
      WithdrawalRequestSubmittedEvent.InputTuple,
      WithdrawalRequestSubmittedEvent.OutputTuple,
      WithdrawalRequestSubmittedEvent.OutputObject
    >;
    WithdrawalRequestSubmitted: TypedContractEvent<
      WithdrawalRequestSubmittedEvent.InputTuple,
      WithdrawalRequestSubmittedEvent.OutputTuple,
      WithdrawalRequestSubmittedEvent.OutputObject
    >;

    "Withdrawn(address,address,uint256)": TypedContractEvent<
      WithdrawnEvent.InputTuple,
      WithdrawnEvent.OutputTuple,
      WithdrawnEvent.OutputObject
    >;
    Withdrawn: TypedContractEvent<
      WithdrawnEvent.InputTuple,
      WithdrawnEvent.OutputTuple,
      WithdrawnEvent.OutputObject
    >;
  };
}
