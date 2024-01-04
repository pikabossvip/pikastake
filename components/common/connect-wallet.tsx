"use client";

import { useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatPublicAddress } from "@/lib/utils";

export default function ConnectWallet() {
  const { isConnected, address } = useAccount();
  const { toast } = useToast();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
    chainId: 1,
  });

  useEffect(() => {
    if (isConnected) {
      toast({
        title: "Wallet connected",
        description: "Metamask wallet connected successfully",
      });
    }
  }, [isConnected]);
  return (
    <Button onClick={() => connect()} variant="pika" size="pika" className="mb-20">
      {isConnected && address ? formatPublicAddress(address) : "Connect wallet"}
    </Button>
  );
}
