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
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface IFtsoRegistryInterface extends ethers.utils.Interface {
  functions: {
    "getCurrentPrice(string)": FunctionFragment;
    "getFtso(uint256)": FunctionFragment;
    "getFtsoBySymbol(string)": FunctionFragment;
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
  };

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

  events: {};
}

export class IFtsoRegistry extends BaseContract {
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

  interface: IFtsoRegistryInterface;

  functions: {
    "getCurrentPrice(string)"(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { _price: BigNumber; _timestamp: BigNumber }
    >;

    "getCurrentPrice(uint256)"(
      _ftsoIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { _price: BigNumber; _timestamp: BigNumber }
    >;

    getFtso(
      _ftsoIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string] & { _activeFtsoAddress: string }>;

    getFtsoBySymbol(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<[string] & { _activeFtsoAddress: string }>;

    getFtsoIndex(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { _assetIndex: BigNumber }>;

    getFtsoSymbol(
      _ftsoIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string] & { _symbol: string }>;

    getFtsos(
      _indices: BigNumberish[],
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
  };

  "getCurrentPrice(string)"(
    _symbol: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { _price: BigNumber; _timestamp: BigNumber }
  >;

  "getCurrentPrice(uint256)"(
    _ftsoIndex: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { _price: BigNumber; _timestamp: BigNumber }
  >;

  getFtso(_ftsoIndex: BigNumberish, overrides?: CallOverrides): Promise<string>;

  getFtsoBySymbol(_symbol: string, overrides?: CallOverrides): Promise<string>;

  getFtsoIndex(_symbol: string, overrides?: CallOverrides): Promise<BigNumber>;

  getFtsoSymbol(
    _ftsoIndex: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  getFtsos(
    _indices: BigNumberish[],
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

  callStatic: {
    "getCurrentPrice(string)"(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { _price: BigNumber; _timestamp: BigNumber }
    >;

    "getCurrentPrice(uint256)"(
      _ftsoIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { _price: BigNumber; _timestamp: BigNumber }
    >;

    getFtso(
      _ftsoIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    getFtsoBySymbol(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<string>;

    getFtsoIndex(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFtsoSymbol(
      _ftsoIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    getFtsos(
      _indices: BigNumberish[],
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
  };

  filters: {};

  estimateGas: {
    "getCurrentPrice(string)"(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getCurrentPrice(uint256)"(
      _ftsoIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFtso(
      _ftsoIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFtsoBySymbol(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFtsoIndex(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFtsoSymbol(
      _ftsoIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFtsos(
      _indices: BigNumberish[],
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
  };

  populateTransaction: {
    "getCurrentPrice(string)"(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getCurrentPrice(uint256)"(
      _ftsoIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getFtso(
      _ftsoIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getFtsoBySymbol(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getFtsoIndex(
      _symbol: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getFtsoSymbol(
      _ftsoIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getFtsos(
      _indices: BigNumberish[],
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
  };
}