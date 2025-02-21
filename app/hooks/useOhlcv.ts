import { useQuery } from "@tanstack/react-query";

interface OhlcvData {
  buys: string;
  sells: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  timestamp: string;
}

export default function useOhlcv(token: string) {
  const fetchOhlcv = async () => {
    const response = await fetch(`/api/ohlcv/${token}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const groupBy5Minutes = (data: OhlcvData[]) => {
    const groups = new Map<string, OhlcvData[]>();
    
    data.forEach(item => {
      // Round down to nearest 5 minutes
      const date = new Date(item.timestamp);
      date.setMinutes(Math.floor(date.getMinutes() / 5) * 5);
      date.setSeconds(0);
      date.setMilliseconds(0);
      
      const key = date.toISOString();
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)?.push(item);
    });

    return Array.from(groups.entries()).map(([timestamp, items]) => {
      // Convert string values to numbers for calculations
      const numericItems = items.map(item => ({
        ...item,
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        open: parseFloat(item.open),
        close: parseFloat(item.close),
        volume: parseFloat(item.volume),
        buys: parseFloat(item.buys),
        sells: parseFloat(item.sells),
      }));

      return {
        time: Math.floor(new Date(timestamp).getTime() / 1000),
        // First item's open price
        open: numericItems[0].open.toString(),
        // Last item's close price
        close: numericItems[numericItems.length - 1].close.toString(),
        // Highest high in the group
        high: Math.max(...numericItems.map(item => item.high)).toString(),
        // Lowest low in the group
        low: Math.min(...numericItems.map(item => item.low)).toString(),
        // Sum of volume
        volume: numericItems.reduce((sum, item) => sum + item.volume, 0).toString(),
        // Sum of buys and sells
        buys: numericItems.reduce((sum, item) => sum + item.buys, 0).toString(),
        sells: numericItems.reduce((sum, item) => sum + item.sells, 0).toString(),
      };
    }).sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  };

  const {
    data: ohlcv,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ohlcv", token],
    queryFn: fetchOhlcv,
    staleTime: 250000,
    select: (data) => groupBy5Minutes(data),
  });

  return {
    ohlcv,
    isLoading,
    error,
  };
}