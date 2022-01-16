// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../ERC1155Proxy.sol";
import "../../interfaces/IERC1155Proxy.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./CommonNFT.sol";

contract Lootbox is CommonNFT{
    using SafeMathUpgradeable for uint256;

    uint  currentCampaignId;
    struct Metadata {
        uint appearance;
        uint fightingPower;
        uint level;
    }

    mapping (uint => Metadata) public idToMetadata;
    mapping(address => uint[]) public userToIds;

    constructor(Campaign memory _campaign, address _controller) public  CommonNFT(_campaign, _controller){
    }

    function claim(address user) public override returns (bool) {
        require(isClaimable(user), "You cannot claim this token");

        require(campaign.appearance > 1, "appearance must be greater than 1");
        require(campaign.fightingPower > 1, "fightingPower must be greater than 1");
        require(campaign.level > 1, "level must be greater than 1");

        uint id = getNextId();

        Metadata memory metadata;
        metadata.appearance = randomRange(1,campaign.appearance);
        metadata.fightingPower = randomRange(1,campaign.fightingPower);
        metadata.level = randomRange(1,campaign.level);

        idToMetadata[id]= metadata;

        ERC1155Proxy.mint(user, id, 1, "");

        userToIds[user].push(id);
        return true;
    }
    function getUserCampaignIDs(address user) public view returns (uint[] memory) {
        return userToIds[user];
    }
    function getCampaignMetadata(uint id) public view returns (uint256, uint256, uint256) {
        require(idToMetadata[id].appearance != 0, "Metadata not found");

        return (idToMetadata[id].appearance, idToMetadata[id].fightingPower, idToMetadata[id].level);

    }

    function getNextId() private view returns (uint256 nextId) {
        return currentCampaignId.add(1);
    }
    function randomRange(uint256 min, uint256 max) private view returns (uint256 result) {
        require(min < max, "min must be less than max");
        return min + (ramdom() % (max - min));
    }
    function ramdom()
        private
        view
        returns (uint256)
    {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        msg.sender
                    )
                )
            );
    }

}
