import React from "react";

import { Coin } from "./CoinHistory";
type CoinCardProps = {
  coin: Coin;
  onClick?: (coin: Coin) => void;
};

const CoinCard: React.FC<CoinCardProps> = ({ coin, onClick }) => {
  return (
    <div
      className="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 cursor-pointer transition"
      onClick={() => onClick?.(coin)}
    >
      <h3 className="font-semibold text-lg">Coin ID: {coin.coin_id}</h3>
      <p><strong>Value:</strong> ${coin.value}</p>
      <p><strong>Bits:</strong> {coin.bit1}, {coin.bit2}, {coin.bit3}</p>
      <p><strong>Created At:</strong> {new Date(coin.created_at).toLocaleDateString()}</p>
    </div>
  );
};

export default CoinCard;
