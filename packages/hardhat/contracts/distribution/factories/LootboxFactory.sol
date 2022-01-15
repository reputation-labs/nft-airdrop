// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../templates/Lootbox.sol";

contract LootboxFactory {
    function create(uint index) external returns(address) {
        Lootbox newCampaign = new Lootbox{salt: keccak256(abi.encode(msg.sender, index))}(
            // params
        );

        return address(newCampaign);
    }
}


