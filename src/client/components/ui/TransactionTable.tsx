import React from 'react';
import TransactionRow from './TransactionRow';

interface TransactionTableProps {
    transactions: any[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
    return (
        <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="w-full border-collapse bg-white">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="p-4 text-left">ID</th>
                        <th className="p-4 text-left">BitSlow</th>
                        <th className="p-4 text-left">Seller</th>
                        <th className="p-4 text-left">Buyer</th>
                        <th className="p-4 text-right">Amount</th>
                        <th className="p-4 text-left">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <TransactionRow key={transaction.id} transaction={transaction} index={index} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;