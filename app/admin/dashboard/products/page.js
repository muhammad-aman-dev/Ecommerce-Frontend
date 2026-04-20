"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FaArrowLeft, FaSearch, FaBox, FaUser, 
  FaTag, FaLayerGroup, FaCheckCircle, FaBan, FaEye 
} from "react-icons/fa";
import axiosInstance from "@/lib/axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function ManageProductPage() {
  const router = useRouter();
  const [searchId, setSearchId] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProduct = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    try {
      setLoading(true);
      setProduct(null);
      const response = await axiosInstance.get(`/admin/products/find/?id=${searchId}`);
      setProduct(response.data.product);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Not Found",
        text: "No product matches that ID in Tradexon records.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    const isSuspending = newStatus === "Suspended By Admin";
    const actionLabel = isSuspending ? "Suspend" : "Activate";
    
    // 1. Setup the SweetAlert Config
    const swalConfig = {
      title: `${actionLabel} Product?`,
      text: isSuspending 
        ? "Please provide a reason for suspending this product." 
        : "Are you sure you want to make this product live?",
      icon: isSuspending ? "warning" : "question",
      showCancelButton: true,
      confirmButtonColor: isSuspending ? "#e11d48" : "#0d9488",
      confirmButtonText: `Yes, ${isSuspending ? 'Suspend' : 'Activate'}`,
      input: isSuspending ? "textarea" : null,
      inputLabel: isSuspending ? "Reason for Suspension" : null,
      inputPlaceholder: "Enter reason...",
      inputValidator: (value) => {
        if (isSuspending && !value) {
          return "You must provide a reason for suspension!";
        }
      },
      // This allows us to handle the async request inside the Swal promise
      showLoaderOnConfirm: true,
      preConfirm: async (reason) => {
        try {
          Swal.showLoading();
          const response = await axiosInstance.post(`/admin/products/status?id=${product._id}`, { 
            status: newStatus,
            reason: isSuspending ? reason : null 
          });
          return response.data;
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error.response?.data?.message || error.message}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    };

    const result = await Swal.fire(swalConfig);

    if (result.isConfirmed) {
      setProduct({ ...product, status: newStatus });
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Product is now ${newStatus}`,
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <button 
          onClick={() => router.push("/admin/dashboard")}
          className="flex items-center gap-2 mb-8 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
        >
          <FaArrowLeft /> Dashboard
        </button>

        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Merchant Control</h1>
          <p className="text-slate-500 font-medium">Lookup and moderate specific marketplace inventory.</p>
        </header>

        {/* SEARCH BOX */}
        <form onSubmit={fetchProduct} className="relative mb-12">
          <input
            type="text"
            placeholder="Enter Product ID or PRD-XXXXXX..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-4xl py-5 pl-14 pr-32 shadow-sm focus:border-teal-500 focus:ring-0 outline-none font-bold text-slate-900 transition-all"
          />
          <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-600 transition-all disabled:opacity-50"
          >
            {loading ? "Searching..." : "Fetch Record"}
          </button>
        </form>

        <AnimatePresence mode="wait">
          {product ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
            >
              {/* STATUS HEADER */}
              <div className={`p-4 text-center text-[10px] font-black uppercase tracking-[0.3em] transition-colors duration-500 ${
                product.status === "Active" ? "bg-teal-50 text-teal-600" : "bg-rose-50 text-rose-600"
              }`}>
                Current Status: {product.status}
              </div>

              <div className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-12">
                  
                  {/* LEFT: GALLERY */}
                  <div className="space-y-6">
                    <div className="relative aspect-square rounded-3xl overflow-hidden border-4 border-slate-50">
                      <Image 
                        src={product.images[0]} 
                        alt={product.name} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover"
                        priority
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.slice(1, 5).map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                          <Image src={img} alt="sub" fill sizes="100px" className="object-cover opacity-60" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT: DETAILS & ACTIONS */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded tracking-tighter">
                          {product.productId}
                        </span>
                        <span className="text-slate-300 text-[10px] font-bold">|</span>
                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">
                          {product.category}
                        </span>
                      </div>
                      
                      <h2 className="text-2xl font-black text-slate-900 mb-4">{product.name}</h2>
                      
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-slate-600 text-sm">
                          <FaUser className="text-slate-300" />
                          <span className="font-bold">{product.sellerName}</span>
                          <span className="text-[10px] text-slate-400">({product.seller})</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 text-sm">
                          <FaLayerGroup className="text-slate-300" />
                          <span className="font-bold">Stock: {product.stock} Units</span>
                        </div>
                        <div className="flex items-center gap-3 text-2xl font-black text-teal-600">
                          ${product.price}
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                          "{product.description}"
                        </p>
                      </div>
                    </div>

                    {/* ADMIN ACTION BOX */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* ACTIVATE BUTTON: Disabled if ALREADY Active */}
                      <button 
                        onClick={() => handleStatusChange("Active")}
                        disabled={product.status === "Active"}
                        className="flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white transition-all disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed"
                      >
                        <FaCheckCircle /> Activate
                      </button>

                      {/* SUSPEND BUTTON: Disabled if ALREADY Suspended By Admin */}
                      <button 
                        onClick={() => handleStatusChange("Suspended By Admin")}
                        disabled={product.status === "Suspended By Admin"}
                        className="flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white transition-all disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed"
                      >
                        <FaBan /> Suspend
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-20 opacity-20">
              <FaBox size={80} className="mx-auto mb-4" />
              <p className="font-black uppercase tracking-[0.5em] text-sm">Enter Product ID to Begin</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}