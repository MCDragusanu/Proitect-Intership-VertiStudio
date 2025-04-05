import React from 'react';

interface TransactionRowProps {
    transaction: any;
    index: number;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction, index }) => {
    return (
        <tr
            key={transaction.id}
            className={`hover:bg-gray-50 transition-colors ${index === transaction.length - 1 ? "" : "border-b border-gray-200"}`}
        >
            <td className="p-4 text-gray-600">{transaction.id}</td>
            <td className="p-4">
                <div>
                    <div className="font-medium text-gray-800">{transaction.computedBitSlow}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        Bits: {transaction.bit1}, {transaction.bit2}, {transaction.bit3}
                    </div>
                    <div className="text-xs text-gray-500">
                        Value: ${transaction.value.toLocaleString()}
                    </div>
                </div>
            </td>
            <td className="p-4 text-gray-700">
                {transaction.seller_name ? transaction.seller_name : "Original Issuer"}
            </td>
            <td className="p-4 text-gray-700">{transaction.buyer_name}</td>
            <td className="p-4 text-right font-semibold text-gray-800">
                ${transaction.amount.toLocaleString()}
            </td>
            <td className="p-4 text-sm text-gray-600">
                {new Date(transaction.transaction_date).toLocaleString()}
            </td>
        </tr>
    );
};

export default TransactionRow;
