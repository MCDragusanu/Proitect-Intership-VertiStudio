import Coin from "@/shared/coin";
import CoinDao from "../database/CoinDao";


export default class SQLiteCoinDao implements CoinDao{
    constructor(){

    }

    createSource(): void {
        
    }
    clearSource(): void {
        
    }
    deleteSource(): void {
        
    }
    checkSource(): Boolean {
        
    }

    insertCoin(coin: Coin): Promise<Boolean> {
        
    }
    updateCoin(coin: Coin): Promise<Boolean> {
        
    }
    getFreeCoins(): Promise<Coin[] | null> {
        
    }
    getUserCoins(userUid: string): Promise<Boolean> {
        
    }

    bitsAlreadyInUse(bit1: number, bit2: number, bit3: number): Promise<Boolean> {
        
    }
}