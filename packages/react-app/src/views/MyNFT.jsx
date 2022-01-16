import { List } from "antd";
import { Divider, Heading, Image } from "@chakra-ui/react";
import { useCampaign } from "./CampaignContext";

import { useState, useEffect } from "react";

function Nft(props) {
  if (!props?.appearance) return null;

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

export default function MyNft({ address, readContracts, localProvider, signerAccount }) {
  const { campaignMap } = useCampaign();
  const [userCampaigns, setUserCampaigns] = useState([]);

  useEffect(() => {
    if (!address || !readContracts?.DistributionManager) {
      return;
    }

    (async () => {
      const campaigns = await readContracts.DistributionManager.userCampaigns(address);
      const userCampaignInfos = campaigns.map(campaignAddress => ({ ...campaignMap[campaignAddress] }));
      console.log(userCampaignInfos);
      setUserCampaigns(userCampaignInfos);
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
          renderItem={item => <Nft key={item} {...item} />}
        />
      </div>
    </div>
  );
}
