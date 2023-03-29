//Declaring global variables that will need to be accessed by multiple functions.
let provider = new ethers.providers.Web3Provider(window.ethereum)
let signer
let accountAddress
let walletDepositoryContractAddress
let walletPolicyFactoryContractAddress
let walletPolicyContractAddress



//The ABIs for the three Solidity contracts used in this app were obtained via Remix compiler.
const walletDepositoryContractAbi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_policyId",
				"type": "address"
			}
		],
		"name": "approveClaim",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "claimsArray",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "claimId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "policyId",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "claimDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "claimAmount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "walletHacked",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "insuredWallet",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "payoutAmount",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "payoutAddress",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isApproved",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "hasBeenPaid",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "payoutDate",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "claimsRegistry",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "claimId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "policyId",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "claimDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "claimAmount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "walletHacked",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "insuredWallet",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "payoutAmount",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "payoutAddress",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isApproved",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "hasBeenPaid",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "payoutDate",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCETHBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getDepositoryBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_policyId",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_claimAmount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_walletHacked",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_insuredWallet",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "_payoutAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_payoutAmount",
				"type": "uint256"
			}
		],
		"name": "processClaim",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "redeemCETH",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "swapETHforCETH",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "viewAllClaims",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "claimId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "policyId",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "claimDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "claimAmount",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "walletHacked",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "insuredWallet",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "payoutAmount",
						"type": "uint256"
					},
					{
						"internalType": "address payable",
						"name": "payoutAddress",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "isApproved",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "hasBeenPaid",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "payoutDate",
						"type": "uint256"
					}
				],
				"internalType": "struct WalletDepository.Claim[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "viewClaimAdmin",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "claimId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "policyId",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "claimDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "claimAmount",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "walletHacked",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "insuredWallet",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "payoutAmount",
						"type": "uint256"
					},
					{
						"internalType": "address payable",
						"name": "payoutAddress",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "isApproved",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "hasBeenPaid",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "payoutDate",
						"type": "uint256"
					}
				],
				"internalType": "struct WalletDepository.Claim",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_policyId",
				"type": "address"
			}
		],
		"name": "viewClaimCustomer",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]

const walletPolicyFactoryContractAbi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "administrator",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_insuredWallet",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_productSelected",
				"type": "uint256"
			}
		],
		"name": "createPolicy",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLatestPolicy",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "latestPolicy",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_walletDepository",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "sweepFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const walletPolicyContractAbi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_policyHolder",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_insuredWallet",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_administrator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_productSelected",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_claimAmount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_walletHacked",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "_payoutAddress",
				"type": "address"
			}
		],
		"name": "fileClaim",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPolicyDetails",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renewPolicy",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_payoutAmount",
				"type": "uint256"
			}
		],
		"name": "updateCoverage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]


//Connects Metamask
async function connectMetamask(){
    await provider.send("eth_requestAccounts", [])
    signer = await provider.getSigner()
    accountAddress = await signer.getAddress()
    console.log(`Account address = ${accountAddress}`)
    document.getElementById("metamask-connection-message").textContent = `Account address = ${accountAddress}`
}


//------------------------ ADMIN SECTION --------------------------


