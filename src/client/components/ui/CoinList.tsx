import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";
import { SiBit } from "react-icons/si";
import CoinCard from "./CoinCard";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationParams } from "../../requrests/GetAllCoins";

type CoinListProps = {
	params: PaginationParams;
	coins: CoinDTO[];
	buyButtonEnables: boolean;
	onClick?: (coin: CoinDTO) => void;
	onClickToBuy: (coin: CoinDTO) => void;
	onPageChange: (newPage: number) => void; // 👈 new callback for pagination
};

export const CoinList: React.FC<CoinListProps> = ({
	params,
	coins,
	buyButtonEnables,
	onClick,
	onClickToBuy,
	onPageChange,
}) => {
	const [currentPage, setCurrentPage] = useState(params.pageNumber);

	useEffect(() => {
		setCurrentPage(params.pageNumber);
		console.log(params);
	}, [params.pageNumber]);

	const goToNextPage = () => {
		if (coins.length === params.pageSize) {
			const nextPage = currentPage + 1;
			setCurrentPage(nextPage);
			onPageChange(nextPage);
		}
	};

	const goToPrevPage = () => {
		if (currentPage > 1) {
			const prevPage = currentPage - 1;
			setCurrentPage(prevPage);
			onPageChange(prevPage);
		}
	};

	return (
		<div className="flex flex-col h-full">
			<div
				className="flex-1 overflow-y-auto pr-2"
				style={{ maxHeight: "500px" }}
			>
				{coins.length === 0 ? (
					<div className="p-8 bg-gray-50 rounded-lg border border-gray-200 text-center">
						<SiBit size={48} className="mx-auto text-gray-400 mb-3" />
						<p className="text-gray-500 text-lg">
							Coins are being loaded or no coins are available
						</p>
					</div>
				) : (
					<div className="grid grid-cols-3 gap-4">
						{coins.map((coin) => (
							<CoinCard
								key={coin.coin_id}
								coin={coin}
								buyButtonEnabled={buyButtonEnables}
								onClick={onClick}
								onActionClicked={onClickToBuy}
							/>
						))}
					</div>
				)}
			</div>

			{/* Pagination Controls */}
			<div className="flex items-center justify-between mt-4 border-t pt-3">
				<div className="text-sm text-gray-500">
					Showing {coins.length} coin{coins.length !== 1 && "s"} on page{" "}
					{currentPage}
				</div>
				<div className="flex items-center space-x-2">
					<button
						onClick={goToPrevPage}
						disabled={currentPage === 1}
						className={`p-1 rounded-md ${
							currentPage === 1
								? "text-gray-300 cursor-not-allowed"
								: "text-gray-600 hover:bg-gray-100"
						}`}
					>
						<ChevronLeft size={20} />
					</button>

					<div className="text-sm font-medium">Page {currentPage}</div>

					<button
						onClick={goToNextPage}
						disabled={coins.length < params.pageSize}
						className={`p-1 rounded-md ${
							coins.length < params.pageSize
								? "text-gray-300 cursor-not-allowed"
								: "text-gray-600 hover:bg-gray-100"
						}`}
					>
						<ChevronRight size={20} />
					</button>
				</div>
			</div>
		</div>
	);
};
