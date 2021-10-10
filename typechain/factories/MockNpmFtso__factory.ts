/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { MockNpmFtso, MockNpmFtsoInterface } from "../MockNpmFtso";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "contract IPriceSubmitter",
        name: "_priceSubmitter",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_firstEpochStartTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_submitPeriod",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_revealPeriod",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "epochId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "natTurnout",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lowNatTurnoutThresholdBIPS",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "LowTurnout",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "epochId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "PriceEpochInitializedOnFtso",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "epochId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "rewardedFtso",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lowRewardPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "highRewardPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum IFtso.PriceFinalizationType",
        name: "finalizationType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "PriceFinalized",
    type: "event",
  },
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
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "PriceHashSubmitted",
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
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "random",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "votePowerNat",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "votePowerAsset",
        type: "uint256",
      },
    ],
    name: "PriceRevealed",
    type: "event",
  },
  {
    inputs: [],
    name: "ASSET_PRICE_USD_DECIMALS",
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
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "activateFtso",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "active",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
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
    name: "assetFtsos",
    outputs: [
      {
        internalType: "contract IIFtso",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "assets",
    outputs: [
      {
        internalType: "contract IIVPToken",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "averageFinalizePriceEpoch",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    name: "configureEpochs",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "deactivateFtso",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "epochsConfiguration",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    name: "finalizePriceEpoch",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
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
    name: "forceFinalizePriceEpoch",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getAsset",
    outputs: [
      {
        internalType: "contract IIVPToken",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getAssetFtsos",
    outputs: [
      {
        internalType: "contract IIFtso[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentEpochId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentRandom",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
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
    name: "getEpochId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
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
    name: "getEpochPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
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
        internalType: "address",
        name: "_voter",
        type: "address",
      },
    ],
    name: "getEpochPriceForVoter",
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
    inputs: [],
    name: "getPriceEpochConfiguration",
    outputs: [
      {
        internalType: "uint256",
        name: "_firstEpochStartTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_submitPeriod",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_revealPeriod",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPriceEpochData",
    outputs: [
      {
        internalType: "uint256",
        name: "_epochId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_epochSubmitEndTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_epochRevealEndTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_votePowerBlock",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_fallbackMode",
        type: "bool",
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
    name: "getRandom",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getVoteWeightingParameters",
    outputs: [
      {
        internalType: "contract IIVPToken[]",
        name: "",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    name: "initializeCurrentEpochStateForReveal",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "priceSubmitter",
    outputs: [
      {
        internalType: "contract IPriceSubmitter",
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
        name: "_voter",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_epochId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_random",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "revealPriceSubmitter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IIVPToken",
        name: "",
        type: "address",
      },
    ],
    name: "setAsset",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IIFtso[]",
        name: "",
        type: "address[]",
      },
    ],
    name: "setAssetFtsos",
    outputs: [],
    stateMutability: "pure",
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
    name: "setVotePowerBlock",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_epochId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "_hash",
        type: "bytes32",
      },
    ],
    name: "submitPriceHashSubmitter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
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
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "updateInitialPrice",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "wNat",
    outputs: [
      {
        internalType: "contract IIVPToken",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_epochId",
        type: "uint256",
      },
    ],
    name: "wNatVotePowerCached",
    outputs: [
      {
        internalType: "uint256",
        name: "_wNatVP",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620014ab380380620014ab833981810160405260a08110156200003757600080fd5b81019080805160405193929190846401000000008211156200005857600080fd5b9083019060208201858111156200006e57600080fd5b82516401000000008111828201881017156200008957600080fd5b82525081516020918201929091019080838360005b83811015620000b85781810151838201526020016200009e565b50505050905090810190601f168015620000e65780820380516001836020036101000a031916815260200191505b5060409081526020828101519183015160608401516080909401518751939650909450916200011c916001919088019062000163565b50426003556000805460ff19166001179055600680546001600160a01b039095166001600160a01b031990951694909417909355600991909155600a55600b55506200020f565b828054600181600116156101000203166002900490600052602060002090601f0160209004810192826200019b5760008555620001e6565b82601f10620001b657805160ff1916838001178555620001e6565b82800160010185558215620001e6579182015b82811115620001e6578251825591602001919060010190620001c9565b50620001f4929150620001f8565b5090565b5b80821115620001f45760008155600101620001f9565b61128c806200021f6000396000f3fe608060405234801561001057600080fd5b50600436106102065760003560e01c80639de6f9271161011a578063dbdb0f4b116100ad578063eb91d37e1161007c578063eb91d37e146107d0578063f72cab28146107f1578063f7dba1f51461081d578063f937d6ad14610872578063fd00e5391461087a57610206565b8063dbdb0f4b146106f8578063e3749e0c14610730578063e3b3a3b31461079b578063e536f3961461065c57610206565b8063cd4b6914116100e9578063cd4b691414610464578063cf35bdd0146106ad578063d0d552dd146106ca578063d89601fd146106f057610206565b80639de6f9271461065c5780639edbf007146104d9578063a29a839f14610679578063c5d8b9e71461068157610206565b8063555989da1161019d5780637d1d6f121161016c5780637d1d6f1214610464578063826cc76b146105055780638357d08c1461052257806395d89b41146105df578063974d7a6b1461065c57610206565b8063555989da1461049357806355f7b69b1461049b5780635c222bad146104d95780636b52b242146104fd57610206565b806327bd2ad5116101d957806327bd2ad51461034a578063306ba2531461037c57806340462a2d1461039f5780635303548b1461046457610206565b806302fb0c5e1461020b578063131fdee214610227578063144e1591146102cc57806318931c35146102f2575b600080fd5b610213610899565b604080519115158252519081900360200190f35b6102ca6004803603602081101561023d57600080fd5b81019060208101813564010000000081111561025857600080fd5b82018360208201111561026a57600080fd5b8035906020019184602083028401116401000000008311171561028c57600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295506108a2945050505050565b005b6102d4610948565b60408051938452602084019290925282820152519081900360600190f35b6102fa610956565b60408051602080825283518183015283519192839290830191858101910280838360005b8381101561033657818101518382015260200161031e565b505050509050019250505060405180910390f35b6102ca6004803603606081101561036057600080fd5b506001600160a01b0381351690602081013590604001356109ba565b6102ca6004803603604081101561039257600080fd5b50803590602001356108a2565b6103c4600480360360408110156103b557600080fd5b50803590602001351515610b5f565b604051808060200180602001848152602001838103835286818151815260200191508051906020019060200280838360005b8381101561040e5781810151838201526020016103f6565b50505050905001838103825285818151815260200191508051906020019060200280838360005b8381101561044d578181015183820152602001610435565b505050509050019550505050505060405180910390f35b6104816004803603602081101561047a57600080fd5b5035610bcb565b60408051918252519081900360200190f35b6102ca6108a2565b6102ca600480360360a08110156104b157600080fd5b506001600160a01b038135169060208101359060408101359060608101359060800135610c33565b6104e1610bcb565b604080516001600160a01b039092168252519081900360200190f35b610481610eb9565b6104e16004803603602081101561051b57600080fd5b5035610ebe565b61052a610ee8565b604051808060200180602001878152602001868152602001858152602001848152602001838103835289818151815260200191508051906020019060200280838360005b8381101561058657818101518382015260200161056e565b50505050905001838103825288818151815260200191508051906020019060200280838360005b838110156105c55781810151838201526020016105ad565b505050509050019850505050505050505060405180910390f35b6105e7610f8d565b6040805160208082528351818301528351919283929083019185019080838360005b83811015610621578181015183820152602001610609565b50505050905090810190601f16801561064e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6102ca6004803603602081101561067257600080fd5b50356108a2565b610481610bcb565b6104816004803603604081101561069757600080fd5b50803590602001356001600160a01b031661101a565b6104e1600480360360208110156106c357600080fd5b5035611042565b6102ca600480360360208110156106e057600080fd5b50356001600160a01b03166108a2565b610481611052565b6102ca6004803603608081101561070e57600080fd5b506001600160a01b0381351690602081013590604081013590606001356108a2565b610738611057565b604051808881526020018781526020018681526020018581526020018481526020018381526020018060200182810382528381815181526020019150805190602001906020028083836000838110156105c55781810151838201526020016105ad565b6107a361111d565b60408051958652602086019490945284840192909252606084015215156080830152519081900360a00190f35b6107d8611153565b6040805192835260208301919091528051918290030190f35b6104816004803603604081101561080757600080fd5b506001600160a01b038135169060200135611159565b6102ca600480360360e081101561083357600080fd5b81359160208101359160408201359160608101359160808201359160a08101359181019060e0810160c082013564010000000081111561025857600080fd5b6104e1611161565b6102ca6004803603602081101561089057600080fd5b503515156108a2565b60005460ff1681565b6040805180820190915260178152600080516020611214833981519152602082015260405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b8381101561090d5781810151838201526020016108f5565b50505050905090810190601f16801561093a5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b600954600a54600b54909192565b604080518082018252601781526000805160206112148339815191526020808301918252925162461bcd60e51b815260048101938452825160248201528251606094928392604401918083836000831561090d5781810151838201526020016108f5565b6006546001600160a01b031633146109d4576109d4611170565b6109dc6111d8565b82146040518060400160405280600e81526020016d15dc9bdb99c8195c1bd8da081a5960921b81525090610a515760405162461bcd60e51b815260206004820181815283516024840152835190928392604490910191908501908083836000831561090d5781810151838201526020016108f5565b5060008281526004602090815260408083206001600160a01b0387168452825291829020548251808401909352601983527f4475706c6963617465207375626d697420696e2065706f6368000000000000009183019190915215610af65760405162461bcd60e51b815260206004820181815283516024840152835190928392604490910191908501908083836000831561090d5781810151838201526020016108f5565b5060008281526004602090815260408083206001600160a01b038716808552908352928190208490558051848152429281019290925280518593927f615c0184a2b16dbbcd09eae0bf239e28977aa4e6ff2204eda59c14016310bb6692908290030190a3505050565b604080518082018252601781526000805160206112148339815191526020808301918252925162461bcd60e51b8152600481019384528251602482015282516060948594600094909391928392604401919080838389831561090d5781810151838201526020016108f5565b604080518082018252601781526000805160206112148339815191526020808301918252925162461bcd60e51b8152600481019384528251602482015282516000949283926044019180838389831561090d5781810151838201526020016108f5565b919050565b6006546001600160a01b03163314610c4d57610c4d611170565b60408051808201909152600e81526d0a0e4d2c6ca40e8dede40d0d2ced60931b6020820152600160801b8410610cc45760405162461bcd60e51b815260206004820181815283516024840152835190928392604490910191908501908083836000831561090d5781810151838201526020016108f5565b50600a546009546001860190910201428111801590610ce65750600b54810142105b6040518060400160405280601881526020017f52657665616c20706572696f64206e6f7420616374697665000000000000000081525090610d685760405162461bcd60e51b815260206004820181815283516024840152835190928392604490910191908501908083836000831561090d5781810151838201526020016108f5565b506040805160208082018790528183018690526001600160a01b0389166060808401829052845180850390910181526080840180865281519184019190912060008b81526004855286812093815292909352908490205460e084019094526023808252939091149290916112349060a0013990610e265760405162461bcd60e51b815260206004820181815283516024840152835190928392604490910191908501908083836000831561090d5781810151838201526020016108f5565b5060008581526004602090815260408083206001600160a01b038a16808552908352818420849055888452600d8352818420818552835281842088905581518881529283018790524283830152606083018490526080830193909352518792917f408bc8c9d02102257c33373c2df5771b03067bd8ea7ec60c35f314ec4ee99d05919081900360a00190a3505050505050565b600581565b60088181548110610ece57600080fd5b6000918252602090912001546001600160a01b0316905081565b606080600080600080600060405180604001604052806017815260200160008051602061121483398151915281525090610f635760405162461bcd60e51b815260206004820181815283516024840152835190928392604490910191908501908083836000831561090d5781810151838201526020016108f5565b50506040805160008082526020820181815282840190935290979196509450849350839250829150565b60018054604080516020600284861615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156110125780601f10610fe757610100808354040283529160200191611012565b820191906000526020600020905b815481529060010190602001808311610ff557829003601f168201915b505050505081565b6000918252600d602090815260408084206001600160a01b0393909316845291905290205490565b60078181548110610ece57600080fd5b600090565b60008060008060008060606000604051806040016040528060178152602001600080516020611214833981519152815250906110d45760405162461bcd60e51b815260206004820181815283516024840152835190928392604490910191908501908083836000831561090d5781810151838201526020016108f5565b506000808080808080604051908082528060200260200182016040528015611106578160200160208202803683370190505b50959d949c50929a50909850965094509092509050565b600080600080600061112d6111d8565b9450600a548560010102600954019350600b548401925060009150600090509091929394565b60008091565b600092915050565b6006546001600160a01b031681565b604080518082018252600d81526c1058d8d95cdcc819195b9a5959609a1b6020808301918252925162461bcd60e51b8152600481019384528251602482015282519293928392604490920191908083836000831561090d5781810151838201526020016108f5565b60006111e3426111e8565b905090565b60006009548210156111fc57506000610c2e565b600a5460095483038161120b57fe5b049050610c2e56fe556e617661696c61626c6520666f722074657374696e67000000000000000000507269636520616c72656164792072657665616c6564206f72206e6f742076616c6964a2646970667358221220dbcd4234bb047ab589fd9d9d95340066a7e6bcb5b9de761deca472ab96f88dbe64736f6c63430007060033";

export class MockNpmFtso__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _symbol: string,
    _priceSubmitter: string,
    _firstEpochStartTime: BigNumberish,
    _submitPeriod: BigNumberish,
    _revealPeriod: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MockNpmFtso> {
    return super.deploy(
      _symbol,
      _priceSubmitter,
      _firstEpochStartTime,
      _submitPeriod,
      _revealPeriod,
      overrides || {}
    ) as Promise<MockNpmFtso>;
  }
  getDeployTransaction(
    _symbol: string,
    _priceSubmitter: string,
    _firstEpochStartTime: BigNumberish,
    _submitPeriod: BigNumberish,
    _revealPeriod: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _symbol,
      _priceSubmitter,
      _firstEpochStartTime,
      _submitPeriod,
      _revealPeriod,
      overrides || {}
    );
  }
  attach(address: string): MockNpmFtso {
    return super.attach(address) as MockNpmFtso;
  }
  connect(signer: Signer): MockNpmFtso__factory {
    return super.connect(signer) as MockNpmFtso__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockNpmFtsoInterface {
    return new utils.Interface(_abi) as MockNpmFtsoInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockNpmFtso {
    return new Contract(address, _abi, signerOrProvider) as MockNpmFtso;
  }
}