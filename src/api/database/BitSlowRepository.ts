import BitSlow from "../../shared/bitslow";
import Coin from "../../shared/coin";
import Transaction from "../../shared/transaction";

export default interface BitSlowRepository {
	// BitSlowDao
	insertBitSlow(bitslow: BitSlow): Promise<boolean>;
	getBitSlowByCoinId(coinId: number): Promise<BitSlow | null>;
	getBitSlowByBits(
		bit1: number,
		bit2: number,
		bit3: number,
	): Promise<BitSlow | null>;
	deleteTransaction(transaction: Transaction): Promise<boolean>;
	insertCoin(coin: Coin): Promise<boolean>;
	updateCoin(coin: Coin): Promise<boolean>;
	getCoinById(coinId: number): Promise<Coin | null>;
	getUserCoins(
		userUid: string,
		offset: number,
		limit: number,
	): Promise<Coin[] | null>;
	getFreeCoins(offset: number, limit: number): Promise<Coin[] | null>;
	getMonetaryValue(userUid: string): Promise<number | null>;
	bitsAlreadyInUse(bit1: number, bit2: number, bit3: number): Promise<boolean>;
	getAllTransactions(): Promise<Transaction[]>;

	insertTransaction(transaction: Transaction): Promise<boolean>;
	updateTransaction(transaction: Transaction): Promise<boolean>;

	getCoinHistory(coinUid: number): Promise<Transaction[] | null>;
	getTransactionByUid(id: number): Promise<Transaction | null>;
	getUserTransactions(userUid: string): Promise<Transaction[] | null>;
	getUsersTransactionCount(userUid: string): Promise<number>;
}
