import { TransactionFilters } from "../ui/TransactionFilter";
import { OnErrorCallback } from "../../requrests/getTransactions";
import { fetchTransactions } from "../../requrests/getTransactions";
import { useEffect , useState } from "react";
import { toast } from "react-toastify";

function loadTransactions(
  filters: TransactionFilters,
  callback: OnErrorCallback
): Promise<any[]> {
  return fetchTransactions(filters, callback);
}

export function useQueriedTransaction() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({
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
    loadTransactions(filters, (message) => {
      onError(new Error(message));
    })
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(onError);
  }, [filters]);

  return { transactions, filters, loading, error, setFilters , setLoading };
}
