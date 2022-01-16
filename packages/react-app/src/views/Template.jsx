import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Image,
  Center,
  Input,
  Button,
  FormHelperText,
  Avatar,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { ScaleFade } from "@chakra-ui/react";
import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
} from "@choc-ui/chakra-autocomplete";
import { useForm } from "react-hook-form";
import { DatePicker } from "antd";
import moment from "moment";

import { Card } from "../components";
import RadioGroup, { RadioCard } from "../components/RadioGroup";
import { getNfts } from "../helpers/getNft";
import { useDebounce } from "../hooks";
import { InfoIcon } from "@chakra-ui/icons";
import PowerStepper from "../components/PowerStepper";

const tokenURIs = [
  "https://bafkreiezcn2hz4lf7iinozrgjko6wy3dfqzdvmhxzjf7mca7a6fm3fhiqu.ipfs.dweb.link/",
  "https://bafkreiarlgt2fwrzli4qi5om37mj2j5rgb5cywwywm7tl3l74thrgtldiu.ipfs.dweb.link/",
  "https://bafkreihrboxpiqs2edhuzvzvoztn5cbmhrbxu5o6pidzafply7trasmm24.ipfs.dweb.link/",
  "https://bafkreieodyj4evndsk7ytjohmkta6egz62bidzwkksjfeielvgswlpc7ly.ipfs.dweb.link/",
];

const kittyImages = [
  "https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/141984.svg",
  "https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/426489.svg",
  "https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/404414.svg",
  "https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1573045.svg",
];

const CatCard = ({ random = true, selectedIndex }) => {
  const [delta, setDelta] = useState(0);
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const refreshImage = time => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      setDelta(prevIndex => (prevIndex + deltaTime * 0.00233) % kittyImages.length);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(refreshImage);
  };

  useLayoutEffect(() => {
    requestRef.current = requestAnimationFrame(refreshImage);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  if (random) {
    return (
      <Card height="12rem" width="12rem" borderRadius="3rem" p={0}>
        <Center pos="relative" width="100%" height="100%">
          <Box pos="absolute">
            {kittyImages.map((_, i) => {
              const isAcitve = Math.floor(delta) === i;
              return (
                <ScaleFade initialScale={0.9} in={isAcitve} key={i}>
                  <Image src={kittyImages[i]} width="100%" height="100%" display={isAcitve ? "block" : "none"} />
                </ScaleFade>
              );
            })}
          </Box>
        </Center>
      </Card>
    );
  }

  return (
    <Card height="12rem" width="12rem" borderRadius="3rem" p={0}>
      <Center pos="relative" width="100%" height="100%">
        <Box pos="absolute">
          <ScaleFade initialScale={0.9} in>
            <Image src={kittyImages[selectedIndex]} width="100%" height="100%" />
          </ScaleFade>
        </Box>
      </Center>
    </Card>
  );
};

export default function Template({ writeContracts }) {
  const options = [
    {
      value: "loot",
      title: "Loot Box",
      description: "This template will generate a random NFT for user",
    },
    {
      value: "standard",
      title: "Standard NFT",
      description: "This template will generate the same NFT for user",
    },
  ];

  const [selectedOption, setSelectedOption] = useState("loot");
  const [selectedKitty, setSelectedKitty] = useState("0");
  const [durationDate, setDurationDate] = useState();
  const [level, setLevel] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [power, setPower] = useState(1);

  const [nftList, setNftList] = useState([]);
  const [isSearchingNfts, setIsSearchingNfts] = useState(false);
  const [searchValue, setSearchValue] = useState();
  const debouncedSearch = useDebounce(searchValue, 233);

  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 3) return;

    (async () => {
      setIsSearchingNfts(true);
      const searchResp = await getNfts({ keyword: debouncedSearch });
      setNftList(searchResp.result);
      setIsSearchingNfts(false);
    })();
  }, [debouncedSearch]);

  const toast = useToast();
  const onSubmit = async values => {
    const method = selectedOption == "loot" ? "launchCampaignLootbox" : "launchCampaignCommonNFT";
    const data = {
      campaignName: values.name,
      tokenURI: tokenURIs[selectedKitty],
      duration: durationDate,
      appearance: selectedKitty,
      fightingPower: power,
      level,
      canMintErc721: addresses ?? [],
    };
    const contractArgs = [
      data.campaignName,
      data.tokenURI,
      data.duration,
      data.appearance,
      data.fightingPower,
      data.level,
      data.canMintErc721,
    ];

    try {
      await writeContracts.DistributionManager[method](...contractArgs);
      toast({
        title: "Create NFT Success!",
        description: "We've created your nft for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (e) {
      console.log(e);

      toast({
        title: "Error on NFT creation.",
        description: "Check log message or contact support",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      return;
    }
  };

  const handleSetDuration = date => {
    const today = moment().startOf("day");
    const daysFromNow = Math.floor(moment.duration(date - today).asDays());
    setDurationDate(daysFromNow);
  };

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  return (
    <Box width="555px" margin="2rem auto" paddingBottom="10rem">
      <VStack spacing="2rem">
        <Heading size="md">Launch a NFT reward program</Heading>
        <Heading size="base">Select your template</Heading>
        {/* Select template */}
        <RadioGroup name="template" defaultValue={selectedOption} onChange={setSelectedOption} spacing="2rem">
          {options.map(({ title, description, value }) => {
            return (
              <RadioCard key={value} height="220px" value={value}>
                {checkbox => (
                  <VStack spacing="0.5rem">
                    <Heading as="h3" size="md" color={checkbox.checked ? "white" : "black"}>
                      {title}
                    </Heading>
                    <Text>{description}</Text>
                  </VStack>
                )}
              </RadioCard>
            );
          })}
        </RadioGroup>

        <VStack as="form" onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <VStack spacing="0.25rem" width="100%">
            {/* Name */}
            <FormControl isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">Campaign Name</FormLabel>
              <Input id="name" placeholder="name" {...register("name", { required: true })} />
              {!!errors.name && <FormErrorMessage>Name is required</FormErrorMessage>}
            </FormControl>
            {/* duration */}
            <FormControl isInvalid={!!errors.duration}>
              <FormLabel htmlFor="duration">Duration</FormLabel>
              <DatePicker
                id="duration"
                placeholder="Date until expired"
                style={{ display: "block" }}
                disabledDate={curr => curr && curr < moment().endOf("day")}
                onChange={handleSetDuration}
              />
            </FormControl>
          </VStack>

          <Heading size="md">Cat</Heading>

          <CatCard random={selectedOption === "loot"} selectedIndex={selectedKitty} />

          <VStack alignItems="flex-start" width="100%">
            {/* Appearance */}
            {selectedOption !== "loot" && (
              <FormControl isInvalid={!!errors.appearance}>
                <FormLabel htmlFor="appearance">Appearance</FormLabel>
                <RadioGroup id="appearance" value={selectedKitty} onChange={setSelectedKitty}>
                  {kittyImages.map((_, i) => (
                    <RadioCard value={String(i)} name={String(i)} key={String(i)}>
                      {i}
                    </RadioCard>
                  ))}
                </RadioGroup>
                {!!errors.appearance && <FormErrorMessage>Appearance is required.</FormErrorMessage>}
              </FormControl>
            )}
            {/* power */}
            <FormControl isInvalid={!!errors.power}>
              <FormLabel htmlFor="power">Fighting Power</FormLabel>
              <PowerStepper defaultValue={power} value={power} onChange={setPower} id="power" />
              {!!errors.power && <FormErrorMessage>Power is required.</FormErrorMessage>}
            </FormControl>
            {/* level */}
            <FormControl isInvalid={!!errors.level}>
              <FormLabel htmlFor="level">Level</FormLabel>
              <NumberInput step={1} defaultValue={level} value={level} onChange={setLevel} id="level">
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper children="+" />
                  <NumberDecrementStepper children="-" />
                </NumberInputStepper>
              </NumberInput>
              {!!errors.level && <FormErrorMessage>Level is required.</FormErrorMessage>}
            </FormControl>
            {/* address */}
            <FormControl isInvalid={!!errors.addresses} textAlign="left">
              <FormLabel display="inline-flex" alignItems="center" htmlFor="addresses">
                <Text>NFT holding requirement</Text> {isSearchingNfts && <Spinner ml="1rem" />}
              </FormLabel>
              <AutoComplete multiple openOnFocus onChange={setAddresses}>
                <AutoCompleteInput
                  variant="filled"
                  placeholder="NFT Addresses like: 0xb39bebc396c0849d1f894efb9037b76640fff9ce"
                  id="addresses"
                  onChange={evt => setSearchValue(evt.target.value)}
                  icon
                >
                  {({ tags }) =>
                    tags.map((tag, tid) => <AutoCompleteTag key={tid} label={tag.label} onRemove={tag.onRemove} />)
                  }
                </AutoCompleteInput>
                <AutoCompleteList>
                  {nftList?.map(nft => (
                    <AutoCompleteItem
                      key={`option-${nft.token_address}-${nft.token_id}`}
                      value={nft.token_address}
                      textTransform="capitalize"
                    >
                      <Avatar size="sm" src={nft.metadata?.image} icon={<InfoIcon width="100%" height="100%" />} />
                      <Text ml="4" isTruncated>
                        {nft.metadata?.name} #{nft.token_id}
                      </Text>
                    </AutoCompleteItem>
                  ))}
                </AutoCompleteList>
              </AutoComplete>
              <FormHelperText>Start searching nft by typing at least 3 characters</FormHelperText>
              {!!debouncedSearch && debouncedSearch.length < 3 && (
                <FormErrorMessage>At least 3 characters</FormErrorMessage>
              )}
            </FormControl>

            <Button mt="1rem" size="lg" isLoading={isSubmitting} type="submit">
              Confirm
            </Button>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  );
}
