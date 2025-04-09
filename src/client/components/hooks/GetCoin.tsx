import { fetchCoinById } from "../../requrests/GetCoin";
import type { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";
import { useState, useEffect } from "react";
// Function to load the coin data
function loadCoin(
	coinId: number,
	errorCallback: (message: string) => void,
): Promise<CoinDTO | null> {
	return fetchCoinById(coinId, errorCallback);
}

export const useCoin = (
	errorCallback: (error: string) => void,
	onLoaded?: () => void,
) => {
	const [coinId, setCoinId] = useState<number>(-1);
	const [coin, setCoin] = useState<CoinDTO | null>(null); // Coin state
	const [loading, setLoading] = useState<boolean>(true); // Loading state
	useEffect(() => {
		console.log("Coin received from api in useCoin: ");
		console.log(coin);
	}, [coin]);
	useEffect(() => {
		if (coinId <= 0) return; // Ensure a valid coinId is provided

		setLoading(true); // Set loading state to true before fetching

		loadCoin(coinId, errorCallback)
			.then((data) => {
				setCoin(data);
				setLoading(false);
				if (onLoaded) onLoaded(); // Call onLoaded callback after loading completes
			})
			.catch((err: any) => {
				const message = err?.message || "Failed to load coin data";
				errorCallback(message);
				setLoading(false);
			});
	}, [coinId]); // Dependencies: when coinId changes, rerun the effect

	return { coin, setCoinId };
};
