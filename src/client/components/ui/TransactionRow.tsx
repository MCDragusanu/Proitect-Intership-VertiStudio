import React from 'react';

interface TransactionRowProps {
    transaction: any;
    index: number;
    onBitSlowClick?: (transaction: any) => void; // Optional callback for BitSlow click
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction, index, onBitSlowClick }) => {
    // Handle BitSlow field click
    const handleBitSlowClick = () => {
        if (onBitSlowClick) {
            onBitSlowClick(transaction); // Trigger the optional callback if provided
        }
    };

    return (
        <tr
            key={transaction.id}
            className={`hover:bg-gray-50 transition-colors ${index === transaction.length - 1 ? "" : "border-b border-gray-200"}`}
        >
            <td className="p-4 text-gray-600">{transaction.id}</td>
            <td className="p-4">
                <div>
                    {/* Clickable BitSlow field */}
                    <div
                        className="font-medium text-gray-800 cursor-pointer"
                        onClick={handleBitSlowClick}
                    >
                        {transaction.computedBitSlow}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        Bits: {transaction.bit1}, {transaction.bit2}, {transaction.bit3}
                    </div>
                    <div className="text-xs text-gray-500">
                        Value: ${transaction.amount.toLocaleString()}
                    </div>
                </div>
            </td>
            <td className="p-4 text-gray-700">
                {transaction.sellerName ? transaction.sellerName : "Original Issuer"}
            </td>
            <td className="p-4 text-gray-700">{transaction.buyerName}</td>
            <td className="p-4 text-right font-semibold text-gray-800">
                ${transaction.amount.toLocaleString()}
            </td>
            <td className="p-4 text-sm text-gray-600">
                {new Date(transaction.date).toLocaleString()}
            </td>
        </tr>
    );
};

export default TransactionRow;
