import { useState, useEffect, useLayoutEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TransactionLoader from "../../components/ui/TransactionLoader";
import TransactionTable from "../../components/ui/TransactionTable";
import { TransactionFilter } from "../../components/ui/TransactionFilter";
import { useNavigate } from "react-router-dom";
import { fetchAccessToken } from "../../requrests/RefreshToken";
import CoinCard from "../../components/ui/CoinCard";
import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";
import CoinHistoryModal from "../../components/ui/CoinHistory";
import { logoutUser } from "../../requrests/UserLogout";
import { useCoinHistory } from "../../components/hooks/CoinHistory";
import { useTransactions as useLoadUserTransactions } from "../../components/hooks/LoadUserTransactions";
import { useProfileInformation } from "../../components/hooks/LoadUserInformation";
import { parseToken } from "../../requrests/parseJWT";

import {
  User,
  DollarSign,
  ArrowUpCircle,
  ChevronLeft,
  Clock,
  Award,
  BarChart3,
  Coins,
} from "lucide-react";
import { SiBit } from "react-icons/si";
import { delay } from "framer-motion";
import { CoinList } from "../../components/ui/CoinList";
import { useCoin } from "../../components/hooks/GetCoin";

const Dashboard = () => {
  const navigate = useNavigate();
  const userUid = localStorage.getItem("userUid");
  const [currentToken, setAccessToken] = useState(
    sessionStorage.getItem("accessToken")
  );
   
  const [loadingTime, setLoadingTime] = useState(0);

  const handleFailedRefresh = async (error: string) => {
    console.log(error);
    toast.error(
      "A valid session has not be found!You must login or register in order to continue "
    );

    //wait 2 secs and redirect to root page
    delay(() => {
      navigate("/");
    }, 2000);
  };
  const handleError = async (error: string, actionName: string) => {
    console.log(error);
    toast.error(`Something went wrong while ${actionName}`);
  };

  useLayoutEffect(() => {
    const fetchToken = async (token: string) => {
      fetchAccessToken(
        token,
        (newToken: string) => {
          setAccessToken(newToken);
          const decodedToken = parseToken(newToken);
          sessionStorage.setItem("accessToken", newToken);
          localStorage.setItem("userUid", decodedToken.userUid);
          localStorage.setItem("role", decodedToken.userRole);
        },
        () => {
          console.log("Session Expired!");
          navigate("/");
          toast.warn("Session is expired");
        },
        (error: any) => {
          console.log(
            error.message || "Error occurred while validating session"
          );
          toast.error(
            error.message || "Error occurred while validating session"
          );
          navigate("/");
        }
      );
    };

    fetchToken(currentToken || "Oopsie");
  }, [currentToken, navigate]);

  const { transactions, filters, transactionsAreLoading, error, setFilters } =
    useLoadUserTransactions(
      userUid || "Ooopsie",
      currentToken || "Ooooopsie",
      (message: string) => {
        handleError(message, "retrieving your transactions!");
      },
      handleFailedRefresh
    );

  const {
    coins,
    profile,
    monetaryValue,
    loading: profileLoading,
    error: profileError,
  } = useProfileInformation(
    userUid || "Ooopsie",
    currentToken || "Ooooopsie",
    (message: string) => {
      handleError(message, "retrieving your information!");
    },
    handleFailedRefresh
  );

  const { coinHistory, setCoinUid } = useCoinHistory(
    (error: string) => handleError(error, "retrieving coin history"),
    () => setShowHistoryModal(true)
  );
  const [coinId , setCoinId] = useState(-1)
  const {coin ,loading} = useCoin(coinId , (message : string) => {
    handleError(message, "retrieving coin information!");
  })
 
  const [showHistoryModal, setShowHistoryModal] = useState(false);

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

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    if (currentToken && userUid) {
      logoutUser(
        userUid,
        currentToken,
        (message) => {
          handleError(message, "logging you out!");
        },
        handleFailedRefresh
      );
    }

    navigate("/");
  };

  // Handle back navigation
  const handleBackNavigation = () => {
    navigate(-1); // Go back to previous page
  };

  if (!userUid || !currentToken) {
    handleFailedRefresh("You must be signed in order to continue")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Back Button */}
      <header className="bg-white shadow-md py-4 px-8">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackNavigation}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-8">
        {/* Main Overview Section */}
        <section className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <BarChart3 size={24} className="text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold">Overview</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Your account at a glance - key metrics summarized
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Monetary Value */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md flex items-center border border-blue-200">
              <div className="bg-blue-200 p-3 rounded-full">
                <DollarSign size={24} className="text-blue-700" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg text-blue-700">
                  Monetary Value
                </h3>
                <p className="text-2xl font-bold text-blue-800">
                  {monetaryValue ? `$${monetaryValue.toFixed(2)}` : "$0.00"}
                </p>
              </div>
            </div>

            {/* Number of Transactions */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-md flex items-center border border-green-200">
              <div className="bg-green-200 p-3 rounded-full">
                <ArrowUpCircle size={24} className="text-green-700" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg text-green-700">
                  Transactions
                </h3>
                <p className="text-2xl font-bold text-green-800">
                  {transactions.length}
                </p>
              </div>
            </div>

            {/* Number of Coins */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-md flex items-center border border-yellow-200">
              <div className="bg-yellow-200 p-3 rounded-full">
                <SiBit size={24} className="text-yellow-700" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg text-yellow-700">
                  Owned Coins
                </h3>
                <p className="text-2xl font-bold text-yellow-800">
                  {coins.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Section */}
        <section className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <User size={24} className="text-indigo-600 mr-3" />
            <h2 className="text-2xl font-semibold">Profile Information</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Your personal details and account information
          </p>

          <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-6 md:mb-0">
              <User size={48} className="text-indigo-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 flex-grow">
              <div>
                <p className="text-gray-500 text-sm">Full Name</p>
                <p className="font-medium text-lg">
                  {profile.name || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Role</p>
                <p className="font-medium text-lg">
                  {localStorage.getItem("role") || "User"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Address</p>
                <p className="font-medium">
                  {profile.adress || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">City</p>
                <p className="font-medium">{profile.city || "Not provided"}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Country</p>
                <p className="font-medium">
                  {profile.country || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Account Created</p>
                <p className="font-medium">
                  {profile.account_creation_date
                    ? new Date(
                        profile.account_creation_date
                      ).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transactions Section */}
        <section className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <Clock size={24} className="text-purple-600 mr-3" />
            <h2 className="text-2xl font-semibold">Transactions</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Your transaction history and records
          </p>

          {/* Filter Section */}
          <TransactionFilter
            itemCount={transactions.length}
            filters={filters}
            onFilterChange={(updatedFilters) => setFilters(updatedFilters)}
          />

          {/* Display Transactions */}
          <div className="mt-6">
            {transactionsAreLoading ? (
              <TransactionLoader loadingTime={loadingTime} />
            ) : error ? (
              <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="font-medium">Error loading transactions:</p>
                <p>{error.message}</p>
              </div>
            ) : (
              <TransactionTable
                transactions={transactions}
                onRowClick={(transaction) => {
                  console.log(transaction);
                  setCoinId(transaction.coinId);
                }}
              />
            )}
          </div>
        </section>

        {/* Coins Section */}
        <section className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <Coins size={24} className="text-amber-600 mr-3" />
            <h2 className="text-2xl font-semibold">Coins</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Your coin collection and portfolio
          </p>
          <CoinList coins = {coins} onClick={(coin) => {
            setCoinId(coin.coin_id)
            setShowHistoryModal(true)}} onClickToBuy={()=>{}}/>
           
          
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} BitSlow Platform. All rights
            reserved.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <CoinHistoryModal
        isOpen={showHistoryModal}
        onClose={() => {
          setCoinUid(-1);
          setShowHistoryModal(false);
        }}
        coin={coin}
        history={coinHistory}
      />

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Dashboard;
