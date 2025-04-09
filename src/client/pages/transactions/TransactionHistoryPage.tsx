import { useState, useEffect } from "react";
import {

	FaHistory,
	
	FaBars,
	FaTimes,
} from "react-icons/fa";
import TransactionLoader from "../../components/ui/TransactionLoader";
import TransactionTable from "../../components/ui/TransactionTable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TransactionFilter } from "../../components/ui/TransactionFilter";
import { useNavigate } from "react-router-dom";
import { useQueriedTransaction } from "../../components/hooks/QueryTransactions";
import { useCoinHistory } from "../../components/hooks/CoinHistory";
import CoinHistoryModal from "../../components/ui/CoinHistory";
import { useCoin } from "../../components/hooks/GetCoin";

const handleError = (message: string, actionName: string) => {
	console.log(message);
	toast.error(`Something went wrong ${actionName}!`);
};

export function TransactionsPage() {
	const { transactions, loading, filters, error, setFilters, setLoading } =
		useQueriedTransaction((message: string) => {
			handleError(message, "while loading the transactions");
		});

	const { coin, setCoinId } = useCoin((message: string) => {
		handleError(message, "retrieving coin information");
	});

	const [loadingTime, setLoadingTime] = useState(0);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const { coinHistory, setCoinUid } = useCoinHistory(
		(error: string) => {
			handleError(error, "while loading the coin history");
		},
		() => setShowHistoryModal(true),
	);

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
		if (error) handleError(error.message, "");
	}, [error]);

	if (loading) {
		return <TransactionLoader loadingTime={loadingTime} />;
	}

	const goToProfile = () => {
		const userUid = localStorage.getItem("userUid");
		const accessToken = sessionStorage.getItem("accessToken");

		if (!userUid || !accessToken) {
			toast.warning(
				"You are not logged in at the moment! You must login in order to continue",
			);
		} else {
			navigate(`/profile/${userUid}`);
		}
	};

	const goToRoot = () => navigate("/");
	const goToMarketplace = () => navigate("/marketplace");
	const goToSignUp = () => navigate("/register");

	const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

	return (
		<div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
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
							onClick={goToMarketplace}
							className="text-gray-700 hover:text-blue-500 font-medium transition-colors"
						>
							Marketplace
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

					{/* Mobile Menu Button */}
					<button
						className="md:hidden text-gray-700 focus:outline-none"
						onClick={toggleMobileMenu}
					>
						{mobileMenuOpen ? (
							<FaTimes className="h-6 w-6" />
						) : (
							<FaBars className="h-6 w-6" />
						)}
					</button>
				</div>
			</header>

			{/* Mobile Navigation Menu */}
			{mobileMenuOpen && (
				<div className="bg-white border-b border-gray-200 py-4 px-6 md:hidden">
					<nav className="flex flex-col space-y-4">
						<button
							onClick={() => {
								goToMarketplace();
								setMobileMenuOpen(false);
							}}
							className="text-gray-700 hover:text-blue-500 font-medium text-left"
						>
							Marketplace
						</button>
						<button
							onClick={() => {
								goToProfile();
								setMobileMenuOpen(false);
							}}
							className="text-gray-700 hover:text-blue-500 font-medium text-left"
						>
							My Profile
						</button>
						<button
							onClick={() => {
								goToSignUp();
								setMobileMenuOpen(false);
							}}
							className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium w-full text-center"
						>
							Sign Up / Login
						</button>
					</nav>
				</div>
			)}

			{/* Content */}
			<main className="flex-grow max-w-7xl mx-auto p-4 w-full">
				<div className="bg-white shadow-md rounded-lg p-6 mb-6 border-l-4 border-blue-500">
					<h1 className="text-2xl font-bold text-gray-800 mb-2">
						Transaction History
					</h1>
					<p className="text-gray-600">
						View all transactions that have taken place on the platform
					</p>
				</div>

				<div className="bg-white shadow-md rounded-lg p-6 mb-6">
					<TransactionFilter
						filters={filters}
						itemCount={transactions.length}
						onFilterChange={setFilters}
					/>
				</div>

				<div className="bg-white shadow-md rounded-lg p-6">
					{transactions.length === 0 ? (
						<div className="py-16 text-center">
							<FaHistory className="mx-auto text-blue-300 text-5xl mb-4" />
							<p className="text-gray-400 text-lg">No transactions found</p>
							<p className="text-gray-400">
								Try adjusting your filters to see more results
							</p>
						</div>
					) : (
						<TransactionTable
							transactions={transactions}
							onRowClick={(transaction) => {
								console.log(transaction);
								setCoinId(transaction.coinId);
								setCoinUid(transaction.coinId);
								setShowHistoryModal(true);
							}}
						/>
					)}
				</div>
			</main>

			{/* Footer */}
			<footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-600 text-sm mt-auto">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="mb-4 md:mb-0">
							<span className="font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
								BitSlowShop
							</span>{" "}
							© {new Date().getFullYear()} — All rights reserved.
						</div>
						<div className="flex space-x-6">
							<button className="text-gray-600 hover:text-blue-500 transition-colors">
								Terms
							</button>
							<button className="text-gray-600 hover:text-blue-500 transition-colors">
								Privacy
							</button>
							<button className="text-gray-600 hover:text-blue-500 transition-colors">
								Support
							</button>
						</div>
					</div>
				</div>
			</footer>

			<CoinHistoryModal
				isOpen={showHistoryModal}
				onClose={() => {
					setCoinUid(-1);
					setShowHistoryModal(false);
				}}
				coin={coin}
				history={coinHistory}
			/>

			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
		</div>
	);
}

export default TransactionsPage;
