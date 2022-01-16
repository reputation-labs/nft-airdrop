// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../templates/CommonNFT.sol";

contract CommonNFTFactory {
    function create(
        uint index,
        string memory campaignName,
        string memory tokenURI,
        uint8 duration,
        uint8 appearance,
        uint8 fightingPower,
        uint8 level,
        address[] memory canMintErc721,
        address controller
    ) external returns(address) {
        CommonNFT.Campaign memory campaign;
        campaign.campaignName = campaignName;
        campaign.tokenURI=tokenURI;
        campaign.duration=duration;
        campaign.appearance=appearance;
        campaign.fightingPower=fightingPower;
        campaign.level=level;
        campaign.canMintErc721 = canMintErc721;


        CommonNFT newCampaign = new CommonNFT{salt: keccak256(abi.encode(msg.sender, index))}(
            campaign,
            controller
        );

        return address(newCampaign);
    }
}


