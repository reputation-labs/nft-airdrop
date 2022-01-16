import { MessageOutlined, LikeOutlined, StarOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { DatePicker,List, Avatar, Space} from "antd";
import {
  Button,
  Divider,
  Input,
  Progress,
  Spinner,
  Switch,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Box,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { AddIcon, HamburgerIcon } from "@chakra-ui/icons";

import React, { useState } from "react";
import { Address, Balance, Events, Card } from "../components";

export default function ExampleUI({
    purpose,
    address,
    mainnetProvider,
    localProvider,
    yourLocalBalance,
    price,
    tx,
    readContracts,
    writeContracts,
  }) {
    const [newPurpose, setNewPurpose] = useState("loading...");
    const toast = useToast();
  
    const { isOpen, onOpen, onClose } = useDisclosure();
    const listData = [];
    for (let i = 1; i < 5; i++) {
    listData.push({
        href: 'https://ant.design',
        title: `NFT ${i}`,
        appearance:1,
        fightingPower:6,
        level:6
    });
    }

    const IconText = ({ icon, text }) => (
        <Space>
          {React.createElement(icon)}
          {text}
        </Space>
      );
      

return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 600, margin: "auto", marginTop: 64 }}>
        <h2>My NFTs</h2>
         
        <Divider />
        <List
            itemLayout="vertical"
            size="large"
            dataSource={listData}

    renderItem={item => (
        <List.Item
          key={item.title}
          extra={
            <img
              width={272}
              alt="logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            />
          }
        ><List.Item.Meta
        title={<a href={item.href}>{item.title}</a>}
      />
      Appearance: {item.appearance} 
      <Divider />
      Fight Power: {item.fightingPower}
      <Divider />
      Level: {item.level}
    </List.Item>
  )}
/>
 </div>
    </div>
  );
            }
