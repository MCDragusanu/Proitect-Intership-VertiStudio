import { getModule } from "../../module";
import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";
import { computeBitSlow } from "@/src/bitslow";
import Transaction from "@/src/shared/transaction";
export const CreateTransaction = async (
	req: Request,
	buyer_id: string,
): Promise<any> => {
	try {
		console.log("Begin Creating new Transaction");
		// Fetch the coin by coin_id from the repository
		const { coinId } = await req.json();
		const coinIdValue = Number(coinId);
		if (!coinId || Number.isNaN(coinId)) {
			console.log("No coinId field found or is malformed: " + coinId);
			return new Response(
				JSON.stringify({ message: "CoinId field invalid or not found" }),
				{
					status: 404,
					headers: { "Content-Type": "application/json" },
				},
			);
		}
		const coin = await getModule().bitSlowRepo.getCoinById(coinIdValue);
		if (!coin) {
			console.log("No coin found");
			console.log(coin);
			return new Response(JSON.stringify({ message: "Coin not found!" }), {
				status: 405,
				headers: { "Content-Type": "application/json" },
			});
		}
		if (coin.client_id !== "") {
			console.log("Coin is alreadyd owned : " + coin.client_id);
			return new Response(
				JSON.stringify({ message: "Coin is already owned by somebody else" }),
				{
					status: 406,
					headers: { "Content-Type": "application/json" },
				},
			);
		}
		const transaction: Transaction = {
			id: Date.now(),
			coin_id: coin.coin_id,
			amount: coin.value,
			buyer_id: buyer_id,
			seller_id: "VENDOR",
			bit1: coin.bit1,
			bit2: coin.bit2,
			bit3: coin.bit3,
			transaction_date: new Date().toISOString(),
		};

		const result1 = await getModule().bitSlowRepo.updateCoin({
			...coin,
			client_id: buyer_id,
		});

		const result2 =
			await getModule().bitSlowRepo.insertTransaction(transaction);

		if (!result1 || !result2) {
			console.log(`Failed one of the transaction ${result1} ,${result2}`);
			//revert to prev state
			if (result1) {
				await getModule().bitSlowRepo.updateCoin(coin);
			}
			if (result2) {
				await getModule().bitSlowRepo.deleteTransaction(transaction);
			}
			return new Response(
				JSON.stringify({ message: "Changes cound't be saved" }),
				{
					status: 407,
					headers: { "Content-Type": "application/json" },
				},
			);
		}
		const updatedCoin = await getModule().bitSlowRepo.getCoinById(coinIdValue);
		console.log("Coin has been purchased!");
		console.log("Bought coin : ");
		console.log(updatedCoin);
		// Return the result
		return new Response(JSON.stringify({}), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err: any) {
		console.error("Error fetching coin by ID:", err);

		// Return an error response if something goes wrong
		return new Response(
			JSON.stringify({
				message: "Failed to fetch coin by ID. Please try again later.",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
