"use client";

import HeroCarousel from "@/components/HeroCarousel";
import Image from "next/image";
import Link from "next/link";
import { FaFire, FaArrowRight, FaStar } from "react-icons/fa";
import axiosInstance from "@/lib/axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

// Skeleton loader for products
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

// Product grid component
const ProductGrid = ({ products, isLoading, currency, exchangeRates }) => (
  <div className="grid gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
              {/* Image Container */}
              <div className="relative aspect-4/5 rounded-4xl overflow-hidden bg-slate-200 mb-4 shadow-sm group-hover:shadow-2xl group-hover:shadow-teal-900/10 transition-all duration-500">
                <Image
                  src={
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : "/placeholder.png"
                  }
                  alt={product.name}
                  sizes="(max-width: 640px) 50vw, 
         (max-width: 768px) 50vw, 
         (max-width: 1024px) 33vw, 
         25vw"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-teal-600 font-black text-xs uppercase tracking-widest">
                     View
                  </span>
                </button>
                {product.featured && (
                  <div className="absolute top-4 left-4 bg-teal-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                    Featured
                  </div>
                )}
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
);

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { currency, exchangeRates } = useSelector((state) => state.currency);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/general/homepagedata");

        if (response.data.success) {
          setBestSellers(response.data.bestSellers || []);
          setTrendingProducts(response.data.trendingProducts || []);
          setNewArrivals(response.data.newArrivals || []);
          setFeaturedProducts(response.data.featuredProducts || []);
        }
      } catch (error) {
        console.error("Error fetching homepage products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeProducts();
  }, []);

  // Define sections
  const sections = [
    { title: "Featured Products", products: featuredProducts, link: "featured-products" },
    { title: "Trending Products", products: trendingProducts, link: "trending-products" },
    { title: "Best Sellers", products: bestSellers, link: "best-sellers" },
    { title: "New Arrivals", products: newArrivals, link: "new-arrivals" },
  ];

  const visibleSections = sections.filter(
    (section) => isLoading || (section.products && section.products.length > 0)
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Section */}
      <HeroCarousel />
      {/* Product Sections */}
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {visibleSections.map((section, index) => (
          <div key={index}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
              <h2 className="text-4xl font-black text-slate-800 tracking-tight">
                {section.title}
              </h2>
              <Link href={`/products/${section.link}`}>
              <button className=" flex items-center gap-2 text-teal-600 font-bold hover:gap-3 transition-all">
                View All <FaArrowRight size={14} />
              </button>
              </Link>
            </div>

            <ProductGrid
              products={section.products}
              isLoading={isLoading}
              currency={currency}
              exchangeRates={exchangeRates}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;