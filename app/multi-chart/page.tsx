"use client";
import { useRef, useEffect, useState } from "react";

import TvChartsHolder from "@/components/tv-charts-holder";

export default function MultiChart() {
	const [charts, setCharts] = useState<string[]>(["NASDAQ:AAPL", "NASDAQ:GOOGL", "NASDAQ:MSFT", "NASDAQ:AMZN", "NASDAQ:FB", "NASDAQ:TSLA"]);
	const chartRefs = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		chartRefs.current = chartRefs.current.slice(0, charts.length);
	}, [charts]);

	const removeChart = (symbol: string) => {
		const newCharts = charts.filter((s) => s !== symbol);

    setCharts(newCharts);
	};

  const addChart = (symbol: string) => {
    const newCharts = [...charts, symbol];
    setCharts(newCharts);
  };

	return (
		<div>
      <TvChartsHolder
        charts={charts}
        removeChart={(symbol) => removeChart(symbol)}
        addChart={(symbol) => addChart(symbol)}
      />
		</div>
	);
}
