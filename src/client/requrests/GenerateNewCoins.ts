const ENDPOINT_URL = "http://localhost:3000/api/coins/generate";
import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";

export async function fetchGeneratedCoins(
  amount: number,
  userUid: string,
  accessToken: string,
  onError: (message: string) => void,
  onUnAuthorizedRequest :() => void
): Promise<CoinDTO[]> {
  try {
    console.log("Sending token : ")
    console.log(accessToken)
    const headers: Headers = new Headers();
    headers.set("Authorization", `Bearer ${accessToken}`);
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

   const body = JSON.stringify({ coinCount: amount });

    const response = await fetch(`${ENDPOINT_URL}/${userUid}`, {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Retrieved New Coins : ");
      console.log(data);
      return (data as CoinDTO[]) || null;
    }else if(response.status === 403){
        console.log("UnAuthorized request")
        onUnAuthorizedRequest()
        return []
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
