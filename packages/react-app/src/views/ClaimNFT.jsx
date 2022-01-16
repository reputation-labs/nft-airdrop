import { utils } from "ethers";
import { Box, Select } from "@chakra-ui/react";
import React, { useState } from "react";
import { Tag, HighlightText, Card } from "../components";
import { useTokenList } from "eth-hooks/dapps/dex";
import { Button } from "antd";
import getRandomColor from "../helpers/randomColor";

export default function ClaimNft({ yourLocalBalance, mainnetProvider, price, address }) {
  // Get a list of tokens from a tokenlist -> see tokenlists.org!
  const [selectedToken, setSelectedToken] = useState("Pick a token!");
  const listOfTokens = useTokenList(
    "https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json",
  );

  const mockData = [
    {
      name: "Uniswap v3 reward program",
      requirement: ["address1", "address2"],
    },
    {
      name: "Compound v2 reward program",
      requirement: ["address3", "address4"],
    },
  ];

  return (
    <div style={{ margin: "auto", width: "70vw" }}>
      <Card style={{ marginTop: 50, width: "100%" }}>
        <Box>
          <span style={{ marginRight: 8 }}>🚀</span>
          Campaign 1: <b>{mockData[0].name}</b>
          <Button style={{ marginLeft: 32 }}>Claim NFT 💸</Button>
        </Box>
        <Box>
          {mockData[0].requirement.map(address => (
            <Tag color={getRandomColor()}>
              <span style={{ color: "white" }}>{address}</span>
            </Tag>
          ))}
        </Box>
        <Box>
          <span style={{ marginRight: 8 }}>🚀</span>
          Campaign 2: <b>{mockData[1].name}</b>
          <Button style={{ marginLeft: 32 }}>Claim NFT 💸</Button>
        </Box>
        <Box>
          {mockData[1].requirement.map(address => (
            <Tag color={getRandomColor()}>
              <span style={{ color: "white" }}>{address}</span>
            </Tag>
          ))}
        </Box>
      </Card>
    </div>
  );
}
