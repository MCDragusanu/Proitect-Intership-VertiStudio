import Transaction from "@/shared/transaction";


interface TransactionDao{

    insertTransaction(transaction : Transaction) : Promise<Boolean>
    updateTransaction(transaction : Transaction) : Promise<Boolean>

    getCoinHistory(coinUid : string)             : Promise<Transaction[] | null>
    getTransactionByUid(id : Number)             : Promise<Transaction   | null>
    getUserTransactions(userUid : String)        : Promise<Transaction[] | null>


    bitsAlreadyInUse(bit1 : number , bit2 : number , bit3 : number) : Promise<Boolean>
    
}