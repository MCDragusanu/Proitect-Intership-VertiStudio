interface Coin{
    coin_id : string,
    client_id : number // the owner of the coin -1 if it not owned
    value : number
    bit1 : number,
    bit2 : number,
    bit3 : number,
    created_at : number
}

export default Coin