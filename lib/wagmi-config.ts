import { configureChains, createConfig } from "wagmi";
import { mainnet, polygon, optimism } from "wagmi/chains";
// import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism],
  [
    // alchemyProvider({ apiKey: "6pfrl3-FCu2_VVrH4O7NNHi476Hnbb8M" }),
    publicProvider(),
  ]
);

const config = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient,
});

export default config;
