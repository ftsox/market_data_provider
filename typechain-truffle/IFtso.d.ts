/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface IFtsoContract extends Truffle.Contract<IFtsoInstance> {
  "new"(meta?: Truffle.TransactionDetails): Promise<IFtsoInstance>;
}

export interface LowTurnout {
  name: "LowTurnout";
  args: {
    epochId: BN;
    natTurnout: BN;
    lowNatTurnoutThresholdBIPS: BN;
    timestamp: BN;
    0: BN;
    1: BN;
    2: BN;
    3: BN;
  };
}

export interface PriceEpochInitializedOnFtso {
  name: "PriceEpochInitializedOnFtso";
  args: {
    epochId: BN;
    endTime: BN;
    timestamp: BN;
    0: BN;
    1: BN;
    2: BN;
  };
}

export interface PriceFinalized {
  name: "PriceFinalized";
  args: {
    epochId: BN;
    price: BN;
    rewardedFtso: boolean;
    lowRewardPrice: BN;
    highRewardPrice: BN;
    finalizationType: BN;
    timestamp: BN;
    0: BN;
    1: BN;
    2: boolean;
    3: BN;
    4: BN;
    5: BN;
    6: BN;
  };
}

export interface PriceHashSubmitted {
  name: "PriceHashSubmitted";
  args: {
    submitter: string;
    epochId: BN;
    hash: string;
    timestamp: BN;
    0: string;
    1: BN;
    2: string;
    3: BN;
  };
}

export interface PriceRevealed {
  name: "PriceRevealed";
  args: {
    voter: string;
    epochId: BN;
    price: BN;
    random: BN;
    timestamp: BN;
    votePowerNat: BN;
    votePowerAsset: BN;
    0: string;
    1: BN;
    2: BN;
    3: BN;
    4: BN;
    5: BN;
    6: BN;
  };
}

type AllEvents =
  | LowTurnout
  | PriceEpochInitializedOnFtso
  | PriceFinalized
  | PriceHashSubmitted
  | PriceRevealed;

export interface IFtsoInstance extends Truffle.ContractInstance {
  active(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

  getCurrentEpochId(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  getCurrentPrice(
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: BN; 1: BN }>;

  getCurrentRandom(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  getEpochId(
    _timestamp: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  getEpochPrice(
    _epochId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  getEpochPriceForVoter(
    _epochId: number | BN | string,
    _voter: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  getPriceEpochConfiguration(
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: BN; 1: BN; 2: BN }>;

  getPriceEpochData(
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: BN; 1: BN; 2: BN; 3: BN; 4: boolean }>;

  getRandom(
    _epochId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  symbol(txDetails?: Truffle.TransactionDetails): Promise<string>;

  methods: {
    active(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

    getCurrentEpochId(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    getCurrentPrice(
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN; 1: BN }>;

    getCurrentRandom(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    getEpochId(
      _timestamp: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    getEpochPrice(
      _epochId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    getEpochPriceForVoter(
      _epochId: number | BN | string,
      _voter: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    getPriceEpochConfiguration(
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN; 1: BN; 2: BN }>;

    getPriceEpochData(
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN; 1: BN; 2: BN; 3: BN; 4: boolean }>;

    getRandom(
      _epochId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    symbol(txDetails?: Truffle.TransactionDetails): Promise<string>;
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
