// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../ERC1155Proxy.sol";
import "../../interfaces/IERC1155Proxy.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Lootbox is ERC1155Proxy {
    using SafeMathUpgradeable for uint256;

    struct Campaign {
        string campaignName;
        string tokenURI;
        uint256 duration;
        address[] canMintErc721;
        // address[] canMint1155;
    }

    uint256 public currentCampaignId;
    Campaign private data;
    address private owner;
    struct Metadata {
        uint appearance;
        uint fightingPower;
        uint level;
    }

    mapping (uint => Metadata) public idToMetadata;
    mapping(address => uint[]) public userToIds;

    constructor(Campaign memory _data, address _controller) public {
        data = _data;
        currentCampaignId = 1;
        owner = msg.sender;
        initialize(_data.tokenURI);
        setController(_controller);
    }

    function isClaimable(address user) public view returns (bool) {
        for (uint index = 0; index < data.canMintErc721.length; index++) {
            uint balance = ERC721(data.canMintErc721[index]).balanceOf(user);
            if (balance > 0) {
                return true;
            }
        }
        return false;
    }

    function claim(address user) public returns (uint) {
        require(isClaimable(user), "You cannot claim this token");

        uint id = getNextId();

        Metadata memory metadata;
        metadata.appearance = randomRange(1,9);
        metadata.fightingPower = randomRange(1,9);
        metadata.level = randomRange(1,9);

        idToMetadata[id]= metadata;

        ERC1155Proxy.mint(user, id, 1, "");

        userToIds[user].push(id);
        return (id);
    }
    function getUserCampaignIDs(address user) public view returns (uint[] memory) {
        return userToIds[user];
    }
    function getCampaign() external view returns (Campaign memory) {
        return data;
    }
    function getCampaignMetadata(uint id) public view returns (uint256, uint256, uint256) {
        require(idToMetadata[id].appearance != 0, "Metadata not found");

        return (idToMetadata[id].appearance, idToMetadata[id].fightingPower, idToMetadata[id].level);

    }
    function getCurrentOwner() public view returns (address) {
        return owner;
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
