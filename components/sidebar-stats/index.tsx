"use client";

import { Card, CardBody, Progress } from "@nextui-org/react";
import TopNav from "./top-nav";
import { useState } from "react";

export default function SidebarStats() {
  const [activeTab, setActiveTab] = useState<string>("5m");
	return (
		<Card className="bg-transparent border border-white/10">
			<CardBody className="p-0">
				<TopNav activeTab={activeTab} setActiveTab={setActiveTab} />

				<div className="py-2">
					<div className="grid grid-cols-4 divide-x divide-white/10">
						<div className="col-span-1 flex flex-col gap-2 px-4">
							<div className="flex flex-col">
								<span className="text-white/50">Txns</span>
								<span className="text-2xl">1</span>
							</div>

							<div className="flex flex-col">
								<span className="text-white/50">Volume</span>
								<span className="text-2xl">$77</span>
							</div>

							<div className="flex flex-col">
								<span className="text-white/50">Makers</span>
								<span className="text-2xl">1</span>
							</div>
						</div>
						<div className="col-span-3 flex flex-col gap-2">
							<div className="px-4 py-1">
								<div className="w-full flex justify-between pb-1">
									<div className="flex flex-col">
										<span className="text-white/50 leading-none">Buys</span>
										<span className="text-xl leading-none">2</span>
									</div>
									<div className="flex flex-col text-right">
										<span className="text-white/50 leading-none">Sells</span>
										<span className="text-xl leading-none">4</span>
									</div>
								</div>
								<div>
									<Progress
										value={50}
										size="sm"
										classNames={{
											track: "bg-secondary",
										}}
									/>
								</div>
							</div>

							<div className="pr-2 pl-4 py-2">
								<div className="w-full flex justify-between pb-1">
									<div className="flex flex-col">
										<span className="text-white/50 leading-none">Buy Vol</span>
										<span className="text-xl leading-none">$80</span>
									</div>
									<div className="flex flex-col text-right">
										<span className="text-white/50 leading-none">Sell Vol</span>
										<span className="text-xl leading-none">$20</span>
									</div>
								</div>
								<div>
									<Progress
										value={80}
										size="sm"
										classNames={{
											track: "bg-secondary",
										}}
									/>
								</div>
							</div>

							<div className="pr-2 pl-4 py-2">
								<div className="w-full flex justify-between pb-1">
									<div className="flex flex-col">
										<span className="text-white/50 leading-none">Buyers</span>
										<span className="text-xl leading-none">100</span>
									</div>
									<div className="flex flex-col text-right">
										<span className="text-white/50 leading-none">Sellers</span>
										<span className="text-xl leading-none">1000</span>
									</div>
								</div>
								<div>
									<Progress
										value={10}
										size="sm"
										classNames={{
											track: "bg-secondary",
										}}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
