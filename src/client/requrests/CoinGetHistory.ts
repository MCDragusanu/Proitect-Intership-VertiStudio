
import type { CoinHistoryEntry } from "../components/ui/CoinHistory";

export const fetchCoinHistory = async (
	coinId: number,
	errorCallback: (message: string) => void,
): Promise<CoinHistoryEntry[]> => {
	try {
		const response = await fetch(
			`http://localhost:3000/api/coins/history/${coinId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			},
		);
		if (response.status == 404) {
			return [];
		} else if (!response.ok) {
			let errorMessage = "Something went wrong fetching coin history.";

			try {
				const errorData = await response.json();
				errorMessage = errorData.message || errorMessage;
			} catch (err) {
				console.error("Error parsing error response:", err);
			}

			errorCallback(errorMessage);
			return [];
		}

		const history: CoinHistoryEntry[] = await response.json();
		console.log(history);
		if (history === undefined) return [];
		return history ?? [];
	} catch (err: any) {
		console.error("Network or server error:", err);
		errorCallback(
			err?.message || "Network error occurred while fetching coin history.",
		);
		return [];
	}
};
