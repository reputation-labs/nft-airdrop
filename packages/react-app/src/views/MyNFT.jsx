import { List } from "antd";
import { Divider, Heading, Image } from "@chakra-ui/react";

import { useCampaign } from "./CampaignContext";

// useNft() is now ready to be used in your app. Pass
// the NFT contract and token ID to fetch the metadata.
function Nft(props) {
  console.log(props);
  // nft.loading is true during load.
  if (!props?.appearance) return null;

  // You can now display the NFT metadata.

  // appearance: number;
  // campaignName: string;
  // canMintErc721: string[];
  // endTime: BigNumber;
  // fightingPower: number;
  // level: number;
  // // image url
  // tokenURI: string;
  return (
    <List.Item
      extra={<Image width={272} alt="Nft image" src={props?.tokenURI} fallbackSrc="https://via.placeholder.com/272" />}
    >
      <List.Item.Meta title={<Heading>{props.campaignName}</Heading>} />
      Level: {props.level}
      <Divider />
      Fight Power: {props.fightingPower}
      <Divider />
      Appearance: {props.appearance}
    </List.Item>
  );
}

export default function MyNft() {
  const campaignContext = useCampaign();

  const { campaignMap } = campaignContext;

  return (
    <div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 600, margin: "auto", marginTop: 64 }}>
        <h2>My NFTs</h2>

        <List
          itemLayout="vertical"
          size="large"
          dataSource={Object.values(campaignMap)}
          renderItem={item => <Nft key={item} {...item} />}
        />
      </div>
    </div>
  );
}
