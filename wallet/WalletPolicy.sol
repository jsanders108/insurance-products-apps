//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

//Creates an interface with the WalletDepository contract.
interface WalletDepositoryInterface {
    function processClaim(address _policyId, uint _claimAmount, address _walletHacked, address _insuredWallet, address payable _payoutAddress, uint _payoutAmount) external;  
}

/*
  1. This WalletPolicy contract is the actual insurance policy after deployment.
  2. This contract is deployed by the WalletPolicyFactory contract (Factory model). 
  3. The policy covers one wallet in case funds are lost due to a hack. 
  4. The policy does not cover losses due to user error.  
  5. Payment for coverage is in ETH. 
  6. There are two types of coverage. Type 1 covers losses up to 50 ETH. Type 2 covers losses up to 25 ETH. 
  7. The cost of Type 1 is 0.02 ETH; the cost of Type 2 is 0.01 ETH.
  6. Coverage lasts for 30 days. 
  7. Coverage operates like dental insurance, in that a customer may make multiple claims if 
     necessary. For example, let's say Customer_A purchases 50 ETH of coverage and their wallet is
     hacked. The losses incurred are the equivalent of 20 ETH. Customer_A files a successful claim.
     Customer_A now has 30ETH of coverage left for the remainder of the contract duration. 
  */


contract WalletPolicy {

    //The address of the Wallet Depository contract (which will not change) needs to be hard-coded into this contract. 
    address walletDepositoryAddress = 0xB04121Deccf94E180b45375f822dFB139411D3c3;

    //These global variables (except for PolicyType) are set via the constructor when the contract is deployed.
    uint policyType; //Type 1 = 0.02 ETH cost; Type 2 = 0.01 ETH cost
    address administrator;
    address policyHolder;
    address insuredWallet;
    uint purchaseDate;
    uint expirationDate; 
    address policyId = address(this); 
    uint ethCoverageRemaining; 


    //Creates an instance of the Wallet Depository contract. This will be needed to file claims. 
    WalletDepositoryInterface walletDepositoryInstance = WalletDepositoryInterface(walletDepositoryAddress); 


    //Three of the constructor variables (_policyHolder, _insuredWallet, and _productSelected) are passed in by the 
    //customer (via the UI) when the policy is purchased.
    constructor(address _policyHolder, address _insuredWallet, address _administrator, uint _productSelected){
        policyType = _productSelected; //Can be a value of 1 or 2
        administrator = _administrator;
        policyHolder = _policyHolder;
        insuredWallet = _insuredWallet;
        purchaseDate = block.timestamp;
        expirationDate = block.timestamp + 30 days;
        //If customer selected Policy Type 1, coverage = 50 ETH, if Policy Type 2, coverage = 25 ETH.
        ethCoverageRemaining = 50000000000000000000 / _productSelected; 
    }

    //This function allows the customer to view their policy information after it has been created.
    function getPolicyDetails() public view returns (uint, address, address, uint, uint, address, uint){
        return (policyType,
                policyHolder, 
                insuredWallet,
                purchaseDate,
                expirationDate,
                policyId,
                ethCoverageRemaining);
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
            a) The amount they are claiming (e.g., how much was lost due to a hack of the insured wallet).
            b) The address of the wallet which was hacked. Note that the Owner/Administrator will need to verify.
            c) The address to which they want their payout to be sent.
    */
    function fileClaim(uint _claimAmount, address _walletHacked, address payable _payoutAddress) external {
      
        uint payoutAmount; 

        //These require statements check to make sure that the policy hasn't expired,
        //and that enough funds remain in the policy to cover the claim. 
        int timeRemaining = _getTimeRemaining();
        require(timeRemaining > 0, "Your insurance contract has expired"); 
        require(ethCoverageRemaining > 0, "You have used up all your coverage funds");

        /*
          This if-then statment sets the payout amount for the claim to be:
            1. The full amount of the claim if enough funds are in the policy to cover it, or
            2. A portion of the claim. For example, the customer claims 50 ETH but only 40 ETH remains in 
               their coverage plan. In such a scenario, instead of 50 ETH, the customer gets a payout of 40 ETH. 
        */ 
        if(ethCoverageRemaining > _claimAmount ){
            payoutAmount = _claimAmount; 
        } else {
            payoutAmount = ethCoverageRemaining;
        }

        //This statement creates a new instance of a claim struct in the Wallet Depository based on the info provided by the customer. 
        walletDepositoryInstance.processClaim(policyId, _claimAmount, _walletHacked, insuredWallet, _payoutAddress, payoutAmount);
        
    }


    /*
      1. This function allows a customer to renew a policy (even after it has expired).
      2. The customer must deposit 0.01 or 0.02 ETH into the contract (depending on their policy type).
      3. After doing so, the coverage is reset to 50ETH or 25 ETH (depending on policy type) and the expiration date is
         moved forward by 30 days.
      4. The funds deposited are automatically transferred to the Wallet Depository. 
    */
    function renewPolicy() external payable  {

        uint cost;

        if(policyType == 1){
            cost = 2000000000000000000 / 100;
        } else if (policyType == 2){
            cost = 1000000000000000000 / 100;
        }

        require (msg.value >= cost);
        purchaseDate = block.timestamp;
        expirationDate = block.timestamp + 30 days; 
        ethCoverageRemaining = 50000000000000000000 / policyType;

        //Funds are transferred to the Wallet Depository. 
        _transferFunds();

    }


    //This function sweeps ETH deposited into this contract to the Wallet Depository. 
    function _transferFunds() private  {
        payable(walletDepositoryAddress).transfer(address(this).balance);
    }

    //This function updates the amount of coverage left in the policy after a payout has taken place. 
    function updateCoverage(uint _payoutAmount) external {
        //Only the Wallet Depository contract can update the coverage amount (after a payout has occured)
        require(msg.sender == walletDepositoryAddress, "Only the Wallet Depository may update coverage amount" );
        ethCoverageRemaining -= _payoutAmount; 
    }

}