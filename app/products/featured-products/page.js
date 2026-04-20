"use client";

import { useSelector } from "react-redux";
import { useProductPagination } from "@/hooks/useProductPagination";
import PaginatedProductGrid from "@/components/PaginatedProductGrid";

export default function FeaturedPage() {
  const { currency, exchangeRates } = useSelector((state) => state.currency);
  
  // Simply change the endpoint URL for each page
  const { products, hasMore, isLoading, isInitialLoading, loadMore } = 
    useProductPagination("/general/products/featured");

  return (
    <div className="min-h-screen bg-slate-50/50">
      <PaginatedProductGrid 
        title="Featured Selections"
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