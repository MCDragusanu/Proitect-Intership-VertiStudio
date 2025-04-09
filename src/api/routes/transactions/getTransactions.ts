import { computeBitSlow } from "@/src/bitslow";
import BitSlow from "@/src/shared/bitslow";
import Transaction from "@/src/shared/transaction";
import { getModule } from "../../module";

/**
 * Helper functions that builds the WHERE statements required by the query
 *
 */
const buildWhereClause = (filters: any) => {
	const {
		sellerName,
		buyerName,
		beforeDateTimeStamp,
		afterDateTimeStamp,
		bitSlowMinPrice,
		bitSlowMaxPrice,
		userUid,
	} = filters;
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
	if (bitSlowMinPrice !== null && bitSlowMinPrice !== undefined) {
		conditions.push("t.amount >= ?");
		params.push(bitSlowMinPrice);
	}
	if (bitSlowMaxPrice !== null && bitSlowMaxPrice !== undefined) {
		conditions.push("t.amount <= ?");
		params.push(bitSlowMaxPrice);
	}
	if (userUid) {
		conditions.push("(seller.user_uid = ? OR buyer.user_uid = ?)");
		params.push(userUid, userUid); // Note: userUid is used twice here
	}

	const whereClause =
		conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

	return { whereClause, params };
};

/**
 *Helper function to process transactions and compute BitSlow.
 *Checks to see if the BitSlow has already been computed to optimize the processing time
 */
const processTransactions = async (transactions: any[]): Promise<any[]> => {
	const result: any[] = [];

	for (const transaction of transactions) {
		let computedBitSlow: string | null = null;
		//check to see if it already in the database
		const preComputedBitSlow = await getModule().bitSlowRepo.getBitSlowByCoinId(
			transaction.coinId,
		);

		//if it has been chached already
		if (preComputedBitSlow) {
			computedBitSlow = preComputedBitSlow.computedBitSlow;
		} else {
			// compute it for the first time
			computedBitSlow = computeBitSlow(
				transaction.bit1,
				transaction.bit2,
				transaction.bit3,
			);
			//create a new record
			const newBitSlow: BitSlow = {
				id: Date.now(),
				coinId: transaction.coinId,
				bit1: transaction.bit1,
				bit2: transaction.bit2,
				bit3: transaction.bit3,
				computedBitSlow: computedBitSlow,
			};
			//save it for later
			await getModule().bitSlowRepo.insertBitSlow(newBitSlow);
		}
		//append to the result
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
			computedBitSlow: computedBitSlow,
		});
	}

	return result;
};

/**
 * Retrieves all the Transactions that match the filters provided
 * Also cached the bitSlows to avoid recalculations
 */
export const queryTransactions = async (req: Request): Promise<Response> => {
	try {
		const requestBody = await req.json();
		const { pageSize: pageSizeParam = 10, pageNumber: pageNumberParam = 1 } =
			requestBody;

		const pageSize = parseInt(String(pageSizeParam), 10);
		const pageNumber = parseInt(String(pageNumberParam), 10);
		const startIndex = (pageNumber - 1) * pageSize;

		// Build the WHERE clause and parameters dynamically based on filters
		const { whereClause, params } = buildWhereClause(requestBody);

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
        c.bit1, c.bit2, c.bit3,
        b.computed_bit_slow as bitSlow
      FROM transactions t
      LEFT JOIN user_profiles seller ON t.seller_id = seller.user_uid
      JOIN user_profiles buyer ON t.buyer_id = buyer.user_uid
      JOIN coins c ON c.coin_id = t.coin_id
      LEFT JOIN bitSlow b on b.coin_id = t.coin_id
      ${whereClause}
      ORDER BY t.transaction_date DESC
      LIMIT ? OFFSET ?`;

		// Add pagination parameters at the end
		params.push(pageSize, startIndex);

		const transactions = await getModule().database.prepare(query);

		const result = transactions.all(params);
		const final = await processTransactions(result);

		return Response.json(final);
	} catch (err) {
		console.error("Transaction error:", err);
		return new Response(
			"Failed to fetch transactions. Invalid or empty request body.",
			{ status: 400 },
		);
	}
};

/**
 * Retrieves all the Transactions of a given user while matching the filters provided
 * Also cached the bitSlows to avoid recalculations
 */
export const getTransactionsByUser = async (
	req: Request,
): Promise<Response> => {
	try {
		const requestBody = await req.json();
		const {
			userUid,
			pageSize: pageSizeParam = 10,
			pageNumber: pageNumberParam = 1,
		} = requestBody;

		if (!userUid) {
			throw new Error("User Uid not provided!");
		}

		const pageSize = parseInt(String(pageSizeParam), 10);
		const pageNumber = parseInt(String(pageNumberParam), 10);
		const startIndex = (pageNumber - 1) * pageSize;

		// Build the WHERE clause and parameters dynamically based on filters
		const { whereClause, params } = buildWhereClause({
			...requestBody,
			userUid,
			userUid,
		});

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
          c.bit1, c.bit2, c.bit3,
          b.computed_bit_slow AS bitSlow
      FROM transactions t
      LEFT JOIN user_profiles seller ON t.seller_id = seller.user_uid
      JOIN user_profiles buyer ON t.buyer_id = buyer.user_uid
      JOIN coins c ON c.coin_id = t.coin_id
      LEFT JOIN bitSlow b ON b.coin_id = t.coin_id
      ${whereClause}
      ORDER BY t.transaction_date DESC
      LIMIT ? OFFSET ?`;

		// Add pagination parameters at the end
		params.push(pageSize, startIndex);

		const transactions = await getModule().database.prepare(query);

		const result = transactions.all(params);
		const final = await processTransactions(result);

		return Response.json(final);
	} catch (err) {
		console.error("Transaction error:", err);
		return new Response(
			"Failed to fetch transactions. Invalid or empty request body.",
			{ status: 400 },
		);
	}
};
