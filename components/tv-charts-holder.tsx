"use client";

import TvChart from "@/components/tv-chart";
import { Card, Input, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { Button, CardBody } from "@nextui-org/react";
import { useState } from "react";

export default function TvChartsHolder({ charts, removeChart, addChart }: { charts: string[]; removeChart: (symbol: string) => void; addChart: (symbol: string) => void }) {
  const [symbolToAdd, setSymbolToAdd] = useState("");
  const [isAddChartOpen, setIsAddChartOpen] = useState(false);

  const handleAddChart = () => {
    addChart(symbolToAdd);
    setSymbolToAdd("");
    setIsAddChartOpen(false);
  };

	return (
		<div>
			<div className="px-4">
				<Card fullWidth className="bg-zinc-800/20">
					<CardBody className="">
						<div className="w-full flex justify-end items-center">
							<Popover placement="bottom-end" showArrow offset={10} isOpen={isAddChartOpen} onOpenChange={(open) => setIsAddChartOpen(open)} backdrop="blur">
								<PopoverTrigger>
									<Button size="sm" className="text-md" color="primary" aria-label="Add Chart">
										Add Chart
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-[240px]">
									{(titleProps) => (
										<div className="px-1 py-2 w-full">
											<p className="text-small font-bold text-foreground" {...titleProps}>
												Symbol
											</p>
											<div className="mt-2 flex flex-col gap-2 w-full">
												<Input
                          value={symbolToAdd}
                          onChange={(e) => setSymbolToAdd(e.target.value)}
                          size="sm"
                          variant="bordered"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddChart();
                            }
                          }}
                          classNames={{
                            input: "inter"
                          }}
                        />
                        <Button color="primary" onClick={() => handleAddChart()} className="text-xl" aria-label="Add">Add</Button>
											</div>
										</div>
									)}
								</PopoverContent>
							</Popover>
						</div>
					</CardBody>
				</Card>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
				{charts.map((symbol) => (
					<TvChart key={symbol} symbol={symbol} removeChart={() => removeChart(symbol)} />
				))}
			</div>
		</div>
	);
}
