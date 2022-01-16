// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../templates/Lootbox.sol";

contract LootboxFactory {
        function create(uint index,
        string memory campaignName,
        string memory tokenURI,
        address[] memory canMintErc721,
        address  controller
    ) external returns(address) {
        Lootbox.Campaign memory campaign;
        campaign.campaignName = campaignName;
        campaign.tokenURI=tokenURI;
        campaign.canMintErc721 = canMintErc721;
    
        Lootbox newCampaign = new Lootbox{salt: keccak256(abi.encode(msg.sender, index))}(
           campaign,controller
        );

        return address(newCampaign);
    }
}


