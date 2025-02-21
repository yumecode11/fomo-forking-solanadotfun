"use client"

import { Icon } from "@iconify/react";
import { Button, Card, CardBody } from "@nextui-org/react"
import { useWallet } from "@solana/wallet-adapter-react";
export default function Portfolio() {
  const { wallet } = useWallet();
  return (
    <div className="p-5">
      <div className="flex flex-col md:flex-row items-start justify-between pb-4">
        <div className="flex gap-2 items-end">
          <span className="font-bold text-3xl inter">$11.30</span>
          <span className="uppercase text-xl text-white/40">Total Value</span>
        </div>

        <div>
          <span className="text-2xl flex items-center gap-2">
            <span className="text-white/40">Wallet:</span> {wallet?.adapter?.publicKey?.toBase58().slice(0, 6) + '...' + wallet?.adapter?.publicKey?.toBase58().slice(-4)}
            <Icon icon="solar:copy-bold" className="cursor-pointer w-5 h-5 text-white/40" />
          </span>
        </div>
      </div>

      {/* <div className="flex gap-2">
        <Button size="sm" className="text-lg" variant="bordered" color="primary">Add Wallet</Button>
        <Button size="sm" className="text-lg" variant="bordered" color="primary">Rename</Button>
        <Button size="sm" className="text-lg" variant="bordered" color="primary">Remove</Button>
        <Button size="sm" className="text-lg" variant="bordered" color="primary">Show Small Values</Button>
      </div> */}

      <div className="pt-4">
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row justify-between p-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Icon icon="token-branded:solana" className="w-5 h-5" />
                  <span className="text-xl font-bold">Solana</span>
                </div>

                <div className="inter flex justify-between md:justify-start pb-4 md:pb-0 items-center gap-2 text-sm">
                  <span className="border border-white/10 rounded-md py-1 px-2">$11.22</span>
                  <span className="text-xs text-white/40">CLMM</span>
                  <span className="text-white font-bold">Wrapped SOL</span>
                  <span className="text-xs text-white/40">SOL</span>
                </div>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 items-center gap-4 md:gap-10">
                <div className="flex flex-col">
                  <span className="text-white/40">Amount</span>
                  <span className="inter font-bold">0.07</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-white/40">Price USD</span>
                  <span className="inter font-bold">0.07</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-white/40">1H</span>
                  <span className="inter font-bold">0.07</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-white/40">24H</span>
                  <span className="inter font-bold">0.07</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}