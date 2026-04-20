"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaStar, FaTags, FaBoxOpen } from "react-icons/fa";
import { useSelector } from "react-redux";

const ProductGrid = ({ products, currency, exchangeRates }) => (
  <div className="grid gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {products.map((product) => {
      const rate = exchangeRates[currency] || 1;
      const convertedPrice = (product.price * rate).toFixed(2);
      return (
        <Link key={product._id} href={`/products/${product._id}`} className="group cursor-pointer">
          <div className="relative aspect-4/5 rounded-4xl overflow-hidden bg-slate-100 mb-4 shadow-sm group-hover:shadow-2xl transition-all duration-500">
            <Image
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, 
       (max-width: 768px) 50vw, 
       (max-width: 1024px) 33vw, 
       25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {product.featured && (
              <div className="absolute top-4 left-4 bg-teal-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                Featured
              </div>
            )}
          </div>

          <div className="px-2">
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-teal-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
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
      );
    })}
  </div>
);

const CategoryExplorerClient = ({ initialCategories }) => {
  const { currency, exchangeRates } = useSelector((state) => state.currency);
  const categoryNames = Object.keys(initialCategories);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-slate-900 pt-32 pb-20 px-6 mb-16 rounded-b-[4rem]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 text-teal-400 mb-4">
            <FaTags />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Tradexon Marketplace</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            Our <span className="text-teal-500">Collections</span>
          </h1>
        </div>
      </div>

      {/* Categories Content */}
      <div className="max-w-7xl mx-auto px-6 space-y-32">
        {categoryNames.length > 0 ? (
          categoryNames.map((category) => (
            <section key={category}>
              <div className="flex items-end justify-between mb-10 border-b border-slate-100 pb-8">
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">
                  {category}
                </h2>
                <Link 
                  href={`/categories/products?category=${encodeURIComponent(category)}`}
                  className="flex items-center gap-2 text-teal-600 font-bold hover:gap-4 transition-all group"
                >
                  View All <FaArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <ProductGrid
                products={initialCategories[category].slice(0, 8)}
                currency={currency}
                exchangeRates={exchangeRates}
              />
            </section>
          ))
        ) : (
          <div className="text-center py-40">
            <FaBoxOpen className="mx-auto text-slate-200 mb-6" size={64} />
            <h3 className="text-2xl font-black text-slate-800">No Categories Found</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryExplorerClient;