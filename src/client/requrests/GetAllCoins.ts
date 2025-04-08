import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";

const ENDPOINT_URL = "http://localhost:3000/api/coins";

export async function fetchAllCoins(
  onError: (message: string) => void
): Promise<CoinDTO[]> {
  try {
    const response = await fetch(ENDPOINT_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      onError(`Failed to fetch: ${response.status} ${response.statusText}`);
      return [];
    }
  } catch (error: any) {
    console.error("Fetch error:", error);
    onError(error?.message || "An unexpected error occurred.");
    return [];
  }
}
