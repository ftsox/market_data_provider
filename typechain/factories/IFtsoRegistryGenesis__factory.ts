/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IFtsoRegistryGenesis,
  IFtsoRegistryGenesisInterface,
} from "../IFtsoRegistryGenesis";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_indices",
        type: "uint256[]",
      },
    ],
    name: "getFtsos",
    outputs: [
      {
        internalType: "contract IFtsoGenesis[]",
        name: "_ftsos",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IFtsoRegistryGenesis__factory {
  static readonly abi = _abi;
  static createInterface(): IFtsoRegistryGenesisInterface {
    return new utils.Interface(_abi) as IFtsoRegistryGenesisInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IFtsoRegistryGenesis {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IFtsoRegistryGenesis;
  }
}