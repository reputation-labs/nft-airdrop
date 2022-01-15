// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../ERC1155Proxy.sol";
import "../interfaces/IERC1155Proxy.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract CommonNFT is ERC1155Proxy {
    using SafeMathUpgradeable for uint256;

    struct Campaign {
        string campaignName;
        string tokenURI;
        uint256 duration;
        uint8 appearance;
        uint8 fightingPower;
        uint8 level;
        address[] canMintErc721;
        address[] canMint1155;
    }

    uint256 public currentCampaignId;
    Campaign private data;
    address private owner;

    constructor(Campaign memory _data) public {
        require(
            (_data.canMintErc721.length+_data.canMint1155.length)> 0,
            "Must have at least one address to mint to"
        );
        data = _data;
        currentCampaignId = 1;
        owner = msg.sender;
    }

    function getCampaign() public view returns (Campaign memory) {
        require(msg.sender == owner, "Only owner can call this function");
        return data;
    }
    function getCurrentOwner() public view returns (address) {
        return owner;
    }

    function claimNFT(address _to, uint256 _amount) public {
        //TODO: check if _to is not null
    }

    function mintNFT() public returns (bool) {
         ERC721 erc721;
         ERC721Enumerable erc721Enumerable;
         require(msg.sender == owner, "Only owner can call this function");

         uint256 tokens = erc721.balanceOf(msg.sender);
         console.log("tokens", tokens);

        require(tokens > 0, "User don't have any tokens to mint");

        uint8 i;

        for (i = 0; i < tokens; i++) {
            uint256 tokenId = erc721Enumerable.tokenOfOwnerByIndex(msg.sender,i);
            if (msg.sender == erc721.ownerOf(tokenId)) {
                ERC1155Proxy.mint(msg.sender, 1, 1, "");
                return true;
            }
        }

        return false;
    }

    function _setTokenURI(uint256 baseId, string memory uri) private pure {}

    function getNextId() private view returns (uint256 nextId) {
        return currentCampaignId.add(1);
    }
}
