"use client";

import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Button, Card, CardBody, Divider, Link, Progress, Tab, Tabs } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import useCoins from "@/app/hooks/useCoins";
import { useRouter } from 'next/navigation'
import ItemFilterBar from "@/components/item-filter-bar";
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { ModalContext } from "@/app/providers";

import Logo from "@/app/assets/images/logo_color.svg";
import usePairs from "./hooks/usePairs";
import useSolPrice from "./hooks/useSolPrice";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('trending');
  const [parent, enableAnimations] = useAutoAnimate()
  const router = useRouter();
  const { pairs: coins, isLoading, error } = usePairs();

  console.log(coins);

  const { price } = useSolPrice()

  console.log(price);
  const filteredCoins = coins && coins.filter((coin: any) => {
    switch (activeFilter) {
      case 'new':
        return coin.is_new;
      case 'rising':
        return coin.is_rising;
      case 'top':
        return coin.is_top;
      case 'trending':
        return coin.is_trending;
      default:
        return true;
    }
  });

  const modalContext = useContext(ModalContext);

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">Loading...</div>
      ) : error ? (
        <div className="flex items-center justify-center h-screen">Error: {error.message}</div>
      ) : (
        <div>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-[50px] font-bold text-center pt-10 md:pt-0 leading-none hidden md:block">FOMO 3D</h1>
            <p className="text-center text-xl opacity-70 px-4 pt-4">The most accessible launchpad on Solana.</p>
            <p className="text-center text-xl opacity-70 pb-6 px-4">Jumpstart the next big token on your terms!</p>
            <div className="flex items-center gap-2 pb-10">
              <Button size="md" color="secondary" variant="ghost" className="text-xs md:text-lg" aria-label="How it Works" onPress={() => modalContext?.setOpenModals((prev: any) => [...prev, "howItWorksModal"])}>How it Works</Button>
              <Button size="md" color="primary" className="text-xs md:text-lg" aria-label="Launch Your Own Token" onClick={() => router.push('/launch')}>Lauch Your Own Token</Button>
            </div>
            <Divider />
          </div>

          <section className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-2">
              {coins && coins.length > 0 && coins.map((coin: any) => (
                <Card
                  key={coin.mint.address}
                  isPressable
                  onPress={() => {
                    console.log(coin.mint.address);
                    router.push(`/token/${coin.mint.address}`);
                  }}>
                  <CardBody className="flex flex-col gap-2 pt-6 md:pt-3">
                    <div className="flex items-center gap-1 absolute top-2 right-2">
                      <Link href={coin.twitter} target="_blank" className="text-white/90">
                        <Icon icon="arcticons:x-twitter" />
                      </Link>
                      <Link href={coin.telegram} target="_blank" className="text-white/90">
                        <Icon icon="arcticons:telegram" />
                      </Link>
                      <Link href={coin.website} target="_blank" className="text-white/90">
                        <Icon icon="arcticons:emoji-globe-with-meridians" />
                      </Link>
                    </div>
                    <div className="flex items-center gap-4">
                      <Image
                        unoptimized
                        src={coin.mint.metadata.image || "https://via.assets.so/img.jpg?w=400&h=150&tc=blue&bg=#000000&t="}
                        width={70}
                        height={70}
                        alt="avatar"
                        className="rounded-lg aspect-square object-cover"
                        placeholder="blur"
                        blurDataURL={"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=="}
                      />
                      <div className="flex flex-col gap-0">
                        <h2 className="text-md md:text-xl font-bold leading-none">
                          <span className="opacity-50">@{coin.mint.metadata.symbol}</span> {coin.mint.metadata.name}
                        </h2>
                        <p className="opacity-70 text-xs md:text-sm pt-1">{coin.mint.metadata.description}</p>
                      </div>
                    </div>

                    <Divider />

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-secondary">{coin['1h'] || 'N/A'}</span>
                          <span>${coin.volume || 'N/A'}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <span>Market Cap</span>:<span>{(coin.price * coin.supply * price?.solana_usd / LAMPORTS_PER_SOL).toFixed(4)} USD</span>
                          {coin.supply.supply}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span>{coin.buys || 'N/A'} buys</span>/<span>{coin.sells || 'N/A'} sells</span>
                        </div>
                      </div>
                      <Progress value={parseFloat(coin['24h']) || 0} classNames={{ indicator: "bg-[#9648fe]" }} size="sm" />
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
