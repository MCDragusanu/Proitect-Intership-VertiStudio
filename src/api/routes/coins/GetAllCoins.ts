import { computeBitSlow } from "@/src/bitslow";
import { getModule } from "../../module";
import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";
import BitSlow from "@/src/shared/bitslow";

export const GetAvailableCoins = async (): Promise<any> => {
	try {
		// Fetch all coins from the repository
		const coinDatabase = await getModule().bitSlowRepo.getAvailableCoins();

		if (coinDatabase.length === 0) {
			return new Response(JSON.stringify([]), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		}

		// Process all coins in parallel
		const coinsWithBitSlow = await Promise.all(
			coinDatabase.map(async (rawCoin) => {
				// Get BitSlow entity for this coin
				const bitSlowEntity = await getModule().bitSlowRepo.getBitSlowByCoinId(
					rawCoin.coin_id,
				);

				let bitSlow;
				if (!bitSlowEntity) {
					// Compute and store new BitSlow
					bitSlow = computeBitSlow(rawCoin.bit1, rawCoin.bit2, rawCoin.bit3);

					const newBitSlow: BitSlow = {
						id: Date.now(),
						coinId: rawCoin.coin_id,
						bit1: rawCoin.bit1,
						bit2: rawCoin.bit2,
						bit3: rawCoin.bit3,
						computedBitSlow: bitSlow,
					};

					// Save for future use
					await getModule().bitSlowRepo.insertBitSlow(newBitSlow);
				} else {
					bitSlow = bitSlowEntity.computedBitSlow;
				}

				// Return the complete coin DTO
				return {
					...rawCoin,
					bitSlow: bitSlow,
					contract_id: Number(rawCoin.coin_id),
				} as CoinDTO;
			}),
		);

		console.log(`All Coins: Retrieved ${coinsWithBitSlow.length} coins`);

		// Return the complete list of coins
		return new Response(JSON.stringify(coinsWithBitSlow), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err: any) {
		console.error("Error fetching all coins:", err);

		// Return an error response
		return new Response(
			JSON.stringify({
				message: "Failed to fetch coins. Please try again later.",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
