import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import "@rainbow-me/rainbowkit/styles.css";
import "./index.css";
import App from "./App";
import { themeOptions } from "./MUITheme";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import {
  getDefaultWallets,
  RainbowKitProvider,
  // eslint-disable-next-line
  connectorsForWallets,
  // eslint-disable-next-line
  wallet,
} from "@rainbow-me/rainbowkit";
import { createClient, chain, configureChains, WagmiConfig } from "wagmi";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

// if (!process.env.REACT_APP_RINKEBY_URL || !process.env.REACT_APP_ARBRINKEBY_URL)
//   throw new Error(
//     "Missing environment variables. Make sure to set your .env file."
//   );

const { chains, provider } = configureChains(
  [
    //chain.hardhat,
    chain.rinkeby,
  ],
  [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Voting Ethereum App, with Wagmi,Rainbowkit and Material-UI",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

// const apolloClient = new ApolloClient({
//   cache: new InMemoryCache(),
//   uri: process.env.REACT_APP_GRAPH_URL,
// });

const theme = createTheme(themeOptions);

ReactDOM.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        {/* <ApolloProvider client={apolloClient}> */}
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
        {/* </ApolloProvider> */}
      </RainbowKitProvider>
    </WagmiConfig>
    ,
  </React.StrictMode>,
  document.getElementById("root")
);
