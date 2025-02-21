"use client";

import { Card, CardHeader, CardBody, CardFooter, Button, Input, Select, SelectItem } from "@nextui-org/react";
import Image from "next/image";
import { Icon } from "@iconify/react";

// Crypto Icons
import BTC from "@/app/assets/images/crypto-icons/btc.svg";
import ETH from "@/app/assets/images/crypto-icons/eth.svg";
import USDT from "@/app/assets/images/crypto-icons/usdt.svg";
import USDC from "@/app/assets/images/crypto-icons/usdc.svg";
import FLOKI from "@/app/assets/images/crypto-icons/floki.svg";
import SOL from "@/app/assets/images/crypto-icons/sol.svg";

export default function Swap() {
	const coins = [
		{
      id: 1,
      name: "BTC",
      image: BTC.src,
		},
    {
      id: 2,
      name: "ETH",
      image: ETH.src,
    },
    {
      id: 3,
      name: "USDT",
      image: USDT.src,
    },
    {
      id: 4,
      name: "USDC",
      image: USDC.src,
    },
    {
      id: 5,
      name: "FLOKI",
      image: FLOKI.src,
    },
    {
      id: 6,
      name: "SOL",
      image: SOL.src,
    },
	];
	return (
		<div className="w-full h-full flex items-center justify-center">
			<Card className="w-full max-w-[450px] pb-3 bg-neutral-950 shadow-none">
				<CardHeader className="flex justify-center">
					<h1 className="text-5xl font-bold text-center pt-4">SuperSwap</h1>
				</CardHeader>
				<CardBody className="pb-0">
          <div className="flex flex-col gap-1.5 items-center px-2">
            <Card className="bg-[#0d0d0e] border-0 shadow-none py-3">
              <CardBody>
                <div className="flex items-center gap-2">
                  <Input
                    defaultValue="0"
                    type="number"
                    size="md"
                    classNames={{
                      mainWrapper: [
                        "!bg-transparent",
                      ],
                      innerWrapper: [
                        "!bg-transparent",
                      ],
                      inputWrapper: [
                        "!bg-transparent",
                      ],
                      input: [
                        "!bg-transparent",
                        "text-[25px]", 
                        "font-bold"
                      ],
                      base: "-mt-2"
                    }}
                  />

                  <Select
                    items={coins}
                    size="lg"
                    radius="full"
                    variant="bordered" 
                    defaultSelectedKeys={["1"]}
                    classNames={{
                      base: "w-[250px] rounded-full",
                      trigger: "p-4 border-none"
                    }}
                    renderValue={(items) => {
                      return items.map((item) => (
                        <div key={item.key} className="flex items-center gap-2">
                          {item.data?.image && <Image src={item.data?.image} alt={item.data?.name} unoptimized className="w-5 h-5" width={20} height={20} />}
                          <div className="flex flex-col">
                            <span className="text-md">{item.data?.name}</span>
                          </div>
                        </div>
                      ));
                    }}
                  >
                    {(coin: any) => (
                      <SelectItem key={coin?.mint?.address} textValue={coin.name}>
                        <div className="flex gap-2 items-center">
                          <Image alt={coin.name} className="flex-shrink-0 w-5 h-5" src={coin.image} width={20} height={20} unoptimized />
                          <div className="flex flex-col">
                            <span className="text-md">{coin.name}</span>
                          </div>
                        </div>
                      </SelectItem>
                    )}
                  </Select>
                </div>
                <div className="absolute bottom-1.5 left-6 text-white/40">$0.00</div>
              </CardBody>
            </Card>

            <Button isIconOnly className="w-10 h-10 -mt-6 -mb-6 z-10 bg-[#0d0d0e] border-[3px] border-[#18181b]" aria-label="Swap">
              <Icon icon="iconamoon:swap-bold" />
            </Button>

            <Card className="bg-[#0d0d0e] border-0 shadow-none py-3">
              <CardBody>
                <div className="flex items-center gap-2">
                  <Input
                    defaultValue="0"
                    type="number"
                    size="md"
                    classNames={{
                      mainWrapper: [
                        "!bg-transparent",
                      ],
                      innerWrapper: [
                        "!bg-transparent",
                      ],
                      inputWrapper: [
                        "!bg-transparent",
                      ],
                      input: [
                        "!bg-transparent",
                        "text-[25px]", 
                        "font-bold"
                      ],
                      base: "-mt-2"
                    }}
                  />

                  <Select
                    items={coins}
                    size="lg"
                    radius="full"
                    variant="bordered" 
                    placeholder="Select a token"
                    classNames={{
                      base: "w-[250px] rounded-full",
                      trigger: "p-4 border-none"
                    }}
                    renderValue={(items) => {
                      return items.map((item) => (
                        <div key={item.key} className="flex items-center gap-2">
                          {item.data?.image && <Image src={item.data?.image} alt={item.data?.name} unoptimized className="w-5 h-5" width={20} height={20} />}
                          <div className="flex flex-col">
                            <span className="text-md">{item.data?.name}</span>
                          </div>
                        </div>
                      ));
                    }}
                  >
                    {(coin: any) => (
                      <SelectItem key={coin?.mint?.address} textValue={coin.name}>
                        <div className="flex gap-2 items-center">
                          <Image alt={coin.name} className="flex-shrink-0 w-5 h-5" src={coin.image} width={20} height={20} unoptimized />
                          <div className="flex flex-col">
                            <span className="text-md">{coin.name}</span>
                          </div>
                        </div>
                      </SelectItem>
                    )}
                  </Select>
                </div>
                <div className="absolute bottom-1.5 left-6 text-white/40">$0.00</div>
              </CardBody>
            </Card>
          </div>
				</CardBody>
				<CardFooter className="px-6">
					<Button color="primary" fullWidth size="lg" aria-label="Swap">
						Swap
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
