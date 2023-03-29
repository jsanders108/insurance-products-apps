// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./WalletPolicy.sol"; 


contract WalletPolicyFactory  {

    
    address public administrator;

    //The address of the Owner/Administrator is set to the address of the deployer of the contract.
    constructor(){
        administrator = msg.sender;
    }

    uint productCost; 

    //This mapping credits a customer after depositing funds to purchase a policy.
    mapping(address => uint) credits;

    //This mapping stores the address of the most recent wallet policy created by a customer.
    mapping(address => address) public latestPolicy;


    //This array keeps a record of all the wallet insurance policies created by the Factory. 
    address[] policies; 

    
    //This function creates a new policy after the customer has sent funds into the Factory.
    //The customer must enter the wallet address they would like to insure, as well as the Policy Type they intend to buy.
    function createPolicy(address _insuredWallet, uint _productSelected) external payable  {
        
        //Sets the cost of the policy based on the PolicyType the customer selected.
        if(_productSelected == 1){
            productCost = 2000000000000000000 / 100; //0.02 ETH
        } else if (_productSelected == 2){
            productCost = 1000000000000000000 / 100; //0.01 ETH
        }

        address newPolicy;

        //The customer's account is credited with the amount of ETH they sent into the Factory.
        credits[msg.sender] = msg.value;
        
        //In order to purchase 30 days of coverage for the selected Policy Type, the customer must have sufficient ETH credits in their account.
        require(credits[msg.sender] >= productCost, "Insufficient funds to purchase a policy");

        
        //Creates a new wallet insurance policy contract (by importing the smart contract "WalletPolicy.sol").
        //The address of the wallet to be insured is passed in as an argument.
        //The variable "newPolicy" captures the address of the newly created insurance policy contract.
        newPolicy = address(new WalletPolicy(msg.sender, _insuredWallet, administrator, _productSelected));
        
        //The cost of the new wallet insurance policy is deducted from the customer's credits.
        credits[msg.sender] -= productCost; 

        //The address of the new wallet insurance policy is pushed into an array.
        policies.push(newPolicy);

        //The address of the new wallet insurance policy is recorded in a mapping (attached to the wallet address 
        //used by the customer to purchase the policy).
        latestPolicy[msg.sender] = newPolicy; 

    } 

    //This function sweeps deposited funds to the Wallet Depository contract.
    //Access to this function is restricted to the Owner/Administrator.
    function sweepFunds(address _walletDepository, uint _amount) external {
        require(msg.sender == administrator, "Only the administrator can sweep funds");
        payable(_walletDepository).transfer(_amount); 
    }

    //This function retreives the latest wallet policy created by a customer.
    function getLatestPolicy() public view returns (address){
        return latestPolicy[msg.sender]; 
    }

    //This function returns the amount of ETH contained in the Wallet Policy Factory contract. 
    function getContractBalance() external view returns (uint) {
        return address(this).balance; 
    }

}