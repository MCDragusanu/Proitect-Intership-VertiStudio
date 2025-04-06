import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TransactionLoader from "../../components/ui/TransactionLoader";
import TransactionTable from "../../components/ui/TransactionTable";
import { TransactionFilter } from "../../components/ui/TransactionFilter";
import { useNavigate } from "react-router-dom"; // React Router v6+
import { RefreshTokens } from "../../activities/RefreshToken";
import CoinCard from "../../components/ui/CoinCard";
import { Coin } from "../../components/ui/CoinHistory";
import CoinHistoryModal from "../../components/ui/CoinHistory";
import { logoutUser } from "../../activities/UserLogout";
import { useCoinHistory } from "../../components/hooks/CoinHistory";
import { useTransactions as useLoadUserTransactions } from "../../components/hooks/LoadUserTransactions";
import { useProfileInformation } from "../../components/hooks/LoadUserInformation";
import { useRefreshToken } from "../../components/hooks/RefreshToken";
import { RefreshTokenResponse } from "../../components/hooks/RefreshToken";

const Dashboard = () => {
  const userUid = localStorage.getItem("userUid");
  const [currentToken, setAccessToken] = useState(
    sessionStorage.getItem("accessToken")
  );

  const navigate = useNavigate();
  const [loadingTime, setLoadingTime] = useState(0);
  const { transactions, filters, transactionsAreLoading, error, setFilters } =
    useLoadUserTransactions(userUid || "Ooopsie", currentToken || "Ooooopsie");
  const { accessToken, refreshTokenError, refreshTokenLoading } =
    useRefreshToken(currentToken);

  const {
    coins,
    profile,
    monetaryValue,
    loading: profileLoading,
    error: profileError,
  } = useProfileInformation(
    userUid || "Ooopsie",
    currentToken || "Ooooopsie",
    () => {}
  );

  const { coinHistory, setCoinUid } = useCoinHistory(
    (error: string) => toast.error(error),
    () => setShowHistoryModal(true) // <- open modal *after* history is loaded
  );

  const [currentCoin, setCoin] = useState<Coin | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  useEffect(() => {
    if (currentToken === null) {
      RefreshTokens("EXPIRED")
        .catch((error: any) => {
          toast.error("Sessiom expired you have to login");
          localStorage.removeItem("userUid");
        })
        .then((data) => {
          console.log(data);
          if (data === null) {
            localStorage.removeItem("userUid");
            navigate("/");
            return;
          } else {
            const result = data as RefreshTokenResponse;
            sessionStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("userUid", result.userUid);
          }
        });
    }
  }, [currentToken]);
  useEffect(() => {
    if (refreshTokenError) {
      // Handle error
      console.error("Token refresh failed:", refreshTokenError);
      toast.error("Sesssion Expired. You have to login");
      navigate("/");
    }
  }, [refreshTokenError]);

  useEffect(() => {
    let timerId: number | undefined;

    if (transactionsAreLoading) {
      timerId = window.setInterval(() => {
        setLoadingTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [transactionsAreLoading]);

  if (!userUid || !currentToken) {
    console.log("User UID or Access Token missing.");
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Main Overview Section */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Monetary Value */}
          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <h3 className="font-bold text-lg text-blue-600">Monetary Value</h3>
            <p className="text-xl">
              {monetaryValue ? `$${monetaryValue.toFixed(2)}` : "0.0"}
            </p>
          </div>
          {/* Number of Transactions */}
          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <h3 className="font-bold text-lg text-green-600">Transactions</h3>
            <p className="text-xl">{transactions.length}</p>
          </div>
          {/* Number of Coins */}
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
            <h3 className="font-bold text-lg text-yellow-600">Owned Coins</h3>
            <p className="text-xl">{coins.length}</p>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
        <div className="space-y-4">
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Address:</strong> {profile.adress}
          </p>
          <p>
            <strong>City:</strong> {profile.city}
          </p>
          <p>
            <strong>Country:</strong> {profile.country}
          </p>
          <p>
            <strong>Account Creation Date:</strong>{" "}
            {profile.account_creation_date}
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => {
              logoutUser(
                userUid || "Oopsie",
                currentToken || "Ooopise",
                (errorMessage) => {
                  toast.error(errorMessage);
                },
                (errorMessage) => {
                  toast.error(errorMessage);
                }
              );
              sessionStorage.removeItem("accessToken");
              localStorage.removeItem("userUid");

              navigate("/"); // Assuming you have a login route
            }}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </section>

      {/* Transactions Section */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Transactions</h2>

        {/* Filter Section */}
        <TransactionFilter
          itemCount={transactions.length}
          filters={filters}
          onFilterChange={(updatedFilters) => setFilters(updatedFilters)}
        />

        {/* Display Transactions */}
        {transactionsAreLoading ? (
          <TransactionLoader loadingTime={loadingTime} />
        ) : error ? (
          <div className="text-red-500">
            Error loading transactions: {error.message}
          </div>
        ) : (
          <TransactionTable
            transactions={transactions}
            onRowClick={(transaction) => {
              const clicked: Coin = {
                coin_id: transaction.coinId,
                value: transaction.amount,
                bit1: transaction.bit1,
                bit2: transaction.bit2,
                bit3: transaction.bit3,
                created_at: transaction.date,
              };
              setCoinUid(clicked.coin_id);
              setCoin(clicked);
            }}
          />
        )}
      </section>

      {/* Coins Section */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Coins</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coins.length === 0 ? (
            <p>No coins found</p>
          ) : (
            coins.map((coin) => (
              <CoinCard
                key={coin.coin_id}
                coin={coin}
                onClick={(selectedCoin) => {
                  setCoin(selectedCoin);
                  setCoinUid(selectedCoin.coin_id); // triggers history + modal
                }}
              />
            ))
          )}
        </div>
      </section>
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
};

export default Dashboard;
