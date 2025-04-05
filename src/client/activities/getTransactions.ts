import Transaction from "@/src/shared/transaction";
const ENDPOINT_URL = "http://localhost:3000/api/transactions";
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
  const headers: Headers = new Headers();

  const requestBody = JSON.stringify({
    pageSize: pageSize,
    pageNumber: pageNumber,
    sellerName: sellerId,
    buyerName: buyerId,
    beforeDateTimeStamp ,
    afterDateTimeStamp ,
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
    if (!result.ok) {
     
      const errorBody = await result.json(); 
      console.log(errorBody)
      onErrorCallback(errorBody.messae);
      return Promise.resolve([]);
    }
    const resultBody = await result.json();
 
    console.log(`Retrieved ${resultBody.length} transactions`);
    return Promise.resolve(resultBody);
  } catch (error: any) {
    onErrorCallback(error.messae);
    return Promise.resolve([]);
  }
}

export async function fetchTransactionsCount(
  pageSize: number,
  pageNumber: number,
  sellerId: string | null,
  buyerId: string | null,
  bitSlowMinPrice: number | null,
  bitSlowMaxPrice: number | null,
  onErrorCallback: (errorMessage: string) => {}
): Promise<number> {
  const headers: Headers = new Headers();

  const requestBody = JSON.stringify({
    pageSize: pageSize,
    pageNumber: pageNumber,
    sellerId: sellerId,
    buyerId: buyerId,
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
