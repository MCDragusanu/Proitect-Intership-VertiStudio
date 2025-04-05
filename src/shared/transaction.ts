// Define the Transaction interface based on the API response
interface Transaction {
    id: number;
    coin_id: number; 
    amount: number;
    transaction_date: string;
    seller_id: string | null; // change it to string to accomodate usage of UUIDs for th pk of the user
    buyer_id: string; // same
    bit1: number;
    bit2: number;
    bit3: number;
}

export default Transaction