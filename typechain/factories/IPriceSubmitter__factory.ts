/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IPriceSubmitter,
  IPriceSubmitterInterface,
} from "../IPriceSubmitter";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "submitter",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "epochId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "contract IFtsoGenesis[]",
        name: "ftsos",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "bytes32[]",
        name: "hashes",
        type: "bytes32[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "PriceHashesSubmitted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "epochId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "contract IFtsoGenesis[]",
        name: "ftsos",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "prices",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "randoms",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "PricesRevealed",
    type: "event",
  },
  {
    inputs: [],
    name: "getFtsoManager",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getFtsoRegistry",
    outputs: [
      {
        internalType: "contract IFtsoRegistryGenesis",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVoterWhitelister",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_epochId",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_ftsoIndices",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_prices",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_randoms",
        type: "uint256[]",
      },
    ],
    name: "revealPrices",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_epochId",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_ftsoIndices",
        type: "uint256[]",
      },
      {
        internalType: "bytes32[]",
        name: "_hashes",
        type: "bytes32[]",
      },
    ],
    name: "submitPriceHashes",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
    ],
    name: "voterWhitelistBitmap",
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

export class IPriceSubmitter__factory {
  static readonly abi = _abi;
  static createInterface(): IPriceSubmitterInterface {
    return new utils.Interface(_abi) as IPriceSubmitterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IPriceSubmitter {
    return new Contract(address, _abi, signerOrProvider) as IPriceSubmitter;
  }
}
