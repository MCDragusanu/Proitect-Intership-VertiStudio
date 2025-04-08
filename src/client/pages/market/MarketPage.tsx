import React, { useEffect, useState } from "react";
// Adjust the import path based on your structure
import { toast } from "react-toastify";
import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";
import { TransactionFilter } from "../../components/ui/TransactionFilter";
import TransactionTable from "../../components/ui/TransactionTable";
import CoinHistoryModal from "../../components/ui/CoinHistory";
import { ClockIcon } from "lucide-react";
import { useQueriedTransaction } from "../../components/hooks/QueryTransactions";
import { useCoinHistory } from "../../components/hooks/CoinHistory";
import useIntervalEffect from "../../components/hooks/TimedInterval";
import { useCoinDatabase } from "../../components/hooks/GetAllCoins";
import { useCoin } from "../../components/hooks/GetCoin";
const handleError = async (error: string, actionName: string) => {
  console.log(error);
  toast.error(`Something went wrong while ${actionName}`);
};

const MarketDashboard: React.FC = () => {
  const { transactions, loading, filters, error, setFilters, setLoading } =
    useQueriedTransaction((message : string) => {
        handleError(message , "while loading the most recent transactions!")
    });

  const { coinHistory, setCoinUid } = useCoinHistory(
    (message : string) => {
        handleError(message , "while loading the coin history!")
    },
    () => setShowHistoryModal(true)
  );

  
    const {coin , setCoinId} = useCoin((message : string) => {
      handleError(message, "retrieving coin information!");
    })

  const {coins , setCoins} = useCoinDatabase((message : string) => {
    handleError(message , "while loading the coin database!")
  } , () =>{
    toast.success("Coins have been loaded")
  })


  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [lastRefreshMoment, setNewMoment] = useState(new Date().toISOString());
  useEffect(() => {
        handleError(error?.message || "Unknown Error" , "")
  }, [error]);

  const transactionRefresh = () => {
    //get a new timestamp
    const now = new Date().toISOString();
    //construct the new filters
    const newFilters = { ...filters, afterDateTimeStamp: now };
    //update the filters and last timestamp
    setFilters(newFilters);
    console.log(`Last Update Moment : ${lastRefreshMoment}`);
    setNewMoment(now);
  };

  //hook that will run every 60 seconds to query all the transactions that have occured
  //after current timestamp
  useIntervalEffect(transactionRefresh, 60);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Market Dashboard</h1>
        <button onClick={() => {}}>Generate New Coin</button>
      </div>

      {/* Recent Transactions Section */}
      <section className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <ClockIcon className="text-blue-500 w-5 h-5" />
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
        </div>

        <TransactionFilter
          filters={filters}
          itemCount={transactions.length}
          onFilterChange={setFilters}
        />

        {transactions.length === 0 ? (
          <p className="text-gray-400 mt-6 text-center">
            No transactions found.
          </p>
        ) : (
          <TransactionTable
            transactions={transactions}
            onRowClick={(transaction) => {
             
              setCoinId(transaction.coinId);
             
            }}
          />
        )}
      </section>
      {/* The Coin Database */}
      <section></section>
      {/* Coin History Modal */}
      <CoinHistoryModal
        isOpen={showHistoryModal}
        onClose={() => {
          setCoinUid(-1);
          setShowHistoryModal(false);
        }}
        coin={coin}
        history={coinHistory}
      />
    </div>
  );
};

export default MarketDashboard;
