import { useState, useEffect } from "react";
import { fetchGeneratedCoins } from "../../requrests/GenerateNewCoins";
import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";

function loadNewCoins(
	amount: number,
	userUid: string,
	accessToken: string,
	errorCallback: (message: string) => void,
	unAuthorizedAccessCallback: () => void,
): Promise<CoinDTO[]> {
	return fetchGeneratedCoins(
		amount,
		userUid,
		accessToken,
		errorCallback,
		unAuthorizedAccessCallback,
	);
}

export const useGeneratedCoins = (
	userUid: string | null,
	accessToken: string | null,
	onError: (error: string) => void,
	onMissingCredentials: () => void,
	onComplete: () => void,
) => {
	const [newCoins, setCoins] = useState<CoinDTO[]>([]);
	const [amount, setAmount] = useState<number>(0);
	const [newCoinsLoading, setLoading] = useState<boolean>(false);
	useEffect(() => {
		if (amount <= 0) {
			return;
		}
		if (!userUid || !accessToken) {
			onMissingCredentials();
			return;
		} else {
			setLoading(true);
			loadNewCoins(
				amount,
				userUid || "Oopsie",
				accessToken || "Ooopsie",
				onError,
				onMissingCredentials,
			)
				.then((data) => {
					setLoading(false);
					setCoins(data);
					onComplete();
				})
				.catch((err: any) => {
					const message = err?.message || "Failed to generate new coins";
					onError(message);
				});
		}
	}, [amount]);

	return { newCoins, setAmount, newCoinsLoading };
};
