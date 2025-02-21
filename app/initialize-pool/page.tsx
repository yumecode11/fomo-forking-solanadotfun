"use client";

import { Icon } from "@iconify/react";
import { Button, Card, CardBody, DatePicker, Input, Select, SelectItem, Tab, Tabs } from "@nextui-org/react";
import {now, getLocalTimeZone} from "@internationalized/date";
import { useState } from "react";

export default function InitializePool() {
  const [startTimeType, setStartTimeType] = useState("start-now");
  console.log('[startTimeType]', startTimeType)
	const availableTokens = [
		{
			symbol: "SOL",
			iconString: "token-branded:sol",
		},
		{
			symbol: "USDC",
			iconString: "token-branded:usdc",
		},
		{
			symbol: "USDT",
			iconString: "token-branded:usdt",
		},
		{
			symbol: "ETH",
			iconString: "token-branded:eth",
		},
	];
	return (
		<div className="px-5 py-4">
			<Card className="w-[500px] mx-auto">
				<CardBody>
					<h1 className="text-xs font-bold inter pl-1 pr-2 pt-2 pb-4">Initial liquidity</h1>
					<div className="flex flex-col gap-4 items-center justify-center w-full">
						<div className="bg-black/40 rounded-lg w-full">
							<div className="flex items-center justify-between">
								<div className="px-4 py-2 flex items-center justify-between w-full">
									<div className="text-white/50">Base token</div>
									<div className="flex items-center gap-1">
										<Button size="sm" className="bg-white/10 text-white/50 text-md">
											Max
										</Button>
										<Button size="sm" className="bg-white/10 text-white/50 text-md">
											50%
										</Button>
									</div>
								</div>
							</div>

							<div className="bg-black/60 p-4 rounded-lg flex items-center justify-between">
								<div className="w-[120px] h-full">
									<Select
										size="lg"
										items={availableTokens}
                    defaultSelectedKeys={["SOL"]}
										renderValue={(items) => {
											console.log(items);
											return items.map((item: any) => {
												return (
													<div key={item.key} className="flex items-center gap-2">
														<Icon icon={item.data.iconString} className="w-4 h-4" />
														<span>{item.key}</span>
													</div>
												);
											});
										}}
									>
										{(token) => {
											return (
												<SelectItem key={token.symbol} textValue={token.symbol}>
													<div className="flex items-center gap-2">
														<Icon icon={token.iconString} className="w-4 h-4" />
														<span className="text-lg">{token.symbol}</span>
													</div>
												</SelectItem>
											);
										}}
									</Select>
								</div>

								<div className="w-[120px] flex flex-col items-end justify-end">
									<Input
										type="number"
										placeholder="0"
										size="sm"
										variant="bordered"
										classNames={{
											input: "text-lg",
											inputWrapper: "border-white/5",
										}}
									/>
									<div className="text-white/50 text-lg">~$0</div>
								</div>
							</div>
						</div>

            <div className="bg-slate-500 w-7 h-7 rounded-full flex items-center justify-center -mt-5 relative z-10">
              <Icon icon="ph:plus" className="w-4 h-4" />
            </div>

						<div className="bg-black/40 rounded-lg w-full -mt-5">
							<div className="flex items-center justify-between">
								<div className="px-4 py-2 flex items-center justify-between w-full">
									<div className="text-white/50">Base token</div>
									<div className="flex items-center gap-1">
										<Button size="sm" className="bg-white/10 text-white/50 text-md">
											Max
										</Button>
										<Button size="sm" className="bg-white/10 text-white/50 text-md">
											50%
										</Button>
									</div>
								</div>
							</div>

							<div className="bg-black/60 p-4 rounded-lg flex items-center justify-between">
								<div className="w-[120px] h-full">
									<Select
										size="lg"
										items={availableTokens}
                    defaultSelectedKeys={["ETH"]}
										renderValue={(items) => {
											console.log(items);
											return items.map((item: any) => {
												return (
													<div key={item.key} className="flex items-center gap-2">
														<Icon icon={item.data.iconString} className="w-4 h-4" />
														<span>{item.key}</span>
													</div>
												);
											});
										}}
									>
										{(token) => {
											return (
												<SelectItem key={token.symbol} textValue={token.symbol}>
													<div className="flex items-center gap-2">
														<Icon icon={token.iconString} className="w-4 h-4" />
														<span className="text-lg">{token.symbol}</span>
													</div>
												</SelectItem>
											);
										}}
									</Select>
								</div>

								<div className="w-[120px] flex flex-col items-end justify-end">
									<Input
										type="number"
										placeholder="0"
										size="sm"
										variant="bordered"
										classNames={{
											input: "text-lg",
											inputWrapper: "border-white/5",
										}}
									/>
									<div className="text-white/50 text-lg">~$0</div>
								</div>
							</div>
						</div>

            <div className="w-full">
              <Input
                name="Initial Price"
                type="number"
                placeholder="0"
                size="lg"
                label="Initial Price"
                labelPlacement="outside"
                classNames={{ input: "text-lg", inputWrapper: "border-white/5" }}
                endContent={<div className="text-white/50">RAY/SOL</div>}
              />
              <div className="text-white/50 text-sm pt-2">
                Current Price: <span className="text-white/80">1 SOL ≈ 80.9954527 RAY</span>
              </div>
            </div>

            <div className="w-full">
              <Select label="Fee Tier" labelPlacement="outside" defaultSelectedKeys={["0.25%"]} size="lg">
                <SelectItem key="0.25%">0.25%</SelectItem>
                <SelectItem key="0.5%">0.5%</SelectItem>
                <SelectItem key="1%">1%</SelectItem>
                <SelectItem key="2.5%">2.5%</SelectItem>
                <SelectItem key="5%">5%</SelectItem>
                <SelectItem key="10%">10%</SelectItem>
              </Select>
            </div>

            <div className="w-full">
              <span className="pb-4">Start Time</span>

              <Tabs size="md" aria-label="Tabs sizes" fullWidth defaultSelectedKey={startTimeType} onSelectionChange={(e: any) => setStartTimeType(e)}>
                <Tab key="start-now" title="Start Now"/>
                <Tab key="custom" title="Custom"/>
              </Tabs>              
            </div>

            {startTimeType === "custom" && <div className="w-full">
              <DatePicker
                label="Event Date"
                variant="bordered"
                hideTimeZone
                showMonthAndYearPickers
                labelPlacement="outside"
                defaultValue={now(getLocalTimeZone())}
              />
            </div>}

            <Button color="primary" className="w-full">Intialize</Button>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
