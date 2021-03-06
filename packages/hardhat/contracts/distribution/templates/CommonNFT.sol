// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../ERC1155Proxy.sol";
import "../../interfaces/IERC1155Proxy.sol";
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
        uint256 endTime;
        uint8 appearance;
        uint8 fightingPower;
        uint8 level;
        address[] canMintErc721;
        // address[] canMint1155;
    }

    Campaign internal campaign;
    address public owner;

    constructor(Campaign memory _campaign, address _controller) public {
        campaign = _campaign;
        owner = msg.sender;
        initialize(_campaign.tokenURI);
        setController(_controller);
    }

    function getCampaign() external view returns (Campaign memory) {
        return campaign;
    }

    function isClaimable(address user) public virtual view returns (bool) {
        if (block.timestamp > campaign.endTime) {
            return false;
        }

        if (campaign.canMintErc721.length == 0) {
            return true;
        }

        for (uint index = 0; index < campaign.canMintErc721.length; index++) {
            uint balance = ERC721(campaign.canMintErc721[index]).balanceOf(user);
            if (balance > 0) {
                return true;
            }
        }
        return false;
    }

    function claim(address user) public virtual returns (bool) {
        require(isClaimable(user), "You cannot claim this token");

        ERC1155Proxy.mint(user, 1, 1, "");
        return true;
    }
}
