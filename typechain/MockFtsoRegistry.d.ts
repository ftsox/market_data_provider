/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface MockFtsoRegistryInterface extends ethers.utils.Interface {
  functions: {
    "addFtso(address)": FunctionFragment;
    "claimGovernance()": FunctionFragment;
    "getAllFtsos()": FunctionFragment;
    "getCurrentPrice(string)": FunctionFragment;
    "getFtso(uint256)": FunctionFragment;
    "getFtsoBySymbol(string)": FunctionFragment;
    "getFtsoHistory(uint256)": FunctionFragment;
    "getFtsoIndex(string)": FunctionFragment;
    "getFtsoSymbol(uint256)": FunctionFragment;
    "getFtsos(uint256[])": FunctionFragment;
    "getSupportedFtsos()": FunctionFragment;
    "getSupportedIndices()": FunctionFragment;
    "getSupportedIndicesAndFtsos()": FunctionFragment;
    "getSupportedIndicesAndSymbols()": FunctionFragment;
    "getSupportedIndicesSymbolsAndFtsos()": FunctionFragment;
    "getSupportedSymbols()": FunctionFragment;
    "getSupportedSymbolsAndFtsos()": FunctionFragment;
    "governance()": FunctionFragment;
    "initialise(address)": FunctionFragment;
    "proposeGovernance(address)": FunctionFragment;
    "proposedGovernance()": FunctionFragment;
    "removeFtso(address)": FunctionFragment;
    "transferGovernance(address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "addFtso", values: [string]): string;
  encodeFunctionData(
    functionFragment: "claimGovernance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getAllFtsos",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getCurrentPrice",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getFtso",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getFtsoBySymbol",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getFtsoHistory",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getFtsoIndex",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getFtsoSymbol",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getFtsos",
    values: [BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "getSupportedFtsos",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getSupportedIndices",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getSupportedIndicesAndFtsos",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getSupportedIndicesAndSymbols",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getSupportedIndicesSymbolsAndFtsos",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getSupportedSymbols",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getSupportedSymbolsAndFtsos",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "governance",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "initialise", values: [string]): string;
  encodeFunctionData(
    functionFragment: "proposeGovernance",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "proposedGovernance",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "removeFtso", values: [string]): string;
  encodeFunctionData(
    functionFragment: "transferGovernance",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "addFtso", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "claimGovernance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAllFtsos",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCurrentPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getFtso", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getFtsoBySymbol",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFtsoHistory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFtsoIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFtsoSymbol",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getFtsos", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getSupportedFtsos",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSupportedIndices",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSupportedIndicesAndFtsos",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSupportedIndicesAndSymbols",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSupportedIndicesSymbolsAndFtsos",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSupportedSymbols",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSupportedSymbolsAndFtsos",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "governance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialise", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "proposeGovernance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "proposedGovernance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "removeFtso", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferGovernance",
    data: BytesLike
  ): Result;

  events: {
    "GovernanceProposed(address)": EventFragment;
    "GovernanceUpdated(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "GovernanceProposed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "GovernanceUpdated"): EventFragment;
}

export class MockFtsoRegistry extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: MockFtsoRegistryInterface;

  functions: {
    addFtso(
      _ftsoContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claimGovernance(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getAllFtsos(
      overrides?: CallOverrides
    ): Promise<[string[]] & { _ftsos: string[] }>;

    "getCurrentPrice(string)"(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { _price: BigNumber; _timestamp: BigNumber }
    >;

    "getCurrentPrice(uint256)"(
      _assetIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { _price: BigNumber; _timestamp: BigNumber }
    >;

    getFtso(
      _assetIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string] & { _activeFtso: string }>;

    getFtsoBySymbol(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<[string] & { _activeFtso: string }>;

    getFtsoHistory(
      _assetIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [[string, string, string, string, string]] & {
        _ftsoAddressHistory: [string, string, string, string, string];
      }
    >;

    getFtsoIndex(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { _assetIndex: BigNumber }>;

    getFtsoSymbol(
      _assetIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string] & { _symbol: string }>;

    getFtsos(
      _assetIndices: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<[string[]] & { _ftsos: string[] }>;

    getSupportedFtsos(
      overrides?: CallOverrides
    ): Promise<[string[]] & { _ftsos: string[] }>;

    getSupportedIndices(
      overrides?: CallOverrides
    ): Promise<[BigNumber[]] & { _supportedIndices: BigNumber[] }>;

    getSupportedIndicesAndFtsos(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber[], string[]] & {
        _supportedIndices: BigNumber[];
        _ftsos: string[];
      }
    >;

    getSupportedIndicesAndSymbols(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber[], string[]] & {
        _supportedIndices: BigNumber[];
        _supportedSymbols: string[];
      }
    >;

    getSupportedIndicesSymbolsAndFtsos(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber[], string[], string[]] & {
        _supportedIndices: BigNumber[];
        _supportedSymbols: string[];
        _ftsos: string[];
      }
    >;

    getSupportedSymbols(
      overrides?: CallOverrides
    ): Promise<[string[]] & { _supportedSymbols: string[] }>;

    getSupportedSymbolsAndFtsos(
      overrides?: CallOverrides
    ): Promise<
      [string[], string[]] & { _supportedSymbols: string[]; _ftsos: string[] }
    >;

    governance(overrides?: CallOverrides): Promise<[string]>;

    initialise(
      _governance: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    proposeGovernance(
      _governance: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    proposedGovernance(overrides?: CallOverrides): Promise<[string]>;

    removeFtso(
      _ftso: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferGovernance(
      _governance: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  addFtso(
    _ftsoContract: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claimGovernance(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getAllFtsos(overrides?: CallOverrides): Promise<string[]>;

  "getCurrentPrice(string)"(
    _symbol: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { _price: BigNumber; _timestamp: BigNumber }
  >;

  "getCurrentPrice(uint256)"(
    _assetIndex: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { _price: BigNumber; _timestamp: BigNumber }
  >;

  getFtso(
    _assetIndex: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  getFtsoBySymbol(_symbol: string, overrides?: CallOverrides): Promise<string>;

  getFtsoHistory(
    _assetIndex: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[string, string, string, string, string]>;

  getFtsoIndex(_symbol: string, overrides?: CallOverrides): Promise<BigNumber>;

  getFtsoSymbol(
    _assetIndex: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  getFtsos(
    _assetIndices: BigNumberish[],
    overrides?: CallOverrides
  ): Promise<string[]>;

  getSupportedFtsos(overrides?: CallOverrides): Promise<string[]>;

  getSupportedIndices(overrides?: CallOverrides): Promise<BigNumber[]>;

  getSupportedIndicesAndFtsos(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber[], string[]] & {
      _supportedIndices: BigNumber[];
      _ftsos: string[];
    }
  >;

  getSupportedIndicesAndSymbols(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber[], string[]] & {
      _supportedIndices: BigNumber[];
      _supportedSymbols: string[];
    }
  >;

  getSupportedIndicesSymbolsAndFtsos(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber[], string[], string[]] & {
      _supportedIndices: BigNumber[];
      _supportedSymbols: string[];
      _ftsos: string[];
    }
  >;

  getSupportedSymbols(overrides?: CallOverrides): Promise<string[]>;

  getSupportedSymbolsAndFtsos(
    overrides?: CallOverrides
  ): Promise<
    [string[], string[]] & { _supportedSymbols: string[]; _ftsos: string[] }
  >;

  governance(overrides?: CallOverrides): Promise<string>;

  initialise(
    _governance: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  proposeGovernance(
    _governance: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  proposedGovernance(overrides?: CallOverrides): Promise<string>;

  removeFtso(
    _ftso: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferGovernance(
    _governance: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addFtso(_ftsoContract: string, overrides?: CallOverrides): Promise<void>;

    claimGovernance(overrides?: CallOverrides): Promise<void>;

    getAllFtsos(overrides?: CallOverrides): Promise<string[]>;

    "getCurrentPrice(string)"(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { _price: BigNumber; _timestamp: BigNumber }
    >;

    "getCurrentPrice(uint256)"(
      _assetIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { _price: BigNumber; _timestamp: BigNumber }
    >;

    getFtso(
      _assetIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    getFtsoBySymbol(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<string>;

    getFtsoHistory(
      _assetIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string, string, string, string, string]>;

    getFtsoIndex(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFtsoSymbol(
      _assetIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    getFtsos(
      _assetIndices: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<string[]>;

    getSupportedFtsos(overrides?: CallOverrides): Promise<string[]>;

    getSupportedIndices(overrides?: CallOverrides): Promise<BigNumber[]>;

    getSupportedIndicesAndFtsos(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber[], string[]] & {
        _supportedIndices: BigNumber[];
        _ftsos: string[];
      }
    >;

    getSupportedIndicesAndSymbols(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber[], string[]] & {
        _supportedIndices: BigNumber[];
        _supportedSymbols: string[];
      }
    >;

    getSupportedIndicesSymbolsAndFtsos(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber[], string[], string[]] & {
        _supportedIndices: BigNumber[];
        _supportedSymbols: string[];
        _ftsos: string[];
      }
    >;

    getSupportedSymbols(overrides?: CallOverrides): Promise<string[]>;

    getSupportedSymbolsAndFtsos(
      overrides?: CallOverrides
    ): Promise<
      [string[], string[]] & { _supportedSymbols: string[]; _ftsos: string[] }
    >;

    governance(overrides?: CallOverrides): Promise<string>;

    initialise(_governance: string, overrides?: CallOverrides): Promise<void>;

    proposeGovernance(
      _governance: string,
      overrides?: CallOverrides
    ): Promise<void>;

    proposedGovernance(overrides?: CallOverrides): Promise<string>;

    removeFtso(_ftso: string, overrides?: CallOverrides): Promise<void>;

    transferGovernance(
      _governance: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    GovernanceProposed(
      proposedGovernance?: null
    ): TypedEventFilter<[string], { proposedGovernance: string }>;

    GovernanceUpdated(
      oldGovernance?: null,
      newGoveranance?: null
    ): TypedEventFilter<
      [string, string],
      { oldGovernance: string; newGoveranance: string }
    >;
  };

  estimateGas: {
    addFtso(
      _ftsoContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claimGovernance(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getAllFtsos(overrides?: CallOverrides): Promise<BigNumber>;

    "getCurrentPrice(string)"(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getCurrentPrice(uint256)"(
      _assetIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFtso(
      _assetIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFtsoBySymbol(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFtsoHistory(
      _assetIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFtsoIndex(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFtsoSymbol(
      _assetIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFtsos(
      _assetIndices: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getSupportedFtsos(overrides?: CallOverrides): Promise<BigNumber>;

    getSupportedIndices(overrides?: CallOverrides): Promise<BigNumber>;

    getSupportedIndicesAndFtsos(overrides?: CallOverrides): Promise<BigNumber>;

    getSupportedIndicesAndSymbols(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getSupportedIndicesSymbolsAndFtsos(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getSupportedSymbols(overrides?: CallOverrides): Promise<BigNumber>;

    getSupportedSymbolsAndFtsos(overrides?: CallOverrides): Promise<BigNumber>;

    governance(overrides?: CallOverrides): Promise<BigNumber>;

    initialise(
      _governance: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    proposeGovernance(
      _governance: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    proposedGovernance(overrides?: CallOverrides): Promise<BigNumber>;

    removeFtso(
      _ftso: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferGovernance(
      _governance: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addFtso(
      _ftsoContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claimGovernance(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getAllFtsos(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "getCurrentPrice(string)"(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getCurrentPrice(uint256)"(
      _assetIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getFtso(
      _assetIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getFtsoBySymbol(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getFtsoHistory(
      _assetIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getFtsoIndex(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getFtsoSymbol(
      _assetIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getFtsos(
      _assetIndices: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSupportedFtsos(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getSupportedIndices(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSupportedIndicesAndFtsos(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSupportedIndicesAndSymbols(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSupportedIndicesSymbolsAndFtsos(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSupportedSymbols(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSupportedSymbolsAndFtsos(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    governance(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialise(
      _governance: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    proposeGovernance(
      _governance: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    proposedGovernance(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    removeFtso(
      _ftso: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferGovernance(
      _governance: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
