import { useState, useEffect } from "react";
import { CoinHistoryEntry } from "../ui/CoinHistory";
import { fetchCoinHistory } from "../../requrests/CoinGetHistory";
import { fetchAllCoins } from "../../requrests/GetAllCoins";
import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";

function loadCoins(
  errorCallback: (message: string) => void
): Promise<CoinDTO[]> {
  return fetchAllCoins(errorCallback) ;
}

export const useCoinDatabase = (
  onError: (error: string) => void,
  
  onLoaded?: () => void
) => {
  const [coins, setCoins] = useState<CoinDTO[]>([]);
  const [refresh , setRefresh] = useState(false)
  useEffect(() => {
    loadCoins(onError)
      .then((data) => {
        setCoins(data);
        if (onLoaded) onLoaded(); // call after loading
      })
      .catch((err: any) => {
        const message = err?.message || "Failed to load coin history";
        onError(message);
      });
  }, [refresh]);

  return { coins, setCoins , setRefresh };
};
