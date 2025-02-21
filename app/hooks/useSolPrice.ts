import { useQuery } from "@tanstack/react-query";

export default function useSolPrice() {
  const fetchCoins = async () => {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    const solanaPrice = data.solana.usd;

    return {
      solana_usd: solanaPrice
    };
  }

  const {
    data: price,
    isLoading,
    error,
  } = useQuery({
    // select: (data) => data.filter((pair:any) => pair.token !== 'Unknown'),
    queryKey: ["solana_usd"],
    queryFn: fetchCoins,
    staleTime: 50000,
  });

  return {
    price,
    isLoading,
    error,
  };
}