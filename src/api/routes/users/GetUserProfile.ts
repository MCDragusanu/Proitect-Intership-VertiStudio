import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";
import { getModule } from "../../module";
import { computeBitSlow } from "@/src/bitslow";
import BitSlow from "@/src/shared/bitslow";
export const getUserInformation = async (
	req: Request,
	userUid: string,
	offset: number,
	limit: number,
): Promise<Response> => {
	try {
		const maxLimit = 30;
		const safeLimit = Math.max(limit, 30);
		const startIndex = (offset - 1) * safeLimit;

		// Fetch coins related to the user
		const coins = await getModule().bitSlowRepo.getUserCoins(
			userUid,
			startIndex,
			safeLimit,
		);

		// Fetch monetary value related to the user
		const monetaryValue =
			await getModule().bitSlowRepo.getMonetaryValue(userUid);

		// Fetch user profile details based on the userUid
		const userProfile =
			await getModule().userRepository.getProfileByUid(userUid);
		const totalTransactions =
			await getModule().bitSlowRepo.getUsersTransactionCount(userUid);

		if (
			coins === null ||
			coins === undefined ||
			monetaryValue === null ||
			monetaryValue === undefined ||
			userProfile === null ||
			userProfile === undefined
		) {
			console.log("Information is incomplete!");
			return new Response("User information not found or incomplete", {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}

		const processedCoins: CoinDTO[] = [];
		for (const rawCoin of coins) {
			let computedBitSlow: string | null = null;
			//check to see if it already in the database
			const preComputedBitSlow =
				await getModule().bitSlowRepo.getBitSlowByCoinId(rawCoin.coin_id);

			//if it has been chached already
			if (preComputedBitSlow) {
				computedBitSlow = preComputedBitSlow.computedBitSlow;
			} else {
				console.log("Will compute bitslow");
				// compute it for the first time
				computedBitSlow = computeBitSlow(
					rawCoin.bit1,
					rawCoin.bit2,
					rawCoin.bit3,
				);
				//create a new record
				const newBitSlow: BitSlow = {
					id: Date.now(),
					coinId: rawCoin.coin_id,
					bit1: rawCoin.bit1,
					bit2: rawCoin.bit2,
					bit3: rawCoin.bit3,
					computedBitSlow: computedBitSlow,
				};
				//save it for later
				await getModule().bitSlowRepo.insertBitSlow(newBitSlow);
			}
			const processedCoin: CoinDTO = {
				...rawCoin,
				bitSlow: computedBitSlow,
			};
			processedCoins.push(processedCoin);
		}
		// Combining all the fetched data into a single response object

		const userInformation = {
			profile: userProfile,
			ownedCoins: processedCoins,
			monetaryValue: monetaryValue,
			totalTransactionCount: totalTransactions,
		};

		// Return the combined user information
		return new Response(JSON.stringify(userInformation), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (err) {
		console.error("Error fetching user information:", err);
		return new Response(
			"Failed to fetch user information. Please try again later.",
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
