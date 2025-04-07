import React from "react";
import { X, ArrowRight, ArrowLeft } from "lucide-react";

export type Coin = {
  coin_id: number;
  value: number;
  bit1: number;
  bit2: number;
  bit3: number;
  created_at: number;
  bitSlow : string | null 
};

export type CoinHistoryEntry = {
  sellerName: string;
  buyerName: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  coin: Coin | null;
  history: CoinHistoryEntry[];
};

const CoinHistoryModal: React.FC<Props> = ({ isOpen, onClose, coin, history }) => {
  if (!isOpen) return null;
  if(!coin) return null;
  return (
    <div className="fixed inset-0 z-50  flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Coin History - ID #{coin.coin_id}</h2>
          <p className="text-sm text-gray-500">
            Value: <span className="font-medium">{coin.value} $</span> • Created:{" "}
            <span className="font-medium">
              {new Date(coin.created_at).toLocaleDateString()}
            </span>
          </p>
        </div>

        {/* Caption */}
        <div className="mb-6">
          <p className="text-gray-700">
            Below is a timeline of all transactions involving this coin.
          </p>
        </div>

        {/* Transaction History */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {history.map((entry, index) => {
           
            return (
              <div
                key={index}
                className={`flex items-center justify-between gap-4 ${
                 "flex-row" 
                }`}
              >
                <div className="text-sm font-medium text-blue-600">{entry.sellerName}</div>
                <div className="text-gray-400">
                  { <ArrowRight size={20} />}
                </div>
                <div className="text-sm font-medium text-green-600">{entry.buyerName}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CoinHistoryModal;
