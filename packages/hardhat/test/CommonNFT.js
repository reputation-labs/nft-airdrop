const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("CommonNFT", function () {
  let nftContract;
  let owner;
  let alice;
  let bob;
  let erc271Contract;
  let erc721NFT;
  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();

    const _erc271Contract = await ethers.getContractFactory("TestERC721");
    erc271Contract = await _erc271Contract.deploy();
    erc721NFT = await erc271Contract.deployed();
    await erc721NFT.awardItem(owner.address, 'IPFS://');

    const _contract = await ethers.getContractFactory("CommonNFT");
    const campaign = {
      campaignName: "Test campaignName",
      tokenURI: "https://www.example.com/tokenURI",
      duration: 7,
      appearance: 1,
      fightingPower: 1,
      level: 3,
      canMint1155: [erc721NFT.address],
      canMintErc721: [erc721NFT.address]
    }
    nftContract = await _contract.deploy(campaign);
  });


  it("ERC271", async function () {
    const tokenURI = await erc721NFT.tokenURI(1);
    expect(tokenURI).to.equal('IPFS://')

    const addr = await erc721NFT.ownerOf(1);
    expect(addr).to.equal(owner.address)
  });


  it("getCurrentOwner", async function () {
    const owner = await nftContract.getCurrentOwner()
    expect(owner).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
  });
  it("getCampaign", async function () {
    const campaign = await nftContract.getCampaign();
    expect(campaign.level).to.equal(3);
  });

  it("claim", async function () {
    await nftContract.claim();
    const balance = await nftContract.balanceOf(owner.address, 1);
    expect(balance).to.equal(1);
  });

});
