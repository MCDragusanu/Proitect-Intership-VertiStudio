import Coin from "@/shared/coin"

interface CoinDao {

    createSource() : void
    deleteSource() : void
    clearSource() : void
    checkSource() : Boolean

    insertCoin(coin : Coin )        : Promise<Boolean>
    updateCoin(coin : Coin)         : Promise<Boolean>

    getUserCoins(userUid : string)  : Promise<Coin[] | null>
    getFreeCoins()                  : Promise<Coin[] | null>

    bitsAlreadyInUse(bit1 : number , bit2 : number , bit3 : number) : Promise<Boolean>
}

export default CoinDao