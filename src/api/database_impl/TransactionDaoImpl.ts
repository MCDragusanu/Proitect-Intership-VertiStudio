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

  async getCoinHistory(coinUid: string): Promise<Transaction[] | null> {
    const stmt = getModule().database.prepare(
      "SELECT * FROM transactions WHERE bitSlow = ?"
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
 // Get transactions by seller name
 async getAllTransactions(
    
  ): Promise<Transaction[]> {
    const stmt = getModule().database.prepare(`
            SELECT t.* 
            FROM transactions t`);
    const result = stmt.all();
    return result.length > 0 ? result.map(this.mapToTransaction) : [];
  }
  // Get transactions by both buyer and seller names
  async getTransactionsByBuyerAndSellerName(
    buyerName: string,
    sellerName: string
  ): Promise<Transaction[] | null> {
    const stmt = getModule().database.prepare(`
            SELECT t.* 
            FROM transactions t
            JOIN user_profiles u_buyer ON t.buyer_id = u_buyer.user_uid
            JOIN user_profiles u_seller ON t.seller_id = u_seller.user_uid
            WHERE u_buyer.name = ? AND u_seller.name = ?`);
    const result = stmt.all(buyerName, sellerName);
    return result.length > 0 ? result.map(this.mapToTransaction) : null;
  }

  // Get transactions before a certain date
  async getTransactionsBeforeDate(date: Date): Promise<Transaction[] | null> {
    const stmt = getModule().database.prepare(`
        SELECT * FROM transactions 
        WHERE transaction_date < date(?)`); // Use date() to format the date correctly
    const result = stmt.all(date.toISOString()); // Convert to YYYY-MM-DD HH:MM:SS
    return result.length > 0 ? result.map(this.mapToTransaction) : null;
  }

  // Get transactions after a certain date
  async getTransactionsAfterDate(date: Date): Promise<Transaction[] | null> {
    const stmt = getModule().database.prepare(`
        SELECT * FROM transactions 
        WHERE transaction_date > date(?)`); // Use date() to format the date correctly
    const result = stmt.all(date.toISOString()); // Convert to YYYY-MM-DD HH:MM:SS
    return result.length > 0 ? result.map(this.mapToTransaction) : null;
  }

  // Get transactions within a date range
  async getTransactionsInDateRange(
    after: Date,
    before: Date
  ): Promise<Transaction[] | null> {
    const stmt = getModule().database.prepare(`
        SELECT * FROM transactions 
        WHERE transaction_date BETWEEN date(?) AND date(?)`); 
    const result = stmt.all(
      after.toISOString(), 
      before.toISOString()
    );
    return result.length > 0 ? result.map(this.mapToTransaction) : null;
  }

  // Get transactions with a amount less than a given value
  async getTransactionsLessThanBitSlow(
    value: number
  ): Promise<Transaction[] | null> {
    const stmt = getModule().database.prepare(`
            SELECT * FROM transactions 
            WHERE amount < ?`);
    const result = stmt.all(value);
    return result.length > 0 ? result.map(this.mapToTransaction) : null;
  }

  // Get transactions with a amount more than a given value
  async getTransactionsMoreThanBitSlow(
    value: number
  ): Promise<Transaction[] | null> {
    const stmt = getModule().database.prepare(`
            SELECT * FROM transactions 
            WHERE amount > ?`);
    const result = stmt.all(value);
    return result.length > 0 ? result.map(this.mapToTransaction) : null;
  }

  // Get transactions within a amount range (inclusive)
  async getTransactionsInBitSlowRange(
    lowerBound: number,
    upperBoundInclusive: number
  ): Promise<Transaction[] | null> {
    const stmt = getModule().database.prepare(`
            SELECT * FROM transactions 
            WHERE amount BETWEEN ? AND ?`);
    const result = stmt.all(lowerBound, upperBoundInclusive);
    return result.length > 0 ? result.map(this.mapToTransaction) : null;
  }
}
