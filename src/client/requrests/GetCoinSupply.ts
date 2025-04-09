import { CoinHistoryEntry } from "../components/ui/CoinHistory";

export const fetchCoinSupply = async (
	errorCallback: (message: string) => void,
): Promise<number> => {
	try {
		const response = await fetch(`http://localhost:3000/api/coins/supply`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		if (!response.ok) {
			let errorMessage = "Something went wrong fetching coin supply.";
			try {
				const errorData = await response.json();
				errorMessage = errorData.message || errorMessage;
			} catch (err) {
				console.error("Error parsing error response:", err);
			}
			errorCallback(errorMessage);
			return 0;
		}

		const supply = await response.json();
		return supply.coinSupply ?? 0;
	} catch (err: any) {
		console.error("Network or server error:", err);
		errorCallback(
			err?.message || "Network error occurred while fetching coin history.",
		);
		return 0;
	}
};
