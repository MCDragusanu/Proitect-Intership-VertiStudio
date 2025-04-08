import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  ClockIcon,
  PlusCircleIcon,
  CoinsIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { TransactionFilter } from "../../components/ui/TransactionFilter";
import TransactionTable from "../../components/ui/TransactionTable";
import CoinHistoryModal from "../../components/ui/CoinHistory";
import { useQueriedTransaction } from "../../components/hooks/QueryTransactions";
import { useCoinHistory } from "../../components/hooks/CoinHistory";
import { useIntervalEffect } from "../../components/hooks/TimedInterval";
import { useCoinDatabase } from "../../components/hooks/GetAllCoins";
import { useCoin } from "../../components/hooks/GetCoin";
import { CoinList } from "../../components/ui/CoinList";
import CreateCoinCard from "../../components/ui/CreateNewCardSection";
import { useGeneratedCoins } from "../../components/hooks/GenerateCoins";
import BuyCoinModal from "../../components/ui/GenerateCoinDialogue";
import { useNavigate } from "react-router-dom";

const handleError = async (error: string, actionName: string) => {
  console.log(error);
  toast.error(`Something went wrong while ${actionName}`);
};
const handleMissingCredentials = (action : string) => {
  console.log("No credentials found");
  toast.warning(`You must be logged in order to ${action}`);
};
const MarketDashboard = () => {
  const userUid = localStorage.getItem("userUid");
  const accessToken = sessionStorage.getItem("accessToken");

  const { transactions, loading, filters, error, setFilters } =
    useQueriedTransaction((message) => {
      handleError(message, "loading the most recent transactions!");
    });

  const { coinHistory, setCoinUid } = useCoinHistory(
    (message) => {
      handleError(message, "loading the coin history!");
    },
    () => setShowHistoryModal(true)
  );

  const { coin, setCoinId } = useCoin((message) => {
    handleError(message, "retrieving coin information!");
  });

  const [showGenerateDialogue, setGenerateDialogeVisibility] = useState(false);
  const { newCoins, setAmount } = useGeneratedCoins(
    userUid,
    accessToken,
    (message) => {
      handleError(message, "loading the coin history!");
    },
    () => {handleMissingCredentials("generate new BitSlows!")}
  );
  const { coins } = useCoinDatabase(
    (message) => {
      handleError(message, "loading the coin database!");
    },
    () => {}
  );

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [lastRefreshMoment, setNewMoment] = useState(new Date());
  const navigate = useNavigate()
  // Fixed transaction refresh function
  const transactionRefresh = () => {
    const now = new Date();
    const newFilters = { ...filters, afterDateTimeStamp: now.toISOString() };
    setFilters(newFilters);
    console.log(`Last Update Moment: ${lastRefreshMoment.toISOString()}`);
    setNewMoment(now);
    toast.info("Refreshed transactions data");
  };

  // Fixed interval - 5 minutes in milliseconds (300000ms)
 // useIntervalEffect(transactionRefresh, 300000); // 5 * 60 * 1000

  const handleGoBack = () => {
    // Implementation for going back - adjust as needed
    toast.info("Navigating back...");
    navigate(-1)
    // You might want to use router.push('/previous-page') or similar here
  };

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <div className="mb-2">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Market Dashboard</h1>
      </div>

      {/* Top Row - Two Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CreateCoinCard
          remainingItem={1000 - coins.length}
          createNewCoin={() => {
            setGenerateDialogeVisibility(true)
          }}
        />

        {/* View All Coins Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col items-center gap-2 mb-4">
            <CoinsIcon className="text-amber-500 w-5 h-5" />
            <h2 className="text-lg font-semibold">Coin Database</h2>

            <p> See all the existing coins and spend some moooney</p>
          </div>
          <div className="overflow-x-auto">
            <CoinList
              coins={coins}
              buyButtonEnables={true}
              onClick={(coin) => {
                setCoinId(coin.coin_id);
                setShowHistoryModal(true);
              }}
              onClickToBuy={() => {}}
            />
          </div>
        </section>
      </div>

      {/* Bottom Row - Transactions (Full Width) */}
      <section className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <ClockIcon className="text-blue-500 w-5 h-5" />
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
        </div>

        <TransactionFilter
          filters={filters}
          itemCount={transactions.length}
          onFilterChange={setFilters}
        />

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-gray-400 mt-6 text-center py-4">
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
      {/* Coin History Modal */}
      <BuyCoinModal
        isOpen={showGenerateDialogue}
        onClose={() => {
          setGenerateDialogeVisibility(false)
        }}
        maxAmount={1000 - coins.length}
        onBuy = {(value : number) => {
          setAmount(value)
        }}
      />
      <ToastContainer/>
    </div>
  );
};

export default MarketDashboard;
