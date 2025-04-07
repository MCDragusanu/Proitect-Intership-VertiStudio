import Coin from "@/src/shared/coin";
import CoinDao from "../database/CoinDao";
import { getModule } from "../module";

export default class SQLiteCoinDao implements CoinDao {
  constructor() {}

 

  async insertCoin(coin: Coin): Promise<boolean> {
    const stmt = getModule().database.prepare(
      "INSERT INTO coins (user_uid, bit1, bit2, bit3, value) VALUES (?, ?, ?, ?, ?)"
    );
    const info = stmt.run(
      coin.client_id,
      coin.bit1,
      coin.bit2,
      coin.bit3,
      coin.value
    );
    return info.changes > 0;
  }

  async getMonetaryValue(userUid: string): Promise<number | null> {
    const stmt = getModule().database.prepare(
      "SELECT SUM(value) AS monetaryValue FROM coins WHERE client_id = ?"
    );
    
    const result = stmt.get(userUid) as { monetaryValue: number | null };
    console.log(result)
    console.log(`Retrieved Monetary value of : ${result.monetaryValue} $`)
    return result.monetaryValue  || 0;
  }

  async updateCoin(coin: Coin): Promise<boolean> {
    const stmt = getModule().database.prepare(
      "UPDATE coins SET client_id = ?, bit1 = ?, bit2 = ?, bit3 = ?, value = ? WHERE coin_id = ?"
    );
    const info = stmt.run(
      coin.client_id,
      coin.bit1,
      coin.bit2,
      coin.bit3,
      coin.value,
      coin.coin_id
    );
    return info.changes > 0;
  }

  async getFreeCoins(): Promise<Coin[] | null> {
    const stmt = getModule().database.prepare(
      "SELECT * FROM coins WHERE client_id IS FREE"
    );
    const result = stmt.all();
    return result.length > 0 ? result.map(this.mapToCoin) : null;
  }

  async getUserCoins(userUid: string): Promise<Coin[]> {
    const stmt = getModule().database.prepare(
      `SELECT c.*, b.computed_bit_slow AS bitSlow 
       FROM coins c
       LEFT JOIN bitSlow b ON c.coin_id = b.coin_id
       WHERE c.client_id = ?`
    );
    const result = stmt.all(userUid);
    console.log(`Retrieved ${result.length} coins`)
    return result.map(this.mapToCoin);
  }

  async bitsAlreadyInUse(
    bit1: number,
    bit2: number,
    bit3: number
  ): Promise<boolean> {
    const stmt = getModule().database.prepare(
      "SELECT COUNT(*) AS count FROM coins WHERE bit1 = ? AND bit2 = ? AND bit3 = ?"
    );

    // Explicitly cast the result to an expected type
    const result = stmt.get(bit1, bit2, bit3) as { count: number } | undefined;

    if (result === undefined) {
      console.log(`Failed query to check coin usage : ${bit1} ${bit2} ${bit3}`);
      throw new TypeError(
        `Failed query to check coin usage : ${bit1} ${bit2} ${bit3} The result does not contain the count field`
      );
    }

    return result?.count > 0;
  }

  private mapToCoin(row: any): Coin {
    return {
      coin_id: row.coin_id.toString(),
      client_id: row.client_id ?? "",
      value: row.value,
      bit1: row.bit1,
      bit2: row.bit2,
      bit3: row.bit3,
      created_at: new Date(row.created_at).getTime(),
      bitSlow : row.bitSlow,
    };
  }
}
