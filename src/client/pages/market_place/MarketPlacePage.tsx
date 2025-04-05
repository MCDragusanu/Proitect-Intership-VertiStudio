import { useState, useEffect } from "react";
import TransactionLoader from "../../components/ui/TransactionLoader";
import TransactionTable from "../../components/ui/TransactionTable";
import { toast } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS
import { fetchTransactions, fetchTransactionsCount } from "../../activities/getTransactions";

const ENDPOINT_URL = "http://localhost:3000/"; // NOTE: change this based on your environment.

function loadTransactions(pageSize : number = 100 , pageIndex : number = 1): Promise<any[]> {
  return  fetchTransactions(pageSize , pageIndex)
}

function useTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("Invoked")
    loadTransactions()
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        // Show error toast when data fetching fails
        toast.error(`Error fetching transactions: ${err.message}`);
      });
  }, []);

  return { transactions, loading, error };
}

export function MarketPage() {
  const { transactions, loading, error } = useTransactions();
  const [loadingTime, setLoadingTime] = useState(0);

  useEffect(() => {
    let timerId: number | undefined;

    if (loading) {
      timerId = window.setInterval(() => {
        setLoadingTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [loading]);

  useEffect(() => {
    toast.error(error?.message);
  }, [error]);

  if (loading) {
    return <TransactionLoader loadingTime={loadingTime} />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        BitSlow Transactions
      </h1>

      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found</p>
      ) : (
        <TransactionTable transactions={transactions} />
      )}
    </div>
  );
}

export default MarketPage;
