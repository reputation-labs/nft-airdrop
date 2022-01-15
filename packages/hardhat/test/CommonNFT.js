const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("CommonNFT", function () {
  let nftContract;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  describe("CommonNFT", function () {
    it("Should deploy CommonNFT", async function () {
      const _contract = await ethers.getContractFactory("CommonNFT");
      const campaign = {
        campaignName: "Test campaignName",
        tokenURI: "https://www.example.com/tokenURI",
        duration: 7,
        appearance: 1,
        fightingPower: 1,
        level: 3,
        canMint1155: ['0x0000000000000000000000000000000000000123', '0x0000000000000000000000000000000000000001'],
        canMintErc721: ['0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000001']
      }
      nftContract = await _contract.deploy(campaign);
    });

    describe("CommontNFT ", function () {
      it("getCurrentOwner", async function () {
        const owner = await nftContract.getCurrentOwner()
        expect(owner).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
      });
      it("getCampaign", async function () {
        const campaign = await nftContract.getCampaign();
        expect(campaign.level).to.equal(3);
      });

      it("claim", async function () {
        const ret = await nftContract.claim();
        expect(ret).to.equal(true);
      });
    });
  });
});
