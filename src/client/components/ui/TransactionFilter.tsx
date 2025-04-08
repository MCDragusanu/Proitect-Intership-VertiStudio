import React, { useState, useEffect } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  User,
} from "lucide-react";

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
  const [localFilters, setLocalFilters] = useState<TransactionFilters>(filters);

  // Handle page size change
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pageSize = parseInt(e.target.value, 10);
    const updatedFilters = {
      ...localFilters,
      pageSize,
      pageNumber: 0, // Reset to first page when page size changes
    };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Handle page navigation
  const handlePreviousPage = () => {
    if (localFilters.pageNumber > 0) {
      const updatedFilters = {
        ...localFilters,
        pageNumber: localFilters.pageNumber - 1,
      };
      setLocalFilters(updatedFilters);
      onFilterChange(updatedFilters);
    }
  };

  const handleNextPage = () => {
   
    const updatedFilters = {
      ...localFilters,
      pageNumber: localFilters.pageNumber + 1,
    };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    let updatedValue: string | number | null = value;
    
    // Convert numeric fields appropriately
    if (type === "number") {
      updatedValue = value === "" ? null : Number(value);
      
      // Validate numeric values
      if (
        updatedValue !== null &&
        (name === "bitSlowMinPrice" || name === "bitSlowMaxPrice") &&
        (updatedValue as number) < 0
      ) {
        return; // Don't update with negative values
      }
    } else if (type === "datetime-local") {
      updatedValue = value === "" ? null : value;
    } else {
      // Text inputs
      updatedValue = value === "" ? null : value;
    }
    
    setLocalFilters({
      ...localFilters,
      [name]: updatedValue,
    });
  };

  // Apply filters function
  const applyFilters = () => {
    const updatedFilters = {
      ...localFilters,
      pageNumber: 0, // Reset to first page when filters are applied
    };
    onFilterChange(updatedFilters);
  };

  // Keep local state in sync with parent's filters
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  return (
    <div className="w-full bg-gray-50 rounded-xl p-4">
      <div className="w-full flex justify-between items-center mb-4">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            {isVisible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {isVisible ? "Hide Filters" : "Show Filters"}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Page {filters.pageNumber + 1}
              {itemCount > 0 && ` • ${itemCount} items`}
            </span>
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={handlePreviousPage}
                disabled={filters.pageNumber <= 0}
                className="p-2 bg-white border-r hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white flex items-center justify-center"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNextPage}
                disabled={itemCount < filters.pageSize}
                className="p-2 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white flex items-center justify-center"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <select
              name="pageSize"
              value={filters.pageSize}
              onChange={handlePageSizeChange}
              className="ml-2 p-2 border rounded-lg text-sm bg-white"
              aria-label="Page size"
            >
              <option value={15}>15 per page</option>
              <option value={30}>30 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
      </div>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isVisible ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-5 bg-white rounded-xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Date Range */}
            <div className="w-full">
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Calendar size={16} />
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Starting Date
                  </label>
                  <input
                    type="datetime-local"
                    name="afterDateTimeStamp"
                    value={localFilters.afterDateTimeStamp || ""}
                    onChange={handleLocalChange}
                    className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="From"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Calendar size={16} />
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ending Date
                  </label>
                  <input
                    type="datetime-local"
                    name="beforeDateTimeStamp"
                    value={localFilters.beforeDateTimeStamp || ""}
                    onChange={handleLocalChange}
                    className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="To"
                  />
                </div>
              </div>
            </div>

            {/* Seller and Buyer */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seller Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  name="sellerName"
                  value={localFilters.sellerName || ""}
                  onChange={handleLocalChange}
                  placeholder="Filter by seller"
                  className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">
                Buyer Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  name="buyerName"
                  value={localFilters.buyerName || ""}
                  onChange={handleLocalChange}
                  placeholder="Filter by buyer"
                  className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <DollarSign size={16} />
                  </div>
                  <input
                    type="number"
                    name="bitSlowMinPrice"
                    value={localFilters.bitSlowMinPrice ?? ""}
                    onChange={handleLocalChange}
                    placeholder="Min price"
                    className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <span className="text-gray-500">to</span>
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <DollarSign size={16} />
                  </div>
                  <input
                    type="number"
                    name="bitSlowMaxPrice"
                    value={localFilters.bitSlowMaxPrice ?? ""}
                    onChange={handleLocalChange}
                    placeholder="Max price"
                    className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center mt-4">
                <button
                  onClick={applyFilters}
                  className="min-w-full justify-center items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};