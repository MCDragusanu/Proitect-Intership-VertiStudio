import React, { useState, useEffect } from "react";
import {
	X,
	Coins,
	Check,
	AlertTriangle,
	Info,
	ShieldCheck,
} from "lucide-react";

import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";

type ConfirmCoinModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (coin: CoinDTO) => void;
	selectedCoin: CoinDTO | null;
};

const ConfirmCoinModal: React.FC<ConfirmCoinModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	selectedCoin,
}) => {
	const [isProcessing, setIsProcessing] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setIsProcessing(false);
		}
	}, [isOpen]);

	if (!isOpen || !selectedCoin) return null;

	const handleConfirm = () => {
		setIsProcessing(true);

		// Call the onConfirm callback
		onConfirm(selectedCoin);

		// Note: The parent component will likely handle closing
		// the modal after the API call completes
	};

	const formatDate = (timestamp: number) => {
		return new Date(timestamp).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<div className="fixed inset-0  flex items-center justify-center z-50">
			<div
				className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fadeIn"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-4 text-white">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-2">
							<Coins className="w-5 h-5" />
							<h3 className="text-lg font-bold">Confirm Your Purchase</h3>
						</div>
						<button
							onClick={onClose}
							className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
							disabled={isProcessing}
						>
							<X className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* Body */}
				<div className="p-6">
					{/* Warning Box */}
					<div className="bg-amber-50 p-4 rounded-lg mb-6 flex items-start gap-3">
						<AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
						<p className="text-amber-800 text-sm">
							You are about to purchase this coin. This action cannot be undone.
							Please review the details carefully before confirming.
						</p>
					</div>

					{/* Coin Details */}
					<div className="mb-6">
						<h4 className="text-gray-700 font-medium mb-3">Coin Details</h4>

						<div className="bg-gray-50 rounded-lg p-4">
							<div className="grid grid-cols-2 gap-y-3 text-sm">
								<div className="text-gray-500">Coin ID</div>
								<div className="text-gray-900 font-medium text-right">
									{selectedCoin.coin_id}
								</div>

								<div className="text-gray-500">Value</div>
								<div className="text-gray-900 font-medium text-right">
									{selectedCoin.value}
								</div>

								<div className="text-gray-500">Bits</div>
								<div className="text-gray-900 font-medium text-right">
									{selectedCoin.bit1} / {selectedCoin.bit2} /{" "}
									{selectedCoin.bit3}
								</div>

								<div className="text-gray-500">Created</div>
								<div className="text-gray-900 font-medium text-right">
									{formatDate(selectedCoin.created_at)}
								</div>

								{selectedCoin.bitSlow && (
									<>
										<div className="text-gray-500">BitSlow</div>
										<div className="text-gray-900 font-medium text-right">
											{selectedCoin.bitSlow}
										</div>
									</>
								)}
							</div>
						</div>
					</div>

					{/* Security Note */}
					<div className="flex items-center gap-2 mb-6 bg-blue-50 p-3 rounded-lg">
						<ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
						<p className="text-sm text-blue-700">
							This transaction will be processed securely and added to your
							wallet immediately.
						</p>
					</div>

					{/* Disclaimer */}
					<div className="flex items-start gap-2 mb-6 bg-gray-50 p-3 rounded-lg">
						<Info className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
						<p className="text-xs text-gray-600">
							By confirming this purchase, you agree to the terms and conditions
							of our platform. Cryptocurrency transactions are irreversible.
						</p>
					</div>

					{/* Actions */}
					<div className="flex gap-3">
						<button
							onClick={onClose}
							disabled={isProcessing}
							className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50"
						>
							Cancel
						</button>
						<button
							onClick={handleConfirm}
							disabled={isProcessing}
							className={`flex-1 py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg
                ${isProcessing ? "opacity-75 cursor-not-allowed" : "hover:bg-indigo-700"} 
                flex items-center justify-center gap-2`}
						>
							{isProcessing ? (
								<>
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									Processing...
								</>
							) : (
								<>
									<Check className="w-4 h-4" />
									Confirm Purchase
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ConfirmCoinModal;
