// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../interfaces/ITemplate.sol";

contract LootboxController {
    function claim(address nftAddress) external returns (bool) {
        ITemplate(nftAddress).claim(msg.sender);
        return true;
    }
}
