import Transaction from "@/shared/transaction";
import TransactionDao from "../database/TransactionDao";

export default class SQLiteTransactionDao implements TransactionDao{
    constructor(){

    }

    createSource(): void {
        
    }
    deleteSource(): void {
        
    }
    clearSource(): void {
        
    }
    checkSource(): Boolean {
        
    }
    insertTransaction(transaction: Transaction): Promise<Boolean> {
        
    }
    getTransactionByUid(id: Number): Promise<Transaction | null> {
        
    }
    getCoinHistory(coinUid: string): Promise<Transaction[] | null> {
        
    }
    getUserTransactions(userUid: String): Promise<Transaction[] | null> {
        
    }
    updateTransaction(transaction: Transaction): Promise<Boolean> {
        
    }
}