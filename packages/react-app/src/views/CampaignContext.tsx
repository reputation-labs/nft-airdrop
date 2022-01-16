import { BigNumber } from "ethers";
import React, { FC } from "react";

type Campaign = {
  appearance: number;
  campaignName: string;
  canMintErc721: string[];
  endTime: BigNumber;
  fightingPower: number;
  level: number;
  // image url
  tokenURI: string;
};

type CampaignMap = Record<string, Campaign[]>;

type CampaignContextType = {
  campaignMap?: CampaignMap;
  setCampaignMap?: (campaignMap: CampaignMap) => void;
};
const CampaignContext = React.createContext<CampaignContextType>({});

export const useCampaign = () => React.useContext(CampaignContext);

const CampaignProvider: FC = ({ children }) => {
  const [campaignMap, setCampaignMap] = React.useState<CampaignMap>({});
  return <CampaignContext.Provider value={{ campaignMap, setCampaignMap }}>{children}</CampaignContext.Provider>;
};

export default CampaignProvider;
