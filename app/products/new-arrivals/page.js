"use client";

import { useSelector } from "react-redux";
import { useProductPagination } from "@/hooks/useProductPagination";
import PaginatedProductGrid from "@/components/PaginatedProductGrid";

export default function NewArrivalsPage() {
  const { currency, exchangeRates } = useSelector((state) => state.currency);
  
  // Simply change the endpoint URL for each page
  const { products, hasMore, isLoading, isInitialLoading, loadMore } = 
    useProductPagination("/general/products/new-arrivals");

  return (
    <div className="min-h-screen bg-slate-50/50">
      <PaginatedProductGrid 
        title="New Arrivals"
        products={products}
        isLoading={isLoading}
        isInitialLoading={isInitialLoading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        currency={currency}
        exchangeRates={exchangeRates}
      />
    </div>
  );
}