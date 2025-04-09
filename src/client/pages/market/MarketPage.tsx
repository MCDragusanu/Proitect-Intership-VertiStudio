import React, { useState, useEffect } from "react";
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
import TransactionLoader from "../../components/ui/TransactionLoader";
import { useCoinSupply } from "../../components/hooks/CoinSupply";
import { FaTimes } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
const handleError = async (error: string, actionName: string) => {
	console.log(error);
	toast.error(`Something went wrong while ${actionName}`);
};

const MarketDashboard = () => {
	const userUid = localStorage.getItem("userUid");
	const accessToken = sessionStorage.getItem("accessToken");
	const [showHistoryModal, setShowHistoryModal] = useState(false);

	const {
		transactions,
		loading: transactionsLoading,
		filters,
		error,
		setFilters,
		setLoading: setTransactionsLoading,
	} = useQueriedTransaction((message) => {
		handleError(message, "loading the most recent transactions!");
	});
	const { amount, setRefreshSupply } = useCoinSupply(
		(error: string) => {
			handleError(error, "retrieving coin supply!");
		},
		() => {},
	);
	const { coinHistory, setCoinUid } = useCoinHistory(
		(message) => {
			handleError(message, "loading the coin history!");
		},
		() => setShowHistoryModal(true),
	);

	const { coin, setCoinId } = useCoin((message) => {
		handleError(message, "retrieving coin information!");
	});

	const [showGenerateDialogue, setGenerateDialogeVisibility] = useState(false);
	const handleMissingCredentials = (action: string) => {
		console.log("No credentials found");
		toast.warning(`You must be logged in order to ${action}`);
		if (showGenerateDialogue) {
			setGenerateDialogeVisibility(false);
		}
	};
	const { newCoins, setAmount, newCoinsLoading } = useGeneratedCoins(
		userUid,
		accessToken,
		(message) => {
			handleError(message, "loading the coin history!");
		},
		() => {
			handleMissingCredentials("generate new BitSlows!");
		},
		() => {
			toast.success("You successfully generated new BitSlows");
			setGenerateDialogeVisibility(false);
			setRefresh((prev) => !prev);
			setRefreshSupply((prev) => !prev);
		},
	);

	// Track coin database loading separately
	const [coinsLoading, setCoinsLoading] = useState(true);

	const { coins, setCoins, setRefresh } = useCoinDatabase(
		(message) => {
			handleError(message, "loading the coin database!");
		},
		() => {
			setCoinsLoading(false); // Set coinsLoading to false after coins are loaded
		},
	);

	const [loadingTime, setLoadingTime] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		let timerId: number | undefined;

		if (transactionsLoading) {
			timerId = window.setInterval(() => {
				setLoadingTime((prevTime) => prevTime + 1);
			}, 1000);
		}

		return () => {
			if (timerId) clearInterval(timerId);
		};
	}, [transactionsLoading]);

	const handleGoBack = () => {
		toast.info("Navigating back...");
		navigate(-1);
	};

	// Show loading indicator for transactions if still loading
	if (coinsLoading || transactionsLoading) {
		return <TransactionLoader loadingTime={loadingTime} />;
	}

	// Coin database loader component
	const CoinDatabaseLoader = () => (
		<div className="flex flex-col items-center justify-center h-full py-8">
			<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mb-4"></div>
			<p className="text-gray-600">Loading coin database...</p>
		</div>
	);
	//const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const goToRoot = () => navigate("/");
	const goToTransactions = () => navigate("/transactions");
	const goToSignUp = () => navigate("/register");
	const goToProfile = () => {
		if (!accessToken || !userUid) {
			toast.info("You are not logged in at the moment!");
		} else {
			navigate(`/profile/${userUid}`);
		}
	};
	//const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

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
			<header className="bg-white shadow-md border-b-2 border-blue-500 py-4 px-4 sticky top-0 z-10">
				<div className="max-w-7xl mx-auto flex justify-between items-center">
					{/* Logo and Brand */}
					<div className="flex items-center">
						<h1
							className="text-2xl md:text-3xl font-bold cursor-pointer bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
							onClick={goToRoot}
						>
							BitSlowShop
						</h1>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-6">
						<button
							onClick={goToTransactions}
							className="text-gray-700 hover:text-blue-500 font-medium transition-colors"
						>
							Transaction
						</button>
						<button
							onClick={goToProfile}
							className="text-gray-700 hover:text-blue-500 font-medium transition-colors"
						>
							My Profile
						</button>
						<button
							onClick={goToSignUp}
							className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
						>
							Sign Up / Login
						</button>
					</nav>
				</div>
			</header>

			{/* Top Row - Two Sections */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<CreateCoinCard
					remainingItem={amount}
					createNewCoin={() => {
						setGenerateDialogeVisibility(true);
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
						{coinsLoading ? (
							<CoinDatabaseLoader />
						) : (
							<CoinList
								coins={coins}
								buyButtonEnables={true}
								onClick={(coin) => {
									setCoinId(coin.coin_id);
									setCoinUid(coin.coin_id);
									setShowHistoryModal(true);
								}}
								onClickToBuy={() => {}}
							/>
						)}
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

				{transactionsLoading ? (
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

			{/* Coin Generation Modal */}
			<BuyCoinModal
				isOpen={showGenerateDialogue}
				onClose={() => {
					setGenerateDialogeVisibility(false);
				}}
				maxAmount={amount}
				onBuy={(value: number) => {
					setAmount(value);
				}}
			/>
			<ToastContainer />
		</div>
	);
};

export default MarketDashboard;
