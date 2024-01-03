"use client";

import wagmiConfig from "@/lib/wagmi-config";
import type { ReactNode } from "react";
import { WagmiConfig as WagmiProvider } from "wagmi";

interface WagmiProviderProps {
  children: ReactNode;
}

const WagmiConfig = ({ children }: WagmiProviderProps) => {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};

export default WagmiConfig;
