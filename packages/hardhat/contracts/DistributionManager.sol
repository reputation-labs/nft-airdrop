// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./distributionTemplates/CommonNFT.sol";
import "./distributionTemplates/Lootbox.sol";
import "hardhat/console.sol";

contract DistributionManager {
    address[] public campaigns;
    mapping (address => address[]) public userToCampaign;
    mapping (address => address) public campaignToUser;

    uint public commonNFTAmount;
    uint public lootboxAmount;

    function launchCampaignCommonNFT(params) {
        CommonNFT newCampaign = new CommonNFT{salt: keccak256(abi.encode(msg.sender, commonNFTAmount))}(
            // params
        );
        campaigns.push(newCampaign);

    }

    function launchCampaignLootbox(params) {
        Lootbox newCampaign = new Lootbox{salt: keccak256(abi.encode(msg.sender, lootboxAmount))}(
            // params
        );
        campaigns.push(newCampaign);
    }

    function getCampaigns() public view returns (address[]) {
        return campaigns;
    }
}


