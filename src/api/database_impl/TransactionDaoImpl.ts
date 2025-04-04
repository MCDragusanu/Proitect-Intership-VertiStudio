import Transaction from "@/shared/transaction";
import TransactionDao from "../database/TransactionDao";
import { getModule } from "../module";

export default class SQLiteTransactionDao implements TransactionDao {
    constructor() {}

    createSource(): void {
        getModule().database.exec(`CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            coin_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            transaction_date TEXT DEFAULT CURRENT_TIMESTAMP,
            seller_id TEXT,
            seller_name TEXT,
            buyer_id TEXT NOT NULL,
            buyer_name TEXT NOT NULL,
            value REAL NOT NULL,
            computedBitSlow TEXT NOT NULL,
            FOREIGN KEY (coin_id) REFERENCES coins(coin_id)
        );`);
    }

    deleteSource(): void {
        getModule().database.exec("DROP TABLE IF EXISTS transactions");
    }

    clearSource(): void {
        getModule().database.exec("DELETE FROM transactions");
    }

    checkSource(): Boolean {
        const result = getModule().database.prepare(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='transactions'"
        ).get();
        return result !== undefined;
    }

    async insertTransaction(transaction: Transaction): Promise<Boolean> {
        const stmt = getModule().database.prepare(
            "INSERT INTO transactions (coin_id, amount, seller_id, seller_name, buyer_id, buyer_name, bit1, bit2, bit3, value, computedBitSlow) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        const info = stmt.run(
            transaction.coin_id,
            transaction.amount,
            transaction.seller_id,
            transaction.seller_name,
            transaction.buyer_id,
            transaction.buyer_name,
            transaction.bit1,
            transaction.bit2,
            transaction.bit3,
            transaction.value,
            transaction.computedBitSlow
        );
        return info.changes > 0;
    }

    async getTransactionByUid(id: number): Promise<Transaction | null> {
        const stmt = getModule().database.prepare("SELECT * FROM transactions WHERE id = ?");
        const result = stmt.get(id);
        return result ? this.mapToTransaction(result) : null;
    }

    async getCoinHistory(coinUid: string): Promise<Transaction[] | null> {
        const stmt = getModule().database.prepare("SELECT * FROM transactions WHERE bitSlow = ?");
        const result = stmt.all(coinUid);
        return result.length > 0 ? result.map(this.mapToTransaction) : null;
    }

    async getUserTransactions(userUid: string): Promise<Transaction[] | null> {
        const stmt = getModule().database.prepare("SELECT * FROM transactions WHERE buyer_id = ? OR seller_id = ?");
        const result = stmt.all(userUid, userUid);
        return result.length > 0 ? result.map(this.mapToTransaction) : null;
    }

    async updateTransaction(transaction: Transaction): Promise<Boolean> {
        const stmt = getModule().database.prepare(
            "UPDATE transactions SET coin_id = ?, amount = ?, seller_id = ?, seller_name = ?, buyer_id = ?, buyer_name = ?, bit1 = ?, bit2 = ?, bit3 = ?, value = ?, computedBitSlow = ? WHERE id = ?"
        );
        const info = stmt.run(
            transaction.coin_id,
            transaction.amount,
            transaction.seller_id,
            transaction.seller_name,
            transaction.buyer_id,
            transaction.buyer_name,
            transaction.bit1,
            transaction.bit2,
            transaction.bit3,
            transaction.value,
            transaction.computedBitSlow,
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
            seller_name: row.seller_name,
            buyer_id: row.buyer_id,
            buyer_name: row.buyer_name,
            bit1: row.bit1,
            bit2: row.bit2,
            bit3: row.bit3,
            value: row.value,
            computedBitSlow: row.computedBitSlow
        };
    }
}
