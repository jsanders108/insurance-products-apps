//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

//Creates an interface with the WalletDepository contract.
interface CollateralDepositoryInterface {
    function processClaim(address _policyId, uint _claimAmount, address _walletHacked, address _insuredWallet, address payable _payoutAddress, uint _payoutAmount) external;  
}

/*
  1. This CollateralPolicy contract is the actual insurance policy after deployment.
  2. This contract is deployed by the CollateralPolicyFactory contract (Factory model). 
  3. The policy covers collateral used for 1 loan in case such collateral is liquidated due to a price drop.
  4. Here's an example of how it works:
     a) Let's say a customer deposits 10 ETH into a DeFi lending protocol and gets a loan for 5 ETH (to do 
        whatever they want with). 
     b) There will be a liquidation price level. In other words, if the value of ETH drops 
        below a certain price level, then the borrower will get liquidated (and lose all their 
        collateral -- in this case 10 ETH).
     c) Insurance can be purchased to protect the borrower such that if they get liquidated, then the
        insurance company will reimburse all (or a percentage of) their collateral.    
  5. Payment for coverage is in ETH. 
  6. There are two types of coverage. Type 1 reimburses 100% of collateral loss up to 30 ETH (max). 
     Type 2 reimburses 75% of collateral loss up to 30 ETH (max). 
  7. The cost of Type 1 is 0.04 ETH; the cost of Type 2 is 0.02 ETH.
  8. Coverage lasts for 60 days. 
  9. There is only one claim and payout allowed per policy (e.g., if covered collateral gets liquidated). 
  */


contract CollateralPolicy {

    //The address of the Collateral Depository contract (which will not change) needs to be hard-coded into this contract. 
    address collateralDepositoryAddress = 0xecaEb35b391aAfEAa1ceb0DA2cA967d682b3bF14;


    //These global variables (except for PolicyType) are set via the constructor when the contract is deployed.
    uint policyType; //Type 1 = 0.04 ETH cost; Type 2 = 0.02 ETH cost
    address administrator;
    address policyHolder;


    //This is the address of the contract holding the collateral used for a loan in the defi application.
    address collateralContract;
    
    uint purchaseDate;
    uint expirationDate; 
    address policyId = address(this); 
    uint maxCoverageAmount; 


    //Creates an instance of the Collateral Depository contract. This will be needed to file claims. 
    CollateralDepositoryInterface collateralDepositoryInstance = CollateralDepositoryInterface(collateralDepositoryAddress); 


    //Three of the constructor variables (_policyHolder, _collateralContract, and _productSelected) are passed in by the 
    //customer (via the UI) when the policy is purchased.
    constructor(address _policyHolder, address _collateralContract, address _administrator, uint _productSelected){
        policyType = _productSelected; //Can be a value of 1 or 2
        administrator = _administrator;
        policyHolder = _policyHolder;
        collateralContract = _collateralContract;
        purchaseDate = block.timestamp;
        expirationDate = block.timestamp + 60 days;
        //Max coverage is set to 30 ETH (for both policy types)
        maxCoverageAmount = 30000000000000000000; 
    }


    //This function allows the customer to view their policy information after it has been created.
    function getPolicyDetails() public view returns (uint, address, address, uint, uint, address, uint){
        return (policyType,
                policyHolder, 
                collateralContract,
                purchaseDate,
                expirationDate,
                policyId,
                maxCoverageAmount);
    }


    //This is an internal function used to check how much time is remaining on the insurance policy.
    function _getTimeRemaining() internal view returns (int){
        uint currentTime = block.timestamp;
        uint expiration = expirationDate;
        int remaining = int(expiration - currentTime);
        if (remaining > 0){
            return remaining;
        } else
            return 0;
    }


    /*
      1. This function allows a customer to file a claim. 
      2. The customer must provide the following: 
            a) The amount they are claiming (e.g., how much was lost due to liquidation).
            b) The address of funds being held by a defi app that were liquidated. Note that the Owner/Administrator will need to verify.
            c) The address to which they want their payout to be sent.
    */
    function fileClaim(uint _amountLiquidated, address _liquidatedContract, address payable _payoutAddress) external {
      
        uint payoutAmount; 

        //These require statements check to make sure that the policy hasn't expired,
        //and that the claim is less than or equal to the maximum allowed (30 ETH).  
        int timeRemaining = _getTimeRemaining();
        require(timeRemaining > 0, "Your insurance contract has expired"); 
        require(_amountLiquidated <= maxCoverageAmount, "Your claim must be less than or equal to 30 ETH");

        //Adjusts the payout amount downwards by 25% if the customer has Policy Type 2
        if(policyType == 1) {
            payoutAmount = _amountLiquidated;
        } else if (policyType == 2){
            payoutAmount = _amountLiquidated - (_amountLiquidated / 4);
        }

        //This statement creates a new instance of a claim struct in the Collateral Depository based on the info provided by the customer. 
        collateralDepositoryInstance.processClaim(policyId, _amountLiquidated, _liquidatedContract, collateralContract, _payoutAddress, payoutAmount);
    }


    /*
      1. This function allows a customer to renew a policy (even after it has expired).
      2. The customer must deposit 0.02 or 0.04 ETH into the contract (depending on their policy type).
      3. After doing so, the expiration date is moved forward by 60 days.
      4. The funds deposited are automatically transferred to the Collateral Depository. 
    */
    function renewPolicy() external payable  {

        uint cost;

        if(policyType == 1){
            cost = 4000000000000000000 / 100;
        } else if (policyType == 2){
            cost = 2000000000000000000 / 100;
        }

        require (msg.value >= cost);
        purchaseDate = block.timestamp;
        expirationDate = block.timestamp + 60 days; 

        //Funds are transferred to the Collateral Depository. 
        _transferFunds();
    }


    //This function sweeps ETH deposited into this contract to the Collateral Depository. 
    function _transferFunds() private  {
        payable(collateralDepositoryAddress).transfer(address(this).balance);
    }


    //This function sets the amount of coverage left in the policy after a payout has taken place to 0 (collateral
    //may be reimbursed only once).
    function updateCoverage() external {
        //Only the Collateral Depository contract can update the coverage amount (after a payout has occured).
        require(msg.sender == collateralDepositoryAddress, "Only the Collateral Depository may update coverage amount" );
        maxCoverageAmount = 0; 
    }
}
