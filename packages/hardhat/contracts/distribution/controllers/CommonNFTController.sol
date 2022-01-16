// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../interfaces/IERC1155Proxy.sol";

contract CommonNFTController {
    function claim(address nftAddress) external returns (bool) {
        IERC1155Proxy(nftAddress).mint(msg.sender, 1, 1, "");
        return true;
    }
}
