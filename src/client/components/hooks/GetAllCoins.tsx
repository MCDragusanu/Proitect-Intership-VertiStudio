import { useState, useEffect } from "react";
import { CoinHistoryEntry } from "../ui/CoinHistory";
import { fetchCoinHistory } from "../../requrests/CoinGetHistory";
import { getFreeCoins } from "../../requrests/GetAllCoins";
import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";
import { PaginationParams } from "../../requrests/GetAllCoins";

function loadCoins(
	params: PaginationParams,
	errorCallback: (message: string) => void,
): Promise<CoinDTO[]> {
	return getFreeCoins(params, errorCallback);
}

export const useCoinDatabase = (
	onError: (error: string) => void,
	onLoaded?: () => void,
) => {
	const [coins, setCoins] = useState<CoinDTO[]>([]);
	const [refresh, setRefresh] = useState(false);
	const [params, setParams] = useState<PaginationParams>({
		pageNumber: 1,
		pageSize: 30,
	});
	useEffect(() => {
		console.log("A new refresh triggered");
		loadCoins(params, onError)
			.then((data) => {
				setCoins(data);
				if (onLoaded) onLoaded(); // call after loading
			})
			.catch((err: any) => {
				const message = err?.message || "Failed to load coin history";
				onError(message);
			});
	}, [refresh, params]);

	return { coins, params, setCoins, setRefresh, setParams };
};
