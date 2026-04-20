"use client";

import { useSearchParams } from "next/navigation"; // Changed from useParams
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaSearch, FaArrowLeft } from "react-icons/fa";
import { useSelector } from "react-redux";
import axiosInstance from "@/lib/axios";

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="relative aspect-4/5 rounded-4xl bg-slate-200 mb-4"></div>
    <div className="h-3 bg-slate-200 rounded mb-2 w-3/4"></div>
    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
    <div className="flex justify-between mt-3">
      <div className="h-6 w-16 bg-slate-200 rounded"></div>
      <div className="h-6 w-10 bg-slate-200 rounded"></div>
    </div>
  </div>
);

const SearchContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("search") || ""; 

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { currency, exchangeRates } = useSelector((state) => state.currency);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setProducts([]);
        return;
      }

      try {
        setIsLoading(true);
        // Using the query directly from searchParams
        const response = await axiosInstance.get(`/general/search-product?q=${query}`);
        if (response.data.success) {
          setProducts(response.data.products || []);
        }
      } catch (error) {
        console.error("Search fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Header Section */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-teal-600 font-black text-xs uppercase tracking-widest mb-2">
            Search Results
          </p>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            {query ? (
              <>Results for <span className="text-teal-600 italic">"{query}"</span></>
            ) : (
              "Search Products"
            )}
          </h1>
        </div>
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold transition-all text-sm">
          <FaArrowLeft size={12} /> Back to Home
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map((product) => {
              const rate = exchangeRates[currency] || 1;
              const convertedPrice = (product.price * rate).toFixed(1);
              
              return (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-4/5 rounded-4xl overflow-hidden bg-slate-200 mb-4 shadow-sm group-hover:shadow-2xl group-hover:shadow-teal-900/10 transition-all duration-500">
                    <Image
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl translate-y-20 group-hover:translate-y-0 transition-transform duration-500 z-10">
                      <span className="text-teal-600 font-black text-xs uppercase tracking-widest">
                        view
                      </span>
                    </button>
                  </div>

                  <div className="px-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      {product.category}
                    </p>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-teal-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm sm:text-2xl font-black text-slate-900">
                        {currency} {convertedPrice}
                      </span>
                      <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
                        <FaStar className="text-orange-400" size={12} />
                        <span className="text-xs font-bold text-slate-600">
                          {product.rating || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
      </div>

      {/* Empty State */}
      {!isLoading && query && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-slate-200 p-8 rounded-full mb-6 text-slate-400">
            <FaSearch size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">No matches found</h2>
          <p className="text-slate-500 mt-2">Try different keywords or check your spelling.</p>
        </div>
      )}
    </div>
  );
};

// Main component with Suspense boundary
const SearchPage = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-10">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      }>
        <SearchContent />
      </Suspense>
    </div>
  );
};

export default SearchPage;