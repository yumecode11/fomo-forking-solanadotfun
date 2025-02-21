import { useQuery } from "@tanstack/react-query";

export default function usePair(token: string) {
	console.log('token in hook', token);
	const fetchPair = async () => {
		const response = await fetch(`/api/metadata?token=${token}`);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return response.json();
	};

	const {
		data: pair,
		isLoading,
		error,
	} = useQuery({
		// select: (data) => data.filter((pair:any) => pair.token !== 'Unknown'),
		queryKey: ["pair", token],
		queryFn: fetchPair,
		staleTime: 250000,
	});

	console.log('[[[PAIR INF HOOK]]]', pair);

	return {
		pair,
		isLoading,
		error,
	};
}
