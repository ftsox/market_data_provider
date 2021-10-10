/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface IFtsoManagerContract
  extends Truffle.Contract<IFtsoManagerInstance> {
  "new"(meta?: Truffle.TransactionDetails): Promise<IFtsoManagerInstance>;
}

export interface DistributingRewardsFailed {
  name: "DistributingRewardsFailed";
  args: {
    ftso: string;
    epochId: BN;
    0: string;
    1: BN;
  };
}

export interface FallbackMode {
  name: "FallbackMode";
  args: {
    fallbackMode: boolean;
    0: boolean;
  };
}

export interface FinalizingPriceEpochFailed {
  name: "FinalizingPriceEpochFailed";
  args: {
    ftso: string;
    epochId: BN;
    failingType: BN;
    0: string;
    1: BN;
    2: BN;
  };
}

export interface FtsoAdded {
  name: "FtsoAdded";
  args: {
    ftso: string;
    add: boolean;
    0: string;
    1: boolean;
  };
}

export interface FtsoFallbackMode {
  name: "FtsoFallbackMode";
  args: {
    ftso: string;
    fallbackMode: boolean;
    0: string;
    1: boolean;
  };
}

export interface InitializingCurrentEpochStateForRevealFailed {
  name: "InitializingCurrentEpochStateForRevealFailed";
  args: {
    ftso: string;
    epochId: BN;
    0: string;
    1: BN;
  };
}

export interface PriceEpochFinalized {
  name: "PriceEpochFinalized";
  args: {
    chosenFtso: string;
    rewardEpochId: BN;
    0: string;
    1: BN;
  };
}

export interface RewardEpochFinalized {
  name: "RewardEpochFinalized";
  args: {
    votepowerBlock: BN;
    startBlock: BN;
    0: BN;
    1: BN;
  };
}

type AllEvents =
  | DistributingRewardsFailed
  | FallbackMode
  | FinalizingPriceEpochFailed
  | FtsoAdded
  | FtsoFallbackMode
  | InitializingCurrentEpochStateForRevealFailed
  | PriceEpochFinalized
  | RewardEpochFinalized;

export interface IFtsoManagerInstance extends Truffle.ContractInstance {
  active(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

  getCurrentPriceEpochData(
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: BN; 1: BN; 2: BN; 3: BN; 4: BN }>;

  getCurrentRewardEpoch(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  getFtsos(txDetails?: Truffle.TransactionDetails): Promise<string[]>;

  getPriceEpochConfiguration(
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: BN; 1: BN; 2: BN }>;

  getPriceSubmitter(txDetails?: Truffle.TransactionDetails): Promise<string>;

  getRewardEpochVotePowerBlock(
    _rewardEpoch: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  methods: {
    active(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

    getCurrentPriceEpochData(
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN; 1: BN; 2: BN; 3: BN; 4: BN }>;

    getCurrentRewardEpoch(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    getFtsos(txDetails?: Truffle.TransactionDetails): Promise<string[]>;

    getPriceEpochConfiguration(
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN; 1: BN; 2: BN }>;

    getPriceSubmitter(txDetails?: Truffle.TransactionDetails): Promise<string>;

    getRewardEpochVotePowerBlock(
      _rewardEpoch: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
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
