import React from "react";
import TransactionRow from "./TransactionRow";
import { TransactionDTO } from "@/src/shared/DataTransferObjects/TransactionDTO";

interface TransactionTableProps {
  transactions: TransactionDTO[];
  onRowClick?: (transaction: TransactionDTO) => void; // Optional callback function when a row is clicked
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onRowClick,
}) => {
  const handleRowClick = (transaction: any) => {
    if (onRowClick) {
      console.log(transaction);
      onRowClick(transaction); // If callback is provided, call it
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-4 text-left flex-1">ID</th>
            <th className="p-4 text-left flex-1">BitSlow</th>
            <th className="p-4 text-left flex-1">Seller</th>
            <th className="p-4 text-left flex-1">Buyer</th>
            <th className="p-4 text-right flex-1">Amount</th>
            <th className="p-4 text-left flex-1">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                No available transactions
              </td>
            </tr>
          ) : (
            transactions.map((transaction, index) => (
             
                <TransactionRow
                onBitSlowClick={handleRowClick}
                  key={transaction.id}
                  transaction={transaction}
                  index={index}
                />
              
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