//This function deploys the WalletDepository.sol contract.
async function deployWalletDepository(){
    
//The bytecode for WalletDepository.sol was obtained via Remix compiler.
	const walletDepositoryContractByteCode = "60806040527320572e4c090f15667cf7378e16fad2ea0e2f3eff600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503480156100c857600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061264e806101186000396000f3fe6080604052600436106100ab5760003560e01c80638da5cb5b116100645780638da5cb5b146101e357806395b97a791461020e578063c743070414610255578063cd89e62114610280578063dbb773d9146102c7578063f0f1d3f1146102f0576100b2565b80631f19ec63146100b757806334177acd146100e0578063439ffcf21461011d578063522a764214610164578063584df1531461018f5780636d8af7e9146101b8576100b2565b366100b257005b600080fd5b3480156100c357600080fd5b506100de60048036038101906100d99190611d86565b610319565b005b3480156100ec57600080fd5b5061010760048036038101906101029190611e13565b610775565b6040516101149190611f69565b60405180910390f35b34801561012957600080fd5b50610144600480360381019061013f9190611e13565b610972565b60405161015b9b9a99989796959493929190611fc1565b60405180910390f35b34801561017057600080fd5b50610179610a76565b60405161018691906121fd565b60405180910390f35b34801561019b57600080fd5b506101b660048036038101906101b19190611e13565b610d24565b005b3480156101c457600080fd5b506101cd610e38565b6040516101da919061221f565b60405180910390f35b3480156101ef57600080fd5b506101f8610f6a565b604051610205919061223a565b60405180910390f35b34801561021a57600080fd5b5061023560048036038101906102309190612255565b610f8e565b60405161024c9b9a99989796959493929190611fc1565b60405180910390f35b34801561026157600080fd5b5061026a611082565b604051610277919061221f565b60405180910390f35b34801561028c57600080fd5b506102a760048036038101906102a29190612255565b611119565b6040516102be9b9a99989796959493929190612282565b60405180910390f35b3480156102d357600080fd5b506102ee60048036038101906102e99190612255565b6114cf565b005b3480156102fc57600080fd5b5061031760048036038101906103129190611e13565b611aba565b005b60006040518061016001604052806001600280549050610339919061235c565b81526020018873ffffffffffffffffffffffffffffffffffffffff1681526020014281526020018781526020018673ffffffffffffffffffffffffffffffffffffffff1681526020018573ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018473ffffffffffffffffffffffffffffffffffffffff1681526020016000151581526020016000151581526020016000815250905080600160008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550604082015181600201556060820151816003015560808201518160040160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060a08201518160050160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060c0820151816006015560e08201518160070160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506101008201518160070160146101000a81548160ff0219169083151502179055506101208201518160070160156101000a81548160ff021916908315150217905550610140820151816008015590505060028190806001815401808255809150506001900390600052602060002090600902016000909190919091506000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550604082015181600201556060820151816003015560808201518160040160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060a08201518160050160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060c0820151816006015560e08201518160070160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506101008201518160070160146101000a81548160ff0219169083151502179055506101208201518160070160156101000a81548160ff0219169083151502179055506101408201518160080155505050505050505050565b61077d611bf9565b6002828154811061079157610790612390565b5b906000526020600020906009020160405180610160016040529081600082015481526020016001820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160028201548152602001600382015481526020016004820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016005820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600682015481526020016007820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016007820160149054906101000a900460ff161515151581526020016007820160159054906101000a900460ff161515151581526020016008820154815250509050919050565b6002818154811061098257600080fd5b90600052602060002090600902016000915090508060000154908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060020154908060030154908060040160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060060154908060070160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060070160149054906101000a900460ff16908060070160159054906101000a900460ff1690806008015490508b565b606060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610b06576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610afd90612442565b60405180910390fd5b6002805480602002602001604051908101604052809291908181526020016000905b82821015610d1b578382906000526020600020906009020160405180610160016040529081600082015481526020016001820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160028201548152602001600382015481526020016004820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016005820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600682015481526020016007820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016007820160149054906101000a900460ff161515151581526020016007820160159054906101000a900460ff1615151515815260200160088201548152505081526020019060010190610b28565b50505050905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610db2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610da990612442565b60405180910390fd5b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16631249c58b826040518263ffffffff1660e01b81526004016000604051808303818588803b158015610e1c57600080fd5b505af1158015610e30573d6000803e3d6000fd5b505050505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610ec9576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ec090612442565b60405180910390fd5b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401610f24919061223a565b602060405180830381865afa158015610f41573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f659190612477565b905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60016020528060005260406000206000915090508060000154908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060020154908060030154908060040160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060060154908060070160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060070160149054906101000a900460ff16908060070160159054906101000a900460ff1690806008015490508b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611113576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161110a90612442565b60405180910390fd5b47905090565b6000806000806000806000806000806000808c9050600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000154600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060020154600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060030154600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060040160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600160008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600160008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060060154600160008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060070160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600160008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060070160149054906101000a900460ff16600160008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060070160159054906101000a900460ff16600160008c73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600801549b509b509b509b509b509b509b509b509b509b509b505091939597999b90929496989a50565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461155d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161155490612442565b60405180910390fd5b60001515600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060070160149054906101000a900460ff161515146115f3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115ea906124f0565b60405180910390fd5b600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060040160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614611725576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161171c90612582565b60405180910390fd5b600081905060018060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060070160146101000a81548160ff021916908315150217905550600060018060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001546117d491906125a2565b90506001600282815481106117ec576117eb612390565b5b906000526020600020906009020160070160146101000a81548160ff021916908315150217905550600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060070160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600601549081150290604051600060405180830381858888f193505050501580156118fe573d6000803e3d6000fd5b5060018060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060070160156101000a81548160ff02191690831515021790555060016002828154811061196f5761196e612390565b5b906000526020600020906009020160070160156101000a81548160ff02191690831515021790555042600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206008018190555042600282815481106119f3576119f2612390565b5b9060005260206000209060090201600801819055508173ffffffffffffffffffffffffffffffffffffffff166361672ca8600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600601546040518263ffffffff1660e01b8152600401611a83919061221f565b600060405180830381600087803b158015611a9d57600080fd5b505af1158015611ab1573d6000803e3d6000fd5b50505050505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611b48576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611b3f90612442565b60405180910390fd5b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663db006a756305f5e10083611b9691906125d6565b6040518263ffffffff1660e01b8152600401611bb2919061221f565b6020604051808303816000875af1158015611bd1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611bf59190612477565b5050565b60405180610160016040528060008152602001600073ffffffffffffffffffffffffffffffffffffffff1681526020016000815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001600073ffffffffffffffffffffffffffffffffffffffff16815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001600015158152602001600015158152602001600081525090565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611cdf82611cb4565b9050919050565b611cef81611cd4565b8114611cfa57600080fd5b50565b600081359050611d0c81611ce6565b92915050565b6000819050919050565b611d2581611d12565b8114611d3057600080fd5b50565b600081359050611d4281611d1c565b92915050565b6000611d5382611cb4565b9050919050565b611d6381611d48565b8114611d6e57600080fd5b50565b600081359050611d8081611d5a565b92915050565b60008060008060008060c08789031215611da357611da2611caf565b5b6000611db189828a01611cfd565b9650506020611dc289828a01611d33565b9550506040611dd389828a01611cfd565b9450506060611de489828a01611cfd565b9350506080611df589828a01611d71565b92505060a0611e0689828a01611d33565b9150509295509295509295565b600060208284031215611e2957611e28611caf565b5b6000611e3784828501611d33565b91505092915050565b611e4981611d12565b82525050565b611e5881611cd4565b82525050565b611e6781611d48565b82525050565b60008115159050919050565b611e8281611e6d565b82525050565b61016082016000820151611e9f6000850182611e40565b506020820151611eb26020850182611e4f565b506040820151611ec56040850182611e40565b506060820151611ed86060850182611e40565b506080820151611eeb6080850182611e4f565b5060a0820151611efe60a0850182611e4f565b5060c0820151611f1160c0850182611e40565b5060e0820151611f2460e0850182611e5e565b50610100820151611f39610100850182611e79565b50610120820151611f4e610120850182611e79565b50610140820151611f63610140850182611e40565b50505050565b600061016082019050611f7f6000830184611e88565b92915050565b611f8e81611d12565b82525050565b611f9d81611cd4565b82525050565b611fac81611d48565b82525050565b611fbb81611e6d565b82525050565b600061016082019050611fd7600083018e611f85565b611fe4602083018d611f94565b611ff1604083018c611f85565b611ffe606083018b611f85565b61200b608083018a611f94565b61201860a0830189611f94565b61202560c0830188611f85565b61203260e0830187611fa3565b612040610100830186611fb2565b61204e610120830185611fb2565b61205c610140830184611f85565b9c9b505050505050505050505050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b610160820160008201516120af6000850182611e40565b5060208201516120c26020850182611e4f565b5060408201516120d56040850182611e40565b5060608201516120e86060850182611e40565b5060808201516120fb6080850182611e4f565b5060a082015161210e60a0850182611e4f565b5060c082015161212160c0850182611e40565b5060e082015161213460e0850182611e5e565b50610100820151612149610100850182611e79565b5061012082015161215e610120850182611e79565b50610140820151612173610140850182611e40565b50505050565b60006121858383612098565b6101608301905092915050565b6000602082019050919050565b60006121aa8261206c565b6121b48185612077565b93506121bf83612088565b8060005b838110156121f05781516121d78882612179565b97506121e283612192565b9250506001810190506121c3565b5085935050505092915050565b60006020820190508181036000830152612217818461219f565b905092915050565b60006020820190506122346000830184611f85565b92915050565b600060208201905061224f6000830184611f94565b92915050565b60006020828403121561226b5761226a611caf565b5b600061227984828501611cfd565b91505092915050565b600061016082019050612298600083018e611f85565b6122a5602083018d611f94565b6122b2604083018c611f85565b6122bf606083018b611f85565b6122cc608083018a611f94565b6122d960a0830189611f94565b6122e660c0830188611f85565b6122f360e0830187611f94565b612301610100830186611fb2565b61230f610120830185611fb2565b61231d610140830184611f85565b9c9b505050505050505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061236782611d12565b915061237283611d12565b925082820190508082111561238a5761238961232d565b5b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600082825260208201905092915050565b7f546869732066756e6374696f6e206973207265737472696374656420746f207460008201527f6865206f776e6572000000000000000000000000000000000000000000000000602082015250565b600061242c6028836123bf565b9150612437826123d0565b604082019050919050565b6000602082019050818103600083015261245b8161241f565b9050919050565b60008151905061247181611d1c565b92915050565b60006020828403121561248d5761248c611caf565b5b600061249b84828501612462565b91505092915050565b7f436c61696d2068617320616c7265616479206265656e20617070726f76656400600082015250565b60006124da601f836123bf565b91506124e5826124a4565b602082019050919050565b60006020820190508181036000830152612509816124cd565b9050919050565b7f436c61696d206d75737420626520666f7220616e20696e73757265642077616c60008201527f6c65740000000000000000000000000000000000000000000000000000000000602082015250565b600061256c6023836123bf565b915061257782612510565b604082019050919050565b6000602082019050818103600083015261259b8161255f565b9050919050565b60006125ad82611d12565b91506125b883611d12565b92508282039050818111156125d0576125cf61232d565b5b92915050565b60006125e182611d12565b91506125ec83611d12565b92508282026125fa81611d12565b915082820484148315176126115761261061232d565b5b509291505056fea2646970667358221220a8317931d64e566a8371fbad1fbbe567d1d294bc9d8e608964a9824780fe292864736f6c63430008120033"
	try {
		//The Wallet Depository contract is deployed.
        const factory = new ethers.ContractFactory(walletDepositoryContractAbi, walletDepositoryContractByteCode, signer)
        const walletDepositoryContract = await factory.deploy()
        const transactionReceipt = await walletDepositoryContract.deployTransaction.wait()

        //The contract address for the Wallet Depository is captured and stored for later use.
        walletDepositoryContractAddress = transactionReceipt.contractAddress
        document.getElementById("walletDepoConnection-message").textContent = `Wallet Depository Contract Address = ${walletDepositoryContractAddress}`
    } catch(e) {
		//An error message is displayed if the function fails/reverts.
        document.getElementById("walletDepoConnection-message").textContent = "Failed"
        console.log(e)
    }

}

