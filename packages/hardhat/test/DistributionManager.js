const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("DistributionManager contract", function () {
  let DistributionManager;
  let owner;

  let commonNFTController;
  before(async function () {
    const CommonNFTControllerFactory = await ethers.getContractFactory(
      "CommonNFTController"
    );
    commonNFTController = await CommonNFTControllerFactory.deploy();
  });

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const DistributionManagerContract = await ethers.getContractFactory(
      "DistributionManager"
    );

    DistributionManager = await upgrades.deployProxy(
      DistributionManagerContract,
      []
    );

    const CommonNFTFactoryContract = await ethers.getContractFactory(
      "CommonNFTFactory"
    );

    const CommonNFTFactory = await upgrades.deployProxy(
      CommonNFTFactoryContract,
      []
    );

    const LootboxFactoryContract = await ethers.getContractFactory(
      "LootboxFactory"
    );

    const LootboxFactory = await upgrades.deployProxy(
      LootboxFactoryContract,
      []
    );

    await DistributionManager.setCommonNFTFactory(CommonNFTFactory.address);
    await DistributionManager.setLootboxFactory(LootboxFactory.address);
  });

  it("get initial state", async function () {
    const commonNFTAmount = await DistributionManager.commonNFTAmount();
    const lootboxAmount = await DistributionManager.lootboxAmount();
    const campaigns = await DistributionManager.campaigns();

    expect(commonNFTAmount).to.equal(0);
    expect(lootboxAmount).to.equal(0);
    expect(campaigns.length).to.equal(0);
  });

  it("create a campaign", async function () {
    await DistributionManager.launchCampaignCommonNFT(
      "Common NFT Campaign",

      "ipfs://...",
      7,
      1,
      1,
      4,
      ["0x0000000000000000000000000000000000000001"],
      commonNFTController.address
    );

    const campaigns = await DistributionManager.campaigns();
    const userCampaigns = await DistributionManager.userCampaigns(
      owner.address
    );

    expect(campaigns.length).to.equal(1);
    expect(userCampaigns.length).to.equal(1);
    expect(userCampaigns[0]).to.equal(campaigns[0]);
    expect(campaigns[0]).not.to.equal("");
    const campaignContract = await ethers.getContractAt(
      "CommonNFT",
      campaigns[0]
    );

    const minterRole = await campaignContract.MINTER_ROLE();
    expect(minterRole).to.equal(
      "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6"
    );
  });
});
