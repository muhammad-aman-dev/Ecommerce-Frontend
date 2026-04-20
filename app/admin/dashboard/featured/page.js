"use client";

import { useState, useEffect } from "react";
import { FaStar, FaPlus, FaTrashAlt, FaArrowLeft, FaBox } from "react-icons/fa";
import { FaMagic } from "react-icons/fa";
import axiosInstance from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import Swal from 'sweetalert2';
import Link from "next/link";
import Image from "next/image";

const FeaturedProductsPage = () => {
  const [productId, setProductId] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/admin/featured-products");
      setFeaturedProducts(response.data.products || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFeatured = async (e) => {
    e.preventDefault();
    if (!productId.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post("/admin/featured-products/add", { productId });
      
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Product Featured',
          text: 'The product is now in the homepage spotlight.',
          timer: 2000,
          showConfirmButton: false
        });
        setFeaturedProducts([...featuredProducts, response.data.product]);
        setProductId("");
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.message || 'Invalid Product ID'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFeatured = async (id) => {
    const result = await Swal.fire({
      title: 'Remove from Featured?',
      text: "This product will no longer appear in the homepage spotlight.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d9488',
      cancelButtonColor: '#f43f5e',
      confirmButtonText: 'Yes, remove it!'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.post(`/admin/featured-products/remove`,{productId : id});
        setFeaturedProducts(featuredProducts.filter(p => p._id !== id));
        Swal.fire('Removed!', 'Product has been unfeatured.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Could not complete request.', 'error');
      }
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-teal-600 transition-all mb-8 group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Dashboard
        </Link>

        {/* TOP SECTION: ADD PRODUCT */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-4xl shadow-sm border border-slate-100 p-8 mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shadow-inner">
                <FaStar size={24} className="animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Feature Spotlight</h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Promote products to homepage</p>
              </div>
            </div>

            <form onSubmit={handleAddFeatured} className="flex-1 max-w-md flex gap-2">
              <div className="relative flex-1">
                <FaBox className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="text"
                  placeholder="Paste Product ID (e.g. PRD-67D...)"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-teal-500 outline-none transition-all"
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting || !productId}
                className="bg-slate-900 text-white px-6 rounded-2xl hover:bg-teal-600 transition-all disabled:opacity-50"
              >
                {isSubmitting ? <FaMagic className="animate-spin" /> : <FaPlus />}
              </button>
            </form>
          </div>
        </motion.div>

        {/* GRID SECTION: CURRENTLY FEATURED */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {featuredProducts.map((product) => (
              <motion.div 
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white rounded-4xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-500"
              >
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <Image 
  src={product.images?.[0] || "/placeholder.png"} 
  alt={product.name}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover group-hover:scale-110 transition-transform duration-700"
  priority={featuredProducts.indexOf(product) < 3} 
/>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-teal-600 uppercase tracking-widest shadow-sm">
                    Live on Home
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 block">
                    ID: {product.productId}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 line-clamp-1 mb-4">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Store</span>
                      <span className="text-xs font-black text-slate-700">{product.sellerName || 'Tradexon Seller'}</span>
                    </div>
                    <button 
                      onClick={() => removeFeatured(product._id)}
                      className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all duration-300"
                      title="Unfeature Product"
                    >
                      <FaTrashAlt size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {featuredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">No products featured yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProductsPage;