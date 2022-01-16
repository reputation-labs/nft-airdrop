import { useNft } from "use-nft";
import { List } from "antd";
import { Divider, Image, Text } from "@chakra-ui/react";

import React, { useState, useEffect } from "react";
import { Contract } from "ethers";

export const ERC1155ABI = [
  // balanceOf
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
    ],
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "balanceOf",
    type: "function",
    payable: false,
    constant: true,
  },
];

// account is optional
function getContract(address, ABI, library, account) {
  return new Contract(address, ABI, getProviderOrSigner(library, account));
}
function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library;
}

function getErc1155TokenContract(library, tokenAddress, signerAccount) {
  return getContract(tokenAddress, ERC1155ABI, library, signerAccount);
}

// useNft() is now ready to be used in your app. Pass
// the NFT contract and token ID to fetch the metadata.
function Nft({ address, tokenId }) {
  const { loading, error, nft } = useNft(address, tokenId);

  // nft.loading is true during load.
  if (loading) return <List.Item>Loading…</List.Item>;

  // nft.error is an Error instance in case of error.
  if (error || !nft) {
    console.dir(error);
    return (
      <List.Item>
        <Text>Error on Nft {error?.message ?? ""}.</Text>
      </List.Item>
    );
  }

  // You can now display the NFT metadata.
  return (
    <List.Item>
      {/* //
  //   extra={
  //     <Image
  //       width={272}
  //       alt="Nft image"
  //       src={item.metadata?.image}
  //       fallbackSrc="https://via.placeholder.com/272"
  //     />
  //   }
  // >
  //   <List.Item.Meta title={<a href={item.href}>{item.name}</a>} />
  //   Appearance: {item.name}
  //   <Divider />
  //   Fight Power: {item.fightingPower}
  //   <Divider />
  //   Level: {item.level} */}

      <h1>{nft.name}</h1>
      <img src={nft.image} alt="" />
      <p>{nft.description}</p>
      <p>Owner: {nft.owner}</p>
      <p>Metadata URL: {nft.metadataUrl}</p>
    </List.Item>
  );
}

export default function MyNft({ address, readContracts, localProvider, signerAccount }) {
  const [userCampaigns, setUserCampaigns] = useState([]);

  useEffect(() => {
    console.log(address, readContracts);
    if (!address || !readContracts?.DistributionManager) {
      return;
    }

    (async () => {
      const campaigns = await readContracts.DistributionManager.userCampaigns(address);
      campaigns.map(async (campaignAddr, i) => {
        const contract = getErc1155TokenContract(localProvider, campaignAddr, signerAccount);
        console.log('contract', contract);
      });
      // setUserCampaigns(campaigns);
    })();
  }, [address, readContracts]);

  return (
    <div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 600, margin: "auto", marginTop: 64 }}>
        <h2>My NFTs</h2>

        <List
          itemLayout="vertical"
          size="large"
          dataSource={userCampaigns}
          renderItem={item => <Nft key={item} address={item} tokenId={1} />}
        />
      </div>
    </div>
  );
}
