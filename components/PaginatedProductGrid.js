"use client";

import Image from "next/image";
import Link from "next/link";
import { FaStar, FaArrowDown, FaSpinner } from "react-icons/fa";

const SkeletonCard = () => (
  <div className="animate-pulse bg-white p-4 rounded-[2.5rem] border border-slate-100">
    <div className="relative aspect-square rounded-3xl bg-slate-200 mb-4"></div>
    <div className="h-3 bg-slate-200 rounded mb-2 w-3/4"></div>
    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
  </div>
);

const PaginatedProductGrid = ({ 
  title, products, isLoading, isInitialLoading, hasMore, onLoadMore, currency, exchangeRates 
}) => {
  const getPrice = (p) => ((p || 0) * (exchangeRates[currency] || 1)).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between mb-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">{title}</h2>
      </div>

      <div className="grid gap-8 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {isInitialLoading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          products.map((product) => (
            <Link key={product._id} href={`/products/${product._id}`} className="group bg-white p-4 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl transition-all duration-500">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-50 mb-4">
                <Image 
                  src={product.images?.[0] || "/placeholder.png"} 
                  alt={product.name} fill sizes="(max-width: 640px) 50vw,
       (max-width: 1024px) 50vw,
       25vw" 
       priority
       className="object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              </div>
              <div className="px-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{product.category}</p>
                          <h3 className="text-sm md:text-lg font-bold text-slate-800 group-hover:text-teal-600 transition-colors line-clamp-2 md:line-clamp-1">{product.name}</h3>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm sm:text-2xl font-black text-slate-900">
                              {currency} {convertedPrice}
                            </span>
                            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
                              <FaStar className="text-orange-400" size={12} />
                              <span className="text-xs font-bold text-slate-600">{product.rating || 0}</span>
                            </div>
                          </div>
                        </div>
            </Link>
          ))
        )}
      </div>

      {hasMore && (
        <div className="mt-20 flex justify-center">
          <button onClick={onLoadMore} disabled={isLoading} className="bg-slate-900 text-white px-10 py-5 rounded-4xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-teal-600 transition-all flex items-center gap-4">
            {isLoading ? <FaSpinner className="animate-spin" /> : <>Load More <FaArrowDown /></>}
          </button>
        </div>
      )}
    </div>
  );
};

export default PaginatedProductGrid;