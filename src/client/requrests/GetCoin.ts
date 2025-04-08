import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO"
const ENDPOINT_URL = "http://localhost:3000/api/coins";
// Fetch a specific coin by ID
export async function fetchCoinById(
    coinId: number,
    onError: (message: string) => void
  ): Promise<CoinDTO | null> {
    try {
      const response = await fetch(`${ENDPOINT_URL}/${coinId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
  
      if (!response.ok) {
        onError(`Failed to fetch coin: ${response.status} ${response.statusText}`);
        return null;
      }
  
      const data: CoinDTO = await response.json();
      return data ?? null; // Return the data or null if no data is found
    } catch (error: any) {
      console.error("Fetch error:", error);
      onError(error?.message || "An unexpected error occurred.");
      return null;
    }
  }