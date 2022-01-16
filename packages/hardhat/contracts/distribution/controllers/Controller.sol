// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../interfaces/ITemplate.sol";

contract Controller {
    function claim(address _nftAddress) external {
        ITemplate(_nftAddress).claim(msg.sender);
    }

    function isClaimable(address _nftAddress, address _user) external returns (bool) {
        return ITemplate(_nftAddress).isClaimable(_user);
    }
}
