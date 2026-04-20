"use client";

import { useState, useEffect } from "react";
import { 
  FaGlobeAmericas, FaSave, FaSyncAlt, 
  FaHistory, FaArrowLeft, FaChevronDown, FaLock, FaCoins
} from "react-icons/fa";
import axiosInstance from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import Swal from 'sweetalert2';
import Link from "next/link";

const ExchangeRatesPage = () => {
  const [allRates, setAllRates] = useState({}); 
  const [selectedCurrency, setSelectedCurrency] = useState("PKR"); 
  const [currentRate, setCurrentRate] = useState(""); 
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/rates/get-rates");
      if (response.data.rates) {
        setAllRates(response.data.rates);
        setCurrentRate(response.data.rates[selectedCurrency] || "");
      }
      setLastUpdated(response.data.lastUpdated);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrencyChange = (e) => {
    const currency = e.target.value;
    setSelectedCurrency(currency);
    setCurrentRate(allRates[currency] || "");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      const response = await axiosInstance.post("/rates/update-rates", { 
        rates: { [selectedCurrency]: parseFloat(currentRate) } 
      });
      
      if (response.status === 200) {
        Swal.fire({ icon: 'success', title: 'Sync Successful', text: `Updated ${selectedCurrency} rate.`, timer: 1500, showConfirmButton: false });
        
        // Update local state with the full object returned from backend
        setAllRates(response.data.rates);
        setLastUpdated(response.data.lastUpdated);
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Update Failed', text: 'Check your database connection.' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <FaSyncAlt className="animate-spin text-teal-500 text-3xl" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-12 font-sans flex flex-col items-center">
      <div className="w-full max-w-2xl">
        
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all mb-8 group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>

        {/* MAIN UPDATE CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white p-6 md:p-10 relative overflow-hidden mb-8"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase text-teal-600">Rate Manager</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" /> Live System Exchange
              </p>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 border border-slate-100">
              <FaGlobeAmericas size={20} />
            </div>
          </div>

          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Base Currency</label>
                <div className="relative">
                  <input readOnly value="USD" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-bold text-slate-400 cursor-not-allowed outline-none" />
                  <FaLock className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Target Currency</label>
                <div className="relative">
                  <select 
                    value={selectedCurrency}
                    onChange={handleCurrencyChange}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 appearance-none outline-none focus:border-teal-500 focus:bg-white transition-all"
                  >
                    <option value="PKR">PKR - Pakistani Rupee</option>
                  </select>
                  <FaChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none size-3" />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-end">
               <div className="bg-teal-50/50 rounded-3xl p-6 border border-teal-100/50 text-center mb-6">
                  <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest mb-2 block">1 USD =</span>
                  <input 
                    type="number" step="0.01" value={currentRate}
                    onChange={(e) => setCurrentRate(e.target.value)}
                    className="bg-transparent text-4xl font-black text-slate-900 w-full text-center outline-none border-b-2 border-teal-200 focus:border-teal-500 transition-all"
                  />
                  <span className="text-xs font-black text-slate-400 mt-2 block">{selectedCurrency}</span>
               </div>
               <button 
                type="submit" disabled={isUpdating}
                className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-teal-600 transition-all shadow-lg disabled:bg-slate-200 flex items-center justify-center gap-3"
              >
                {isUpdating ? <FaSyncAlt className="animate-spin" /> : <FaSave />}
                {isUpdating ? "Syncing..." : "Update Rate"}
              </button>
            </div>
          </form>
        </motion.div>

        {/* EXISTING RATES REGISTRY */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-4 px-4">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <FaCoins className="text-teal-500" /> Active Registry
            </h2>
            <span className="text-[9px] font-bold text-slate-300 uppercase">
              Last Updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'N/A'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <AnimatePresence>
              {Object.entries(allRates).map(([curr, rate]) => (
                <motion.div 
                  layout
                  key={curr}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center transition-all ${
                    curr === selectedCurrency ? "bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-200" : "bg-white border-white text-slate-900 shadow-sm"
                  }`}
                >
                  <span className={`text-[10px] font-black uppercase mb-1 ${curr === selectedCurrency ? "text-teal-100" : "text-slate-400"}`}>
                    {curr}
                  </span>
                  <span className="text-xl font-black tabular-nums">
                    {Number(rate).toFixed(2)}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ExchangeRatesPage;