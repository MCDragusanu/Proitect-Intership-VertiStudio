export interface TransactionDTO {
	id: number;
	coinId: number;
	amount: number;
	bit1: number;
	bit2: number;
	bit3: number;
	computedBitSlow: string;
	date: Date;
	buyerName: string;
	buyerUid: string;
	sellerName: string;
	sellerUid: string;
}
