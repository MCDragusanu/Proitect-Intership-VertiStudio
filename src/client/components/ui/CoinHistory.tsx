import React from "react";
import { X, ArrowRight } from "lucide-react";
import type { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";

export type CoinHistoryEntry = {
	sellerName: string;
	buyerName: string;
	transactionDate?: string; // Added optional date field
};

type Props = {
	isOpen: boolean;
	onClose: () => void;
	coin: CoinDTO | null;
	history: CoinHistoryEntry[];
};

const CoinHistoryModal: React.FC<Props> = ({
	isOpen,
	onClose,
	coin,
	history,
}) => {
	if (!isOpen || !coin) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center px-4 ">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative">
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
					aria-label="Close modal"
				>
					<X size={20} />
				</button>

				{/* Modal Header */}
				<div className="mb-6 border-b pb-4">
					<h2 className="text-2xl font-bold text-gray-800">
						Coin History - ID #{coin.coin_id}
					</h2>
					<p className="text-sm text-gray-500 mt-1">
						Value: <span className="font-medium">{coin.value} $</span> •
						Created: {new Date(coin.created_at).toLocaleDateString()}
					</p>
				</div>

				{/* Caption */}
				<div className="mb-4">
					<p className="text-gray-700">
						Timeline of all transactions involving this coin:
					</p>
				</div>

				{/* Transaction History */}
				{history.length > 0 ? (
					<div className="space-y-4 max-h-96 overflow-y-auto pr-2">
						{history.map((entry, index) => (
							<div
								key={index}
								className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
							>
								<div className="flex-1 text-sm font-medium text-blue-600">
									{entry.sellerName}
								</div>
								<div className="text-gray-400 mx-2">
									<ArrowRight size={18} />
								</div>
								<div className="flex-1 text-sm font-medium text-green-600">
									{entry.buyerName}
								</div>
								{entry.transactionDate && (
									<div className="text-xs text-gray-500 ml-2">
										{entry.transactionDate}
									</div>
								)}
							</div>
						))}
					</div>
				) : (
					<div className="py-12 flex flex-col items-center justify-center text-center">
						<div className="bg-gray-100 p-4 rounded-full mb-4">
							<X size={24} className="text-gray-400" />
						</div>
						<h3 className="text-lg font-medium text-gray-800 mb-2">
							No Transaction History
						</h3>
						<p className="text-gray-500 max-w-sm">
							This coin hasn't been transferred between users yet.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default CoinHistoryModal;
