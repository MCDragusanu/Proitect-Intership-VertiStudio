import { getModule } from "../../module";
import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";
import { computeBitSlow } from "@/src/bitslow";
export const GetCoinById = async (coinId: number): Promise<any> => {
	try {
		console.log("Begin Retriving coin");
		// Fetch the coin by coin_id from the repository
		const rawCoin = await getModule().bitSlowRepo.getCoinById(coinId);

		if (!rawCoin) {
			return new Response(JSON.stringify({ message: "Coin not found" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}

		// Fetch BitSlow information based on coin_id
		const bitSlowEntity = await getModule().bitSlowRepo.getBitSlowByCoinId(
			rawCoin.coin_id,
		);

		let bitSlow;
		if (!bitSlowEntity) {
			bitSlow = computeBitSlow(rawCoin.bit1, rawCoin.bit2, rawCoin.bit3);
		} else {
			bitSlow = bitSlowEntity.computedBitSlow;
		}

		// Create and return the coin DTO
		const coin: CoinDTO = {
			...rawCoin,
			bitSlow: bitSlow,
		};

		// Return the coin data
		return new Response(JSON.stringify(coin), {
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
