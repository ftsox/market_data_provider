/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface IFtsoRegistryContract
  extends Truffle.Contract<IFtsoRegistryInstance> {
  "new"(meta?: Truffle.TransactionDetails): Promise<IFtsoRegistryInstance>;
}

type AllEvents = never;

export interface IFtsoRegistryInstance extends Truffle.ContractInstance {
  getFtso(
    _ftsoIndex: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  getFtsoBySymbol(
    _symbol: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  getFtsoIndex(
    _symbol: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  getFtsoSymbol(
    _ftsoIndex: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  getFtsos(
    _indices: (number | BN | string)[],
    txDetails?: Truffle.TransactionDetails
  ): Promise<string[]>;

  getAllFtsos(
    txDetails?: Truffle.TransactionDetails
  ): Promise<string[]>;

  getSupportedFtsos(txDetails?: Truffle.TransactionDetails): Promise<string[]>;

  getSupportedIndices(txDetails?: Truffle.TransactionDetails): Promise<BN[]>;

  getSupportedIndicesAndFtsos(
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: BN[]; 1: string[] }>;

  getSupportedIndicesAndSymbols(
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: BN[]; 1: string[] }>;

  getSupportedIndicesSymbolsAndFtsos(
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: BN[]; 1: string[]; 2: string[] }>;

  getSupportedSymbols(
    txDetails?: Truffle.TransactionDetails
  ): Promise<string[]>;

  getSupportedSymbolsAndFtsos(
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: string[]; 1: string[] }>;

  methods: {
    getFtso(
      _ftsoIndex: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    getFtsoBySymbol(
      _symbol: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    getFtsoIndex(
      _symbol: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    getFtsoSymbol(
      _ftsoIndex: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    getFtsos(
      _indices: (number | BN | string)[],
      txDetails?: Truffle.TransactionDetails
    ): Promise<string[]>;

    getAllFtsos(
      txDetails?: Truffle.TransactionDetails
    ): Promise<string[]>;

    getSupportedFtsos(
      txDetails?: Truffle.TransactionDetails
    ): Promise<string[]>;

    getSupportedIndices(txDetails?: Truffle.TransactionDetails): Promise<BN[]>;

    getSupportedIndicesAndFtsos(
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN[]; 1: string[] }>;

    getSupportedIndicesAndSymbols(
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN[]; 1: string[] }>;

    getSupportedIndicesSymbolsAndFtsos(
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN[]; 1: string[]; 2: string[] }>;

    getSupportedSymbols(
      txDetails?: Truffle.TransactionDetails
    ): Promise<string[]>;

    getSupportedSymbolsAndFtsos(
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: string[]; 1: string[] }>;

    "getCurrentPrice(string)"(
      _symbol: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN; 1: BN }>;

    "getCurrentPrice(uint256)"(
      _ftsoIndex: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN; 1: BN }>;
  };

  getPastEvents(event: string): Promise<EventData[]>;
  getPastEvents(
    event: string,
    options: PastEventOptions,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
  getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
  getPastEvents(
    event: string,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
}
