interface Coin {
	coin_id: number;
	client_id: string | null; // if it is not owned by anyone -> Null
	value: number;
	bit1: number;
	bit2: number;
	bit3: number;
	created_at: number;
	bitSlow?: string | null;
}

export default Coin;
