import Transaction from "@/src/shared/transaction";


interface TransactionDao{

    
    insertTransaction(transaction : Transaction) : Promise<boolean>
    updateTransaction(transaction : Transaction) : Promise<boolean>

    getCoinHistory(coinUid : number)             : Promise<Transaction[] | null>
    getTransactionByUid(id : Number)             : Promise<Transaction   | null>
    getUserTransactions(userUid : String)        : Promise<Transaction[] | null>
    getAllTransactions() : Promise<Transaction[]>
    getUsersTransactionCount(userUid : string) : Promise<number>
}
export default TransactionDao