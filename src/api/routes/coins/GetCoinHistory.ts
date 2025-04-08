import { getModule } from "../../module";

export const GetCoinHistory = async (coin_id: number): Promise<any> => {
  try {
    // Fetch the coin history from the repository
    const coinHistory = await getModule().bitSlowRepo.getCoinHistory(coin_id);

    // Check if coin history is empty or null
    if (!coinHistory) {
      return new Response(
        JSON.stringify({ message: "No history found for this coin" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    if(coinHistory.length === 0){
        return new Response(JSON.stringify([]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
    }
    const result : any[] = []
   
    // Map the coin history to a list of { sellerName, buyerName } pairs
    for(const entry of coinHistory){
         const sellerName = (await getModule().userRepository.getProfileByUid(entry.seller_id || "Stranger"))?.name || "Stranger"
         const buyerName = (await getModule().userRepository.getProfileByUid(entry.buyer_id || "Stranger"))?.name || "Stranger"
         result.push({sellerName : sellerName , buyerName : buyerName})
    }
    

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
