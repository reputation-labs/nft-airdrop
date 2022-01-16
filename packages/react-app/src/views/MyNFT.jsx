import { MessageOutlined, LikeOutlined, StarOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { DatePicker, List, Avatar, Space } from "antd";
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

import React, { useState, useEffect } from "react";
import { Address, Balance, Events, Card } from "../components";
import Moralis from 'moralis';
Moralis.start({
    serverUrl: 'https://payf36ne5o96.usemoralis.com:2053/server',
    appId: 'B5xeTo90fBYukB8z33kawcCwJ5t4HXTRD1DD6GCq'
})

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
    const [moralis, setMoralis] = useState();
    const [nftList ,setNftList] = useState([]);
    const [newPurpose, setNewPurpose] = useState("loading...");
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(async () => {
        if (!moralis) {
            const user = await Moralis.authenticate({ signingMessage: "Log in using Moralis" })
                .then(function (user) {
                    console.log("logged in user:", user);
                    console.log(user.get("ethAddress"));
                })
                .catch(function (error) {
                    console.log(error);
                });
            Moralis.Web3.getNFTs({
                offset: 0,
                limit: 20,
                address: '0x4fc49473f655633427155badc3f47297f9f80369' // 替换成当前钱包的 account
            }).then(res => {
                console.log('getNFTchain.....')
                console.log(res);
                setNftList(res.slice(0, 5))
            });
        }
        return () => {
            
        }
    }, [1])

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
                    dataSource={nftList}

                    renderItem={item => (
                        <List.Item
                            key={item.name}
                            extra={
                                <img
                                    width={272}
                                    alt="logo"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                />
                            }
                        ><List.Item.Meta
                                title={<a href={item.href}>{item.name}</a>}
                            />
      Appearance: {item.name}
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