import { utils } from "ethers";
import {
  Box,
  useToast,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Tag, HighlightText, Card } from "../components";
import { useTokenList } from "eth-hooks/dapps/dex";
import { Button } from "antd";
import getRandomColor from "../helpers/randomColor";
import tinyColor from "tinycolor2";

function AddressTag(address) {
  const bgColor = getRandomColor();
  const fontColor = !!tinyColor(bgColor).isLight() ? "black" : "white";
  return (
    <Tag color={bgColor}>
      <span style={{ color: fontColor }}>{address}</span>
    </Tag>
  );
}

export default function ClaimNft({ address, tx, readContracts, writeContracts }) {
  // Get a list of tokens from a tokenlist -> see tokenlists.org!
  const [claimable, setClaimable] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  let campaigns = [];
  let campaignsInfo = [];

  useEffect(async () => {
    campaigns = await readContracts?.DistributionManager?.campaigns();
    campaigns?.forEach(async nftContract => {
      const campaign = await readContracts?.controller?.getCampaign(nftContract);
      campaignsInfo.push(campaign);
    });
  });

  const handleClaim = async i => {
    const nftContract = campaigns[i];
    const isClaimable = await readContracts?.controller?.isClaimable(nftContract, address);
    if (isClaimable) {
      await readContracts.controller.claim(nftContract);
      toast({
        title: "Claimed successfully.",
        description: "We've created a NFT for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      onOpen();
    }
  };

  return (
    <div style={{ margin: "auto", width: "70vw" }}>
      <Card style={{ marginTop: 50, width: "100%" }}>
        {campaignsInfo.map((camp, i) => (
          <>
            <Box>
              <span style={{ marginRight: 8 }}>🚀</span>
              Campaign {i}: <b>{camp?.campaignName}</b>
              <Button style={{ marginLeft: 32 }} onClick={() => handleClaim(i)}>
                Claim NFT 💸
              </Button>
            </Box>
            <Box>{camp?.canMintErc721.map(addr => AddressTag(addr))}</Box>
          </>
        ))}
      </Card>
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>You're not able to claim the NFT!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Please check the requirement of this NFT.</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
