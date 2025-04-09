import { computeBitSlow } from "@/src/bitslow";
import { getModule } from "../../module";
import { RowsIcon } from "lucide-react";
import { CoinDTO as CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";
import BitSlow from "@/src/shared/bitslow";
export const GetAllCoins = async (): Promise<any> => {
  try {
    // Fetch the coin history from the repository
    const coinDatabase = await getModule().bitSlowRepo.getAllCoins();
    
    if(coinDatabase.length === 0){
        return new Response(JSON.stringify([]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
    }

    const result : CoinDTO[] = []
    for(const rawCoin of coinDatabase){
        const bitSlowEntity = await getModule().bitSlowRepo.getBitSlowByCoinId(rawCoin.coin_id)
        let bitSlow
        if(!bitSlowEntity){
             bitSlow = computeBitSlow(rawCoin.bit1 , rawCoin.bit2 , rawCoin.bit3)
               const newBitSlow: BitSlow = {
                    id : Date.now(),
                     coinId: rawCoin.coin_id,
                     bit1: rawCoin.bit1,
                     bit2: rawCoin.bit2,
                     bit3: rawCoin.bit3,
                     computedBitSlow: bitSlow,
                   };
                   //save it for later
                   await getModule().bitSlowRepo.insertBitSlow(newBitSlow);
        }else bitSlow = bitSlowEntity.computedBitSlow
        const coin : CoinDTO = {
            ...rawCoin,
            bitSlow :  bitSlow,
            coin_id : Number(rawCoin.coin_id)
        }
       
        result.push(coin)
    }
  
    console.log("All Coins : ")
    console.log(result)
    // Return the list of seller-buyer pairs
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Error fetching coin history:", err);

    // Return an error response if something goes wrong
    return new Response(
      JSON.stringify({
        message: "Failed to fetch coin history. Please try again later.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
