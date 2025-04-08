import { fetchCoinById } from "../../requrests/GetCoin";
import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";
import { useState , useEffect } from "react";
// Function to load the coin data
function loadCoin(coinId: number, errorCallback: (message: string) => void): Promise<CoinDTO | null> {
    return fetchCoinById(coinId, errorCallback);
  }
  
  export const useCoin = (
    coinId: number,
    errorCallback: (error: string) => void,
    onLoaded?: () => void
  ) => {
    const [coin, setCoin] = useState<CoinDTO | null>(null); // Coin state
    const [loading, setLoading] = useState<boolean>(true); // Loading state
  
    useEffect(() => {
      if (coinId <= 0) return; // Ensure a valid coinId is provided
  
      setLoading(true); // Set loading state to true before fetching
  
      loadCoin(coinId, errorCallback)
        .then((data) => {
          setCoin(data);
          setLoading(false); // Set loading to false after loading completes
          if (onLoaded) onLoaded(); // Call onLoaded callback after loading completes
        })
        .catch((err: any) => {
          const message = err?.message || "Failed to load coin data";
          errorCallback(message); // Handle error
          setLoading(false); // Set loading to false if there's an error
        });
    }, [coinId, errorCallback, onLoaded]); // Dependencies: when coinId changes, rerun the effect
  
    return { coin, loading };
  };