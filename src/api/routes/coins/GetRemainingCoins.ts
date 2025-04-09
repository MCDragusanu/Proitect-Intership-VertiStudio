import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";
import { getModule } from "../../module";
import Coin from "@/src/shared/coin";
import Transaction from "@/src/shared/transaction";
import { computeBitSlow } from "@/src/bitslow";
import BitSlow from "@/src/shared/bitslow";

export const GetCoinSupply = async (): Promise<Response> => {
	let remainingCoinCount = 0;
	try {
		for (let b1 = 1; b1 <= 10; b1++)
			for (let b2 = 1; b2 <= 10; b2++)
				for (let b3 = 1; b3 <= 10; b3++) {
					const isUsed = await getModule().bitSlowRepo.bitsAlreadyInUse(
						b1,
						b2,
						b3,
					);
					if (!isUsed) {
						remainingCoinCount++;
					}
				}

		console.log("Coin Supply Remaining : " + remainingCoinCount);
		return new Response(
			JSON.stringify({
				coinSupply: remainingCoinCount,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (err: any) {
		console.log(err);
		return new Response(
			JSON.stringify({
				message: "Failed to generate coin. Unknown error occurred.",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
