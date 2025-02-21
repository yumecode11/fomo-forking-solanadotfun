"use client";

import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function TvChart({ symbol, removeChart }: { symbol: string; removeChart: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== "undefined") {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          allow_symbol_change: false,
          container_id: container.id,
        });
        setIsChartReady(true);
      }
    };

    container.appendChild(script);

    return () => {
      if (container && container.firstChild) {
        container.removeChild(container.firstChild);
      }
      setIsChartReady(false);
    };
  }, [symbol]);

  return (
    <div className="overflow-hidden h-[400px] flex flex-col z-10">
      <div
        id={`tradingview_${symbol.replace(":", "_")}`}
        ref={containerRef}
        className="tradingview-widget-container single-chart overflow-hidden"
        style={{ height: "calc(100% - 40px)" }}
      />
      <div className="bg-zinc-800/20 p-2 rounded-b-md">
        <div className="flex items-center justify-between">
          <Button isIconOnly size="sm" variant="flat" onClick={removeChart} aria-label="Remove Chart">
            <Icon icon="mdi:trash" className="text-white/20" fontSize={18} />
          </Button>
          <span className="text-white/20 text-xl">{symbol}</span>
        </div>
      </div>
    </div>
  );
}