import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";
import { getModule } from "../../module";
import Coin from "@/src/shared/coin";
import Transaction from "@/src/shared/transaction";
import { computeBitSlow } from "@/src/bitslow";
import BitSlow from "@/src/shared/bitslow";
import { randomUUIDv7 } from "bun";

export const CreateNewCoins = async (
	req: Request,
	userUid: string,
): Promise<Response> => {
	console.log("Generating new coins");
	const { coinCount } = await req.json();

	let coinAmount = Number(coinCount);
	if (Number.isNaN(coinAmount) || coinAmount <= 0) {
		console.log("Amount is invalid.");
		console.log(coinAmount);
		console.log(coinCount);
		return new Response(
			JSON.stringify({
				message: "Failed to generate coin. Amount is value",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
	try {
		const coins: CoinDTO[] = [];
		for (let b1 = 1; b1 <= 10 && coinAmount > 0; b1++) {
			for (let b2 = 1; b2 <= 10 && coinAmount > 0; b2++)
				for (let b3 = 1; b3 <= 10 && coinAmount > 0; b3++) {
					const isUsed = await getModule().bitSlowRepo.bitsAlreadyInUse(
						b1,
						b2,
						b3,
					);

					if (!isUsed) {
						const coin = createNewCoinInstance(b1, b2, b3, userUid);
						const transaction = createNewTransaction(coin);
						const bitSlow = createNewBitSlowInstance(coin);

						await getModule().bitSlowRepo.insertCoin(coin);
						await getModule().bitSlowRepo.insertTransaction(transaction);
						await getModule().bitSlowRepo.insertBitSlow(bitSlow);

						const coinDto: CoinDTO = {
							coin_id: coin.coin_id,
							client_id: coin.client_id,
							bit1: coin.bit1,
							bit2: coin.bit2,
							bit3: coin.bit3,
							value: coin.value,
							created_at: coin.created_at,
							bitSlow: bitSlow.computedBitSlow,
						};
						console.log("Coin created : ");
						console.log(coinDto);
						coins.push(coinDto);
						coinAmount--;
					}
				}
		}

		return new Response(
			JSON.stringify({
				coins,
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

const createNewCoinInstance = (
	b1: number,
	b2: number,
	b3: number,
	clientId: string,
): Coin => {
	const coin: Coin = {
		coin_id: Date.now(), // will be set later
		client_id: clientId,
		bit1: b1,
		bit2: b2,
		bit3: b3,
		value: Math.floor(Math.random() * 90_000) + 10_000,
		created_at: Date.now(), // current timestamp in milliseconds
		bitSlow: computeBitSlow(b1, b2, b3),
	};

	return coin;
};

const createNewTransaction = (coin: Coin): Transaction => {
	const transaction: Transaction = {
		id: Date.now(),
		coin_id: coin.coin_id,
		transaction_date: new Date().toISOString(),
		buyer_id: coin.client_id || "Default UID",
		seller_id: "VENDOR",
		amount: coin.value,
		bit1: coin.bit1,
		bit2: coin.bit2,
		bit3: coin.bit3,
	};
	return transaction;
};
const createNewBitSlowInstance = (coin: Coin): BitSlow => {
	const bitSlow: BitSlow = {
		id: Date.now(),
		coinId: coin.coin_id,
		bit1: coin.bit1,
		bit2: coin.bit2,
		bit3: coin.bit3,
		computedBitSlow: coin.bitSlow || "default bitSlow",
	};
	return bitSlow;
};
