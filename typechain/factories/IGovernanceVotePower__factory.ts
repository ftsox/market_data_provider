/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IGovernanceVotePower,
  IGovernanceVotePowerInterface,
} from "../IGovernanceVotePower";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
    ],
    name: "delegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "undelegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_who",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_blockNumber",
        type: "uint256",
      },
    ],
    name: "votePowerOfAt",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IGovernanceVotePower__factory {
  static readonly abi = _abi;
  static createInterface(): IGovernanceVotePowerInterface {
    return new utils.Interface(_abi) as IGovernanceVotePowerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IGovernanceVotePower {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IGovernanceVotePower;
  }
}