//This function deploys WalletPolicyFactory.sol.
async function deployWalletPolicyFactory(){
    
	/*
      The bytecode for the Wallet Policy Factory Contract was obtained via Remix compiler.
      The bytecode needs to be generated (and pasted into this file) after the Wallet Depository 
	  contract has been deployed. This is because the Wallet Depository contract address 
	  needs to be hard coded into the Wallet Policy Factory contract (since the address of the
	  Wallet Depository will not change).
	*/
    const walletPolicyFactoryContractByteCode = "608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506117c3806100606000396000f3fe6080604052600436106200005c5760003560e01c80633904c5c114620000615780636f9fb98a146200008f5780639862644e14620000bf5780639abb9a2814620001035780639acefa1b1462000123578063f53d0a8e1462000153575b600080fd5b3480156200006e57600080fd5b506200008d60048036038101906200008791906200067d565b62000183565b005b3480156200009c57600080fd5b50620000a762000260565b604051620000b69190620006d5565b60405180910390f35b348015620000cc57600080fd5b50620000eb6004803603810190620000e59190620006f2565b62000268565b604051620000fa919062000735565b60405180910390f35b6200012160048036038101906200011b91906200067d565b6200029b565b005b3480156200013057600080fd5b506200013b6200053f565b6040516200014a919062000735565b60405180910390f35b3480156200016057600080fd5b506200016b620005a6565b6040516200017a919062000735565b60405180910390f35b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161462000214576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200020b90620007d9565b60405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501580156200025b573d6000803e3d6000fd5b505050565b600047905090565b60036020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60018103620002b85766470de4df820000600181905550620002d1565b60028103620002d057662386f26fc100006001819055505b5b600034600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550600154600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156200039e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620003959062000871565b60405180910390fd5b338360008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1684604051620003d090620005ca565b620003df949392919062000893565b604051809103906000f080158015620003fc573d6000803e3d6000fd5b509050600154600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546200045291906200090f565b925050819055506004819080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505050565b6000600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610e43806200094b83390190565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200060a82620005dd565b9050919050565b6200061c81620005fd565b81146200062857600080fd5b50565b6000813590506200063c8162000611565b92915050565b6000819050919050565b620006578162000642565b81146200066357600080fd5b50565b60008135905062000677816200064c565b92915050565b60008060408385031215620006975762000696620005d8565b5b6000620006a7858286016200062b565b9250506020620006ba8582860162000666565b9150509250929050565b620006cf8162000642565b82525050565b6000602082019050620006ec6000830184620006c4565b92915050565b6000602082840312156200070b576200070a620005d8565b5b60006200071b848285016200062b565b91505092915050565b6200072f81620005fd565b82525050565b60006020820190506200074c600083018462000724565b92915050565b600082825260208201905092915050565b7f4f6e6c79207468652061646d696e6973747261746f722063616e20737765657060008201527f2066756e64730000000000000000000000000000000000000000000000000000602082015250565b6000620007c160268362000752565b9150620007ce8262000763565b604082019050919050565b60006020820190508181036000830152620007f481620007b2565b9050919050565b7f496e73756666696369656e742066756e647320746f207075726368617365206160008201527f20706f6c69637900000000000000000000000000000000000000000000000000602082015250565b60006200085960278362000752565b91506200086682620007fb565b604082019050919050565b600060208201905081810360008301526200088c816200084a565b9050919050565b6000608082019050620008aa600083018762000724565b620008b9602083018662000724565b620008c8604083018562000724565b620008d76060830184620006c4565b95945050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006200091c8262000642565b9150620009298362000642565b9250828203905081811115620009445762000943620008e0565b5b9291505056fe608060405273e60a1be16b7aa3f38ee1bfc5f7a2a3343e796aa96000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555030600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503480156200010757600080fd5b5060405162000e4338038062000e4383398181016040528101906200012d9190620002e1565b8060018190555081600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555083600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055504260058190555062278d00426200020f919062000382565b600681905550806802b5e3af16b18800006200022c9190620003ec565b6008819055505050505062000424565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200026e8262000241565b9050919050565b620002808162000261565b81146200028c57600080fd5b50565b600081519050620002a08162000275565b92915050565b6000819050919050565b620002bb81620002a6565b8114620002c757600080fd5b50565b600081519050620002db81620002b0565b92915050565b60008060008060808587031215620002fe57620002fd6200023c565b5b60006200030e878288016200028f565b945050602062000321878288016200028f565b935050604062000334878288016200028f565b92505060606200034787828801620002ca565b91505092959194509250565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006200038f82620002a6565b91506200039c83620002a6565b9250828201905080821115620003b757620003b662000353565b5b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6000620003f982620002a6565b91506200040683620002a6565b925082620004195762000418620003bd565b5b828204905092915050565b610a0f80620004346000396000f3fe60806040526004361061003f5760003560e01c8063545ea8141461004457806361672ca81461006d578063bfd1a3a714610096578063cc9ba6fa146100a0575b600080fd5b34801561005057600080fd5b5061006b6004803603810190610066919061059e565b6100d1565b005b34801561007957600080fd5b50610094600480360381019061008f91906105f1565b610260565b005b61009e61030a565b005b3480156100ac57600080fd5b506100b561038b565b6040516100c8979695949392919061063c565b60405180910390f35b6000806100dc610422565b905060008113610121576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101189061072e565b60405180910390fd5b600060085411610166576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161015d906107c0565b60405180910390fd5b8460085411156101785784915061017e565b60085491505b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16631f19ec63600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168787600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1688886040518763ffffffff1660e01b8152600401610227969594939291906107ef565b600060405180830381600087803b15801561024157600080fd5b505af1158015610255573d6000803e3d6000fd5b505050505050505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146102ee576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e5906108c2565b60405180910390fd5b80600860008282546103009190610911565b9250508190555050565b600060018054036103245766470de4df820000905061033a565b60026001540361033957662386f26fc1000090505b5b8034101561034757600080fd5b4260058190555062278d004261035d9190610945565b6006819055506001546802b5e3af16b188000061037a91906109a8565b60088190555061038861045e565b50565b6000806000806000806000600154600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600554600654600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600854965096509650965096509650965090919293949596565b600080429050600060065490506000828261043d9190610911565b905060008113156104535780935050505061045b565b600093505050505b90565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc479081150290604051600060405180830381858888f193505050501580156104c4573d6000803e3d6000fd5b50565b600080fd5b6000819050919050565b6104df816104cc565b81146104ea57600080fd5b50565b6000813590506104fc816104d6565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061052d82610502565b9050919050565b61053d81610522565b811461054857600080fd5b50565b60008135905061055a81610534565b92915050565b600061056b82610502565b9050919050565b61057b81610560565b811461058657600080fd5b50565b60008135905061059881610572565b92915050565b6000806000606084860312156105b7576105b66104c7565b5b60006105c5868287016104ed565b93505060206105d68682870161054b565b92505060406105e786828701610589565b9150509250925092565b600060208284031215610607576106066104c7565b5b6000610615848285016104ed565b91505092915050565b610627816104cc565b82525050565b61063681610522565b82525050565b600060e082019050610651600083018a61061e565b61065e602083018961062d565b61066b604083018861062d565b610678606083018761061e565b610685608083018661061e565b61069260a083018561062d565b61069f60c083018461061e565b98975050505050505050565b600082825260208201905092915050565b7f596f757220696e737572616e636520636f6e747261637420686173206578706960008201527f7265640000000000000000000000000000000000000000000000000000000000602082015250565b60006107186023836106ab565b9150610723826106bc565b604082019050919050565b600060208201905081810360008301526107478161070b565b9050919050565b7f596f752068617665207573656420757020616c6c20796f757220636f7665726160008201527f67652066756e6473000000000000000000000000000000000000000000000000602082015250565b60006107aa6028836106ab565b91506107b58261074e565b604082019050919050565b600060208201905081810360008301526107d98161079d565b9050919050565b6107e981610560565b82525050565b600060c082019050610804600083018961062d565b610811602083018861061e565b61081e604083018761062d565b61082b606083018661062d565b61083860808301856107e0565b61084560a083018461061e565b979650505050505050565b7f4f6e6c79207468652057616c6c6574204465706f7369746f7279206d6179207560008201527f706461746520636f76657261676520616d6f756e740000000000000000000000602082015250565b60006108ac6035836106ab565b91506108b782610850565b604082019050919050565b600060208201905081810360008301526108db8161089f565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061091c826104cc565b9150610927836104cc565b925082820390508181111561093f5761093e6108e2565b5b92915050565b6000610950826104cc565b915061095b836104cc565b9250828201905080821115610973576109726108e2565b5b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b60006109b3826104cc565b91506109be836104cc565b9250826109ce576109cd610979565b5b82820490509291505056fea26469706673582212201dead13507aa4bc156e0644cd0588d59d46dc1bd2a26e993c7a1f713fa2d769564736f6c63430008120033a2646970667358221220da9b68ba575f5adfa536edbbbd5a715ba7f11235a87fd45655c71859bab738dc64736f6c63430008120033"
	try {
		//The Wallet Policy Factory contract is deployed.
        const factory = new ethers.ContractFactory(walletPolicyFactoryContractAbi, walletPolicyFactoryContractByteCode, signer)
        const walletPolicyFactoryContract = await factory.deploy()
        const transactionReceipt = await walletPolicyFactoryContract.deployTransaction.wait()

        //The contract address for the Wallet Policy Factory is captured and stored for later use.
        walletPolicyFactoryContractAddress = transactionReceipt.contractAddress
        document.getElementById("walletPolicyFactoryConnection-message").textContent = `Wallet Policy Factory Contract Address = ${walletPolicyFactoryContractAddress}`
    } catch(e) {
		//An error message is displayed if the function fails/reverts.
        document.getElementById("walletPolicyFactoryConnection-message").textContent = "Failed"
        console.log(e)
    }
}

//This function allows the administrator to approve and pay a claim to a customer. 
async function payClaim() {

	try {
		//The "approveClaim" function in the Wallet Depository contract is called, and
		//the address of the policy is passed in.
        const walletDepositoryContract = new ethers.Contract(walletDepositoryContractAddress, walletDepositoryContractAbi, provider)
        const createPolicyTx = await walletDepositoryContract.connect(signer).approveClaim(walletPolicyContractAddress, {from: accountAddress})
        const response = await createPolicyTx.wait()
        console.log(await response)
		console.log(response.transactionHash)

		//Transaction hash belonging to the ETH transfer is captured and displayed to the customer.
		payoutTransactionHash = response.transactionHash
        document.getElementById("payout-confirmation-message").textContent = "Claim has been approved and paid out." 
		document.getElementById("payout-transaction-hash").textContent = `Transaction hash: ${payoutTransactionHash}` 
    } catch(e){
		//An error message is displayed if the function fails/reverts.
        document.getElementById("payout-confirmation-message").textContent = "Failed"
        console.log(e)
    }
}

//This function allows the administrator to transfer ("sweep") ETH from the Wallet Policy Factory contract
//to the Wallet Depository contract.
async function sweep() {
	const amountEth = document.getElementById("sweep-amount").value
	const weiValue = ethers.utils.parseUnits(amountEth, "ether")

	try {
		//The "sweepFunds" function in the Wallet Policy Factory contract is called, and
		//the amount of ETH the administrator wishes to transfer is passed in (along with the address
		//of the Wallet Depository).
        const walletPolicyFactoryContract = new ethers.Contract(walletPolicyFactoryContractAddress, walletPolicyFactoryContractAbi, provider)
        const createPolicyTx = await walletPolicyFactoryContract.connect(signer).sweepFunds(walletDepositoryContractAddress, weiValue, {from: accountAddress})
        const response = await createPolicyTx.wait()
        console.log(await response)
        document.getElementById("sweep-confirmation-message").textContent = "Funds have been transferred to the Wallet Depository"
    } catch(e){
		//An error message is displayed if the function fails/reverts.
        document.getElementById("sweep-confirmation-message").textContent = "Failed"
        console.log(e)
    }
}

//This function returns the current ETH balance of the Wallet Policy Factory contract.
//The Wallet Policy Factory contract receives ETH each time a customer creates a new Wallet Policy.
async function getFactoryBalance(){

	try{
    	const walletPolicyFactoryContract = new ethers.Contract(walletPolicyFactoryContractAddress,  
		walletPolicyFactoryContractAbi, provider)
        const factoryBalance = await walletPolicyFactoryContract.getContractBalance()
        document.getElementById("factory-balance-message").textContent = `Wallet Policy Factory Contract Balance = ${factoryBalance / 1e18} ETH`
    } catch(e){
		//An error message is displayed if the function fails/reverts.
        document.getElementById("factory-balance-message").textContent = "Failed"
        console.log(e)
}
}

//This function returns the customer claim details. 
async function getClaimDetailsAdmin(){

	//The "claim-id" number corresponds to the location in an array where all customer claims are stored.
	const index = document.getElementById("claim-id-number").value - 1

	try{
		//The "viewClaimAdmin" function in the Wallet Depository contract is called, and
		//the "claim-Id" number is passed in. 
		const walletDepositoryContract = new ethers.Contract(walletDepositoryContractAddress, walletDepositoryContractAbi, provider)
		const claimDetails = await walletDepositoryContract.viewClaimAdmin(index, {from: accountAddress})
		
		//The details of the claim are returned in an array, and each variable below accesses the 
		//relevent information in that array.
		const claimId = claimDetails[0]
		const policyId = claimDetails[1]
		const claimDate = claimDetails[2]
		const claimAmount = claimDetails[3]
		const walletHacked = claimDetails[4]
		const insuredWallet = claimDetails[5]
		const payoutAmount = claimDetails[6]
		const payoutAddress = claimDetails[7]
		const isApproved = claimDetails[8]
		const hasBeenPaid = claimDetails[9]
		const payoutDate = claimDetails[10]

		//The claims information is passed to the user-interface for the administrator to view.
		document.getElementById("claim-id-1").innerHTML = `<span>Claim Id# = </span>${claimId}`
		document.getElementById("policy-address-1").innerHTML = `<span>Policy Id (address) = </span> ${policyId}`
		document.getElementById("claim-date-1").innerHTML = `<span>Claim timestamp (block height) = </span> ${claimDate}`
		document.getElementById("claim-amount-1").innerHTML = `<span>Claim amount = </span>${claimAmount / 1e18 } ETH`
		document.getElementById("wallet-hacked-1").innerHTML = `<span>Address of hacked wallet = </span>${walletHacked}`
		document.getElementById("insured-wallet-1").innerHTML = `<span>Address of insured wallet = </span>${insuredWallet}`
		document.getElementById("payout-amount-1").innerHTML = `<span>Payout amount = </span> ${payoutAmount / 1e18 } ETH`
		document.getElementById("payout-address-1").innerHTML = `<span>Payout address = </span>${payoutAddress}`
		document.getElementById("is-approved-1").innerHTML = `<span>Claim has been approved: </span> ${isApproved ? "Yes": "No"}`
		document.getElementById("has-been-paid-1").innerHTML = `<span>Claim has been paid: </span> ${hasBeenPaid ? "Yes": "No"}`
	} catch(e){
		//An error message is displayed if the function fails/reverts.
        document.getElementById("claim-id-1").textContent = "Failed"
        console.log(e)
    }
}


//This function allows the Owner/Administrator to deposit ETH from the Wallet Depository contract into Compound
//Finance's cETH contract (on the Goerli testnet). This allows the company to earn a return on its ETH. 
async function getCETH(){
	try{
		//The amount of ETH to deposit is passed in by the Owner/Administrator. 
		const amountEth = document.getElementById("amount-ETH-for-CETH").value
		const weiValue = ethers.utils.parseUnits(amountEth, "ether")
	
		//ETH is sent to the "mint()" function in the cETH contract on the Goerli Testnet. Doing so causes
		//cETH to be sent back to the Wallet Depository contract. 
		const walletDepositoryContract = new ethers.Contract(walletDepositoryContractAddress, walletDepositoryContractAbi, provider)
		const createPolicyTx = await walletDepositoryContract.connect(signer).swapETHforCETH(weiValue, {gasLimit: 1000000 })
		const response = await createPolicyTx.wait()
		console.log(await response)
		document.getElementById("ETH-for-CETH-confirmation").textContent = "ETH swapped successfully for cETH"
	} catch(e){
		//An error message is displayed if the function fails/reverts.
        document.getElementById("ETH-for-CETH-confirmation").textContent = "Failed"
        console.log(e)
    }
}

//This function allows the Owner/Administrator to view the current ETH balance in the Wallet Depository contract. 
async function getBalanceOfETH(){
	try {
		const walletDepositoryContract = new ethers.Contract(walletDepositoryContractAddress, walletDepositoryContractAbi, provider)
		const ETHBalance = await walletDepositoryContract.getDepositoryBalance({from: accountAddress})
		console.log(ETHBalance)
		document.getElementById("ETH-balance-confirmation").textContent = `Current ETH balance = ${ETHBalance / 1e18}`
	} catch(e){
		//An error message is displayed if the function fails/reverts.
        document.getElementById("ETH-balance-confirmation").textContent = "Failed"
        console.log(e)
    }
}

//This function allows the Owner/Administrator to get the current cETH balance in the Wallet Depository. 
async function getBalanceOfCETH(){
	try {
		const walletDepositoryContract = new ethers.Contract(walletDepositoryContractAddress, walletDepositoryContractAbi, provider)
		const cETHBalance = await walletDepositoryContract.getCETHBalance({from: accountAddress})
		console.log(cETHBalance)
		document.getElementById("CETH-balance-confirmation").textContent = `Current cETH balance = ${cETHBalance}`
	} catch(e){
		//An error message is displayed if the function fails/reverts.
        document.getElementById("CETH-balance-confirmation").textContent = "Failed"
        console.log(e)
    }
}

//This function allows the Owner/Administrator to deposit cETH from the Wallet Depository contract into Compound
//Finance's cETH contract (on the Goerli testnet) to redeem for ETH.  
async function getETH(){
	try{
		//The amount of cETH to redeem for ETH is passed in by the Owner/Administrator. 
		const amountTokens = document.getElementById("amount-CETH-for-ETH").value
		
		//cETH is sent to the "redeem()" function in the cETH contract on the Goerli Testnet. Doing so causes
		//ETH to be sent back to the Wallet Depository contract. 
		const walletDepositoryContract = new ethers.Contract(walletDepositoryContractAddress, walletDepositoryContractAbi, provider)
		const createPolicyTx = await walletDepositoryContract.connect(signer).redeemCETH(amountTokens, {from: accountAddress})
		const response = await createPolicyTx.wait()
		console.log(await response)
		document.getElementById("CETH-for-ETH-confirmation").textContent = "cETH redeemed successfully for ETH"
	} catch(e){
		//An error message is displayed if the function fails/reverts.
        document.getElementById("CETH-for-ETH-confirmation").textContent = "Failed"
        console.log(e)
    }
}




