// Define the Transaction interface based on the API response
interface Transaction {
    id: number;
    coin_id: number; 
    amount: number;
    transaction_date: string;
    seller_id: string | null; // change it to string to accomodate usage of UUIDs for th pk of the user
    seller_name: string | null;
    buyer_id: string; // same
    buyer_name: string;
    bit1: number;
    bit2: number;
    bit3: number;
    value: number;
    computedBitSlow: string; // the uuid of the coin
}

export default Transaction