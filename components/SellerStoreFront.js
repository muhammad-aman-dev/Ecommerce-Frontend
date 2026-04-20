"use client";

import { useState, useEffect } from "react";
import {
  FaStar,
  FaShoppingBag,
  FaEnvelope,
  FaCheckCircle,
  FaRegClock,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import axiosInstance from "@/lib/axios";
import { useSelector } from "react-redux";

// Skeleton loader for products matching your Home style
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

const SellerStorefront = ({ sellerId }) => {
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get currency data from Redux
  const { currency, exchangeRates } = useSelector((state) => state.currency);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/general/seller/${sellerId}`);
        setSeller(response.data.seller);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching store data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreData();
  }, [sellerId]);

  if (!loading && !seller)
    return (
      <div className="text-center py-20 font-bold text-slate-400">
        Seller not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FBFDFF]">
      {/* HEADER / COVER AREA */}
      <div className="h-48 bg-linear-to-r from-teal-500 to-emerald-600 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SELLER INFO CARD */}
        <div className="relative -mt-24 mb-12">
          {loading ? (
            <div className="h-64 bg-white rounded-[2.5rem] animate-pulse shadow-xl" />
          ) : (
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-6 md:p-10 border border-slate-50">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="w-32 h-32 bg-slate-100 rounded-3xl flex items-center justify-center text-4xl font-black text-teal-600 border-4 border-white shadow-lg shrink-0">
                  {seller.name.charAt(0)}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <h1 className="text-3xl font-black text-slate-900">{seller.name}</h1>
                    {seller.status === "Active" && (
                      <FaCheckCircle className="text-teal-500" title="Verified Seller" />
                    )}
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 text-sm font-bold mb-6">
                    <span className="flex items-center gap-1">
                      <FaEnvelope className="text-slate-300" /> {seller.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaRegClock className="text-slate-300" />
                      Joined {new Date(seller.createdAt?.$date || seller.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
                    <div className="bg-slate-50 p-4 rounded-2xl text-center">
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Rating</p>
                      <p className="text-lg font-black text-slate-900 flex items-center justify-center gap-1">
                        {seller.rating?.toFixed(1)} <FaStar className="text-amber-400 text-sm" />
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl text-center">
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Sales</p>
                      <p className="text-lg font-black text-slate-900">{seller.sales}+</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl text-center">
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Listings</p>
                      <p className="text-lg font-black text-slate-900">{seller.activeListings}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl text-center">
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Reviews</p>
                      <p className="text-lg font-black text-slate-900">{seller.numReviews}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PRODUCTS SECTION (Updated to match HomePage style) */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 italic">
              <FaShoppingBag className="text-teal-500" /> Seller's Collection
            </h2>
            <div className="h-1 flex-1 bg-slate-100 mx-6 hidden md:block" />
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {products.length} Items Found
            </span>
          </div>

          <div className="grid gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {loading
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
                      {/* Image Container (Aspect-4/5) */}
                      <div className="relative aspect-4/5 rounded-4xl overflow-hidden bg-slate-200 mb-4 shadow-sm group-hover:shadow-2xl group-hover:shadow-teal-900/10 transition-all duration-500">
                        <Image
                          src={product.images?.[0] || "/placeholder.png"}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                          <span className="text-teal-600 font-black text-xs uppercase tracking-widest">
                            View
                          </span>
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="px-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          {product.category}
                        </p>
                        <h3 className="text-sm md:text-lg font-bold text-slate-800 group-hover:text-teal-600 transition-colors line-clamp-2 md:line-clamp-1">
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

          {!loading && products.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
              <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">
                This store is currently empty
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerStorefront;