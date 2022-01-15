// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../templates/CommonNFT.sol";

contract CommonNFTFactory {
    function create(uint index) external returns(address) {
        CommonNFT newCampaign = new CommonNFT{salt: keccak256(abi.encode(msg.sender, index))}(
            // params
        );

        return address(newCampaign);
    }
}


