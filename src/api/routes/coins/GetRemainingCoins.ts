import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";
import { getModule } from "../../module";
import Coin from "@/src/shared/coin";
import Transaction from "@/src/shared/transaction";
import { computeBitSlow } from "@/src/bitslow";
import BitSlow from "@/src/shared/bitslow";

export const GetCoinSupply = async (): Promise<Response> => {
  let remainingCoinCount = 0;
  try {
    
    for (let b1 = 1; b1 <= 10; b1++) 
      for (let b2 = 1; b2 <= 10; b2++)
        for (let b3 = 1; b3 <= 10; b3++) {
          const isUsed = await getModule().bitSlowRepo.bitsAlreadyInUse(
            b1,
            b2,
            b3
          );
         if (!isUsed)  remainingCoinCount++
        }
    

    return new Response(
      JSON.stringify({
        coinSupply : remainingCoinCount,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.log(err);
    return new Response(
      JSON.stringify({
        message: "Failed to generate coin. Unknown error occurred.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

const createNewCoinInstance = (
  b1: number,
  b2: number,
  b3: number,
  clientId: string
): Coin => {
  const coin: Coin = {
    coin_id: Date.now(), // will be set later
    client_id: clientId,
    bit1: b1,
    bit2: b2,
    bit3: b3,
    value: Math.floor(Math.random() * 90_000) + 10_000,
    created_at: Date.now(), // current timestamp in milliseconds
    bitSlow: computeBitSlow(b1, b2, b3),
  };

  return coin;
};

const createNewTransaction = (coin: Coin): Transaction => {
  const transaction: Transaction = {
    id: Date.now(),
    coin_id: coin.coin_id,
    transaction_date: new Date().toISOString(),
    buyer_id: coin.client_id || "Default UID",
    seller_id: "VENDOR",
    amount: coin.value,
    bit1: coin.bit1,
    bit2: coin.bit2,
    bit3: coin.bit3,
  };
  return transaction;
};
const createNewBitSlowInstance = (coin: Coin): BitSlow => {
  const bitSlow: BitSlow = {
    id: Date.now(),
    coinId: coin.coin_id,
    bit1: coin.bit1,
    bit2: coin.bit2,
    bit3: coin.bit3,
    computedBitSlow: coin.bitSlow || "default bitSlow",
  };
  return bitSlow;
};
