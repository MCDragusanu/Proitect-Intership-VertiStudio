import React from "react";
import { SiBit } from "react-icons/si";
import { FaCoins, FaUser, FaCalendarAlt, FaTag } from "react-icons/fa";
import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";

type CoinCardProps = {
	coin: CoinDTO;
	buyButtonEnabled: boolean;
	onClick?: (coin: CoinDTO) => void;
	onActionClicked: (coin: CoinDTO) => void;
};

const CoinCard: React.FC<CoinCardProps> = ({
	coin,
	buyButtonEnabled,
	onClick,
	onActionClicked,
}) => {
	console.log(coin);

	const formatDate = (dateTimestamp: number) => {
		const date = new Date(dateTimestamp);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	return (
		<div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
			{/* Card Header */}
			<div className="relative h-16 bg-gradient-to-r from-blue-400 to-blue-600">
				{/* BitSlow Badge */}
				<div
					className={`absolute top-4 right-4 px-3 py-1 rounded-full ${
						coin.bitSlow
							? "bg-purple-600 text-white"
							: "bg-gray-200 text-gray-500"
					} text-xs font-bold`}
				>
					{coin.bitSlow ? "BitSlow" : "Standard"}
				</div>

				{/* Coin Icon */}
				<div className="absolute -bottom-8 left-6 bg-gradient-to-r from-yellow-400 to-amber-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
					<SiBit className="text-white text-2xl" />
				</div>
			</div>

			{/* Card Body */}
			<div className="p-6 pt-10 cursor-pointer" onClick={() => onClick?.(coin)}>
				<div className="flex justify-between items-start mb-4">
					<div>
						<h3 className="text-xl font-bold text-gray-800">
							Coin #{coin.bitSlow || coin.coin_id}
						</h3>
						<p className="text-blue-500 font-medium">
							${coin.value.toFixed(2)}
						</p>
					</div>
				</div>

				{/* Divider */}
				<div className="border-t border-gray-100 my-4"></div>

				{/* Coin Details */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
					<div className="flex items-center text-gray-600">
						<FaCoins className="mr-2 text-blue-400" />
						<span className="font-medium">Bits:</span>
						<span className="ml-2">
							{coin.bit1}, {coin.bit2}, {coin.bit3}
						</span>
					</div>

					<div className="flex items-center text-gray-600">
						<FaCalendarAlt className="mr-2 text-blue-400" />
						<span className="font-medium">Created:</span>
						<span className="ml-2">{formatDate(coin.created_at)}</span>
					</div>

					{coin.contract_id !== null && (
						<div className="flex items-center text-gray-600 col-span-2">
							<FaUser className="mr-2 text-blue-400" />
							<span className="font-medium">Owner:</span>
							<span className="ml-2 truncate">{coin.contract_id}</span>
						</div>
					)}
				</div>
			</div>

			{/* Card Footer */}
			{coin.contract_id === "" && buyButtonEnabled && (
				<div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
					<button
						onClick={(e) => {
							e.stopPropagation();
							onActionClicked(coin);
						}}
						className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
					>
						<FaTag className="mr-2" />
						Purchase Coin
					</button>
				</div>
			)}
		</div>
	);
};

export default CoinCard;
