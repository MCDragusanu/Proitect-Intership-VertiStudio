import React from "react";
import { SiBit } from "react-icons/si";
import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";

type CoinCardProps = {
  coin: CoinDTO;
  onClick?: (coin: CoinDTO) => void;
  onActionClicked : (coin : CoinDTO) => void,
};

const CoinCard: React.FC<CoinCardProps> = ({ coin, onClick, onActionClicked }) => {
  console.log(coin)
  return (
    <div
      className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between bg-neutral-100 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:bg-gray-50 cursor-pointer transition-all duration-300 max-w-4xl gap-4"
      onClick={() => onClick?.(coin)}
    >
      {/* Coin Icon */}
      <div className="absolute top-4 left-4 bg-yellow-400 w-14 h-14 rounded-full flex items-center justify-center shadow-md">
        <SiBit className="text-white text-2xl" />
      </div>

      {/* Spacer to align with icon */}
      <div className="w-16" />

      {/* Main Content */}
      <div className="flex flex-wrap gap-4 ml-2 sm:ml-4">
        {/* BitSlow - Always first */}
        <p className={`font-bold px-3 py-1 rounded-md ${
          coin.bitSlow ? "text-purple-700 bg-purple-100" : "text-gray-400 bg-gray-100 italic"
        }`}>
          BitSlow: {coin.bitSlow ?? "Unavailable"}
        </p>

        <p className="text-gray-800 font-semibold">
          Coin ID: <span className="text-blue-600 font-bold">{coin.coin_id}</span>
        </p>

        <p className="text-gray-800 font-semibold">
          Value: <span className="text-green-600 font-bold">${coin.value}</span>
        </p>

        <p className="text-gray-800 font-semibold">
          Bits: <span className="text-gray-600">{coin.bit1}, {coin.bit2}, {coin.bit3}</span>
        </p>
      </div>

      {/* Used for inserting a button for buying later */}
      {coin.client_id === null && (
        <div className="mt-4 sm:mt-0 sm:ml-auto">
          <button> Click to buy</button>
        </div>
      )}
    </div>
  );
};

export default CoinCard;
