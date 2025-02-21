"use client";

import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
export default function AmountInput({ amount, setAmount }: { amount: string; setAmount: (value: string) => void }) {

	const handleButtonClick = (value: string) => {
		setAmount(value);
	};

	return (
		<Card className="bg-transparent border border-white/10">
			<CardBody className="p-0 flex flex-col gap-0">
				<Input
					type="number"
					placeholder="0.00"
					labelPlacement="outside"
					aria-label="Amount"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					classNames={{
						input: ["bg-transparent", "rounded-b-none", "hover:bg-transparent", "text-md"],
						inputWrapper: ["bg-transparent", "rounded-b-none", "hover:bg-transparent"],
					}}
					startContent={<Icon icon="token-branded:sol" />}
				/>

				<div className="bg-white/10 grid grid-cols-6 gap-0 divide-x divide-black/30">
					<span className="bg-transparent text-xs hover:bg-white/10 w-full h-full flex items-center justify-center py-2" onClick={() => handleButtonClick("0.01")} aria-label="0.01">
						0.01
					</span>
					<span className="bg-transparent text-xs hover:bg-white/10 w-full h-full flex items-center justify-center py-2" onClick={() => handleButtonClick("0.25")} aria-label="0.25">
						0.25
					</span>
					<span className="bg-transparent text-xs hover:bg-white/10 w-full h-full flex items-center justify-center py-2" onClick={() => handleButtonClick("0.5")} aria-label="0.5">
						0.5
					</span>
					<span className="bg-transparent text-xs hover:bg-white/10 w-full h-full flex items-center justify-center py-2" onClick={() => handleButtonClick("1")} aria-label="1">
						1
					</span>
					<span className="bg-transparent text-xs hover:bg-white/10 w-full h-full flex items-center justify-center py-2" onClick={() => handleButtonClick("2")} aria-label="2">
						2
					</span>
					<span className="bg-transparent text-xs hover:bg-white/10 w-full h-full flex items-center justify-center py-2" onClick={() => handleButtonClick("5")} aria-label="5">
						5
					</span>
				</div>
			</CardBody>
		</Card>
	);
}
