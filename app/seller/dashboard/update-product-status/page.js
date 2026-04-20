"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaArrowRight, FaBarcode, FaEdit, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

const UpdateProductStatusPage = () => {
  const [productId, setProductId] = useState("");
  const router = useRouter();

  const handleRedirect = (e) => {
    if (e) e.preventDefault();

    // Basic Validation
    if (!productId.trim()) {
      return toast.error("Please enter a valid Product ID");
    }

    // Typical MongoDB ObjectId length is 24
    if (productId.length < 20) {
      return toast.warning("That ID looks a bit short. Double-check it?");
    }

    const toastId = toast.loading("Locating product...");

    // Redirect to your edit route
    setTimeout(() => {
      toast.dismiss(toastId);
      router.push(`/seller/dashboard/products/edit?id=${productId.trim()}`);
    }, 500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        <button 
                      onClick={() => router.push("/seller/dashboard")}
                      className="group flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-2 text-sm font-bold uppercase tracking-widest"
                    >
                      <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                      Dashboard
                    </button>
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="bg-teal-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-teal-100 shadow-sm">
            <FaEdit className="text-teal-600 text-2xl" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            Quick Edit Bridge
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
            Enter Product ID to modify status or details
          </p>
        </div>

        {/* Input Card */}
        <form 
          onSubmit={handleRedirect}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-6"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FaBarcode className="text-teal-500" /> System Product ID
              </label>
            </div>
            
            <div className="relative group">
              <input
                type="text"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="e.g. 69c37b0ee169407ede..."
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 outline-none transition-all group-hover:bg-slate-100 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5"
                autoFocus
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors">
                <FaSearch size={14} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-teal-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 active:scale-[0.98]"
          >
            Find & Update Product
            <FaArrowRight className="text-[10px]" />
          </button>
        </form>

        {/* Footer Hint */}
        <div className="mt-8 bg-slate-100/50 rounded-2xl p-4 border border-dashed border-slate-200">
          <p className="text-[9px] font-bold text-slate-400 text-center leading-relaxed italic">
            Tip: You can find the Product Main ID in your inventory list or 
            database management console.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductStatusPage;