//Declaring global variables that will need to be accessed by multiple functions
let provider = new ethers.providers.Web3Provider(window.ethereum)
let signer
let accountAddress
let collateralDepositoryContractAddress
let collateralPolicyFactoryContractAddress
let collateralPolicyContractAddress

//The ABIs for the three contracts used in this app were obtained via Remix compiler.
const collateralDepositoryContractAbi = [
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
				"name": "amountLiquidated",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "liquidatedContract",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "collateralContract",
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
				"name": "amountLiquidated",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "liquidatedContract",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "collateralContract",
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
				"name": "_amountLiquidated",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_liquidatedContract",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_collateralContract",
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
						"name": "amountLiquidated",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "liquidatedContract",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "collateralContract",
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
				"internalType": "struct CollateralDepository.Claim[]",
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
						"name": "amountLiquidated",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "liquidatedContract",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "collateralContract",
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
				"internalType": "struct CollateralDepository.Claim",
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

const collateralPolicyFactoryContractAbi = [
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
				"name": "_collateralContract",
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
				"name": "_collateralDepository",
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

const collateralPolicyContractAbi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_policyHolder",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_collateralContract",
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
				"name": "_amountLiquidated",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_liquidatedContract",
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
		"inputs": [],
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


//This function deploys the CollateralDepository.sol contract.
async function deployCollateralDepository(){
    
//The bytecode for CollateralDepository.sol was obtained via Remix compiler.
	const collateralDepositoryContractByteCode = "60806040527320572e4c090f15667cf7378e16fad2ea0e2f3eff600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503480156100c857600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550612601806101186000396000f3fe6080604052600436106100ab5760003560e01c80638da5cb5b116100645780638da5cb5b146101e357806395b97a791461020e578063c743070414610255578063cd89e62114610280578063dbb773d9146102c7578063f0f1d3f1146102f0576100b2565b80631f19ec63146100b757806334177acd146100e0578063439ffcf21461011d578063522a764214610164578063584df1531461018f5780636d8af7e9146101b8576100b2565b366100b257005b600080fd5b3480156100c357600080fd5b506100de60048036038101906100d99190611d39565b610319565b005b3480156100ec57600080fd5b5061010760048036038101906101029190611dc6565b610775565b6040516101149190611f1c565b60405180910390f35b34801561012957600080fd5b50610144600480360381019061013f9190611dc6565b610972565b60405161015b9b9a99989796959493929190611f74565b60405180910390f35b34801561017057600080fd5b50610179610a76565b60405161018691906121b0565b60405180910390f35b34801561019b57600080fd5b506101b660048036038101906101b19190611dc6565b610d24565b005b3480156101c457600080fd5b506101cd610e38565b6040516101da91906121d2565b60405180910390f35b3480156101ef57600080fd5b506101f8610f6a565b60405161020591906121ed565b60405180910390f35b34801561021a57600080fd5b5061023560048036038101906102309190612208565b610f8e565b60405161024c9b9a99989796959493929190611f74565b60405180910390f35b34801561026157600080fd5b5061026a611082565b60405161027791906121d2565b60405180910390f35b34801561028c57600080fd5b506102a760048036038101906102a29190612208565b611119565b6040516102be9b9a99989796959493929190612235565b60405180910390f35b3480156102d357600080fd5b506102ee60048036038101906102e99190612208565b6114cf565b005b3480156102fc57600080fd5b5061031760048036038101906103129190611dc6565b611a6d565b005b60006040518061016001604052806001600280549050610339919061230f565b81526020018873ffffffffffffffffffffffffffffffffffffffff1681526020014281526020018781526020018673ffffffffffffffffffffffffffffffffffffffff1681526020018573ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018473ffffffffffffffffffffffffffffffffffffffff1681526020016000151581526020016000151581526020016000815250905080600160008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550604082015181600201556060820151816003015560808201518160040160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060a08201518160050160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060c0820151816006015560e08201518160070160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506101008201518160070160146101000a81548160ff0219169083151502179055506101208201518160070160156101000a81548160ff021916908315150217905550610140820151816008015590505060028190806001815401808255809150506001900390600052602060002090600902016000909190919091506000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550604082015181600201556060820151816003015560808201518160040160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060a08201518160050160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060c0820151816006015560e08201518160070160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506101008201518160070160146101000a81548160ff0219169083151502179055506101208201518160070160156101000a81548160ff0219169083151502179055506101408201518160080155505050505050505050565b61077d611bac565b6002828154811061079157610790612343565b5b906000526020600020906009020160405180610160016040529081600082015481526020016001820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160028201548152602001600382015481526020016004820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016005820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600682015481526020016007820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016007820160149054906101000a900460ff161515151581526020016007820160159054906101000a900460ff161515151581526020016008820154815250509050919050565b6002818154811061098257600080fd5b90600052602060002090600902016000915090508060000154908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060020154908060030154908060040160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060060154908060070160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060070160149054906101000a900460ff16908060070160159054906101000a900460ff1690806008015490508b565b606060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610b06576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610afd906123f5565b60405180910390fd5b6002805480602002602001604051908101604052809291908181526020016000905b82821015610d1b578382906000526020600020906009020160405180610160016040529081600082015481526020016001820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160028201548152602001600382015481526020016004820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016005820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600682015481526020016007820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016007820160149054906101000a900460ff161515151581526020016007820160159054906101000a900460ff1615151515815260200160088201548152505081526020019060010190610b28565b50505050905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610db2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610da9906123f5565b60405180910390fd5b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16631249c58b826040518263ffffffff1660e01b81526004016000604051808303818588803b158015610e1c57600080fd5b505af1158015610e30573d6000803e3d6000fd5b505050505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610ec9576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ec0906123f5565b60405180910390fd5b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401610f2491906121ed565b602060405180830381865afa158015610f41573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f65919061242a565b905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60016020528060005260406000206000915090508060000154908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060020154908060030154908060040160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060060154908060070160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060070160149054906101000a900460ff16908060070160159054906101000a900460ff1690806008015490508b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611113576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161110a906123f5565b60405180910390fd5b47905090565b6000806000806000806000806000806000808c9050600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000154600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060020154600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060030154600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060040160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600160008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600160008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060060154600160008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060070160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600160008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060070160149054906101000a900460ff16600160008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060070160159054906101000a900460ff16600160008c73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600801549b509b509b509b509b509b509b509b509b509b509b505091939597999b90929496989a50565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461155d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611554906123f5565b60405180910390fd5b60001515600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060070160149054906101000a900460ff161515146115f3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115ea906124a3565b60405180910390fd5b600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060040160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614611725576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161171c90612535565b60405180910390fd5b600081905060018060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060070160146101000a81548160ff021916908315150217905550600060018060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001546117d49190612555565b90506001600282815481106117ec576117eb612343565b5b906000526020600020906009020160070160146101000a81548160ff021916908315150217905550600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060070160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600601549081150290604051600060405180830381858888f193505050501580156118fe573d6000803e3d6000fd5b5060018060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060070160156101000a81548160ff02191690831515021790555060016002828154811061196f5761196e612343565b5b906000526020600020906009020160070160156101000a81548160ff02191690831515021790555042600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206008018190555042600282815481106119f3576119f2612343565b5b9060005260206000209060090201600801819055508173ffffffffffffffffffffffffffffffffffffffff166312fb4dd46040518163ffffffff1660e01b8152600401600060405180830381600087803b158015611a5057600080fd5b505af1158015611a64573d6000803e3d6000fd5b50505050505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611afb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611af2906123f5565b60405180910390fd5b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663db006a756305f5e10083611b499190612589565b6040518263ffffffff1660e01b8152600401611b6591906121d2565b6020604051808303816000875af1158015611b84573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611ba8919061242a565b5050565b60405180610160016040528060008152602001600073ffffffffffffffffffffffffffffffffffffffff1681526020016000815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001600073ffffffffffffffffffffffffffffffffffffffff16815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001600015158152602001600015158152602001600081525090565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611c9282611c67565b9050919050565b611ca281611c87565b8114611cad57600080fd5b50565b600081359050611cbf81611c99565b92915050565b6000819050919050565b611cd881611cc5565b8114611ce357600080fd5b50565b600081359050611cf581611ccf565b92915050565b6000611d0682611c67565b9050919050565b611d1681611cfb565b8114611d2157600080fd5b50565b600081359050611d3381611d0d565b92915050565b60008060008060008060c08789031215611d5657611d55611c62565b5b6000611d6489828a01611cb0565b9650506020611d7589828a01611ce6565b9550506040611d8689828a01611cb0565b9450506060611d9789828a01611cb0565b9350506080611da889828a01611d24565b92505060a0611db989828a01611ce6565b9150509295509295509295565b600060208284031215611ddc57611ddb611c62565b5b6000611dea84828501611ce6565b91505092915050565b611dfc81611cc5565b82525050565b611e0b81611c87565b82525050565b611e1a81611cfb565b82525050565b60008115159050919050565b611e3581611e20565b82525050565b61016082016000820151611e526000850182611df3565b506020820151611e656020850182611e02565b506040820151611e786040850182611df3565b506060820151611e8b6060850182611df3565b506080820151611e9e6080850182611e02565b5060a0820151611eb160a0850182611e02565b5060c0820151611ec460c0850182611df3565b5060e0820151611ed760e0850182611e11565b50610100820151611eec610100850182611e2c565b50610120820151611f01610120850182611e2c565b50610140820151611f16610140850182611df3565b50505050565b600061016082019050611f326000830184611e3b565b92915050565b611f4181611cc5565b82525050565b611f5081611c87565b82525050565b611f5f81611cfb565b82525050565b611f6e81611e20565b82525050565b600061016082019050611f8a600083018e611f38565b611f97602083018d611f47565b611fa4604083018c611f38565b611fb1606083018b611f38565b611fbe608083018a611f47565b611fcb60a0830189611f47565b611fd860c0830188611f38565b611fe560e0830187611f56565b611ff3610100830186611f65565b612001610120830185611f65565b61200f610140830184611f38565b9c9b505050505050505050505050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b610160820160008201516120626000850182611df3565b5060208201516120756020850182611e02565b5060408201516120886040850182611df3565b50606082015161209b6060850182611df3565b5060808201516120ae6080850182611e02565b5060a08201516120c160a0850182611e02565b5060c08201516120d460c0850182611df3565b5060e08201516120e760e0850182611e11565b506101008201516120fc610100850182611e2c565b50610120820151612111610120850182611e2c565b50610140820151612126610140850182611df3565b50505050565b6000612138838361204b565b6101608301905092915050565b6000602082019050919050565b600061215d8261201f565b612167818561202a565b93506121728361203b565b8060005b838110156121a357815161218a888261212c565b975061219583612145565b925050600181019050612176565b5085935050505092915050565b600060208201905081810360008301526121ca8184612152565b905092915050565b60006020820190506121e76000830184611f38565b92915050565b60006020820190506122026000830184611f47565b92915050565b60006020828403121561221e5761221d611c62565b5b600061222c84828501611cb0565b91505092915050565b60006101608201905061224b600083018e611f38565b612258602083018d611f47565b612265604083018c611f38565b612272606083018b611f38565b61227f608083018a611f47565b61228c60a0830189611f47565b61229960c0830188611f38565b6122a660e0830187611f47565b6122b4610100830186611f65565b6122c2610120830185611f65565b6122d0610140830184611f38565b9c9b505050505050505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061231a82611cc5565b915061232583611cc5565b925082820190508082111561233d5761233c6122e0565b5b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600082825260208201905092915050565b7f546869732066756e6374696f6e206973207265737472696374656420746f207460008201527f6865206f776e6572000000000000000000000000000000000000000000000000602082015250565b60006123df602883612372565b91506123ea82612383565b604082019050919050565b6000602082019050818103600083015261240e816123d2565b9050919050565b60008151905061242481611ccf565b92915050565b6000602082840312156124405761243f611c62565b5b600061244e84828501612415565b91505092915050565b7f436c61696d2068617320616c7265616479206265656e20617070726f76656400600082015250565b600061248d601f83612372565b915061249882612457565b602082019050919050565b600060208201905081810360008301526124bc81612480565b9050919050565b7f436c61696d206d75737420626520666f7220696e737572656420636f6c6c617460008201527f6572616c00000000000000000000000000000000000000000000000000000000602082015250565b600061251f602483612372565b915061252a826124c3565b604082019050919050565b6000602082019050818103600083015261254e81612512565b9050919050565b600061256082611cc5565b915061256b83611cc5565b9250828203905081811115612583576125826122e0565b5b92915050565b600061259482611cc5565b915061259f83611cc5565b92508282026125ad81611cc5565b915082820484148315176125c4576125c36122e0565b5b509291505056fea264697066735822122033742bdb58af559daef15499da07cf04109bb798b2a3b928e4ebdfb2f13cc72864736f6c63430008120033"
    
	try {
		//The Collateral Depository contract is deployed.
        const factory = new ethers.ContractFactory(collateralDepositoryContractAbi, collateralDepositoryContractByteCode, signer)
        const collateralDepositoryContract = await factory.deploy()
        const transactionReceipt = await collateralDepositoryContract.deployTransaction.wait()

        //The contract address for the Collateral Depository is captured and stored for later use.
        collateralDepositoryContractAddress = transactionReceipt.contractAddress
        document.getElementById("collateralDepoConnection-message").textContent = `Collateral Depository Contract Address = ${collateralDepositoryContractAddress}`
    } catch(e) {
		//An error message is displayed if the function fails/reverts.
        document.getElementById("collateralDepoConnection-message").textContent = "Failed"
        console.log(e)
    }

}

//This function deploys the Collateral Policy Factory contract (CollateralPolicyFactory.sol).
async function deployCollateralPolicyFactory(){
    
	/*
      The bytecode for the Collateral Policy Factory Contract was obtained via Remix compiler.
      The bytecode needs to be generated (and pasted into this file) after the Collateral Depository 
	  contract has been deployed. This is because the Collateral Depository contract address 
	  needs to be hard coded into the Collateral Policy Factory contract (since the address of the
	  Collateral Depository will not change).
	*/
    const collateralPolicyFactoryContractByteCode = "608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550611700806100606000396000f3fe6080604052600436106200005c5760003560e01c80633904c5c114620000615780636f9fb98a146200008f5780639862644e14620000bf5780639abb9a2814620001035780639acefa1b1462000123578063f53d0a8e1462000153575b600080fd5b3480156200006e57600080fd5b506200008d60048036038101906200008791906200067d565b62000183565b005b3480156200009c57600080fd5b50620000a762000260565b604051620000b69190620006d5565b60405180910390f35b348015620000cc57600080fd5b50620000eb6004803603810190620000e59190620006f2565b62000268565b604051620000fa919062000735565b60405180910390f35b6200012160048036038101906200011b91906200067d565b6200029b565b005b3480156200013057600080fd5b506200013b6200053f565b6040516200014a919062000735565b60405180910390f35b3480156200016057600080fd5b506200016b620005a6565b6040516200017a919062000735565b60405180910390f35b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161462000214576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200020b90620007d9565b60405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501580156200025b573d6000803e3d6000fd5b505050565b600047905090565b60036020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60018103620002b857668e1bc9bf040000600181905550620002d1565b60028103620002d05766470de4df8200006001819055505b5b600034600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550600154600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156200039e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620003959062000871565b60405180910390fd5b338360008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1684604051620003d090620005ca565b620003df949392919062000893565b604051809103906000f080158015620003fc573d6000803e3d6000fd5b509050600154600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546200045291906200090f565b925050819055506004819080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505050565b6000600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610d80806200094b83390190565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200060a82620005dd565b9050919050565b6200061c81620005fd565b81146200062857600080fd5b50565b6000813590506200063c8162000611565b92915050565b6000819050919050565b620006578162000642565b81146200066357600080fd5b50565b60008135905062000677816200064c565b92915050565b60008060408385031215620006975762000696620005d8565b5b6000620006a7858286016200062b565b9250506020620006ba8582860162000666565b9150509250929050565b620006cf8162000642565b82525050565b6000602082019050620006ec6000830184620006c4565b92915050565b6000602082840312156200070b576200070a620005d8565b5b60006200071b848285016200062b565b91505092915050565b6200072f81620005fd565b82525050565b60006020820190506200074c600083018462000724565b92915050565b600082825260208201905092915050565b7f4f6e6c79207468652061646d696e6973747261746f722063616e20737765657060008201527f2066756e64730000000000000000000000000000000000000000000000000000602082015250565b6000620007c160268362000752565b9150620007ce8262000763565b604082019050919050565b60006020820190508181036000830152620007f481620007b2565b9050919050565b7f496e73756666696369656e742066756e647320746f207075726368617365206160008201527f20706f6c69637900000000000000000000000000000000000000000000000000602082015250565b60006200085960278362000752565b91506200086682620007fb565b604082019050919050565b600060208201905081810360008301526200088c816200084a565b9050919050565b6000608082019050620008aa600083018762000724565b620008b9602083018662000724565b620008c8604083018562000724565b620008d76060830184620006c4565b95945050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006200091c8262000642565b9150620009298362000642565b9250828203905081811115620009445762000943620008e0565b5b9291505056fe608060405273eb1d92088914b95bcb9d41f30aa628b5676ac6ea6000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555030600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503480156200010757600080fd5b5060405162000d8038038062000d8083398181016040528101906200012d9190620002d4565b8060018190555081600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555083600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555042600581905550624f1a00426200020f919062000375565b6006819055506801a055690d9db8000060088190555050505050620003b0565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620002618262000234565b9050919050565b620002738162000254565b81146200027f57600080fd5b50565b600081519050620002938162000268565b92915050565b6000819050919050565b620002ae8162000299565b8114620002ba57600080fd5b50565b600081519050620002ce81620002a3565b92915050565b60008060008060808587031215620002f157620002f06200022f565b5b6000620003018782880162000282565b9450506020620003148782880162000282565b9350506040620003278782880162000282565b92505060606200033a87828801620002bd565b91505092959194509250565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000620003828262000299565b91506200038f8362000299565b9250828201905080821115620003aa57620003a962000346565b5b92915050565b6109c080620003c06000396000f3fe60806040526004361061003f5760003560e01c806312fb4dd414610044578063545ea8141461005b578063bfd1a3a714610084578063cc9ba6fa1461008e575b600080fd5b34801561005057600080fd5b506100596100bf565b005b34801561006757600080fd5b50610082600480360381019061007d919061057c565b610157565b005b61008c610305565b005b34801561009a57600080fd5b506100a3610369565b6040516100b697969594939291906105ed565b60405180910390f35b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461014d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610144906106df565b60405180910390fd5b6000600881905550565b600080610162610400565b9050600081136101a7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161019e90610771565b60405180910390fd5b6008548511156101ec576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101e390610803565b60405180910390fd5b60018054036101fd57849150610223565b600260015403610222576004856102149190610881565b8561021f91906108b2565b91505b5b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16631f19ec63600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168787600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1688886040518763ffffffff1660e01b81526004016102cc969594939291906108f5565b600060405180830381600087803b1580156102e657600080fd5b505af11580156102fa573d6000803e3d6000fd5b505050505050505050565b6000600180540361031f57668e1bc9bf0400009050610335565b6002600154036103345766470de4df82000090505b5b8034101561034257600080fd5b42600581905550624f1a00426103589190610956565b60068190555061036661043c565b50565b6000806000806000806000600154600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600554600654600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600854965096509650965096509650965090919293949596565b600080429050600060065490506000828261041b91906108b2565b9050600081131561043157809350505050610439565b600093505050505b90565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc479081150290604051600060405180830381858888f193505050501580156104a2573d6000803e3d6000fd5b50565b600080fd5b6000819050919050565b6104bd816104aa565b81146104c857600080fd5b50565b6000813590506104da816104b4565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061050b826104e0565b9050919050565b61051b81610500565b811461052657600080fd5b50565b60008135905061053881610512565b92915050565b6000610549826104e0565b9050919050565b6105598161053e565b811461056457600080fd5b50565b60008135905061057681610550565b92915050565b600080600060608486031215610595576105946104a5565b5b60006105a3868287016104cb565b93505060206105b486828701610529565b92505060406105c586828701610567565b9150509250925092565b6105d8816104aa565b82525050565b6105e781610500565b82525050565b600060e082019050610602600083018a6105cf565b61060f60208301896105de565b61061c60408301886105de565b61062960608301876105cf565b61063660808301866105cf565b61064360a08301856105de565b61065060c08301846105cf565b98975050505050505050565b600082825260208201905092915050565b7f4f6e6c792074686520436f6c6c61746572616c204465706f7369746f7279206d60008201527f61792075706461746520636f76657261676520616d6f756e7400000000000000602082015250565b60006106c960398361065c565b91506106d48261066d565b604082019050919050565b600060208201905081810360008301526106f8816106bc565b9050919050565b7f596f757220696e737572616e636520636f6e747261637420686173206578706960008201527f7265640000000000000000000000000000000000000000000000000000000000602082015250565b600061075b60238361065c565b9150610766826106ff565b604082019050919050565b6000602082019050818103600083015261078a8161074e565b9050919050565b7f596f757220636c61696d206d757374206265206c657373207468616e206f722060008201527f657175616c20746f203330204554480000000000000000000000000000000000602082015250565b60006107ed602f8361065c565b91506107f882610791565b604082019050919050565b6000602082019050818103600083015261081c816107e0565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061088c826104aa565b9150610897836104aa565b9250826108a7576108a6610823565b5b828204905092915050565b60006108bd826104aa565b91506108c8836104aa565b92508282039050818111156108e0576108df610852565b5b92915050565b6108ef8161053e565b82525050565b600060c08201905061090a60008301896105de565b61091760208301886105cf565b61092460408301876105de565b61093160608301866105de565b61093e60808301856108e6565b61094b60a08301846105cf565b979650505050505050565b6000610961826104aa565b915061096c836104aa565b925082820190508082111561098457610983610852565b5b9291505056fea26469706673582212202a4977398b9bf86033e528dc9ecc3a8db4b8c9e58d0c1babd8cde7d82ed57b1a64736f6c63430008120033a2646970667358221220d69ece65ea100af5fca0e3731f0d6553edfc10d4a26f8e62ceff1acdce18b4aa64736f6c63430008120033"
	
	try {
		//The Collateral Policy Factory contract is deployed.
        const factory = new ethers.ContractFactory(collateralPolicyFactoryContractAbi, collateralPolicyFactoryContractByteCode, signer)
        const collateralPolicyFactoryContract = await factory.deploy()
        const transactionReceipt = await collateralPolicyFactoryContract.deployTransaction.wait()

        //The contract address for the Collateral Policy Factory is captured and stored for later use.
        collateralPolicyFactoryContractAddress = transactionReceipt.contractAddress
        document.getElementById("collateralPolicyFactoryConnection-message").textContent = `Collateral Policy Factory Contract Address = ${collateralPolicyFactoryContractAddress}`
    } catch(e) {
		//An error message is displayed if the function fails/reverts.
        document.getElementById("collateralPolicyFactoryConnection-message").textContent = "Failed"
        console.log(e)
    }
}

//This function allows the administrator to transfer ("sweep") ETH from the Collateral Policy Factory contract
//to the Collateral Depository contract.
async function sweep() {
	const amountEth = document.getElementById("sweep-amount").value
	const weiValue = ethers.utils.parseUnits(amountEth, "ether")

	try {
		//The "sweepFunds" function in the Collateral Policy Factory contract is called, and
		//the amount of ETH the administrator wishes to transfer is passed in (along with the address
		//of the Collateral Depository).
        const collateralPolicyFactoryContract = new ethers.Contract(collateralPolicyFactoryContractAddress, collateralPolicyFactoryContractAbi, provider)
        const createPolicyTx = await collateralPolicyFactoryContract.connect(signer).sweepFunds(collateralDepositoryContractAddress, weiValue, {from: accountAddress})
        const response = await createPolicyTx.wait()
        console.log(await response)
        document.getElementById("sweep-confirmation-message").textContent = "Funds have been transferred to the Collateral Depository"
    } catch(e){
		//An error message is displayed if the function fails/reverts.
        document.getElementById("sweep-confirmation-message").textContent = "Failed"
        console.log(e)
    }
}


//This function returns the current ETH balance of the Collateral Policy Factory contract.
//The Collateral Policy Factory contract receives ETH each time a customer creates a new Collateral Policy.
async function getFactoryBalance(){

	try{
    	const collateralPolicyFactoryContract = new ethers.Contract(collateralPolicyFactoryContractAddress,  
		collateralPolicyFactoryContractAbi, provider)
        const factoryBalance = await collateralPolicyFactoryContract.getContractBalance()
        document.getElementById("factory-balance-message").textContent = `Collateral Policy Factory Contract Balance = ${factoryBalance / 1e18} ETH`
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
		//The "viewClaimAdmin" function in the Collateral Depository contract is called, and
		//the "claim-Id" number is passed in. 
		const collateralDepositoryContract = new ethers.Contract(collateralDepositoryContractAddress, collateralDepositoryContractAbi, provider)
		const claimDetails = await collateralDepositoryContract.viewClaimAdmin(index, {from: accountAddress})
		
		console.log(claimDetails)


		//The details of the claim are returned in an array, and each variable below accesses the 
		//relevent information in that array.
		const claimId = claimDetails[0]
		const policyId = claimDetails[1]
		const claimDate = claimDetails[2]
		const claimAmount = claimDetails[3]
		const liquidatedContract = claimDetails[4]
		const collateralContract = claimDetails[5]
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
		document.getElementById("liquidated-contract-1").innerHTML = `<span>Address of liquidated contract = </span>${liquidatedContract}`
		document.getElementById("collateral-contract-1").innerHTML = `<span>Address of collateral contract = </span>${collateralContract}`
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


//This function allows the administrator to approve and pay a claim to a customer. 
async function payClaim() {

	try {
		//The "approveClaim" function in the Collateral Depository contract is called, and
		//the address of the policy is passed in.
        const collateralDepositoryContract = new ethers.Contract(collateralDepositoryContractAddress, collateralDepositoryContractAbi, provider)
        const createPolicyTx = await collateralDepositoryContract.connect(signer).approveClaim(collateralPolicyContractAddress, {from: accountAddress})
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



//This function allows the Owner/Administrator to deposit ETH from the Collateral Depository contract into Compound
//Finance's cETH contract (on the Goerli testnet). This allows the company to earn a return on its ETH. 
async function getCETH(){
	try{
		//The amount of ETH to deposit is passed in by the Owner/Administrator. 
		const amountEth = document.getElementById("amount-ETH-for-CETH").value
		const weiValue = ethers.utils.parseUnits(amountEth, "ether")
	
		//ETH is sent to the "mint()" function in the cETH contract on the Goerli Testnet. Doing so causes
		//cETH to be sent back to the Collateral Depository contract. 
		const collateralDepositoryContract = new ethers.Contract(collateralDepositoryContractAddress, collateralDepositoryContractAbi, provider)
		const createPolicyTx = await collateralDepositoryContract.connect(signer).swapETHforCETH(weiValue, {gasLimit: 1000000 })
		const response = await createPolicyTx.wait()
		console.log(await response)
		document.getElementById("ETH-for-CETH-confirmation").textContent = "ETH swapped successfully for cETH"
	} catch(e){
		//An error message is displayed if the function fails/reverts.
        document.getElementById("ETH-for-CETH-confirmation").textContent = "Failed"
        console.log(e)
    }
}

//This function allows the Owner/Administrator to view the current ETH balance in the Collateral Depository contract. 
async function getBalanceOfETH(){
	try {
		const collateralDepositoryContract = new ethers.Contract(collateralDepositoryContractAddress, collateralDepositoryContractAbi, provider)
		const ETHBalance = await collateralDepositoryContract.getDepositoryBalance({from: accountAddress})
		console.log(ETHBalance)
		document.getElementById("ETH-balance-confirmation").textContent = `Current ETH balance = ${ETHBalance / 1e18}`
	} catch(e){
		//An error message is displayed if the function fails/reverts.
        document.getElementById("ETH-balance-confirmation").textContent = "Failed"
        console.log(e)
    }
}

//This function allows the Owner/Administrator to get the current cETH balance in the Collateral Depository. 
async function getBalanceOfCETH(){
	try {
		const collateralDepositoryContract = new ethers.Contract(collateralDepositoryContractAddress, collateralDepositoryContractAbi, provider)
		const cETHBalance = await collateralDepositoryContract.getCETHBalance({from: accountAddress})
		console.log(cETHBalance)
		document.getElementById("CETH-balance-confirmation").textContent = `Current cETH balance = ${cETHBalance}`
	} catch(e){
		//An error message is displayed if the function fails/reverts.
        document.getElementById("CETH-balance-confirmation").textContent = "Failed"
        console.log(e)
    }
}

//This function allows the Owner/Administrator to deposit cETH from the Collateral Depository contract into Compound
//Finance's cETH contract (on the Goerli testnet) to redeem for ETH.  
async function getETH(){
	try{
		//The amount of cETH to redeem for ETH is passed in by the Owner/Administrator. 
		const amountTokens = document.getElementById("amount-CETH-for-ETH").value
		
		//cETH is sent to the "redeem()" function in the cETH contract on the Goerli Testnet. Doing so causes
		//ETH to be sent back to the Collateral Depository contract. 
		const collateralDepositoryContract = new ethers.Contract(collateralDepositoryContractAddress, collateralDepositoryContractAbi, provider)
		const createPolicyTx = await collateralDepositoryContract.connect(signer).redeemCETH(amountTokens, {from: accountAddress})
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
//Collateral Policy Factory contract deploys a new instance of a Collateral Policy contract. 
async function createCollateralPolicy() {

	//Customer inputs the contract address of the collateral they would like to insure, as well as the policy type they 
	//would like to purchase.
    const collateralContractAddress = document.getElementById("newpolicy-collateral-address").value
	const productSelected = document.getElementById("newpolicy-product-type").value

	//Customer inputs the appropriate payment amount (0.02 ETH or 0.04 ETH).
    const amountEth = document.getElementById("newpolicy-eth-deposit-amount").value
    const weiValue = ethers.utils.parseUnits(amountEth, "ether")
   
    try {
		//The "createPolicy" function in the Collateral Policy Factory contract is called.
		//It deploys an instance of the Collateral Policy contract (which is the cutomer's actual insurance policy).
		//Payment is received by the Collateral Policy Factory contract. 
        const collateralFactoryContract = new ethers.Contract(collateralPolicyFactoryContractAddress, collateralPolicyFactoryContractAbi, provider)
        const createPolicyTx = await collateralFactoryContract.connect(signer).createPolicy(collateralContractAddress, productSelected, {from: accountAddress, value: weiValue})
        const response = await createPolicyTx.wait()
        console.log(await response)

        document.getElementById("collateral-policy-created-confirmation").textContent = "New collateral insurance policy has been created"
        
		//The contract address of the new Collateral Policy is obtained and provided to the customer.
		collateralPolicyContractAddress = await collateralFactoryContract.getLatestPolicy({from: accountAddress})
        document.getElementById("collateral-policy-address").textContent = `Collateral insurance policy contract address: ${collateralPolicyContractAddress} `
    } catch(e){
		//An error message is displayed if the function fails/reverts.
        document.getElementById("collateral-policy-created-confirmation").textContent = "Failed"
        console.log(e)
    }
}


//This function allows a customer to view their policy information.
async function getPolicyData(){
	
	collateralPolicyContractAddress = document.getElementById("newpolicy-address").value

	try {
		//The "getPolicyDetails" function in the Collateral Policy contract is called.
		const collateralPolicyContract = new ethers.Contract(collateralPolicyContractAddress, collateralPolicyContractAbi, provider)
		const policyDetails = await collateralPolicyContract.getPolicyDetails()
		console.log(policyDetails)

		//The details of the policy are returned in an array, and each variable below accesses the 
		//relevent information in that array.
		const policyType = policyDetails[0]
		const policyHolder = policyDetails[1]
		const collateralContractAddress = policyDetails[2]
		const purchaseDate = policyDetails[3]
		const expirationDate = policyDetails[4]
		const policyIdNumber = policyDetails[5]
		const maxCoverageAmount = policyDetails[6]
		const timeRemaining = expirationDate - purchaseDate
		
		//The policy information is passed to the user-interface for the customer to view.
		document.getElementById("policy-type").innerHTML = `<span>Policy type = </span>${policyType}`
		document.getElementById("policy-holder").innerHTML = `<span>Policy holder (address) = </span> ${policyHolder}`
		document.getElementById("collateral-contract-address").innerHTML = `<span>Collateral contract address = </span> ${collateralContractAddress}`
		document.getElementById("purchase-date").innerHTML = `<span>Purchase date (block height) = </span>${purchaseDate}`
		document.getElementById("expiration-date").innerHTML = `<span>Expiration date (block height) = </span>${expirationDate}`
		document.getElementById("policy-id-number").innerHTML = `<span>Policy Id # = </span>${policyIdNumber}`
		document.getElementById("max-coverage-amount").innerHTML = `<span>Maximum coverage amount = </span> ${maxCoverageAmount / 1e18 } ETH`
		document.getElementById("has-expired").innerHTML = `<span>Policy has expired:  </span>${timeRemaining > 0 ? "No" : "Yes"}`
	} catch(e){
		//An error message is displayed if the function fails/reverts.
        document.getElementById("policy-type").textContent = "Failed"
        console.log(e)
    }
}


//This function allows a customer to file a claim.
async function fileCollateralInsClaim(){

	//The customer provides the claim amount (i.e., the amount they lost due to liquidation of their collateral).
	const claimAmount = document.getElementById("collateral-claim-amount").value
    const weiValue = ethers.utils.parseUnits(claimAmount, "ether")

	//The customer provides the address of their liquidated collateral, along with the wallet address to which they
	//would like to receive a payout of their claim. 
	const liquidatedCollateralAddress = document.getElementById("liquidated-collateral").value
	const collateralPayoutAddress = document.getElementById("collateral-payout-address").value
    
	try {
		//The "fileClaim" function in the Collateral Policy contract is called. The claim amount, the 
		//liquidated collateral contract address, and the payout wallet address are passed in. 
		const collateralPolicyContract = new ethers.Contract(collateralPolicyContractAddress, collateralPolicyContractAbi, provider)
		const createPolicyTx = await collateralPolicyContract.connect(signer).fileClaim(weiValue, liquidatedCollateralAddress, collateralPayoutAddress)
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

	//The "viewClaimCustomer" function in the Collateral Depository contract is called, and
	//the Collateral Policy contract address is passed in.
	try{
		const collateralDepositoryContract = new ethers.Contract(collateralDepositoryContractAddress, collateralDepositoryContractAbi, provider)
		
		//There is a mapping in the Collateral Depository contract which contains the latest claim
		//filed for each policy address. This is why the Collateral Policy contract address is passed in. 
		const claimDetails = await collateralDepositoryContract.viewClaimCustomer(collateralPolicyContractAddress, {from: accountAddress})

		console.log(claimDetails[0])
		console.log(claimDetails[1])
		console.log(claimDetails[2])
		console.log(claimDetails[3])
		console.log(claimDetails[4])
		console.log(claimDetails[5])
		console.log(claimDetails[6])
		console.log(claimDetails[7])
		console.log(claimDetails[8])
		console.log(claimDetails[9])
		console.log(claimDetails[10])

		
		//The details of the claim are returned in an array, and each variable below accesses the 
		//relevent information in that array. 
		const claimId = claimDetails[0]
		const policyId = claimDetails[1]
		const claimDate = claimDetails[2]
		const claimAmount = claimDetails[3]
		const liquidatedContract = claimDetails[4]
		const collateralContract = claimDetails[5]
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
		document.getElementById("liquidated-contract-2").innerHTML = `<span>Address of liquidated contract = </span>${liquidatedContract}`
		document.getElementById("collateral-contract-2").innerHTML = `<span>Address of collateral contract = </span>${collateralContract}`
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




//This function allows a customer to renew their Collateral Policy insurance (without having to
//create an entirely new contract).
//Funds are automatically transferred to the Collateral Depository contract.
async function renew(){

	//The customer enters the payment amount depending on their policy type (0.02 or 0.04 ETH).
	const amountEth = document.getElementById("renewal-deposit-amount").value
	const weiValue = ethers.utils.parseUnits(amountEth, "ether")

	try {
		//The "renewPolicy" function in the Collateral Policy contract is called. Note that there is a transfer
		//function in that contract which automatically transfers the ETH to the Collateral Depository contract.
		const collateralPolicyContract = new ethers.Contract(collateralPolicyContractAddress, collateralPolicyContractAbi, provider)
		const createPolicyTx = await collateralPolicyContract.connect(signer).renewPolicy({from: accountAddress, value: weiValue})
		const response = await createPolicyTx.wait()
		console.log(await response)
		document.getElementById("collateral-policy-renewed-confirmation").textContent = "Your collateral insurance policy has been renewed"
	} catch(e){
		//An error message is displayed if the function fails/reverts.
        console.log(e)
		document.getElementById("collateral-policy-renewed-confirmation").textContent = "Failed"
    }
}




//The functions below are "getter" functions that pull in addresses needed by the user-interface in various 
//places (to call the correct contracts). 
function getDepositoryAddress1(){
	collateralDepositoryContractAddress = document.getElementById("depository-address-1").value
	document.getElementById("depository-address1-confirmation").textContent = "Address received."
}

function getDepositoryAddress2(){
	collateralDepositoryContractAddress = document.getElementById("depository-address-2").value
	document.getElementById("depository-address2-confirmation").textContent = "Address received."
}


function getDepositoryAddress3(){
	collateralDepositoryContractAddress = document.getElementById("depository-address-3").value
	document.getElementById("depository-address3-confirmation").textContent = "Address received."
}

function getDepositoryAddress4(){
	collateralDepositoryContractAddress = document.getElementById("depository-address-4").value
	document.getElementById("depository-address4-confirmation").textContent = "Address received."
}

function getDepositoryAddress5(){
	collateralDepositoryContractAddress = document.getElementById("depository-address-5").value
	document.getElementById("depository-address5-confirmation").textContent = "Address received."
}



function getCollateralFactoryAddress1(){
	collateralPolicyFactoryContractAddress = document.getElementById("collateral-factory-address-1").value
	document.getElementById("collateralFactory-address1-confirmation").textContent = "Address received."
}


function getCollateralFactoryAddress2(){
	collateralPolicyFactoryContractAddress = document.getElementById("collateral-factory-address-2").value
	document.getElementById("collateralFactory-address2-confirmation").textContent = "Address received."
}


function getCollateralPolicyAddress1(){
	collateralPolicyContractAddress = document.getElementById("policy-address-1").value
    document.getElementById("policy-address1-confirmation").textContent = "Address received."
}


function getCollateralPolicyAddress2(){
	collateralPolicyContractAddress = document.getElementById("policy-address-2").value
    document.getElementById("policy-address2-confirmation").textContent = "Address received."
}

function getCollateralPolicyAddress3(){
	collateralPolicyContractAddress = document.getElementById("policy-address-3").value
    document.getElementById("policy-address3-confirmation").textContent = "Address received."
}