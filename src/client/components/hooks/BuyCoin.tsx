import { useState, useEffect } from "react";
import { fetchGeneratedCoins } from "../../requrests/GenerateNewCoins";
import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";
import { buyNewCoin } from "../../requrests/BuyBitslow";

// Updated to accept and pass all error handling callbacks
function processTransaction(
	coinId: number,
	userUid: string,
	accessToken: string,
	errorCallback: (message: string) => void,
	unAuthorizedAccessCallback: () => void,
	onCoinNotFound: () => void,
	onCoinAlreadyOwned: () => void,
	onTransactionFailed: () => void
): Promise<void> {
	return buyNewCoin(
		coinId,
		userUid,
		accessToken,
		errorCallback,
		unAuthorizedAccessCallback,
		onCoinNotFound,
		onCoinAlreadyOwned,
		onTransactionFailed
	);
}

export const useBuyNewCoin = (
	userUid: string | null,
	accessToken: string | null,
	onError: (error: string) => void,
	onMissingCredentials: () => void,
	onComplete: () => void,
	onCoinNotFound: () => void,
	onCoinAlreadyOwned: () => void,
	onTransactionFailed: () => void
) => {
	const [coinToBuy, setCoinToBuy] = useState<CoinDTO | null>(null);
	const [isSubmitted, setSubmission] = useState(false);

	useEffect(() => {
		if (!coinToBuy) return;

		if (!userUid || !accessToken) {
			onMissingCredentials();
			return;
		} else if (isSubmitted) {
			processTransaction(
				coinToBuy.coin_id,
				userUid || "Oopsie",
				accessToken || "Ooopsie",
				onError,
				onMissingCredentials,
				onCoinNotFound,
				onCoinAlreadyOwned,
				onTransactionFailed
			)
				.then(() => {
					onComplete();
					setCoinToBuy(null);
				})
				.catch((err: any) => {
					const message = err?.message || "Failed to generate new coins";
					onError(message);
				});
		}
	}, [coinToBuy, accessToken, isSubmitted, userUid]);

	return { coinToBuy, setCoinToBuy, setSubmission };
};
