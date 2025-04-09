import BitSlowRepository from "../database/BitSlowRepository";
import BitSlow from "../../shared/bitslow";
import Coin from "../../shared/coin";
import Transaction from "../../shared/transaction";
import SQLiteBitSlowDao from "./BitSlowDaoImpl";
import SQLiteCoinDao from "./CoinDaoImpl";
import SQLiteTransactionDao from "./TransactionDaoImpl";

export class SQLiteBitSlowRepository implements BitSlowRepository {
	constructor(
		private bitSlowDao: SQLiteBitSlowDao,
		private coinDao: SQLiteCoinDao,
		private transactionDao: SQLiteTransactionDao,
	) {}

	// BitSlowDao
	async insertBitSlow(bitslow: BitSlow): Promise<boolean> {
		try {
			console.log("Inserting BitSlow:", bitslow);
			return await this.bitSlowDao.insertBitSlow(bitslow);
		} catch (error) {
			console.error("Error inserting BitSlow:", error);
			return false;
		}
	}
	async getCoinById(coinId: number): Promise<Coin | null> {
		try {
			return (await this.coinDao.getCoinById(coinId)) || null;
		} catch (error) {
			console.error("Error getting BitSlow by Coin ID:", error);
			return null;
		}
	}
	async getBitSlowByCoinId(coinId: number): Promise<BitSlow | null> {
		try {
			return await this.bitSlowDao.getBitSlowByCoinId(coinId);
		} catch (error) {
			console.error("Error getting BitSlow by Coin ID:", error);
			return null;
		}
	}

	async getBitSlowByBits(
		bit1: number,
		bit2: number,
		bit3: number,
	): Promise<BitSlow | null> {
		try {
			return await this.bitSlowDao.getBitSlowByBits(bit1, bit2, bit3);
		} catch (error) {
			console.error("Error getting BitSlow by bits:", error);
			return null;
		}
	}

	// CoinDao
	async insertCoin(coin: Coin): Promise<boolean> {
		try {
			console.log("Inserting Coin:", coin);
			return await this.coinDao.insertCoin(coin);
		} catch (error) {
			console.error("Error inserting Coin:", error);
			return false;
		}
	}

	async updateCoin(coin: Coin): Promise<boolean> {
		try {
			console.log("Updating Coin:", coin);
			return await this.coinDao.updateCoin(coin);
		} catch (error) {
			console.error("Error updating Coin:", error);
			return false;
		}
	}

	async getUserCoins(
		userUid: string,
		offset: number,
		limit: number,
	): Promise<Coin[] | null> {
		try {
			console.log("Getting user coins for:", userUid);
			return await this.coinDao.getUserCoins(userUid, offset, limit);
		} catch (error) {
			console.error("Error getting user coins:", error);
			return null;
		}
	}

	async getFreeCoins(offset: number, limit: number): Promise<Coin[] | null> {
		try {
			console.log("Getting free coins");
			return await this.coinDao.getFreeCoins(offset, limit);
		} catch (error) {
			console.error("Error getting free coins:", error);
			return null;
		}
	}
	async deleteTransaction(transaction: Transaction): Promise<boolean> {
		try {
			console.log("Deleting transaction");
			return await this.transactionDao.deleteTransaction(transaction);
		} catch (error) {
			console.error("Error delleting transaction:", error);
			return false;
		}
	}
	async getMonetaryValue(userUid: string): Promise<number | null> {
		try {
			console.log("Getting monetary value for:", userUid);
			return await this.coinDao.getMonetaryValue(userUid);
		} catch (error) {
			console.error("Error getting monetary value:", error);
			return null;
		}
	}
	async getUserCoinCount(userUid: string): Promise<number> {
		try {
			return await this.coinDao.getUserCoinCount(userUid);
		} catch (error) {
			console.error("Error checking coin count usage:", error);
			return -1;
		}
	}
	async bitsAlreadyInUse(
		bit1: number,
		bit2: number,
		bit3: number,
	): Promise<boolean> {
		try {
			return await this.coinDao.bitsAlreadyInUse(bit1, bit2, bit3);
		} catch (error) {
			console.error("Error checking bits usage:", error);
			return false;
		}
	}

	// TransactionDao
	async insertTransaction(transaction: Transaction): Promise<boolean> {
		try {
			console.log("Inserting transaction:", transaction);
			return await this.transactionDao.insertTransaction(transaction);
		} catch (error) {
			console.error("Error inserting transaction:", error);
			return false;
		}
	}

	async updateTransaction(transaction: Transaction): Promise<boolean> {
		try {
			console.log("Updating transaction:", transaction);
			return await this.transactionDao.updateTransaction(transaction);
		} catch (error) {
			console.error("Error updating transaction:", error);
			return false;
		}
	}

	async getCoinHistory(coinUid: number): Promise<Transaction[] | null> {
		try {
			console.log("Getting coin history for:", coinUid);
			return await this.transactionDao.getCoinHistory(coinUid);
		} catch (error) {
			console.error("Error getting coin history:", error);
			return null;
		}
	}

	async getTransactionByUid(id: number): Promise<Transaction | null> {
		try {
			console.log("Getting transaction by UID:", id);
			return await this.transactionDao.getTransactionByUid(id);
		} catch (error) {
			console.error("Error getting transaction by UID:", error);
			return null;
		}
	}

	async getUserTransactions(userUid: string): Promise<Transaction[] | null> {
		try {
			console.log("Getting user transactions for:", userUid);
			return await this.transactionDao.getUserTransactions(userUid);
		} catch (error) {
			console.error("Error getting user transactions:", error);
			return null;
		}
	}

	async getAllTransactions(): Promise<Transaction[]> {
		try {
			console.log("Getting all transactions");
			return await this.transactionDao.getAllTransactions();
		} catch (error) {
			console.error("Error getting transactions by buyer name:", error);
			return [];
		}
	}
	async getTransactionsByBuyerName(
		name: string,
	): Promise<Transaction[] | null> {
		try {
			console.log("Getting transactions by buyer name:", name);
			return await this.transactionDao.getTransactionsByBuyerName(name);
		} catch (error) {
			console.error("Error getting transactions by buyer name:", error);
			return null;
		}
	}

	async getTransactionsBySellerName(
		name: string,
	): Promise<Transaction[] | null> {
		try {
			console.log("Getting transactions by seller name:", name);
			return await this.transactionDao.getTransactionsBySellerName(name);
		} catch (error) {
			console.error("Error getting transactions by seller name:", error);
			return null;
		}
	}
	async getUsersTransactionCount(userUid: string): Promise<number> {
		try {
			console.log("Getting transactions by sellerUid:", userUid);
			return await this.transactionDao.getUsersTransactionCount(userUid);
		} catch (error) {
			console.error("Error getting transactions by seller name:", error);
			return -1;
		}
	}
}
