const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("CommonNFT TEST...", function () {
  let nftContract;
  let owner;
  let alice;
  let erc271Contract;
  let erc721NFT;
  let controller;
  before(async function () {
    const ControllerFactory = await ethers.getContractFactory("Controller");
    controller = await ControllerFactory.deploy();
  });

  beforeEach(async function () {
    [owner, alice] = await ethers.getSigners();

    const erc271ContractFactory = await ethers.getContractFactory("TestERC721");
    erc271Contract = await erc271ContractFactory.deploy();
    erc721NFT = await erc271Contract.deployed();
    await erc721NFT.awardItem(owner.address, "IPFS://");

    const contractFactory = await ethers.getContractFactory("CommonNFT");
    const campaign = {
      campaignName: "Test campaignName",
      tokenURI: "https://www.example.com/tokenURI",
      endTime: 2222222222,
      appearance: 1,
      fightingPower: 1,
      level: 3,
      // canMint1155: [erc721NFT.address],
      canMintErc721: [erc721NFT.address],
    };

    nftContract = await contractFactory.deploy(campaign, controller.address);
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
    expect(campaign.level).to.equal(3);
  });

  it("claim", async function () {
    // await nftContract.claim();
    await controller.connect(owner).claim(nftContract.address);
    const balance = await nftContract.balanceOf(owner.address, 1);
    expect(balance).to.equal(1);
  });

  it("alice claim without nft", async function () {
    const balanceERC721 = await erc721NFT.balanceOf(alice.address);
    expect(balanceERC721).to.equal(0);

    // await erc721NFT.awardItem(alice.address, "IPFS://");

    expect(await erc721NFT.balanceOf(alice.address)).to.equal(0);

    expect(await nftContract.balanceOf(alice.address, 1)).to.equal(0);

    await expect(
      controller.connect(alice).claim(nftContract.address)
    ).to.be.revertedWith("You cannot claim this token");

    expect(await nftContract.balanceOf(alice.address, 1)).to.equal(0);
  });

  it("alice claim with nft", async function () {
    const balanceERC721 = await erc721NFT.balanceOf(alice.address);
    expect(balanceERC721).to.equal(0);

    await erc721NFT.awardItem(alice.address, "IPFS://");

    expect(await erc721NFT.balanceOf(alice.address)).to.equal(1);

    expect(await nftContract.balanceOf(alice.address, 1)).to.equal(0);

    await controller.connect(alice).claim(nftContract.address);

    expect(await nftContract.balanceOf(alice.address, 1)).to.equal(1);
  });
});
