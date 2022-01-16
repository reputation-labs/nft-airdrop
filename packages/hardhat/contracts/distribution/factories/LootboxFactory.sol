// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../templates/Lootbox.sol";

contract LootboxFactory {
        function create(uint index,
        string memory campaignName,
        string memory tokenURI,
        uint256 endTime,
        uint8 appearanceMax,
        uint8 fightingPowerMax,
        uint8 levelMax,
        address[] memory canMintErc721,
        address  controller
    ) external returns(address) {
        Lootbox.Campaign memory campaign;
        campaign.campaignName = campaignName;
        campaign.tokenURI=tokenURI;
        campaign.endTime = endTime;
        campaign.canMintErc721 = canMintErc721;
        campaign.appearance=appearanceMax;
        campaign.fightingPower=fightingPowerMax;
        campaign.level=levelMax;
    
        Lootbox newCampaign = new Lootbox{salt: keccak256(abi.encode(msg.sender, index))}(
           campaign,controller
        );

        return address(newCampaign);
    }
}


