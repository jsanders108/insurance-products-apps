// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CollateralPolicy.sol"; 


contract CollateralPolicyFactory  {

    address public administrator;


    //The address of the Owner/Administrator is set to the address of the deployer of the contract.
    constructor(){
        administrator = msg.sender;
    }


    uint productCost; 

    //This mapping credits a customer after depositing funds to purchase a policy.
    mapping(address => uint) credits;


    //This mapping stores the address of the most recent collateral policy created by a customer.
    mapping(address => address) public latestPolicy;


    //This array keeps a record of all the collateral insurance policies created by the Factory. 
    address[] policies; 


    //This function creates a new policy after the customer has sent funds into the Factory.
    //The customer must enter the collateral contract address they would like to insure, as well as the Policy Type they intend to buy.
    function createPolicy(address _collateralContract, uint _productSelected) external payable  {
        
        //Sets the cost of the policy based on the PolicyType the customer selected.
        if(_productSelected == 1){
            productCost = 4000000000000000000 / 100; //0.04 ETH
        } else if (_productSelected == 2){
            productCost = 2000000000000000000 / 100; //0.02 ETH
        }

        address newPolicy;

        //The customer's account is credited with the amount of ETH they sent into the Factory.
        credits[msg.sender] = msg.value;
        
        //In order to purchase 60 days of coverage for the selected Policy Type, the customer must have sufficient ETH credits in their account.
        require(credits[msg.sender] >= productCost, "Insufficient funds to purchase a policy");

        //Creates a new collateral insurance policy contract (by importing the contract "CollateralPolicy.sol") 
        //The address of the collateral to be insured is passed in as an argument.
        //The variable "newPolicy" captures the address of the newly created insurance policy contract.
        newPolicy = address(new CollateralPolicy(msg.sender, _collateralContract, administrator, _productSelected));
        
        //The cost of the new collateral insurance policy is deducted from the customer's credits.
        credits[msg.sender] -= productCost; 

        //The address of the new collateral insurance policy is pushed into an array.
        policies.push(newPolicy);

        //The address of the new collateral insurance policy is recorded in a mapping (attached to the wallet address 
        //used by the customer to purchase the policy).
        latestPolicy[msg.sender] = newPolicy; 
    } 


    //This function sweeps deposited funds to the Collateral Depository contract.
    //Access to this function is restricted to the Owner/Administrator.
    function sweepFunds(address _collateralDepository, uint _amount) external {
        require(msg.sender == administrator, "Only the administrator can sweep funds");
        payable(_collateralDepository).transfer(_amount); 
    }


    //This function retreives the latest collateral policy created by a customer.
    function getLatestPolicy() public view returns (address){
        return latestPolicy[msg.sender]; 
    }


    //This function returns the amount of ETH contained in the Collateral Policy Factory contract. 
    function getContractBalance() external view returns (uint) {
        return address(this).balance; 
    }
}