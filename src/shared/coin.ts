interface Coin{
    coin_id : number,
    user_uid : string | null // if it is not owned by anyone -> Null
    value : number
    bit1 : number,
    bit2 : number,
    bit3 : number,
    created_at : number
}

export default Coin