import React, { useState, useEffect } from "react";
import { X, Coins, DollarSign, TrendingUp, Info, AlertCircle } from "lucide-react";
import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";

type BuyCoinModalProps = {
  isOpen: boolean;
  onClose: () => void;
  maxAmount: number;
  onBuy: (amount: number) => void;
};

const BuyCoinModal: React.FC<BuyCoinModalProps> = ({
  isOpen,
  onClose,
  maxAmount,
  onBuy,
}) => {
    if (!isOpen) return null;
  
  const [amount, setAmount] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset amount when modal opens with new coin
  useEffect(() => {
    if (isOpen) {
      setAmount(1);
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setAmount(value);
  };

  const handleBuy = () => {
    setIsProcessing(true);
     onBuy(amount);
    // Simulate API call
    /*setTimeout(() => {
     
      setIsProcessing(false);
      onClose();
    }, 1500);*/
  };

  

  

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              <h3 className="text-lg font-bold">Generate new Bitslows</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="amount" className="text-gray-700 font-medium">
                Amount to purchase
              </label>
              <span className="text-blue-600 font-bold text-lg">
                {amount} {amount === 1 ? "coin" : "coins"}
              </span>
            </div>
            
            <input
              type="range"
              id="amount"
              min="1"
              max={maxAmount}
              value={amount}
              onChange={handleAmountChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>{maxAmount}</span>
            </div>
          </div>

          {/* Price info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-700" />
                <span className="text-gray-700">Total cost</span>
              </div>
              <span className="text-blue-800 font-bold text-xl">Priceless</span>
            </div>
            
            <div className="flex items-center gap-1 mt-3 text-sm text-gray-600">
              <Info className="w-4 h-4 text-blue-500" />
              <p>Transaction fees may apply based on network conditions and vibes</p>
            </div>
          </div>

          {/* Market trend */}
          <div className="flex items-center gap-2 mb-6 bg-green-50 p-3 rounded-lg">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-700">
              This coin has seen a <span className="font-bold">{Math.random() % 256 +200 }% increase in popularity</span> in the last 24 hours
            </p>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 mb-6 bg-amber-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
            <p className="text-sm text-amber-700">
              Cryptocurrency investments are subject to market risks. 
              Please invest somebody else's money.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBuy}
              disabled={isProcessing}
              className={`flex-1 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg
                ${isProcessing ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'} 
                flex items-center justify-center gap-2`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4" />
                  Buy Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCoinModal;