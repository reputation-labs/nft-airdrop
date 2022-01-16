import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { NftProvider } from "use-nft";
import { getDefaultProvider } from "ethers";

import { defaultTheme } from "./theme";

import "./index.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";

const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

// Implement your own theme https://chakra-ui.com/docs/theming/customize-theme
const theme = extendTheme(defaultTheme, {
  config,
});

// We are using the "ethers" fetcher here.
const ethersConfig = {
  provider: getDefaultProvider("homestead"),
};

ReactDOM.render(
  <ApolloProvider client={client}>
    <ChakraProvider theme={theme}>
      <NftProvider fetcher={["ethers", ethersConfig]}>
        <App subgraphUri={subgraphUri} />
      </NftProvider>
    </ChakraProvider>
  </ApolloProvider>,
  document.getElementById("root"),
);
