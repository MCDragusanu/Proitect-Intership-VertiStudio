import { computeBitSlow } from "@/src/client/bitslow";
import BitSlow from "@/src/shared/bitslow";
import Transaction from "@/src/shared/transaction";

import { getModule } from "../../module";
import { tr } from "@faker-js/faker";

export const getTransactions = async (req: Request): Promise<Response> => {
  try {
    console.log(req);
    const requestBody = await req.json();

    const {
      pageSize: pageSizeParam = 10,
      pageNumber: pageNumberParam = 1,
      sellerName,
      buyerName,
      beforeDateTimeStamp,
      afterDateTimeStamp,
      bitSlowMinPrice,
      bitSlowMaxPrice,
    } = requestBody;

    const pageSize = parseInt(String(pageSizeParam), 10);
    const pageNumber = parseInt(String(pageNumberParam), 10);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    console.log(
      `${pageSize} ${pageNumber} ${sellerName} ${buyerName} ${beforeDateTimeStamp} ${afterDateTimeStamp} ${bitSlowMinPrice} ${bitSlowMaxPrice}`
    );

    let allTransactions: any[] | null = [];

    // Fetch all transactions (this could be very inefficient for large datasets)
    const allUserTransactions =
      await getModule().bitSlowRepo.getAllTransactions(); // Assuming undefined/null fetches all
    if (allUserTransactions) {
      allTransactions = [...allUserTransactions];

      // Apply filters in memory
      if (sellerName) {
        console.log("Applying Seller filter");
        allTransactions = allTransactions.filter(
          (t) =>
            t.sellerName &&
            t.sellerName.toLowerCase().includes(sellerName.toLowerCase())
        );
      }
      if (buyerName) {
        console.log("Applying Buyer filter");
        allTransactions = allTransactions.filter(
          (t) =>
            t.buyerName &&
            t.buyerName.toLowerCase().includes(buyerName.toLowerCase())
        );
      }
      if (beforeDateTimeStamp) {
        console.log("Applying BeforeDate filter");
        const beforeDate = new Date(beforeDateTimeStamp);
        allTransactions = allTransactions.filter(
          (t) => new Date(t.transactionDate) < beforeDate
        );
      }
      if (afterDateTimeStamp) {
        console.log("Applying AfterDate filter");
        const afterDate = new Date(afterDateTimeStamp);
        allTransactions = allTransactions.filter(
          (t) => new Date(t.transactionDate) > afterDate
        );
      }

      // Apply BitSlow price filter
      if (bitSlowMinPrice !== null || bitSlowMaxPrice !== null) {
        console.log("Applying Amount Value filter");
        const filteredByBitSlow: Transaction[] = [];

        for (const transaction of allTransactions) {
          // Fetch the computed BitSlow value for the transaction's coin
          const coin = await getModule().bitSlowRepo.getBitSlowByCoinId(
            transaction.coin_id
          );
          let computedBitSlow: number | string | null = null;
          if (coin) {
            computedBitSlow = coin.computedBitSlow;
          } else {
            // Compute BitSlow if it's not cached
            const rawCoinData = (await getModule()
              .database.prepare(
                "SELECT bit1, bit2, bit3 FROM coins WHERE coin_id = ?"
              )
              .get(transaction.coin_id)) as
              | { bit1: number; bit2: number; bit3: number }
              | undefined;
            if (rawCoinData) {
              computedBitSlow = computeBitSlow(
                rawCoinData.bit1,
                rawCoinData.bit2,
                rawCoinData.bit3
              );
              const newBitSlow: BitSlow = {
                coinId: transaction.coin_id,
                bit1: rawCoinData.bit1,
                bit2: rawCoinData.bit2,
                bit3: rawCoinData.bit3,
                computedBitSlow,
              };
              await getModule().bitSlowRepo.insertBitSlow(newBitSlow);
            }
          }

          // Apply the filtering for BitSlow values
          if (computedBitSlow !== null) {
            if (
              (bitSlowMinPrice === null ||
                transaction.amount >= bitSlowMinPrice) &&
              (bitSlowMaxPrice === null ||
                transaction.amount <= bitSlowMaxPrice)
            ) {
              filteredByBitSlow.push(transaction);
            }
          }
        }
        allTransactions = filteredByBitSlow;
      }

      // Apply pagination in memory
      allTransactions = allTransactions.slice(startIndex, endIndex);
    } else {
      console.log("Defaulted to Empty");
      allTransactions = [];
    }

    console.log("Final Transactions : ");
    console.log(allTransactions);
    return Response.json(allTransactions);
  } catch (err) {
    console.error("Transaction error:", err);
    return new Response(
      "Failed to fetch transactions. Invalid or empty request body.",
      { status: 400 }
    );
  }
};

