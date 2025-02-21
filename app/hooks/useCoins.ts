import { useQuery } from "@tanstack/react-query";

export default function useCoins() {
	const fetchCoins = async () => {
		const response = await fetch("/api/coins");
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data = await response.json();
		return data.filter((coin:any) => coin.image !== "https://via.assets.so/img.jpg?w=400&h=150&tc=blue&bg=#000000&t=");
	};

	const {
		data: coins,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["coins"],
		queryFn: fetchCoins,
		staleTime: 250000,
	});

	return {
		coins,
		isLoading,
		error,
	};
}
