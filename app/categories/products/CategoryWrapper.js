"use client";

import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useCategoryPagination } from "@/hooks/useCategoryPagination";
import PaginatedProductGrid from "@/components/PaginatedProductGrid";

const CategoryPage = () => {
  const searchParams = useSearchParams();
  const categoryName = searchParams.get("category"); // Grabs 'electronics' from ?category=electronics
  
  const { currency, exchangeRates } = useSelector((state) => state.currency);

  const { products, hasMore, isLoading, isInitialLoading, loadMore } = 
    useCategoryPagination(categoryName);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <PaginatedProductGrid 
        title={categoryName || "Products"}
        products={products}
        isLoading={isLoading}
        isInitialLoading={isInitialLoading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        currency={currency}
        exchangeRates={exchangeRates}
      />

      {/* Empty State */}
      {!isInitialLoading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
            No products found in this category
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;