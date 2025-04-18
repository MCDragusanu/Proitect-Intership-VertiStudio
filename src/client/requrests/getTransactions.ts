import type { TransactionDTO } from "@/src/shared/DataTransferObjects/TransactionDTO";
import type { TransactionFilters } from "../components/ui/TransactionFilter";

const ENDPOINT_URL = "http://localhost:3000/api/transactions/v2";

export type OnErrorCallback = (errorMessage: string) => void;

const defaultCallback: OnErrorCallback = (errorMessage: string) => {
	console.log(errorMessage);
};

const handleResponse = async (
	response: Response,
	onError: (message: string) => void,
): Promise<TransactionDTO[]> => {
	try {
		if (!response.ok) {
			console.log("Failed Response:");
			const errorBody = await response.json();
			console.log(errorBody);
			onError(errorBody.message);
			return Promise.resolve([]);
		}
		const resultBody = ((await response.json()) as TransactionDTO[]) ?? [];
		return Promise.resolve(resultBody);
	} catch (error: any) {
		console.log(error);
		onError(
			error.messae || "Unknown Error occurred while retrieving transactions",
		);
		return [];
	}
};

export async function fetchTransactions(
	filters: TransactionFilters,
	onError: (message: string) => void,
): Promise<any[]> {
	console.log("Preparing to retrieve transactions!");
	const headers: Headers = new Headers();

	const requestBody = JSON.stringify({
		pageSize: filters.pageSize,
		pageNumber: filters.pageNumber,
		sellerName: filters.sellerName,
		buyerName: filters.buyerName,
		beforeDateTimeStamp: filters.beforeDateTimeStamp,
		afterDateTimeStamp: filters.afterDateTimeStamp,
		bitSlowMinPrice: filters.bitSlowMinPrice,
		bitSlowMaxPrice: filters.bitSlowMaxPrice,
	});

	headers.set("Content-Type", "application/json");

	const requestInfo = new Request(ENDPOINT_URL, {
		method: "POST",
		headers: headers,
		body: requestBody,
	});
	try {
		const result = await fetch(requestInfo);
		return handleResponse(result, onError);
	} catch (error: any) {
		console.error("Error fetching transactions:", error);
		onError(error.message); // Or display a generic message
		return Promise.resolve([]); // Return empty data if there's an error
	}
}

export async function fetchTransactionsByUser(
	filters: TransactionFilters,
	userUid: string,
	accessToken: string,
	onError: (message: string) => void,
): Promise<TransactionDTO[]> {
	const requestBody = JSON.stringify({
		pageSize: filters.pageSize,
		pageNumber: filters.pageNumber,
		userUid: userUid,
		beforeDateTimeStamp: filters.beforeDateTimeStamp,
		afterDateTimeStamp: filters.afterDateTimeStamp,
		bitSlowMinPrice: filters.bitSlowMinPrice,
		bitSlowMaxPrice: filters.bitSlowMaxPrice,
	});
	console.log(`Fetching transaction for ${userUid} with token ${accessToken}`);
	const headers: Headers = new Headers();
	headers.set("Authorization", `Bearer ${accessToken}`);
	headers.set("Content-Type", "application/json");
	headers.set("Accept", "application/json");

	const requestInfo = new Request(`${ENDPOINT_URL}/${userUid}`, {
		method: "POST",
		headers: headers,
		body: requestBody,
	});
	try {
		const result = await fetch(requestInfo);
		return handleResponse(result, onError);
	} catch (error: any) {
		console.error(
			`Error fetching transactions for user '${userUid}' : ${error}`,
		);
		onError(error.message);
		return Promise.resolve([]);
	}
}
