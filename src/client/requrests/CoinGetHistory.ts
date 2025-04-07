import { CoinHistoryEntry } from "../components/ui/CoinHistory";

export const fetchCoinHistory = async (
    coinId: number,
    errorCallback: (message: string) => void,
   
  ): Promise<CoinHistoryEntry[]> => {
    const headers = new Headers();
   
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");
  
    const request = new Request(`http://localhost:3000/api/coins/history/${coinId}`, {
      method: "GET",
      headers,
    });
  
    try {
      const response = await fetch(request);
      console.log(response)
      if (response.ok) {
        
        const history = await response.json();
        console.log(history)
        return history as CoinHistoryEntry[] ;
      }
  
     
  
      const errorData = await response.json().catch((err) => {
        console.error("Error parsing error response:", err);
        return { message: "Unknown error occurred" };
      });
  
      errorCallback(errorData.message || "Something went wrong fetching coin history.");
      return [];
  
    } catch (err: any) {
      console.error("Network or server error:", err);
      errorCallback(err.message || "Network error occurred while fetching coin history.");
      return [];
    }
  };