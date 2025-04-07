import React from "react";
import { FaArrowRight } from "react-icons/fa"; // Arrow icon for seller to buyer
import { HiCurrencyDollar } from "react-icons/hi"; // Dollar icon for value
import { BiTime } from "react-icons/bi"; // Time icon for date
import { AiOutlineTransaction } from "react-icons/ai"; // Transaction icon

interface TransactionRowProps {
  transaction: any;
  index: number;
  onBitSlowClick?: (transaction: any) => void; // Optional callback for BitSlow click
}

const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  index,
  onBitSlowClick,
}) => {
  // Handle BitSlow field click
  const handleBitSlowClick = () => {
    if (onBitSlowClick) {
      onBitSlowClick(transaction); // Trigger the optional callback if provided
    }
  };

  return (
    <tr
      key={transaction.id}
      className={`hover:bg-gray-50 transition-colors ${
        index === transaction.length - 1 ? "" : "border-b border-gray-200"
      }`}
    >
      <td className="p-4 text-gray-600">
        <div className="flex items-center">
          <AiOutlineTransaction className="text-blue-500 mr-2" />
          {transaction.id}
        </div>
      </td>
      <td className="p-4">
        <div>
          {/* Clickable BitSlow field */}
          <div
            className="font-medium text-gray-800 cursor-pointer flex items-center"
            onClick={handleBitSlowClick}
          >
            <p
              className={`font-bold px-3 w-80 py-1 rounded-md ${
                transaction.computedBitSlow
                  ? "text-purple-700 bg-purple-100"
                  : "text-gray-400 bg-gray-100 italic"
              }`}
            >
              {transaction.computedBitSlow}
            </p>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            <span className="font-semibold">Bits:</span> {transaction.bit1},{" "}
            {transaction.bit2}, {transaction.bit3}
          </div>
        </div>
      </td>
      <td className="p-4 text-gray-700">
        <div className="flex items-center justify-center">
          <span className="text-blue-600">
            {transaction.sellerName || "Stranger"}
          </span>
        </div>
      </td>
      <td className="p-4 text-gray-700">
        <div className="flex items-center justify-center">
          <span className="text-green-600">
            {transaction.buyerName || "Stranger"}
          </span>
        </div>
      </td>
      <td className="p-4 text-right font-semibold text-gray-800">
        <HiCurrencyDollar className="inline text-gray-600 mr-1" />$
        {transaction.amount.toLocaleString()}
      </td>
      <td className="p-4 text-sm text-gray-600">
        <BiTime className="inline mr-1 text-gray-600" />
        {new Date(transaction.date).toLocaleString()}
      </td>
    </tr>
  );
};

export default TransactionRow;
