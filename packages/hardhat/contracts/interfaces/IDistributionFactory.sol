// SPDX-License-Identifier: GPL-3.0-only
pragma solidity 0.8.4;

/// @title IDistributionFactory
/// @notice A contract used by the Controller to perform ERC1155 functions (inherited
/// from the OpenZeppelin ERC1155PresetMinterPauserUpgradeable contract)
/// @dev All ERC1155 tokens minted by this contract are stored on SeriesVault
/// @dev This contract exists solely to decrease the size of the deployed SeriesController
/// bytecode so it can be lower than the Spurious Dragon bytecode size limit
interface IDistributionFactory {
    function create(uint256 index) external returns (address);
}