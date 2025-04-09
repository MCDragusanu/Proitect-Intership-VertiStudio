import { useState, useEffect } from "react";
import { fetchCoinSupply } from "../../requrests/GetCoinSupply";

function loadCoinSuuply(
	errorCallback: (message: string) => void,
): Promise<number> {
	return fetchCoinSupply(errorCallback);
}

export const useCoinSupply = (
	onError: (error: string) => void,
	onLoaded?: () => void,
) => {
	const [amount, setAmount] = useState<number>(0);
	const [refresh, setRefreshSupply] = useState(false);
	useEffect(() => {
		console.log("A new refresh triggered");
		loadCoinSuuply(onError)
			.then((data) => {
				setAmount(data);
				if (onLoaded) onLoaded(); // call after loading
			})
			.catch((err: any) => {
				const message = err?.message || "Failed to load coin history";
				onError(message);
			});
	}, [refresh]);

	return { amount, setRefreshSupply };
};
