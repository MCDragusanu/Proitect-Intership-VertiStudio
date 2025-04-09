const ENDPOINT_URL = "http://localhost:3000/api/coins/buy";
import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";

export async function buyNewCoin(
	coinId: number,
	userUid: string,
	accessToken: string,
	onError: (message: string) => void,
	onUnAuthorizedRequest: () => void,
	onCoinNotFound: () => void,
	onCoinAlreadyOwned: () => void,
	onTransactionFailed: () => void
): Promise<void> {
	try {
		console.log("Sending token : ");
		console.log(accessToken);
        console.log("CoinId :  " + coinId )
		const headers: Headers = new Headers();
		headers.set("Authorization", `Bearer ${accessToken}`);
		headers.set("Content-Type", "application/json");
		headers.set("Accept", "application/json");

		const body = JSON.stringify({ coinId: coinId });

		const response = await fetch(`${ENDPOINT_URL}/${userUid}`, {
			method: "POST",
			headers: headers,
			body: body,
		});

		if (response.ok) {
			const data = await response.json();
			console.log("A new coin has been bought ");
		} else if (response.status === 404) {
			// Malformed request / Unauthorized
			console.log("Unauthorized request");
			onUnAuthorizedRequest();
		} else if (response.status === 405) {
			// Coin not found
			console.log("Coin not found");
			onCoinNotFound();
		} else if (response.status === 406) {
			// Coin already owned
			console.log("Coin already owned");
			onCoinAlreadyOwned();
		} else if (response.status === 407) {
			// Failed to save transaction
			console.log("Failed to save transaction");
			onTransactionFailed();
		} else {
			onError(`Failed to fetch: ${response.status} ${response.statusText}`);
		}
	} catch (error: any) {
		console.error("Fetch error:", error);
		onError(error?.message || "An unexpected error occurred.");
	}
}
