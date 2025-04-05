import Coin from "@/src/shared/coin";
import CoinDao from "../database/CoinDao";
import { getModule } from "../module";

export default class SQLiteCoinDao implements CoinDao {
  constructor() {}

  createSource(): void {
    getModule().database.exec(`CREATE TABLE IF NOT EXISTS coins (
      coin_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_uid CHAR(256),
      bit1 INTEGER NOT NULL,
      bit2 INTEGER NOT NULL,
      bit3 INTEGER NOT NULL,
      value REAL NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_uid) REFERENCES users (uid)
    );`);
  }

  clearSource(): void {
    getModule().database.exec("DELETE FROM coins");
  }

  deleteSource(): void {
    getModule().database.exec("DROP TABLE IF EXISTS coins");
  }

  checkSource(): Boolean {
    const result = getModule()
      .database.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='coins'"
      )
      .get();
    return result !== undefined;
  }

  async insertCoin(coin: Coin): Promise<Boolean> {
    const stmt = getModule().database.prepare(
      "INSERT INTO coins (user_uid, bit1, bit2, bit3, value) VALUES (?, ?, ?, ?, ?)"
    );
    const info = stmt.run(
      coin.user_uid,
      coin.bit1,
      coin.bit2,
      coin.bit3,
      coin.value
    );
    return info.changes > 0;
  }

  async updateCoin(coin: Coin): Promise<Boolean> {
    const stmt = getModule().database.prepare(
      "UPDATE coins SET user_uid = ?, bit1 = ?, bit2 = ?, bit3 = ?, value = ? WHERE coin_id = ?"
    );
    const info = stmt.run(
      coin.user_uid,
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
      "SELECT * FROM coins WHERE user_uid IS FREE"
    );
    const result = stmt.all();
    return result.length > 0 ? result.map(this.mapToCoin) : null;
  }

  async getUserCoins(userUid: string): Promise<Coin[]> {
    const stmt = getModule().database.prepare(
      "SELECT * FROM coins WHERE user_uid = ?"
    );
    const result = stmt.all(userUid);
    return result.map(this.mapToCoin);
  }

  async bitsAlreadyInUse(
    bit1: number,
    bit2: number,
    bit3: number
  ): Promise<Boolean> {
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
      user_uid: row.user_uid ?? "",
      value: row.value,
      bit1: row.bit1,
      bit2: row.bit2,
      bit3: row.bit3,
      created_at: new Date(row.created_at).getTime(),
    };
  }
}
