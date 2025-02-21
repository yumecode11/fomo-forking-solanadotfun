"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import useActivity from "@/app/hooks/useActivty";
import { Button, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import SingleTokenSidebar from "@/components/single-token-sidebar";
import { Icon } from "@iconify/react";
import { ColorType, createChart, IChartApi, Time } from 'lightweight-charts';
import usePair from "@/app/hooks/usePair";
import useOhlcv from "@/app/hooks/useOhlcv";


export default function TokenPage() {
	let { token }: {token:string} = useParams();

  const { pair, isLoading: isPairLoading } = usePair(token);
  const { ohlcv, isLoading: isOhlcvLoading } = useOhlcv(token);


	const chartContainerRef = useRef<HTMLDivElement>(null);
	const chartRef = useRef<IChartApi | null>(null);

	const { activity, isLoading: isActivityLoading } = useActivity(token);

	console.log(activity);


  useEffect(() => {
    if (!ohlcv) return;
    if (chartContainerRef?.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        layout: { background: { type: ColorType.Solid, color: 'black' }, textColor: 'white' },
      });

      // Add data to the chart
      const candlestickSeries =chartRef.current.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      if (ohlcv) {
        const formattedOhlcv = ohlcv.map((data) => ({
          time: data.time as Time,
          open: parseFloat(data.open),
          high: parseFloat(data.high),
          low: parseFloat(data.low),
          close: parseFloat(data.close)
        }));

        candlestickSeries.setData(formattedOhlcv);
      }
    }
  }, [ohlcv]);

	return (
		<div className="grid grid-cols-12" style={{ height: "calc(100vh - 60px)" }}>
			<div className="flex flex-col col-span-12 md:col-span-9 order-2 md:order-first">
				<div className="overflow-hidden">
          <div className="w-full h-[400px] bg-black/80 text-white/40" ref={chartContainerRef} />
				</div>
				<div className="bg-black/80 w-full h-[450px]">
					<div className="h-full">
						<Table
							isHeaderSticky
							isStriped
							className="h-full"
							classNames={{
								base: "h-full overflow-scroll rounded-none max-w-screen",
								wrapper: "rounded-none p-0",
								th: "bg-[#0a0a0b] !rounded-none",
								tr: "!rounded-none",
								td: "before:!rounded-none",
							}}
						>
							<TableHeader>
								<TableColumn className="text-md text-white">Date</TableColumn>
								<TableColumn className="text-md text-white">Type</TableColumn>
								<TableColumn className="text-md text-white">USD</TableColumn>
								<TableColumn className="text-md text-white">SOL</TableColumn>
								<TableColumn className="text-md text-white">MAKER</TableColumn>
								<TableColumn className="text-md text-white">TXN</TableColumn>
							</TableHeader>

							<TableBody
								isLoading={isActivityLoading}
								emptyContent={"No activity found"}
								loadingContent={<Spinner />}
								className="p-10"
							>
								{activity && activity.data.map((row: any, index: number) => (
									<TableRow key={index + 2}>
										<TableCell className="text-white/50 text-md">{new Date(row.formattedTime * 1000).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})}</TableCell>
										<TableCell className={`text-md ${row.type === 'Buy' ? 'text-success' : 'text-danger'}`}>{row.type}</TableCell>
										<TableCell className={`text-md ${row.type === 'Buy' ? 'text-success' : 'text-danger'}`}>${row.usd}</TableCell>
										<TableCell className={`text-md ${row.type === 'Buy' ? 'text-success' : 'text-danger'}`}>{row.sol}</TableCell>
										<TableCell className="text-white text-md">
											{row?.maker ? `${row?.maker?.slice(0, 5)}...${row?.maker?.slice(-5)}` : '--'}
										</TableCell>
										<TableCell>
											<Button isIconOnly className="bg-white/10" size="sm" aria-label="Transaction" onClick={() => {
												window.open(`https://solscan.io/tx/${row.txn}`, '_blank');
											}}>
												<Icon icon="material-symbols-light:arrow-forward" />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
			<div className="col-span-12 md:col-span-3 border-t-2 md:border-0 border-white/10">
				<SingleTokenSidebar token={pair} />
			</div>
		</div>
	);
}
