import { useState, useEffect } from "react";
import { fetchTransactionsByUser } from "../../requrests/getTransactions";

export function useTransactions(
	userUid: string,
	accessToken: string,
	errorCallback: (message: string) => void,
	unAuthorizedAccessCallback: (message: string) => void,
) {
	const [transactions, setTransactions] = useState<any[]>([]);
	const [transactionsAreLoading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const [filters, setFilters] = useState<any>({
		pageNumber: 1,
		pageSize: 20,
		buyerName: null,
		sellerName: null,
		afterDateTimeStamp: null,
		beforeDateTimeStamp: null,
		bitSlowMinPrice: null,
		bitSlowMaxPrice: null,
	});

	const handleError = (error: Error) => {
		setError(error);
		setLoading(false);
		errorCallback(
			error.message || "Unknown Error occurred while retrieving transactions",
		);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchTransactionsByUser(
					filters,
					userUid,
					accessToken,
					(message) => handleError(new Error(message)),
				);
				setTransactions(data);
				setLoading(false);
			} catch (err) {
				handleError(err as Error);
			}
		};

		fetchData();
	}, [filters]);

	return { transactions, filters, transactionsAreLoading, error, setFilters };
}
