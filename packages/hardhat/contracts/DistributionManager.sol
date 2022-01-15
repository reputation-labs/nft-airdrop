// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./distributionTemplates/CommonNFT.sol";
// import "./distributionTemplates/Lootbox.sol";

contract DistributionManager {
    address[] private _campaigns;
    mapping (address => address[]) public userToCampaign;
    mapping (address => address) public campaignToUser;

    uint public commonNFTAmount;
    uint public lootboxAmount;

    function launchCampaignCommonNFT() external {
        commonNFTAmount = commonNFTAmount + 1;

        CommonNFT newCampaign = new CommonNFT{salt: keccak256(abi.encode(msg.sender, commonNFTAmount))}(
            // params
        );
        // CommonNFT(newCampaign).initialize("ipfs://");
        _campaigns.push(address(newCampaign));
        userToCampaign[msg.sender].push(address(newCampaign));
        campaignToUser[address(newCampaign)] = msg.sender;
    }

    // function launchCampaignLootbox() external {
    //     lootboxAmount = lootboxAmount + 1;

    //     Lootbox newCampaign = new Lootbox{salt: keccak256(abi.encode(msg.sender, lootboxAmount))}(
    //         // params
    //     );
    //     _campaigns.push(address(newCampaign));
    //     userToCampaign[msg.sender].push(address(newCampaign));
    //     campaignToUser[address(newCampaign)] = msg.sender;
    // }
    function campaigns() public view returns (address[] memory) {
        return _campaigns;
    }

    function userCampaigns(address user) public view returns (address[] memory) {
        return userToCampaign[user];
    }
}


