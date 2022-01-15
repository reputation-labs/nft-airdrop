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
        canMint1155: ['0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000001'],
        canMintErc721: ['0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000001']
      }
      nftContract = await _contract.deploy(campaign);
    });

    describe("mintNFT()", function () {
      it("Should mintNFT", async function () {
        const owner = await nftContract.getCurrentOwner()
        //console.log("owner", owner);

        const campaign = await nftContract.getCampaign();
        //console.log("campaign:", campaign.level);
        expect(campaign.level).to.equal(3);

        //const ret = await nftContract.mintNFT();
        //console.log("mint:", ret);
        //expect(await nftContract.getCampaign()).to.equal(campaign);
      });
    });
  });
});
