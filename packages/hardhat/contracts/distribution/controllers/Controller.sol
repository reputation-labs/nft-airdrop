// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../interfaces/ITemplate.sol";
import "../../interfaces/ICampaign.sol";
import "hardhat/console.sol";

contract Controller {
    function claim(address _nftAddress) external {
        ITemplate(_nftAddress).claim(msg.sender);
    }

    function isClaimable(address _nftAddress, address _user)
        external
        view
        returns (bool)
    {
        return ITemplate(_nftAddress).isClaimable(_user);
    }

    function getCampaign(address _nftAddress)
        external
        view
        returns (ICampaign memory campaign)
    {
        return ITemplate(_nftAddress).getCampaign();
    }
}
