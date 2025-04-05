import Transaction from "@/src/shared/transaction";
const ENDPOINT_URL = "http://localhost:3000/api/transactions/v2";
type OnErrorCallback = (errorMessage: string) => void;
const defaultCallback: OnErrorCallback = (errorMessage: string) => {
  console.log(errorMessage); // or any other error handling logic
};
export async function fetchTransactions(
  pageSize: number = 100,
  pageNumber: number= 0,
  sellerId: string | null = null,
  buyerId: string | null = null,
  beforeDateTimeStamp : string | null = null,
  afterDateTimeStamp : string | null = null,
  bitSlowMinPrice: number | null = null,
  bitSlowMaxPrice: number | null = null,
  onErrorCallback: OnErrorCallback = defaultCallback
): Promise<any[]> {
  console.log("Preparing to retrieve transactions!")
  const headers: Headers = new Headers();

  const requestBody = JSON.stringify({
    pageSize: pageSize,
    pageNumber: pageNumber,
    sellerName: sellerId,
    buyerName: buyerId,
    beforeDateTimeStamp:beforeDateTimeStamp ,
    afterDateTimeStamp:afterDateTimeStamp ,
    bitSlowMinPrice: bitSlowMinPrice,
    bitSlowMaxPrice: bitSlowMaxPrice,
  });

  headers.set("Content-Type", "application/json");
 

  const requestInfo = new Request(ENDPOINT_URL, {
    method: "POST",
    headers: headers,
    body: requestBody,
  });

  try {
    const result = await fetch(requestInfo);
    
    if (!result.ok) {
      console.log("Failed Response:");
      const errorBody = await result.json();
      console.log(errorBody);
      onErrorCallback(errorBody.message);
      return Promise.resolve([]); // Or handle accordingly
    }
  
    // Handle the response body only once
    const resultBody = await result.json();
    console.log("Completed Processing:");
    console.log(resultBody);
  
    // Make sure you're returning or using the resultBody properly
    return Promise.resolve(resultBody);
  
  } catch (error : any) {
    console.error("Error fetching transactions:", error);
    onErrorCallback(error.message);  // Or display a generic message
    return Promise.resolve([]);  // Return empty data if there's an error
  }
}

export async function fetchTransactionsCount(
  pageSize: number,
  pageNumber: number,
  sellerId: string | null = null,
  buyerId: string | null = null,
  beforeDateTimeStamp : string | null = null,
  afterDateTimeStamp : string | null = null,
  bitSlowMinPrice: number | null = null,
  bitSlowMaxPrice: number | null = null,
  onErrorCallback: OnErrorCallback = defaultCallback
): Promise<number> {
  const headers: Headers = new Headers();

  const requestBody = JSON.stringify({
    pageSize: pageSize,
    pageNumber: pageNumber,
    sellerName: sellerId,
    buyerName: buyerId,
    beforeDateTimeStamp:beforeDateTimeStamp ,
    afterDateTimeStamp:afterDateTimeStamp ,
    bitSlowMinPrice: bitSlowMinPrice,
    bitSlowMaxPrice: bitSlowMaxPrice,
  });

  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  const requestInfo = new Request(ENDPOINT_URL, {
    method: "POST",
    headers: headers,
    body: requestBody,
  });

  try {
    const result = await fetch(requestInfo);
    console.log(result)
    if (!result.ok) {
      const errorBody = await result.json();
      onErrorCallback(errorBody.messae);
      return Promise.resolve(-1);
    }
    const resultBody = await result.json();
    const transactions = resultBody.count as number;
    console.log(`Retrieved ${transactions} transactions`);
    return Promise.resolve(transactions);
  } catch (error: any) {
    onErrorCallback(error.messae);
    return Promise.resolve(-1);
  }
}
