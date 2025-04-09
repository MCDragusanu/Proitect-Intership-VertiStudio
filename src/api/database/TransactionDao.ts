import type Transaction from "@/src/shared/transaction";

interface TransactionDao {
	insertTransaction(transaction: Transaction): Promise<boolean>;
	updateTransaction(transaction: Transaction): Promise<boolean>;

	getCoinHistory(coinUid: number): Promise<Transaction[] | null>;
	getTransactionByUid(id: number): Promise<Transaction | null>;
	getUserTransactions(userUid: String): Promise<Transaction[] | null>;
	getAllTransactions(): Promise<Transaction[]>;
	getUsersTransactionCount(userUid: string): Promise<number>;
	deleteTransaction(transaction: Transaction): Promise<boolean>;
}
export default TransactionDao;
