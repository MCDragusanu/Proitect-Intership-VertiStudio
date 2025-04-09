import { getModule } from "../module"; // Assuming getModule() provides access to the database
import type BitSlow from "@/src/shared/bitslow";
import type BitSlowDao from "../database/BitSlowDao";
export default class SQLBitSlowDao implements BitSlowDao {
	// Insert a new BitSlow record
	async insertBitSlow(bitslow: BitSlow): Promise<boolean> {
		const stmt = getModule().database.prepare(
			"INSERT INTO bitSlow (id, coin_id, bit1, bit2, bit3, computed_bit_slow) VALUES (?, ?, ?, ?, ?, ?)",
		);
		const info = stmt.run(
			bitslow.id,
			bitslow.coinId,
			bitslow.bit1,
			bitslow.bit2,
			bitslow.bit3,
			bitslow.computedBitSlow,
		);
		return info.changes > 0; // Return true if insert was successful
	}

	// Get BitSlow by coinId
	async getBitSlowByCoinId(coinId: number): Promise<BitSlow | null> {
		const stmt = getModule().database.prepare(
			"SELECT * FROM bitSlow WHERE coin_id = ?",
		);
		const result = stmt.get(coinId);
		return result ? this.mapToBitSlow(result) : null;
	}

	// Get BitSlow by bit1, bit2, and bit3
	async getBitSlowByBits(
		bit1: number,
		bit2: number,
		bit3: number,
	): Promise<BitSlow | null> {
		const stmt = getModule().database.prepare(
			"SELECT * FROM bitSlow WHERE bit1 = ? AND bit2 = ? AND bit3 = ?",
		);
		const result = stmt.get(bit1, bit2, bit3);
		return result ? this.mapToBitSlow(result) : null;
	}

	// Helper function to map database row to BitSlow object
	private mapToBitSlow(row: any): BitSlow {
		return {
			id: Date.now(),
			coinId: row.coin_id,
			bit1: row.bit1,
			bit2: row.bit2,
			bit3: row.bit3,
			computedBitSlow: row.computed_bit_slow,
		};
	}
}