//------------------------ CUSTOMER SECTION --------------------------

//This function allows a customer to create a policy. It uses the "Factory" model, where the 
//Wallet Policy Factory contract deploys a new instance of a Wallet Policy contract. 
async function createWalletPolicy() {

	//The customer inputs the wallet they would like to insure, as well as the policy type they 
	//would like to purchase.
    const insuredWalletAddress = document.getElementById("newpolicy-insured-wallet-address").value
	const productSelected = document.getElementById("newpolicy-product-type").value

	//The customer inputs the appropriate payment amount (0.01 ETH or 0.02 ETH).
    const amountEth = document.getElementById("newpolicy-eth-deposit-amount").value
    const weiValue = ethers.utils.parseUnits(amountEth, "ether")
   
    try {
		//The "createPolicy" function in the Wallet Policy Factory contract is called.
		//It deploys an instance of the Wallet Policy contract (which is the customer's actual insurance policy).
		//Payment is received by the Wallet Policy Factory contract. 
        const walletFactoryContract = new ethers.Contract(walletPolicyFactoryContractAddress, walletPolicyFactoryContractAbi, provider)
        const createPolicyTx = await walletFactoryContract.connect(signer).createPolicy(insuredWalletAddress, productSelected, {from: accountAddress, value: weiValue})
        const response = await createPolicyTx.wait()
        console.log(await response)

        document.getElementById("wallet-policy-created-confirmation").textContent = "New wallet insurance policy has been created"
        
		//The contract address of the new Wallet Policy is obtained and provided to the customer.
		walletPolicyContractAddress = await walletFactoryContract.getLatestPolicy({from: accountAddress})
        document.getElementById("wallet-policy-address").textContent = `Wallet insurance policy contract address: ${walletPolicyContractAddress} `
    } catch(e){
		//An error message is displayed if the function fails/reverts.
        document.getElementById("wallet-policy-created-confirmation").textContent = "Failed"
        console.log(e)
    }
}


//This function allows a customer to view their policy information.
async function getPolicyData(){
	
	walletPolicyContractAddress = document.getElementById("newpolicy-address").value

	try {
		//The "getPolicyDetails" function in the Wallet Policy contract is called.
		const walletPolicyContract = new ethers.Contract(walletPolicyContractAddress, walletPolicyContractAbi, provider)
		const policyDetails = await walletPolicyContract.getPolicyDetails()
		console.log(policyDetails)

		//The details of the policy are returned in an array, and each variable below accesses the 
		//relevent information in that array. 
		const policyType = policyDetails[0]
		const policyHolder = policyDetails[1]
		const insuredWalletAddress = policyDetails[2]
		const purchaseDate = policyDetails[3]
		const expirationDate = policyDetails[4]
		const policyIdNumber = policyDetails[5]
		const ethCoverageRemaining = policyDetails[6]
		const timeRemaining = expirationDate - purchaseDate
		
		//The policy information is passed to the user-interface for the customer to view.
		document.getElementById("policy-type").innerHTML = `<span>Policy type = </span>${policyType}`
		document.getElementById("policy-holder").innerHTML = `<span>Policy holder (address) = </span> ${policyHolder}`
		document.getElementById("insured-wallet-address").innerHTML = `<span>Insured wallet = </span> ${insuredWalletAddress}`
		document.getElementById("purchase-date").innerHTML = `<span>Purchase date (block height) = </span>${purchaseDate}`
		document.getElementById("expiration-date").innerHTML = `<span>Expiration date (block height) = </span>${expirationDate}`
		document.getElementById("policy-id-number").innerHTML = `<span>Policy Id # = </span>${policyIdNumber}`
		document.getElementById("eth-coverage-remaining").innerHTML = `<span>Coverage remaining = </span> ${ethCoverageRemaining / 1e18 } ETH`
		document.getElementById("has-expired").innerHTML = `<span>Policy has expired:  </span>${timeRemaining > 0 ? "No" : "Yes"}`
	} catch(e){
		//An error message is displayed if the function fails/reverts.
        document.getElementById("policy-type").textContent = "Failed"
        console.log(e)
    }
}

//This function allows a customer to file a claim.
async function fileWalletInsClaim(){

	//The customer provides the claim amount (i.e., the amount they lost due to a hack of their insured wallet).
	const claimAmount = document.getElementById("wallet-claim-amount").value
    const weiValue = ethers.utils.parseUnits(claimAmount, "ether")

	//The customer provides the address of their hacked wallet, along with the wallet address to which they
	//would like to receive a payout of their claim. 
	const hackedWalletAddress = document.getElementById("wallet-hacked").value
	const walletPayoutAddress = document.getElementById("wallet-payout-address").value
    
	try {
		//The "fileClaim" function in the Wallet Policy contract is called. The claim amount, the 
		//hacked wallet address, and the payout wallet address are passed in. 
		const walletPolicyContract = new ethers.Contract(walletPolicyContractAddress, walletPolicyContractAbi, provider)
		const createPolicyTx = await walletPolicyContract.connect(signer).fileClaim(weiValue, hackedWalletAddress, walletPayoutAddress)
		const response = await createPolicyTx.wait()
		console.log(await response)
		document.getElementById("claim-filed-confirmation").textContent = "Claim filed successfully"
	} catch(e){
		//An error message is displayed if the function fails/reverts.
        console.log(e)
		document.getElementById("claim-filed-confirmation").textContent = "Failed"
    }
}

