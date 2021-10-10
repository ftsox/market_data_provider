/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Governed, GovernedInterface } from "../Governed";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_governance",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "proposedGovernance",
        type: "address",
      },
    ],
    name: "GovernanceProposed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldGovernance",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newGoveranance",
        type: "address",
      },
    ],
    name: "GovernanceUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "claimGovernance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "governance",
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
        internalType: "address",
        name: "_governance",
        type: "address",
      },
    ],
    name: "initialise",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_governance",
        type: "address",
      },
    ],
    name: "proposeGovernance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "proposedGovernance",
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
        internalType: "address",
        name: "_governance",
        type: "address",
      },
    ],
    name: "transferGovernance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506040516105fb3803806105fb8339818101604052602081101561003357600080fd5b5051806001600160a01b0381161561004e5761004e816100a3565b506001600160a01b03811661009d576040805162461bcd60e51b815260206004820152601060248201526f5f676f7665726e616e6365207a65726f60801b604482015290519081900360640190fd5b50610186565b600154600160a01b900460ff1615610102576040805162461bcd60e51b815260206004820152601460248201527f696e697469616c6973656420213d2066616c7365000000000000000000000000604482015290519081900360640190fd5b6001805460ff60a01b1916600160a01b179055600054604080516001600160a01b039283168152918316602083015280517f434a2db650703b36c824e745330d6397cdaa9ee2cc891a4938ae853e1c50b68d9281900390910190a1600080546001600160a01b039092166001600160a01b0319928316179055600180549091169055565b610466806101956000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c80635aa6e675146100675780635d36b1901461008b57806360f7ac97146100955780639d6a890f1461009d578063c373a08e146100c3578063d38bfff4146100e9575b600080fd5b61006f61010f565b604080516001600160a01b039092168252519081900360200190f35b61009361011e565b005b61006f6101e0565b610093600480360360208110156100b357600080fd5b50356001600160a01b03166101ef565b610093600480360360208110156100d957600080fd5b50356001600160a01b03166102c9565b610093600480360360208110156100ff57600080fd5b50356001600160a01b031661036e565b6000546001600160a01b031681565b6001546001600160a01b0316331461016d576040805162461bcd60e51b815260206004820152600d60248201526c1b9bdd0818db185a5b585a5b9d609a1b604482015290519081900360640190fd5b600054600154604080516001600160a01b03938416815292909116602083015280517f434a2db650703b36c824e745330d6397cdaa9ee2cc891a4938ae853e1c50b68d9281900390910190a160018054600080546001600160a01b03199081166001600160a01b03841617909155169055565b6001546001600160a01b031681565b600154600160a01b900460ff1615610245576040805162461bcd60e51b8152602060048201526014602482015273696e697469616c6973656420213d2066616c736560601b604482015290519081900360640190fd5b6001805460ff60a01b1916600160a01b179055600054604080516001600160a01b039283168152918316602083015280517f434a2db650703b36c824e745330d6397cdaa9ee2cc891a4938ae853e1c50b68d9281900390910190a1600080546001600160a01b039092166001600160a01b0319928316179055600180549091169055565b6000546001600160a01b0316331461031a576040805162461bcd60e51b815260206004820152600f60248201526e6f6e6c7920676f7665726e616e636560881b604482015290519081900360640190fd5b600180546001600160a01b0383166001600160a01b0319909116811790915560408051918252517f1f95fb40be3a947982072902a887b521248d1d8931a39eb38f84f4d6fd758b699181900360200190a150565b6000546001600160a01b031633146103bf576040805162461bcd60e51b815260206004820152600f60248201526e6f6e6c7920676f7665726e616e636560881b604482015290519081900360640190fd5b600054604080516001600160a01b039283168152918316602083015280517f434a2db650703b36c824e745330d6397cdaa9ee2cc891a4938ae853e1c50b68d9281900390910190a1600080546001600160a01b039092166001600160a01b031992831617905560018054909116905556fea264697066735822122089f77b76d3ba9567c3f9165863c234bfc32b099316ef46272d795e56edda225464736f6c63430007060033";

export class Governed__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _governance: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Governed> {
    return super.deploy(_governance, overrides || {}) as Promise<Governed>;
  }
  getDeployTransaction(
    _governance: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_governance, overrides || {});
  }
  attach(address: string): Governed {
    return super.attach(address) as Governed;
  }
  connect(signer: Signer): Governed__factory {
    return super.connect(signer) as Governed__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GovernedInterface {
    return new utils.Interface(_abi) as GovernedInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Governed {
    return new Contract(address, _abi, signerOrProvider) as Governed;
  }
}
