// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../templates/Lootbox.sol";

contract LootboxFactory {
    function create(uint index) external returns(address) {
        Lootbox.Campaign memory campaign;
        campaign.campaignName = "CommonNFT";
        campaign.tokenURI="ipfs://123";
        campaign.appearance=1;
        campaign.fightingPower=1;
        campaign.level=3;
        campaign.canMintErc721 = new address[](2);
        campaign.canMintErc721[0]=(0x0000000000000000000000000000000000000123);
        campaign.canMintErc721[1]=(0x0000000000000000000000000000000000000001);

        Lootbox newCampaign = new Lootbox{salt: keccak256(abi.encode(msg.sender, index))}(
           campaign
        );

        return address(newCampaign);
    }
}


