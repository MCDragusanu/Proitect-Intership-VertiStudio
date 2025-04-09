import { useState, useEffect } from "react";
import type { CoinHistoryEntry } from "../ui/CoinHistory";
import { fetchCoinHistory } from "../../requrests/CoinGetHistory";

function loadCoinHistory(
	coinId: number,
	errorCallback: (message: string) => void,
): Promise<CoinHistoryEntry[]> {
	return fetchCoinHistory(coinId, errorCallback) || [];
}

export const useCoinHistory = (
	onError: (error: string) => void,
	onLoaded?: () => void,
) => {
	const [coinUid, setCoinUid] = useState<number | null>(null);
	const [coinHistory, setHistory] = useState<CoinHistoryEntry[]>([]);

	useEffect(() => {
		if (coinUid === null || coinUid === -1) return;

		loadCoinHistory(coinUid, onError)
			.then((data) => {
				setHistory(data);
				if (onLoaded) onLoaded(); // call after loading
			})
			.catch((err: any) => {
				const message = err?.message || "Failed to load coin history";
				onError(message);
			});
	}, [coinUid]);

	return { coinHistory, setCoinUid };
};
