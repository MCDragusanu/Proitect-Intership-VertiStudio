import Coin from "@/shared/coin"

interface CoinDao {

    insertCoin(coin : Coin )        : Promise<Boolean>
    updateCoin(coin : Coin)         : Promise<Boolean>

    getUserCoins(userUid : string)  : Promise<Boolean>
    getFreeCoins()                  : Promise<Coin[] | null>

}

export default CoinDao