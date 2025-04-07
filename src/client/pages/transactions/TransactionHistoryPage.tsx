import { useState, useEffect } from "react";
import { FaUser, FaStore, FaHistory } from "react-icons/fa"; // Import icons from react-icons
import TransactionLoader from "../../components/ui/TransactionLoader";
import TransactionTable from "../../components/ui/TransactionTable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TransactionFilter } from "../../components/ui/TransactionFilter";

import { useNavigate } from "react-router-dom"; // Correct hook for React Router v6+
import { Coin } from "../../components/ui/CoinHistory";
import { useQueriedTransaction } from "../../components/hooks/QueryTransactions";
import { useCoinHistory } from "../../components/hooks/CoinHistory";
import CoinHistoryModal from "../../components/ui/CoinHistory";

export function TransactionsPage() {
  const { transactions, loading, filters, error, setFilters, setLoading } =
    useQueriedTransaction();
  const [loadingTime, setLoadingTime] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for the sidebar toggle
  const { coinHistory, setCoinUid } = useCoinHistory(
    (error: string) => toast.error(error),
    () => setShowHistoryModal(true) // <- open modal *after* history is loaded
  );

  const [currentCoin, setCoin] = useState<Coin | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
  }, [filters]);
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
    if (error) toast.error(error.message);
  }, [error]);

  if (loading) {
    return <TransactionLoader loadingTime={loadingTime} />;
  }

  const goToProfile = () => {
    const userUid = localStorage.getItem("userUid");
    if (userUid === null || undefined) {
      toast.warning("You are not logged in at the moment!");
      navigate("/");
    } else {
      navigate(`/profile/${userUid}`);
    }
  };

  const goToMarketplace = () => {
    navigate("/marketplace");
  };

  const goToTransactions = () => {
    navigate("/transactions");
  };

  // Toggle the sidebar open and close
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 shadow-lg py-6 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Hamburger Button (left) */}
          <button className="text-white" onClick={toggleSidebar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Shop Name (right) */}
          <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg">
            BitSlowShop
          </h1>
        </div>
      </header>

      {/* Sidebar for mobile and desktop */}
      <div
        className={`fixed inset-0 z-50  transition-all ease-in-out duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      >
        <div
          className="w-64 h-full bg-sky-100 p-4 transition-all duration-300 ease-in-out transform"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Profile Button */}
          <div className="mb-6">
            <button
              onClick={goToProfile}
              className="flex items-center w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-200"
            >
              <FaUser className="mr-3 text-xl" />
              <div>
                <h4 className="font-semibold">Profile</h4>
                <p className="text-sm text-gray-500">Manage your profile</p>
              </div>
            </button>
          </div>

          {/* Marketplace Button */}
          <div className="mb-6">
            <button
              onClick={goToMarketplace}
              className="flex items-center w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-200"
            >
              <FaStore className="mr-3 text-xl" />
              <div>
                <h4 className="font-semibold">Marketplace</h4>
                <p className="text-sm text-gray-500">Browse available items</p>
              </div>
            </button>
          </div>

          {/* Transactions Button */}
          <div className="mb-6">
            <button
              onClick={goToTransactions}
              className="flex items-center w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-200"
            >
              <FaHistory className="mr-3 text-xl" />
              <div>
                <h4 className="font-semibold">Transactions</h4>
                <p className="text-sm text-gray-500">
                  View your transaction history
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-grow max-w-7xl mx-auto p-4 w-full">
        <div>
          <h1>Transaction History</h1>
          <p>See all the transactions that have taken place</p>
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
              console.log(transaction)
              const clicked: Coin = {
                coin_id: transaction.coinId,
                value: transaction.amount,
                bit1: transaction.bit1,
                bit2: transaction.bit2,
                bit3: transaction.bit3,
                created_at: transaction.date,
                bitSlow :  transaction.bitSlow
              };
              setCoinUid(clicked.coin_id);
              setCoin(clicked);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 py-4 text-center text-white text-sm">
        © {new Date().getFullYear()} BitSlowShop — All rights reserved.
      </footer>
      <CoinHistoryModal
        isOpen={showHistoryModal}
        onClose={() => {
          setCoinUid(-1);
          setShowHistoryModal(false);
        }}
        coin={currentCoin}
        history={coinHistory}
      />
      <ToastContainer />
    </div>
  );
}

export default TransactionsPage;
