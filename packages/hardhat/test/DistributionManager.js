const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("DistributionManager contract", function () {
  let DistributionManager;
  let owner;
  let erc721NFT;
  let controller;
  before(async function () {
    const ControllerFactory = await ethers.getContractFactory("Controller");
    controller = await ControllerFactory.deploy();
  });

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    const erc271ContractFactory = await ethers.getContractFactory("TestERC721");
    const erc271Contract = await erc271ContractFactory.deploy();
    erc721NFT = await erc271Contract.deployed();
    await erc721NFT.awardItem(owner.address, "IPFS://");

    const DistributionManagerContract = await ethers.getContractFactory(
      "DistributionManager"
    );

    DistributionManager = await upgrades.deployProxy(
      DistributionManagerContract,
      [controller.address]
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
    // await DistributionManager.setController(controller.address);
  });

  it("get initial state", async function () {
    const commonNFTAmount = await DistributionManager.commonNFTAmount();
    const lootboxAmount = await DistributionManager.lootboxAmount();
    const campaigns = await DistributionManager.campaigns();

    expect(commonNFTAmount).to.equal(0);
    expect(lootboxAmount).to.equal(0);
    expect(campaigns.length).to.equal(0);
  });

  it("launchCampaignCommonNFT create a campaign", async function () {
    await DistributionManager.launchCampaignCommonNFT(
      "Common NFT Campaign",
      "ipfs://...",
      7,
      1,
      1,
      4,
      [erc721NFT.address]
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

  it("launchCampaignLootbox create a campaign", async function () {

    await DistributionManager.launchCampaignLootbox(
      "Common NFT Campaign",
      "ipfs://...",
      7,
      ["0x0000000000000000000000000000000000000001"]
    );

    // const campaigns = await DistributionManager.campaigns();
    // const userCampaigns = await DistributionManager.userCampaigns(
    //   owner.address
    // );

    // expect(campaigns.length).to.equal(1);
    // expect(userCampaigns.length).to.equal(1);
    // expect(userCampaigns[0]).to.equal(campaigns[0]);
    // expect(campaigns[0]).not.to.equal("");
    // const campaignContract = await ethers.getContractAt(
    //   "Lootbox",
    //   campaigns[0]
    // );

    // const minterRole = await campaignContract.MINTER_ROLE();
    // expect(minterRole).to.equal(
    //   "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6"
    // );
  });

  it("get campaign info", async function () {
    await DistributionManager.launchCampaignCommonNFT(
      "Common NFT Campaign",
      "ipfs://...",
      7,
      1,
      1,
      4,
      [erc721NFT.address]
    );

    const campaigns = await DistributionManager.campaigns();

    expect(campaigns.length).to.equal(1);

    const nftContract = campaigns[0];
    const isClaimable = await controller.isClaimable(
      nftContract,
      owner.address
    );

    expect(isClaimable).to.equal(true);

    const campaign = await controller.getCampaign(nftContract);

    expect(campaign.campaignName).to.equal("Common NFT Campaign");
    expect(campaign.appearance).to.equal(1);
    expect(campaign.fightingPower).to.equal(1);
    expect(campaign.level).to.equal(4);
    expect(campaign.canMintErc721[0]).to.equal(erc721NFT.address);

    await controller.connect(owner).claim(nftContract);
    const campaignContract = await ethers.getContractAt(
      "CommonNFT",
      nftContract
    );

    const balance = await campaignContract.balanceOf(owner.address, 1);
    expect(balance).to.equal(1);
  });
});
