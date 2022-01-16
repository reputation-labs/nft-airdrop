import { BigNumber } from "ethers";
import React, { FC, useEffect } from "react";

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

const CampaignProvider: FC<{ contracts: any }> = ({ children, contracts }) => {
  const [campaignMap, setCampaignMap] = React.useState<CampaignMap>({});

  useEffect(() => {
    if (!contracts?.DistributionManager || !contracts?.Controller) return;

    (async () => {
      const campaigns: string[] = await contracts?.DistributionManager?.campaigns();
      const infos: Campaign[] = await Promise.all(
        campaigns?.map((nftContract: any) => {
          return contracts?.Controller?.getCampaign(nftContract);
        }),
      );

      // @ts-ignore
      const campMap: CampaignMap = Object.values(campaigns).reduce((acc: CampaignMap, campaignAddr: string, index) => {
        return {
          ...acc,
          [campaignAddr]: infos[index],
        };
      }, {});
      setCampaignMap(campMap);
    })();
  }, [contracts]);

  return <CampaignContext.Provider value={{ campaignMap, setCampaignMap }}>{children}</CampaignContext.Provider>;
};

export default CampaignProvider;
