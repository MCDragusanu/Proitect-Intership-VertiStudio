import Coin from "@/src/shared/coin";
import CoinDao from "../database/CoinDao";
import { getModule } from "../module";

export default class SQLiteCoinDao implements CoinDao {
	constructor() {}

	async insertCoin(coin: Coin): Promise<boolean> {
		const stmt = getModule().database.prepare(
			"INSERT INTO coins (coin_id, client_id, bit1, bit2, bit3, value , created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
		);
		const info = stmt.run(
			coin.coin_id,
			coin.client_id,
			coin.bit1,
			coin.bit2,
			coin.bit3,
			coin.value,
			coin.created_at,
		);
		return info.changes > 0;
	}

	async getMonetaryValue(userUid: string): Promise<number | null> {
		const stmt = getModule().database.prepare(
			"SELECT SUM(value) AS monetaryValue FROM coins WHERE client_id = ?",
		);

		const result = stmt.get(userUid) as { monetaryValue: number | null };
		console.log(result);
		console.log(`Retrieved Monetary value of : ${result.monetaryValue} $`);
		return result.monetaryValue || 0;
	}

	async updateCoin(coin: Coin): Promise<boolean> {
		const stmt = getModule().database.prepare(
			"UPDATE coins SET client_id = ?, bit1 = ?, bit2 = ?, bit3 = ?, value = ? WHERE coin_id = ?",
		);
		const info = stmt.run(
			coin.client_id,
			coin.bit1,
			coin.bit2,
			coin.bit3,
			coin.value,
			coin.coin_id,
		);
		return info.changes > 0;
	}

	async getFreeCoins(offset: number, limit: number): Promise<Coin[] | null> {
		try {
			// In SQLite, the parameter order in the execute function must match the order of ? in the SQL
			const stmt = getModule().database.prepare(
				"SELECT * FROM coins WHERE client_id IS NULL OR client_id = '' LIMIT ? OFFSET ?",
			);

			// SQLite expects parameters in the same order as they appear in the query
			// LIMIT comes before OFFSET in your query, so limit should be the first parameter
			const result = stmt.all(limit, offset);

			console.log(
				`Retrieved ${result.length} free coins with offset ${offset} and limit ${limit}`,
			);

			return result.length > 0 ? result.map(this.mapToCoin) : [];
		} catch (error) {
			console.error("Error fetching free coins:", error);
			console.error(
				`Failed with parameters - offset: ${offset}, limit: ${limit}`,
			);
			return [];
		}
	}

	async getUserCoins(
		userUid: string,
		offset: number,
		limit: number,
	): Promise<Coin[]> {
		const stmt = getModule().database.prepare(
			`SELECT c.*, b.computed_bit_slow AS bitSlow 
       FROM coins c
       LEFT JOIN bitSlow b ON c.coin_id = b.coin_id
       WHERE c.client_id = ?
	   LIMIT ? OFFSET ?
	   `,
		);
		const result = stmt.all(userUid, limit, offset);
		console.log(`Retrieved ${result.length} coins`);
		return result.map(this.mapToCoin);
	}
	async getCoinById(coinId: number): Promise<Coin | null> {
		const stmt = getModule().database.prepare(
			"SELECT * FROM coins WHERE coin_id = ?",
		);
		const result = stmt.all(coinId);
		console.log("GetCoinById result : ");
		console.log(result);
		return result.length === 1 ? this.mapToCoin(result[0]) : null;
	}
	async getAvailableCoins(): Promise<Coin[] | null> {
		const stmt = getModule().database.prepare("SELECT * FROM coins");
		const result = stmt.all();
		return result.length > 0 ? result.map(this.mapToCoin) : null;
	}

	async bitsAlreadyInUse(
		bit1: number,
		bit2: number,
		bit3: number,
	): Promise<boolean> {
		const stmt = getModule().database.prepare(
			"SELECT COUNT(*) AS count FROM coins WHERE bit1 = ? AND bit2 = ? AND bit3 = ?",
		);

		// Explicitly cast the result to an expected type
		const result = stmt.get(bit1, bit2, bit3) as { count: number } | undefined;

		if (result === undefined) {
			console.log(`Failed query to check coin usage : ${bit1} ${bit2} ${bit3}`);
			throw new TypeError(
				`Failed query to check coin usage : ${bit1} ${bit2} ${bit3} The result does not contain the count field`,
			);
		}

		return result?.count > 0;
	}

	private mapToCoin(row: any): Coin {
		return {
			coin_id: row.coin_id,
			client_id: row.client_id ?? "",
			value: row.value,
			bit1: row.bit1,
			bit2: row.bit2,
			bit3: row.bit3,
			created_at: new Date(row.created_at).getTime(),
			bitSlow: row.bitSlow,
		};
	}
}
