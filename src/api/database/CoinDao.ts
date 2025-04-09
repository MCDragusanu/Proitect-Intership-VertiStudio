import Coin from "@/src/shared/coin";

interface CoinDao {
	insertCoin(coin: Coin): Promise<boolean>;
	updateCoin(coin: Coin): Promise<boolean>;

	getUserCoins(userUid: string): Promise<Coin[] | null>;
	getFreeCoins(): Promise<Coin[] | null>;
	getCoinById(coinId: number): Promise<Coin | null>;
	getAvailableCoins(): Promise<Coin[] | null>;
	getMonetaryValue(userUid: string): Promise<number | null>;

	bitsAlreadyInUse(bit1: number, bit2: number, bit3: number): Promise<boolean>;
}

export default CoinDao;
