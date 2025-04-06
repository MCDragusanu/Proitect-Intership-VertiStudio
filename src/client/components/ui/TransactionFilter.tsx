import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react"; // Optional: install `lucide-react`

export type TransactionFilters = {
  pageSize: number;
  pageNumber: number;
  sellerName: string | null;
  buyerName: string | null;
  beforeDateTimeStamp: string | null;
  afterDateTimeStamp: string | null;
  bitSlowMinPrice: number | null;
  bitSlowMaxPrice: number | null;
};

type TransactionFilterProps = {
  itemCount: number;
  filters: TransactionFilters;
  onFilterChange: (updatedFilters: TransactionFilters) => void;
};

export const TransactionFilter: React.FC<TransactionFilterProps> = ({
  itemCount,
  filters,
  onFilterChange,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const totalPages = Math.ceil(itemCount / (filters.pageSize || 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    onFilterChange({
      ...filters,
      [name]:
        value === ""
          ? null
          : name === "pageSize" ||
            name === "pageNumber" ||
            name.startsWith("bitSlow")
          ? Number(value)
          : value,
    });
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
      >
        {isVisible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {isVisible ? "Hide Filters" : "Show Filters"}
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isVisible ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 sm:px-6 md:px-8 py-6 bg-white rounded-2xl shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
          <div className="w-full min-w-0">
            <label className="block text-sm font-medium">Page Size</label>
            <input
              type="number"
              name="pageSize"
              value={filters.pageSize}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border p-2"
            />
          </div>

          <div className="w-full min-w-0">
            <label className="block text-sm font-medium">Page Number</label>
            <input
              type="number"
              name="pageNumber"
              min={0}
              max={totalPages - 1}
              value={filters.pageNumber}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border p-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Total Pages: {totalPages}
            </p>
          </div>

          <div className="w-full min-w-0">
            <label className="block text-sm font-medium">Seller Name</label>
            <input
              type="text"
              name="sellerName"
              value={filters.sellerName || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border p-2"
            />
          </div>

          <div className="w-full min-w-0">
            <label className="block text-sm font-medium">Buyer Name</label>
            <input
              type="text"
              name="buyerName"
              value={filters.buyerName || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border p-2"
            />
          </div>

          <div className="w-full min-w-0">
            <label className="block text-sm font-medium">After Date</label>
            <input
              type="datetime-local"
              name="afterDateTimeStamp"
              value={filters.afterDateTimeStamp || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border p-2"
            />
          </div>

          <div className="w-full min-w-0">
            <label className="block text-sm font-medium">Before Date</label>
            <input
              type="datetime-local"
              name="beforeDateTimeStamp"
              value={filters.beforeDateTimeStamp || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border p-2"
            />
          </div>

          <div className="w-full min-w-0">
            <label className="block text-sm font-medium">Min Price</label>
            <input
              type="number"
              name="bitSlowMinPrice"
              value={filters.bitSlowMinPrice ?? ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border p-2"
            />
          </div>

          <div className="w-full min-w-0">
            <label className="block text-sm font-medium">Max Price</label>
            <input
              type="number"
              name="bitSlowMaxPrice"
              value={filters.bitSlowMaxPrice ?? ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border p-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
