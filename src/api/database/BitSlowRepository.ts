import BitSlow from "../../shared/bitslow"
import Coin from "../../shared/coin"
import Transaction from "../../shared/transaction"

export default interface BitSlowRepository {
  // BitSlowDao
  insertBitSlow(bitslow: BitSlow): Promise<boolean>;
  getBitSlowByCoinId(coinId: number): Promise<BitSlow | null>;
  getBitSlowByBits(bit1: number, bit2: number, bit3: number): Promise<BitSlow | null>;

 

  insertCoin(coin: Coin): Promise<boolean>;
  updateCoin(coin: Coin): Promise<boolean>;

  getUserCoins(userUid: string): Promise<Coin[] | null>;
  getFreeCoins(): Promise<Coin[] | null>;
  getMonetaryValue(userUid: string): Promise<number | null>;
  bitsAlreadyInUse(bit1: number, bit2: number, bit3: number): Promise<boolean>;

 
  insertTransaction(transaction: Transaction): Promise<boolean>;
  updateTransaction(transaction: Transaction): Promise<boolean>;

  getCoinHistory(coinUid: number): Promise<Transaction[] | null>;
  getTransactionByUid(id: number): Promise<Transaction | null>;
  getUserTransactions(userUid: string): Promise<Transaction[] | null>;

  getTransactionsLessThanBitSlow(bitSlow: number): Promise<Transaction[] | null>;
  getTransactionsMoreThanBitSlow(bitSlow: number): Promise<Transaction[] | null>;
  getTransactionsInBitSlowRange(lowerBound: number, upperBoundInclusive: number): Promise<Transaction[] | null>;

  getTransactionsByBuyerName(name: string): Promise<Transaction[] | null>;
  getTransactionsBySellerName(name: string): Promise<Transaction[] | null>;
  getTransactionsByBuyerAndSellerName(buyerName: string, sellerName: string): Promise<Transaction[] | null>;

   getAllTransactions(): Promise<Transaction[]> 
  getTransactionsBeforeDate(date: Date): Promise<Transaction[] | null>;
  getTransactionsAfterDate(date: Date): Promise<Transaction[] | null>;
  getTransactionsInDateRange(after: Date, before: Date): Promise<Transaction[] | null>;
}
