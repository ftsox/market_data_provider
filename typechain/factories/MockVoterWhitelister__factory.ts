/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  MockVoterWhitelister,
  MockVoterWhitelisterInterface,
} from "../MockVoterWhitelister";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract MockPriceSubmitter",
        name: "_priceSubmitter",
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
        name: "voter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ftsoIndex",
        type: "uint256",
      },
    ],
    name: "VoterRemovedFromWhitelist",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ftsoIndex",
        type: "uint256",
      },
    ],
    name: "VoterWhitelisted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ftsoIndex",
        type: "uint256",
      },
    ],
    name: "addFtso",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "defaultMaxVotersForFtso",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ftsoIndex",
        type: "uint256",
      },
    ],
    name: "getFtsoWhitelistedPriceProviders",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
    ],
    name: "getFtsoWhitelistedPriceProvidersBySymbol",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "maxVotersForFtso",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
    ],
    name: "requestFullVoterWhitelisting",
    outputs: [
      {
        internalType: "uint256[]",
        name: "_supportedIndices",
        type: "uint256[]",
      },
      {
        internalType: "bool[]",
        name: "_success",
        type: "bool[]",
      },
    ],
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
      {
        internalType: "uint256",
        name: "_ftsoIndex",
        type: "uint256",
      },
    ],
    name: "requestWhitelistingVoter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IFtsoRegistry",
        name: "_ftsoRegistry",
        type: "address",
      },
    ],
    name: "setFtsoRegistry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6080604052600160005534801561001557600080fd5b50604051610c38380380610c3883398101604081905261003491610059565b600380546001600160a01b0319166001600160a01b0392909216919091179055610087565b60006020828403121561006a578081fd5b81516001600160a01b0381168114610080578182fd5b9392505050565b610ba2806100966000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c80635fc560141161005b5780635fc56014146100f357806398dccfc214610106578063aa89dfd414610119578063b06cbaf71461012c57610088565b806309fcb4001461008d578063345705a4146100b65780633de2cb1c146100cb57806347ed51b1146100de575b600080fd5b6100a061009b3660046108a6565b61014d565b6040516100ad9190610932565b60405180910390f35b6100c96100c43660046108a6565b610211565b005b6100c96100d9366004610753565b61027a565b6100e66102d0565b6040516100ad9190610b27565b6100c9610101366004610737565b6102d6565b6100e66101143660046108a6565b610322565b6100a061012736600461081f565b610334565b61013f61013a366004610737565b6103c9565b6040516100ad929190610967565b600081815260016020526040902054606090806101855760405162461bcd60e51b815260040161017c90610a96565b60405180910390fd5b6000838152600260205260409020546001600160a01b0316806101ba575050604080516000815260208101909152905061020c565b6040805160018082528183019092526000916020808301908036833701905050905081816000815181106101ea57fe5b6001600160a01b0390921660209283029190910190910152925061020c915050565b919050565b6003546001600160a01b0316331461023b5760405162461bcd60e51b815260040161017c90610af9565b600081815260016020526040902054156102675760405162461bcd60e51b815260040161017c90610a5f565b6000805491815260016020526040902055565b6102838261050c565b156102a05760405162461bcd60e51b815260040161017c90610a36565b60006102ac8383610512565b9050806102cb5760405162461bcd60e51b815260040161017c90610acd565b505050565b60005481565b6003546001600160a01b031633146103005760405162461bcd60e51b815260040161017c90610af9565b600480546001600160a01b0319166001600160a01b0392909216919091179055565b60016020526000908152604090205481565b60048054604051630e848da360e41b81526060926000926001600160a01b03169163e848da3091610367918791016109e3565b60206040518083038186803b15801561037f57600080fd5b505afa158015610393573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103b791906108be565b90506103c28161014d565b9392505050565b6060806103d58361050c565b156103f25760405162461bcd60e51b815260040161017c90610a36565b600480546040805163798aac5b60e01b815290516001600160a01b039092169263798aac5b928282019260009290829003018186803b15801561043457600080fd5b505afa158015610448573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610470919081019061077e565b80519092508067ffffffffffffffff8111801561048c57600080fd5b506040519080825280602002602001820160405280156104b6578160200160208202803683370190505b50915060005b81811015610505576104e1858583815181106104d457fe5b6020026020010151610512565b8382815181106104ed57fe5b911515602092830291909101909101526001016104bc565b5050915091565b50600090565b6000818152600160205260408120548061053e5760405162461bcd60e51b815260040161017c90610a96565b6000838152600260205260409020546001600160a01b0390811690851681141561056d576001925050506105fd565b600084815260026020908152604080832080546001600160a01b0319166001600160a01b038a161790558051600180825281830190925291828101908036833701905050905081816000815181106105c157fe5b60200260200101906001600160a01b031690816001600160a01b0316815250506105eb8186610603565b6105f586866106cc565b600193505050505b92915050565b60005b8251811015610663577f33359f2769756ca8d0da4683f25ee440744d6f18bfb166dbfb59315a8c62b01683828151811061063c57fe5b602002602001015183604051610653929190610919565b60405180910390a1600101610606565b506003546040516376794efb60e01b81526001600160a01b03909116906376794efb906106969085908590600401610945565b600060405180830381600087803b1580156106b057600080fd5b505af11580156106c4573d6000803e3d6000fd5b505050505050565b7f66a8b13abe95391d1851f5bc319f3dde54ce8f2f40a5fe226aa3251d805832e382826040516106fd929190610919565b60405180910390a1600354604051639d986f9160e01b81526001600160a01b0390911690639d986f91906106969085908590600401610919565b600060208284031215610748578081fd5b81356103c281610b54565b60008060408385031215610765578081fd5b823561077081610b54565b946020939093013593505050565b60006020808385031215610790578182fd5b825167ffffffffffffffff808211156107a7578384fd5b818501915085601f8301126107ba578384fd5b8151818111156107c657fe5b83810291506107d6848301610b30565b8181528481019084860184860187018a10156107f0578788fd5b8795505b838610156108125780518352600195909501949186019186016107f4565b5098975050505050505050565b60006020808385031215610831578182fd5b823567ffffffffffffffff80821115610848578384fd5b818501915085601f83011261085b578384fd5b81358181111561086757fe5b610879601f8201601f19168501610b30565b9150808252868482850101111561088e578485fd5b80848401858401378101909201929092529392505050565b6000602082840312156108b7578081fd5b5035919050565b6000602082840312156108cf578081fd5b5051919050565b6000815180845260208085019450808401835b8381101561090e5781516001600160a01b0316875295820195908201906001016108e9565b509495945050505050565b6001600160a01b03929092168252602082015260400190565b6000602082526103c260208301846108d6565b60006040825261095860408301856108d6565b90508260208301529392505050565b604080825283519082018190526000906020906060840190828701845b828110156109a057815184529284019290840190600101610984565b50505083810382850152845180825285830191830190845b818110156109d65783511515835292840192918401916001016109b8565b5090979650505050505050565b6000602080835283518082850152825b81811015610a0f578581018301518582016040015282016109f3565b81811115610a205783604083870101525b50601f01601f1916929092016040019392505050565b6020808252600f908201526e74727573746564206164647265737360881b604082015260600190565b60208082526017908201527f77686974656c69737420616c7265616479206578697374000000000000000000604082015260600190565b60208082526018908201527f4654534f20696e646578206e6f7420737570706f727465640000000000000000604082015260600190565b602080825260129082015271766f746520706f77657220746f6f206c6f7760701b604082015260600190565b60208082526014908201527337b7363c90383934b1b29039bab136b4ba3a32b960611b604082015260600190565b90815260200190565b60405181810167ffffffffffffffff81118282101715610b4c57fe5b604052919050565b6001600160a01b0381168114610b6957600080fd5b5056fea2646970667358221220cdad7793772c975bd2535e26d83b55bfd0c79207f90da6192e5cd9f5a25cdf8664736f6c63430007060033";

export class MockVoterWhitelister__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _priceSubmitter: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MockVoterWhitelister> {
    return super.deploy(
      _priceSubmitter,
      overrides || {}
    ) as Promise<MockVoterWhitelister>;
  }
  getDeployTransaction(
    _priceSubmitter: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_priceSubmitter, overrides || {});
  }
  attach(address: string): MockVoterWhitelister {
    return super.attach(address) as MockVoterWhitelister;
  }
  connect(signer: Signer): MockVoterWhitelister__factory {
    return super.connect(signer) as MockVoterWhitelister__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockVoterWhitelisterInterface {
    return new utils.Interface(_abi) as MockVoterWhitelisterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockVoterWhitelister {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as MockVoterWhitelister;
  }
}