import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";
import { SiBit } from "react-icons/si";
import CoinCard from "./CoinCard";
import React from "react";

type CoinListProps = {
  coins: CoinDTO[];
  onClick?: (coin: CoinDTO) => void;
  onClickToBuy : (coin : CoinDTO) => void; 
};
export const CoinList: React.FC<CoinListProps>= ({coins , onClick , onClickToBuy}) => {
    return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coins.length === 0 ? (
              <div className="col-span-full p-8 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <SiBit size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 text-lg">
                  No coins found in your collection
                </p>
                <p className="text-gray-400 mt-2">
                  Transactions will appear here once you acquire coins
                </p>
              </div>
            ) : (
              coins.map((coin) => (
                <CoinCard
                  key={coin.coin_id}
                  coin={coin}
                  onClick={onClick}
                  onActionClicked = {onClickToBuy}
                />
              ))
            )}
          </div>
}