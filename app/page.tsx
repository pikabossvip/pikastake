"use client";

import {
  pikaContractAbi,
  pikaContractAddress,
  stakingContractAbi,
  stakingContractAddress,
} from "@/assets/contract";
import ConnectWallet from "@/components/common/connect-wallet";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import pikaLogo from "@/assets/images/pika.png";
import { useAccount } from "wagmi";

export default function Home() {
  const [readContract, setReadContract] = useState<any>();
  const [writeContract, setWriteContract] = useState<any>();
  const [readPikaContract, setReadPikaContract] = useState<any>();
  const [writePikaContract, setWritePikaContract] = useState<any>();
  const [provider, setProvider] = useState<any>();
  const [signer, setSigner] = useState<any>();
  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [unstakeAmount, setUnstakeAmount] = useState<number>(0);
  const [apr, setApr] = useState<number>(0);
  const [unclaimed, setUnclaimed] = useState<number>(0);
  const [stakedAmount, setStakedAmount] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [allowance, setAllowance] = useState<number>(0);
  const { toast } = useToast();
  const { isConnected, address } = useAccount();

  useEffect(() => {
    if (isConnected) {
      loadWeb3();
      // getApr();
    }
  }, [isConnected]);

  function handleStakeChange(e: any) {
    setStakeAmount(parseFloat(e.target.value));
  }
  function handleUnstakeChange(e: any) {
    setUnstakeAmount(parseFloat(e.target.value));
  }

  const loadWeb3 = async () => {
    console.log("load web3");
    if ((window as any).ethereum == null) {
      toast({
        title: "No metamask",
        description: "You need to install Metamask to connect your wallet",
      });
    } else {
      const p = new ethers.BrowserProvider((window as any).ethereum);
      setProvider(p);
      const rc = new Contract(stakingContractAddress, stakingContractAbi, p);
      setReadContract(rc);

      const s = await p.getSigner();
      setSigner(s);
      const wc = new Contract(stakingContractAddress, stakingContractAbi, s);
      setWriteContract(wc);

      const contractApr = await rc.apr();
      setApr(Number(contractApr));

      const unclaimed = await rc.unclaimed(address);
      setUnclaimed(Number(unclaimed));

      const balances = await rc.balances(address);
      setStakedAmount(Number(balances));

      const rpc = new Contract(pikaContractAddress, pikaContractAbi, p);
      setReadPikaContract(rpc);

      const b = await rpc.balanceOf(address);
      setWalletBalance(Number(b));

      const a = await rpc.allowance(address, stakingContractAddress);
      setAllowance(Number(a));

      const wpc = new Contract(pikaContractAddress, pikaContractAbi, s);
      setWritePikaContract(wpc);
    }
  };

  const getApr = async () => {
    const apr = await readContract.apr();
    setApr(apr);
  };

  const stake = async () => {
    if (walletBalance > 0 && allowance < walletBalance) {
      await writePikaContract.approve(pikaContractAddress, walletBalance);
    }
    await writeContract.stake(stakeAmount);
  };

  const unstake = async () => {
    await writeContract.unstake(unstakeAmount);
  };

  const restake = async () => {
    await writeContract.restake();
  };

  const claim = async () => {
    await writeContract.claim();
  };

  return (
    <div className="mt-24 flex flex-col items-center">
      <Image src={pikaLogo} alt={"pika_logo"} width={120} height={120} />
      <h1 className="text-[60px] font-chelsea mb-4">PIKA STAKING</h1>
      {isConnected && (
        <div className="flex flex-col gap-4 bg-[#F8F4E2] rounded-md p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between pb-4 mb-4 border-b border-slate-400">
            <p>$PIKA balance: {walletBalance}</p>
            <p>APR: {apr}</p>
            <p>Staked $PIKA: {stakedAmount}</p>
            <p>Unclaimed: {unclaimed}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-12">
            <div className="flex flex-col gap-4 items-center">
              <Input
                type="number"
                placeholder="Stake amount"
                onChange={(e) => handleStakeChange(e)}
                // defaultValue={userStake}
              />
              <Button
                onClick={stake}
                disabled={stakeAmount <= 0}
                variant="pika"
                size="pika"
              >
                Stake
              </Button>
            </div>
            <div className="flex flex-col gap-4 items-center">
              <Input
                type="number"
                placeholder="Unstake amount"
                onChange={(e) => handleUnstakeChange(e)}
                // defaultValue={userStake}
              />
              <Button
                onClick={unstake}
                disabled={unstakeAmount <= 0}
                variant="pika"
                size="pika"
              >
                Unstake
              </Button>
            </div>
            <Button onClick={restake} variant="pika" size="pika">
              Restake
            </Button>
            <Button onClick={claim} variant="pika" size="pika">
              Claim
            </Button>
          </div>
        </div>
      )}
      <ConnectWallet />
    </div>
  );
}
