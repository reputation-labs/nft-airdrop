const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("DistributionManager contract", function () {
  let DistributionManager;
  let owner;
  let alice;
  let bob;

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    const DistributionManagerContract = await ethers.getContractFactory(
      "DistributionManager"
    );

    DistributionManager = await upgrades.deployProxy(
      DistributionManagerContract,
      []
    );
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
    await DistributionManager.launchCampaignCommonNFT();

    const campaigns = await DistributionManager.campaigns();
    const userCampaigns = await DistributionManager.userCampaigns(
      owner.address
    );

    expect(campaigns.length).to.equal(1);
    expect(userCampaigns.length).to.equal(1);
    expect(userCampaigns[0]).to.equal(campaigns[0]);

  });
});
