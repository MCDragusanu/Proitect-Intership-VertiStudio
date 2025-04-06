import Transaction from "@/src/shared/transaction";


interface TransactionDao{

    
    insertTransaction(transaction : Transaction) : Promise<boolean>
    updateTransaction(transaction : Transaction) : Promise<boolean>

    getCoinHistory(coinUid : number)             : Promise<Transaction[] | null>
    getTransactionByUid(id : Number)             : Promise<Transaction   | null>
    getUserTransactions(userUid : String)        : Promise<Transaction[] | null>

    getTransactionsLessThanBitSlow(bitSlow : number) : Promise<Transaction[] | null>
    getTransactionsMoreThanBitSlow(bitSlow : number) : Promise<Transaction[] | null>
    getTransactionsInBitSlowRange(lowerBound : number , upperBoundInclusive : number) : Promise<Transaction[] | null>
    
    getTransactionsByBuyerName(name : string) : Promise<Transaction[] | null>
    getTransactionsBySellerName(name : string) : Promise<Transaction[] | null>
    getTransactionsByBuyerAndSellerName(buyerName : string , sellerName : string) : Promise<Transaction[] | null>

    getTransactionsBeforeDate(date : Date) : Promise<Transaction[] | null>
    getTransactionsAfterDate(date : Date) : Promise<Transaction[] | null>
    getTransactionsInDateRange(after : Date , before : Date) : Promise<Transaction[] | null>
}
export default TransactionDao