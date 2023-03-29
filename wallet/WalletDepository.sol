//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

//Creates an interface with the WalletPolicy contract.
interface WalletPolicyInterface {
    function updateCoverage(uint _payoutAmount) external;  
}


//Creates an interface with Compound Finance's cETH contract. The purpose will be
//to allow the Owner/Administartor to swap ETH for cETH (and vice-versa) to earn a return on 
//customer deposits.
interface CompoundFinanceCETHInterface {
    function mint() external payable;
    function redeem(uint redeemTokens) external returns (uint); 
    function balanceOf(address owner) external view returns (uint); 
}



//The WalletDepository contract holds all the funds for the customers who purchased an insurance policy
//for their wallets. If a customer files a succesful claim, the payout will come from this contract.
contract WalletDepository  {

    
    address public owner;

    //Sets the owner of the WalletDepository contract to be the address which deployed it.
    constructor(){
        owner = msg.sender; 
    }

    //Modifier which restricts the ability to call certain functions to the Owner/Administrator. 
    modifier onlyOwner(){
        require(msg.sender == owner, "This function is restricted to the owner");
        _;
    }

    //This struct is used when a customer files a claim.
    struct Claim {
        uint claimId;
        address policyId; 
        uint claimDate;
        uint claimAmount;
        address walletHacked;
        address insuredWallet;
        uint payoutAmount;
        address payable payoutAddress;
        bool isApproved;
        bool hasBeenPaid; 
        uint payoutDate;
    }

    //In this mapping, claims can be looked up using the the contract address for the policy.
    mapping(address => Claim) public claimsRegistry;

    //Creates an array containing a history of all claims filed for all policies.
    Claim[] public claimsArray; 


    //This function is called by the customer (from the WalletPolicy contract via an interface) when they want to file
    //a claim. The claim info entered by the customer is used to create a claim struct in this WalletDepository contract. 
    function processClaim(address _policyId, uint _claimAmount, address _walletHacked, address _insuredWallet, address payable _payoutAddress, uint _payoutAmount) external {
         
         //This creates a new instance of a claim struct.
         Claim memory newClaim = Claim(claimsArray.length +1, _policyId, block.timestamp, _claimAmount, _walletHacked, _insuredWallet, _payoutAmount, _payoutAddress, false, false, 0);
         
         //The new claim struct is entered into the claims array as well as a claims registry mapping.
         claimsRegistry[_policyId] = newClaim; 
         claimsArray.push(newClaim);
    }


    //This function is called by the Owner/Administrator when they want to approve and pay a claim filed by a customer.
    //To approve the claim, the Owner/Administrator must enter the contract address of the policy.
    //For security reasons, only the Owner/Administrator may approve claims.
    function approveClaim(address _policyId) external onlyOwner {

        //This require statement ensures that the claim has not already been approved. 
        require(claimsRegistry[_policyId].isApproved == false, "Claim has already been approved");

        //This require statement ensures that the claim is being filed for the wallet that was insured. 
        require(claimsRegistry[_policyId].walletHacked == claimsRegistry[_policyId].insuredWallet, "Claim must be for an insured wallet");
        
        //Creates an instance of the specific insurance policy for which the claim is being filed.
        //This will be necessary to update the amount of coverage left in the policy after the payout has been completed.
        WalletPolicyInterface walletPolicyInstance = WalletPolicyInterface(_policyId); 

        //Sets the status of the claim to "approved" in both the claims registry (mapping) and the claims array.
        claimsRegistry[_policyId].isApproved = true;
        uint claimNum = claimsRegistry[_policyId].claimId -1;
        claimsArray[claimNum].isApproved = true;
    
        //Pays out the approved claim to the customer. 
        payable(claimsRegistry[_policyId].payoutAddress).transfer(claimsRegistry[_policyId].payoutAmount); 
        
         
        //Documents that the claim was indeed paid out and records the timestamp of the payout. 
        claimsRegistry[_policyId].hasBeenPaid = true; 
        claimsArray[claimNum].hasBeenPaid = true;
        claimsRegistry[_policyId].payoutDate = block.timestamp; 
        claimsArray[claimNum].payoutDate = block.timestamp;


        //Calls the "updateCoverage" function in the customer's WalletPolicy contract and updates the coverage left after payout.
        walletPolicyInstance.updateCoverage(claimsRegistry[_policyId].payoutAmount);

    }

    //This function allows the Owner/Administrator to view all the claims filed under this policy.
    //Only the Owner/Administrator is allowed to view all the claims.  
    function viewAllClaims() external view onlyOwner returns(Claim[] memory){
        return claimsArray;
    }


    //This function allows the Owner/Administrator to view a specific claim filed under this policy.
    function viewClaimAdmin(uint _index) external view returns (Claim memory){
        return (claimsArray[_index]); 
    }


    //This function allows the customer to view the claim filed under their policy.
    function viewClaimCustomer(address _policyId) external view returns (uint, address, uint, uint, address, address, uint, address, bool, bool, uint){
        address custPolicy = _policyId;
        return (
            claimsRegistry[custPolicy].claimId,
            claimsRegistry[custPolicy].policyId,
            claimsRegistry[custPolicy].claimDate,
            claimsRegistry[custPolicy].claimAmount,
            claimsRegistry[custPolicy].walletHacked,
            claimsRegistry[custPolicy].insuredWallet,
            claimsRegistry[custPolicy].payoutAmount,
            claimsRegistry[custPolicy].payoutAddress,
            claimsRegistry[custPolicy].isApproved,
            claimsRegistry[custPolicy].hasBeenPaid,
            claimsRegistry[custPolicy].payoutDate
        ); 
    }


    //This function allows the Owner/Administrator to see how much total ETH has been deposited into the WalletDepository contract.
    //Only the Owner/Administrator is allowed to see the depository's total balance. 
    function getDepositoryBalance() external view onlyOwner returns (uint){
        return address(this).balance;
    }

    //Allows the WalletDepository contract to receive ETH from the WalletPolicyFactory.
    receive() external payable { }


    //The contract address for cETH (Compound Finance) on the Goerli testnet
    //is hard coded into this contract and an instance of it is created.
    address CETHcontractAddress = 0x20572e4c090f15667cF7378e16FaD2eA0e2f3EfF;
    CompoundFinanceCETHInterface cETHInstance = CompoundFinanceCETHInterface(CETHcontractAddress);


    /*
      1. This function allows the Owner/Administrator to deposit ETH from the Wallet 
          Depository into the cETH contract (Compound Finance) on the Goerli testnet.
      2. To do so, the "mint()" function is called. This automatically sends
         cETH back to the Wallet Depository.
    */ 
    function swapETHforCETH(uint _amount) external onlyOwner {
        cETHInstance.mint{value: _amount}();
    }

    //This function allows the Owner/Administrator to view cETH balance in the
    //Wallet Depository contract. 
    function getCETHBalance() external view onlyOwner returns (uint){
        return cETHInstance.balanceOf(address(this)); 
    }


    /*
      1. This function allows the Owner/Administrator to deposit cETH from the Wallet 
          Depository into the cETH contract (Compound Finance) on the Goerli testnet.
      2. To do so, the "redeem()" function is called. This automatically sends
         ETH back to the Wallet Depository.
    */ 
    function redeemCETH(uint _amount) external onlyOwner {
        cETHInstance.redeem(_amount * 1e8);
    }

}

