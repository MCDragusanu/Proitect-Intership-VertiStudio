import Transaction from "@/shared/transaction";


interface TransactionDao{

    createSource() : void
    deleteSource() : void
    clearSource() : void
    checkSource() : Boolean

    insertTransaction(transaction : Transaction) : Promise<Boolean>
    updateTransaction(transaction : Transaction) : Promise<Boolean>

    getCoinHistory(coinUid : string)             : Promise<Transaction[] | null>
    getTransactionByUid(id : Number)             : Promise<Transaction   | null>
    getUserTransactions(userUid : String)        : Promise<Transaction[] | null>


    
    
}
export default TransactionDao