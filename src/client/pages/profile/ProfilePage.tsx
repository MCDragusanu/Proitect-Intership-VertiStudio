import { useState, useEffect } from "react";
import { FaCoins, FaHistory, FaUser, FaStore } from "react-icons/fa"; // Import icons from react-icons
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TransactionLoader from "../../components/ui/TransactionLoader";
import TransactionTable from "../../components/ui/TransactionTable";
import { TransactionFilter } from "../../components/ui/TransactionFilter";

import {  fetchTransactionsByUser } from "../../activities/getTransactions";
import { fetchUserInformation } from "../../activities/getUserInformation";
import { useNavigate } from "react-router-dom"; // React Router v6+
import { RefreshTokens } from "../../activities/RefreshToken";

function loadUserTransactions(
  filters: any,
  userUid: string,
  accessToken: string,
  callback: (message: string) => void
): Promise<any[]> {
  return fetchTransactionsByUser(filters, userUid, accessToken, callback);
}

function loadUserInformation(
  userUid: string,
  accessToken: string,
  errorCallback: (message: string) => void,
  unAuthorizedAccessCallback: (message: string) => void
) {
  return fetchUserInformation(userUid, accessToken, errorCallback, unAuthorizedAccessCallback);
}

function useProfileInformation(userUid: string, accessToken: string, unAuthorizedAccessCallback: (message: string) => void) {
  const [coins, setCoins] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({});
  const [monetaryValue, setMonetaryValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const onError = (error: Error) => {
    setError(error);
    setLoading(false);
    toast.error(`Error fetching data: ${error.message}`);
  };

  useEffect(() => {
    loadUserInformation(userUid, accessToken, (message) => {
      onError(new Error(message));
    }, unAuthorizedAccessCallback)
      .then((data) => {
        setCoins(data.coins);
        setMonetaryValue(data.monetaryValue);
        setProfile(data.profile);
        setLoading(false);
      })
      .catch(onError);
  }, []);

  return { coins, profile, monetaryValue, loading, error };
}

function useTransactions(userUid: string, accessToken: string) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return { transactions, filters, loading, error, setFilters };
}

const Dashboard = () => {
  const userUid = localStorage.getItem("userUid");
  const [currentToken  , setAccessToken] = useState(sessionStorage.getItem("accessToken"));
  const navigate = useNavigate();
  const [loadingTime, setLoadingTime] = useState(0);
  const { transactions, filters, loading, error, setFilters } = useTransactions(userUid || "Ooopsie", currentToken || "Ooooopsie");
  const { coins, profile, monetaryValue, loading: profileLoading, error: profileError } = useProfileInformation(userUid || "Ooopsie", currentToken || "Ooooopsie", () => {});
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
    // Define the async function inside useEffect
    const refreshTokens = async () => {
      try {
        // Call the RefreshTokens function (you need to define or import this function)
        const { userUid, lastLogin, accessToken, errorMessage } = await RefreshTokens(currentToken || "EXPIRED");
        
        // Save the tokens and user information to localStorage and sessionStorage
        localStorage.setItem("userUid", userUid);
        sessionStorage.setItem("accessToken", accessToken);
        
        // Update the state
        setAccessToken(accessToken);
       

        // If there's an error message, you can handle it here (optional)
        if (errorMessage) {
          console.error("Error refreshing token:", errorMessage);
        }
      } catch (error) {
        console.error("Error during token refresh:", error);
      }
    };

    if (currentToken) {
      refreshTokens();
    } else {
      console.log("Access token is missing or expired");
    }
  }, [currentToken]);

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
            <p className="text-xl">{monetaryValue ? `$${monetaryValue.toFixed(2)}` : "0.0"}</p>
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
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Address:</strong> {profile.adress}</p>
          <p><strong>City:</strong> {profile.city}</p>
          <p><strong>Country:</strong> {profile.country}</p>
          <p><strong>Account Creation Date:</strong> {profile.account_creation_date}</p>
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
        {loading ? (
          <TransactionLoader loadingTime={loadingTime} />
        ) : error ? (
          <div className="text-red-500">Error loading transactions: {error.message}</div>
        ) : (
          <TransactionTable transactions={transactions} />
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
              <div key={coin.coin_id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg">Coin ID: {coin.coin_id}</h3>
                <p><strong>Value:</strong> ${coin.value}</p>
                <p><strong>Bits:</strong> {coin.bit1}, {coin.bit2}, {coin.bit3}</p>
                <p><strong>Created At:</strong> {new Date(coin.created_at).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
