// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./interfaces/IDistributionFactory.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract DistributionManager is Initializable {
    address[] internal _campaigns;
    mapping (address => address[]) public userToCampaign;
    mapping (address => address) public campaignToUser;

    uint public commonNFTAmount;
    uint public lootboxAmount;

    IDistributionFactory public commonNFTFactory;
    IDistributionFactory public lootboxFactory;

    address public controller;

    function initialize(
        address _controller
    ) public virtual initializer {
        controller = _controller;
    }

    function launchCampaignCommonNFT(
        string memory campaignName,
        string memory tokenURI,
        uint256 duration,   // days
        uint8 appearance,
        uint8 fightingPower,
        uint8 level,
        address[] memory canMintErc721
    ) external {
        require(address(commonNFTFactory) != address(0), "CommonNFTFactory is not set");
        require(address(controller) != address(0), "Controller is not set");

        commonNFTAmount = commonNFTAmount + 1;

        address newCampaign = commonNFTFactory.create(
            commonNFTAmount,
            campaignName,
            tokenURI,
            block.timestamp + duration * 24 * 3600,
            appearance,
            fightingPower,
            level,
            canMintErc721,
            controller
        );

        _campaigns.push(address(newCampaign));

        userToCampaign[msg.sender].push(address(newCampaign));
        campaignToUser[address(newCampaign)] = msg.sender;
    }

    function launchCampaignLootbox(
        string memory campaignName,
        string memory tokenURI,
        uint256 duration,   // days
        uint8 appearanceMax,//1-Max,Max > 0
        uint8 fightingPowerMax,//1-Max,Max > 0
        uint8 levelMax,//1-Max,Max > 0
        address[] memory canMintErc721
    ) external {
        require(address(lootboxFactory) != address(0), "LootboxFactory is not set");
        require(address(controller) != address(0), "Controller is not set");

        lootboxAmount = lootboxAmount + 1;

        address newCampaign = lootboxFactory.create(
            lootboxAmount,
            campaignName,
            tokenURI,
            block.timestamp + duration * 24 * 3600,
            appearanceMax,
            fightingPowerMax,
            levelMax,
            canMintErc721,
            controller
        );

        _campaigns.push(address(newCampaign));

        userToCampaign[msg.sender].push(address(newCampaign));
        campaignToUser[address(newCampaign)] = msg.sender;
    }

    function setCommonNFTFactory(IDistributionFactory _commonNFTFactory) external {
        require(address(_commonNFTFactory) != address(0), "CommonNFTFactory should not be 0 address");

        commonNFTFactory = _commonNFTFactory;
    }

    function setLootboxFactory(IDistributionFactory _lootboxFactory) external {
        require(address(_lootboxFactory) != address(0), "LootboxFactory should not be 0 address");

        lootboxFactory = _lootboxFactory;
    }

    function campaigns() public view returns (address[] memory) {
        return _campaigns;
    }

    function userCampaigns(address user) public view returns (address[] memory) {
        return userToCampaign[user];
    }
}


