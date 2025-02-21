import { useQuery } from "@tanstack/react-query";

export default function useActivity(token: string) {
	const fetchActivity = async () => {
		const response = await fetch(`/api/activity/${token}`);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return response.json();
	};

	const {
		data: activity,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["activity", token], // Include token in queryKey for specificity
		queryFn: fetchActivity,
		staleTime: 5000,
	});

	return {
		activity,
		isLoading,
		error,
	};
}
