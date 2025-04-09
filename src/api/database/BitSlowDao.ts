import BitSlow from "@/src/shared/bitslow";

export default interface BitSlowDao {
	insertBitSlow(bitslow: BitSlow): Promise<boolean>;
	getBitSlowByCoinId(coinId: number): Promise<BitSlow | null>;
	getBitSlowByBits(
		bit1: number,
		bit2: number,
		bit3: number,
	): Promise<BitSlow | null>;
}