//This function returns the customer claim details. 
async function getClaimDetailsCustomer(){

	//The "viewClaimCustomer" function in the Wallet Depository contract is called, and
	//the Wallet Policy contract address is passed in.
	try {
		const walletDepositoryContract = new ethers.Contract(walletDepositoryContractAddress, walletDepositoryContractAbi, provider)
		
		//There is a mapping in the Wallet Depository contract which contains the latest claim
		//filed for each policy address. This is why the Wallet Policy contract address is passed in. 
		const claimDetails = await walletDepositoryContract.viewClaimCustomer(walletPolicyContractAddress, {from: accountAddress})

		//The details of the claim are returned in an array, and each variable below accesses the 
		//relevent information in that array.
		const claimId = claimDetails[0]
		const policyId = claimDetails[1]
		const claimDate = claimDetails[2]
		const claimAmount = claimDetails[3]
		const walletHacked = claimDetails[4]
		const insuredWallet = claimDetails[5]
		const payoutAmount = claimDetails[6]
		const payoutAddress = claimDetails[7]
		const isApproved = claimDetails[8]
		const hasBeenPaid = claimDetails[9]
		const payoutDate = claimDetails[10]

		//The claims information is passed to the user-interface for the customer to view.
		document.getElementById("claim-id-2").innerHTML = `<span>Claim Id# = </span>${claimId}`
		document.getElementById("policy-id-2").innerHTML = `<span>Policy Id (address) = </span> ${policyId}`
		document.getElementById("claim-date-2").innerHTML = `<span>Claim timestamp (block height) = </span> ${claimDate}`
		document.getElementById("claim-amount-2").innerHTML = `<span>Claim amount = </span>${claimAmount / 1e18 } ETH`
		document.getElementById("wallet-hacked-2").innerHTML = `<span>Address of hacked wallet = </span>${walletHacked}`
		document.getElementById("insured-wallet-2").innerHTML = `<span>Address of insured wallet = </span>${insuredWallet}`
		document.getElementById("payout-amount-2").innerHTML = `<span>Payout amount = </span> ${payoutAmount / 1e18 } ETH`
		document.getElementById("payout-address-2").innerHTML = `<span>Payout address = </span>${payoutAddress}`
		document.getElementById("is-approved-2").innerHTML = `<span>Claim has been approved: </span> ${isApproved ? "Yes": "No"}`
		document.getElementById("has-been-paid-2").innerHTML = `<span>Claim has been paid: </span> ${hasBeenPaid ? "Yes": "No"}`
	} catch(e){
		//An error message is displayed if the function fails/reverts.
        console.log(e)
		document.getElementById("claim-id-2").textContent = "Failed"
    }
}

//This function allows a customer to renew their Wallet Policy insurance (without having to
//create an entirely new contract).
//Funds are automatically transferred to the Wallet Depository contract.
async function renew(){

	//The customer enters the payment amount depending on their policy type (0.01 or 0.02 ETH).
	const amountEth = document.getElementById("renewal-deposit-amount").value
	const weiValue = ethers.utils.parseUnits(amountEth, "ether")

	try {
		//The "renewPolicy" function in the Wallet Policy contract is called. Note that there is a transfer
		//function in that contract which automatically transfers the ETH to the Wallet Depository contract.
		const walletPolicyContract = new ethers.Contract(walletPolicyContractAddress, walletPolicyContractAbi, provider)
		const createPolicyTx = await walletPolicyContract.connect(signer).renewPolicy({from: accountAddress, value: weiValue})
		const response = await createPolicyTx.wait()
		console.log(await response)
		document.getElementById("wallet-policy-renewed-confirmation").textContent = "Your wallet insurance policy has been renewed"
	} catch(e){
		//An error message is displayed if the function fails/reverts.
        console.log(e)
		document.getElementById("wallet-policy-renewed-confirmation").textContent = "Failed"
    }
}



//The functions below are "getter" functions that pull in addresses needed by the user-interface in various 
//places (to call the relevant contracts). 
function getDepositoryAddress1(){
	walletDepositoryContractAddress = document.getElementById("depository-address-1").value
	document.getElementById("depository-address1-confirmation").textContent = "Address received."
}

function getDepositoryAddress2(){
	walletDepositoryContractAddress = document.getElementById("depository-address-2").value
	document.getElementById("depository-address2-confirmation").textContent = "Address received."
}


function getDepositoryAddress3(){
	walletDepositoryContractAddress = document.getElementById("depository-address-3").value
	document.getElementById("depository-address3-confirmation").textContent = "Address received."
}

function getDepositoryAddress4(){
	walletDepositoryContractAddress = document.getElementById("depository-address-4").value
	document.getElementById("depository-address4-confirmation").textContent = "Address received."
}

function getDepositoryAddress5(){
	walletDepositoryContractAddress = document.getElementById("depository-address-5").value
	document.getElementById("depository-address5-confirmation").textContent = "Address received."
}


function getWalletFactoryAddress1(){
	walletPolicyFactoryContractAddress = document.getElementById("wallet-factory-address-1").value
	document.getElementById("walletFactory-address1-confirmation").textContent = "Address received."
}


function getWalletFactoryAddress2(){
	walletPolicyFactoryContractAddress = document.getElementById("wallet-factory-address-2").value
	document.getElementById("walletFactory-address2-confirmation").textContent = "Address received."
}


function getWalletPolicyAddress1(){
	walletPolicyContractAddress = document.getElementById("policy-address-1").value
    document.getElementById("policy-address1-confirmation").textContent = "Address received."
}


function getWalletPolicyAddress2(){
	walletPolicyContractAddress = document.getElementById("policy-address-2").value
    document.getElementById("policy-address2-confirmation").textContent = "Address received."
}

function getWalletPolicyAddress3(){
	walletPolicyContractAddress = document.getElementById("policy-address-3").value
    document.getElementById("policy-address3-confirmation").textContent = "Address received."
}