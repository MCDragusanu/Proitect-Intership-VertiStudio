import { fetchTransactionsByUser } from "../../requrests/getTransactions";
import { useState , useEffect } from "react";
import { toast } from "react-toastify";

function loadUserTransactions(
  filters: any,
  userUid: string,
  accessToken: string,
  callback: (message: string) => void
): Promise<any[]> {
  return fetchTransactionsByUser(filters, userUid, accessToken, callback);
}
export function useTransactions(userUid: string, accessToken: string) {
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

  const onError = (error: Error) => {
    setError(error);
    setLoading(false);
    toast.error(`Error fetching transactions: ${error.message}`);
  };

  useEffect(() => {
    loadUserTransactions(filters, userUid, accessToken, (message) => {
      onError(new Error(message));
    })
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(onError);
  }, [filters]);

  return { transactions, filters, transactionsAreLoading, error, setFilters };
}