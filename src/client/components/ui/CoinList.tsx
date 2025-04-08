import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";
import { SiBit } from "react-icons/si";
import CoinCard from "./CoinCard";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CoinListProps = {
  coins: CoinDTO[];
  buyButtonEnables : boolean
  onClick?: (coin: CoinDTO) => void;
  onClickToBuy: (coin: CoinDTO) => void;
  
};

export const CoinList: React.FC<CoinListProps> = ({ coins, buyButtonEnables , onClick, onClickToBuy }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(coins.length / itemsPerPage);
  
  // Calculate items for current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCoins = coins.slice(indexOfFirstItem, indexOfLastItem);
  
  // Page change handlers
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  
  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
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
              No coins found in your collection
            </p>
            <p className="text-gray-400 mt-2">
              Transactions will appear here once you acquire coins
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {currentCoins.map((coin) => (
              <CoinCard
                key={coin.coin_id}
                coin={coin}
               // buyButtonEnabled = {buyButtonEnables}
                onClick={onClick}
                onActionClicked={onClickToBuy}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Pagination Controls */}
      {coins.length > 0 && (
        <div className="flex items-center justify-between mt-4 border-t pt-3">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, coins.length)} of {coins.length} coins
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
            
            <div className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-1 rounded-md ${
                currentPage === totalPages 
                  ? "text-gray-300 cursor-not-allowed" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};