import Transaction from "@/src/shared/transaction";
import TransactionDao from "../database/TransactionDao";
import { getModule } from "../module";
import { tr } from "@faker-js/faker";

export default class SQLiteTransactionDao implements TransactionDao {
  constructor() {}

  

  async insertTransaction(transaction: Transaction): Promise<boolean> {
    const stmt = getModule().database.prepare(
      "INSERT INTO transactions (coin_id, amount, seller_id, buyer_id, bit1, bit2, bit3,) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    const info = stmt.run(
      transaction.coin_id,
      transaction.amount,
      transaction.seller_id,
      transaction.buyer_id,
      transaction.bit1,
      transaction.bit2,
      transaction.bit3,
    );
    return info.changes > 0;
  }

  async getTransactionByUid(id: number): Promise<Transaction | null> {
    const stmt = getModule().database.prepare(
      "SELECT * FROM transactions WHERE id = ?"
    );
    const result = stmt.get(id);
    return result ? this.mapToTransaction(result) : null;
  }

  async getCoinHistory(coinUid: number): Promise<Transaction[] | null> {
    const stmt = getModule().database.prepare(
      "SELECT * FROM transactions WHERE coin_id = ? ORDER by transaction_date ASC"
    );
    const result = stmt.all(coinUid);
    return result.length > 0 ? result.map(this.mapToTransaction) : null;
  }

  async getUserTransactions(userUid: string): Promise<Transaction[] | null> {
    const stmt = getModule().database.prepare(
      "SELECT * FROM transactions WHERE buyer_id = ? OR seller_id = ?"
    );
    const result = stmt.all(userUid, userUid);
    return result.length > 0 ? result.map(this.mapToTransaction) : null;
  }

  async updateTransaction(transaction: Transaction): Promise<boolean> {
    const stmt = getModule().database.prepare(
      "UPDATE transactions SET coin_id = ?, amount = ?, seller_id = ?, buyer_id = ?, bit1 = ?, bit2 = ?, bit3 = ?,  WHERE id = ?"
    );
    const info = stmt.run(
      transaction.coin_id,
      transaction.amount,
      transaction.seller_id,
      transaction.buyer_id,
      transaction.bit1,
      transaction.bit2,
      transaction.bit3,
      transaction.id
    );
    return info.changes > 0;
  }

  private mapToTransaction(row: any): Transaction {
    return {
      id: row.id,
      coin_id: row.coin_id,
      amount: row.amount,
      transaction_date: row.transaction_date,
      seller_id: row.seller_id,
      buyer_id: row.buyer_id,
      bit1: row.bit1,
      bit2: row.bit2,
      bit3: row.bit3,
    
    };
  }

  // Get transactions by buyer name
  async getTransactionsByBuyerName(
    name: string
  ): Promise<Transaction[] | null> {
    const stmt = getModule().database.prepare(`
            SELECT t.* 
            FROM transactions t
            JOIN user_profiles u ON t.buyer_id = u.user_uid
            WHERE u.name = ?`);
    const result = stmt.all(name);
    return result.length > 0 ? result.map(this.mapToTransaction) : null;
  }

  // Get transactions by seller name
  async getTransactionsBySellerName(
    name: string
  ): Promise<Transaction[] | null> {
    const stmt = getModule().database.prepare(`
            SELECT t.* 
            FROM transactions t
            JOIN user_profiles u ON t.seller_id = u.user_uid
            WHERE u.name = ?`);
    const result = stmt.all(name);
    return result.length > 0 ? result.map(this.mapToTransaction) : null;
  }
 
}