export const getTransactionsV2 = async (req: Request): Promise<Response> => {
  try {
    const requestBody = await req.json();

    const {
      pageSize: pageSizeParam = 10,
      pageNumber: pageNumberParam = 1,
      sellerName,
      buyerName,
      beforeDateTimeStamp,
      afterDateTimeStamp,
      bitSlowMinPrice,
      bitSlowMaxPrice,
    } = requestBody;

    const pageSize = parseInt(String(pageSizeParam), 10);
    const pageNumber = parseInt(String(pageNumberParam), 10);
    const startIndex = (pageNumber - 1) * pageSize;

    console.log(
      `${pageSize} ${pageNumber} ${sellerName} ${buyerName} ${beforeDateTimeStamp} ${afterDateTimeStamp} ${bitSlowMinPrice} ${bitSlowMaxPrice}`
    );

    // Build the SQL WHERE conditions dynamically based on the filters provided
    const conditions: string[] = [];
    const params: any[] = [];

    if (sellerName) {
      conditions.push("seller.name LIKE ?");
      params.push(`%${sellerName}%`);
    }
    if (buyerName) {
      conditions.push("buyer.name LIKE ?");
      params.push(`%${buyerName}%`);
    }
    if (beforeDateTimeStamp) {
      conditions.push("t.transaction_date < ?");
      params.push(beforeDateTimeStamp);
    }
    if (afterDateTimeStamp) {
      conditions.push("t.transaction_date > ?");
      params.push(afterDateTimeStamp);
    }

    // Only add price conditions if they're actually provided (not null or undefined)
    if (bitSlowMinPrice !== null && bitSlowMinPrice !== undefined) {
      conditions.push("t.amount >= ?");
      params.push(bitSlowMinPrice);
    }
    if (bitSlowMaxPrice !== null && bitSlowMaxPrice !== undefined) {
      conditions.push("t.amount <= ?");
      params.push(bitSlowMaxPrice);
    }

    // Construct WHERE clause
    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Fetch the transactions and relevant data in a single SQL query
    const query = `
              SELECT 
                  t.id AS id,
                  t.coin_id AS coinId,
                  t.amount AS value,
                  t.transaction_date AS date,
                  seller.user_uid AS sellerUid,
                  seller.name AS sellerName,
                  buyer.user_uid AS buyerUid,
                  buyer.name AS buyerName,
                  c.bit1, c.bit2, c.bit3
              FROM transactions t
              LEFT JOIN user_profiles seller ON t.seller_id = seller.user_uid
              JOIN user_profiles buyer ON t.buyer_id = buyer.user_uid
              JOIN coins c ON c.coin_id = t.coin_id
              ${whereClause}
              ORDER BY t.transaction_date DESC
              LIMIT ? OFFSET ?`;

    console.log(query);
    // Add pagination parameters at the end
    params.push(pageSize);
    params.push(startIndex);

    const transactions = await getModule().database.prepare(query).all(params);
    let result: any[] = [];

    for (const transaction of transactions) {
       
      let computedBitSlow: string | null = null;
      //check to see it it has already been computed
      const preComputedBitSlow =
        await getModule().bitSlowRepo.getBitSlowByCoinId(transaction.coinId);
      if (preComputedBitSlow) {
        //assinging it to the varabile  
        computedBitSlow = preComputedBitSlow.computedBitSlow;
      } else { 
        // it has to be computed for the first time
        computedBitSlow = computeBitSlow(
          transaction.bit1,
          transaction.bit2,
          transaction.bit3
        );
        //creating a new instance
        const newBitSlow : BitSlow = {
            coinId:transaction.coinId,
            bit1:transaction.bit1,
            bit2:transaction.bit2,
            bit3:transaction.bit3,
            computedBitSlow : computedBitSlow
        }
        //saving it to the db
        await getModule().bitSlowRepo.insertBitSlow(newBitSlow)
      }
      //appending it to the result
      result.push({
        id: transaction.id,
        coinId: transaction.coinId,
        amount: transaction.value, 
        date: transaction.date, 
        sellerUid: transaction.sellerUid, 
        sellerName: transaction.sellerName, 
        buyerUid: transaction.buyerUid, 
        buyerName: transaction.buyerName,
        bit1: transaction.bit1,
        bit2: transaction.bit2,
        bit3: transaction.bit3,
       
        computedBitSlow: computedBitSlow, // Keep the computed hash
      });
    }
  

    console.log("Final Transactions: ");
    console.log(result);
    return Response.json(result);
  } catch (err) {
    console.error("Transaction error:", err);
    return new Response(
      "Failed to fetch transactions. Invalid or empty request body.",
      { status: 400 }
    );
  }
};
