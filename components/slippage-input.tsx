"use client";

import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { useState } from "react";

export default function SlippageInput() {
	const [slippage, setSlippage] = useState("");

	const handleButtonClick = (value: string) => {
		setSlippage(value);
	};

	return (
		<Card className="bg-transparent border border-white/10">
			<CardBody className="p-0 flex flex-col gap-0">
				<Input
					type="number"
					placeholder="0.00"
					labelPlacement="outside"
					aria-label="Slippage"
					value={slippage}
					onChange={(e) => setSlippage(e.target.value)}
					classNames={{
						input: ["bg-transparent", "rounded-b-none", "hover:bg-transparent", "text-md"],
						inputWrapper: ["bg-transparent", "rounded-b-none", "hover:bg-transparent"],
					}}
					startContent={<span className="text-white/50">Slippage</span>}
				/>

				<div className="bg-white/10 grid grid-cols-6 gap-0 w-full divide-x divide-black/30">
					<span className="bg-transparent text-xs hover:bg-white/10 p-0 w-full h-full flex items-center justify-center py-2" onClick={() => handleButtonClick("5")} aria-label="5%">
						5%
					</span>
					<span className="bg-transparent text-xs hover:bg-white/10 p-0 w-full h-full flex items-center justify-center py-2" onClick={() => handleButtonClick("10")} aria-label="10%">
						10%
					</span>
					<span className="bg-transparent text-xs hover:bg-white/10 p-0 w-full h-full flex items-center justify-center py-2" onClick={() => handleButtonClick("15")} aria-label="15%">
						15%
					</span>
					<span className="bg-transparent text-xs hover:bg-white/10 p-0 w-full h-full flex items-center justify-center py-2" onClick={() => handleButtonClick("20")} aria-label="20%">
						20%
					</span>
					<span className="bg-transparent text-xs hover:bg-white/10 p-0 w-full h-full flex items-center justify-center py-2" onClick={() => handleButtonClick("25")} aria-label="25%">
						25%
					</span>
					<span className="bg-transparent text-xs hover:bg-white/10 p-0 w-full h-full flex items-center justify-center py-2" onClick={() => handleButtonClick("50")} aria-label="50%">
						50%
					</span>
				</div>
			</CardBody>
		</Card>
	);
}
