const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Lootbox TEST...", function () {
  let nftContract;
  let owner;
  let alice;
  let erc271Contract;
  let erc721NFT;
  let lootboxController;
  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before(async function () {
    [owner, alice] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("Controller");
    lootboxController = await Factory.deploy();


  });

  beforeEach(async function () {
    const erc271ContractFactory = await ethers.getContractFactory("TestERC721");
    erc271Contract = await erc271ContractFactory.deploy();
    erc721NFT = await erc271Contract.deployed();
    await erc721NFT.awardItem(owner.address, "IPFS://");

    const contractFactory = await ethers.getContractFactory("Lootbox");
    const campaign = {
      campaignName: "Test campaignName",
      tokenURI: "https://www.example.com/tokenURI",
      endTime: 2222222222,
      appearance: 9,
      fightingPower: 9,
      level: 9,
      // canMint1155: [erc721NFT.address],
      canMintErc721: [erc721NFT.address],
    };

    nftContract = await contractFactory.deploy(campaign, lootboxController.address);
  });

  it("ERC721", async function () {
    const tokenURI = await erc721NFT.tokenURI(1);
    expect(tokenURI).to.equal("IPFS://");

    const addr = await erc721NFT.ownerOf(1);
    expect(addr).to.equal(owner.address);
  });

  it("getCurrentOwner", async function () {
    const nftContractOwner = await nftContract.owner();
    expect(nftContractOwner).to.equal(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    );
  });
  it("getCampaign", async function () {
    const campaign = await nftContract.getCampaign();
    expect(campaign.endTime).to.equal(2222222222);
  });

  it("claim", async function () {
    //await nftContract.claim(owner.address);
    await lootboxController.connect(owner).claim(nftContract.address);

    const ids = await nftContract.getUserCampaignIDs(owner.address);
    expect(ids[0]).to.equal(1);
    expect(ids.length).to.equal(1);

    const balance = await nftContract.balanceOf(owner.address, 1);
    expect(balance).to.equal(1);

    const [appearance, fightingPower, level] = await nftContract.getCampaignMetadata(1);
    console.log("appearance", appearance);
    console.log("fightingPower", fightingPower);
    console.log("level", level);
    expect(level).to.be.above(0);
    expect(level).to.be.below(10);
  });

  it("claim appearance is less than 1", async function () {
    const contractFactory = await ethers.getContractFactory("Lootbox");
    const campaign = {
      campaignName: "Test campaignName",
      tokenURI: "https://www.example.com/tokenURI",
      endTime: 2222222222,
      appearance: 1,
      fightingPower: 9,
      level: 9,
      // canMint1155: [erc721NFT.address],
      canMintErc721: [erc721NFT.address],
    };

    nftContract = await contractFactory.deploy(campaign, lootboxController.address);

    await expect(
      lootboxController.connect(owner).claim(nftContract.address)
    ).to.be.revertedWith("appearance must be greater than 1");
  });
  it("claim canMintErc721 is null", async function () {
    const contractFactory = await ethers.getContractFactory("Lootbox");
    const campaign = {
      campaignName: "Test campaignName",
      tokenURI: "https://www.example.com/tokenURI",
      endTime: 2222222222,
      appearance: 1,
      fightingPower: 9,
      level: 9,
      // canMint1155: [erc721NFT.address],
      canMintErc721: [],
    };

    nftContract = await contractFactory.deploy(campaign, lootboxController.address);

    await lootboxController.connect(owner).claim(nftContract.address);

    const ids = await nftContract.getUserCampaignIDs(owner.address);
    expect(ids[0]).to.equal(1);
    expect(ids.length).to.equal(1);

    const balance = await nftContract.balanceOf(owner.address, 1);
    expect(balance).to.equal(1);

    const [appearance, fightingPower, level] = await nftContract.getCampaignMetadata(1);
    console.log("appearance", appearance);
    console.log("fightingPower", fightingPower);
    console.log("level", level);
    expect(level).to.be.above(0);
    expect(level).to.be.below(10);
  });

  it("alice claim without nft", async function () {
    const ids = await nftContract.getUserCampaignIDs(alice.address);
    expect(ids.length).to.equal(0);

    const balanceERC721 = await erc721NFT.balanceOf(alice.address);
    expect(balanceERC721).to.equal(0);

    expect(await erc721NFT.balanceOf(alice.address)).to.equal(0);

    expect(await nftContract.balanceOf(alice.address, 1)).to.equal(0);

    await expect(
      lootboxController.connect(alice).claim(nftContract.address)
    ).to.be.revertedWith("You cannot claim this token");

    expect(await nftContract.balanceOf(alice.address, 1)).to.equal(0);
  });

  it("alice claim with nft", async function () {
    const ids = await nftContract.getUserCampaignIDs(alice.address);
    expect(ids.length).to.equal(0);

    const balanceERC721 = await erc721NFT.balanceOf(alice.address);
    expect(balanceERC721).to.equal(0);

    await erc721NFT.awardItem(alice.address, "IPFS://");

    expect(await erc721NFT.balanceOf(alice.address)).to.equal(1);

    expect(await nftContract.balanceOf(alice.address, 1)).to.equal(0);

    await lootboxController.connect(alice).claim(nftContract.address);

    expect(await nftContract.balanceOf(alice.address, 1)).to.equal(1);
  });
});
