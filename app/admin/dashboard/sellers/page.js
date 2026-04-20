'use client'

import { useRouter } from "next/navigation"
import { 
  FaArrowLeft, FaStore, FaBoxOpen, FaUserCircle, 
  FaExternalLinkAlt, FaCalendarAlt, FaChartLine, FaFingerprint, FaCopy, FaSpinner, FaEye, FaWallet 
} from "react-icons/fa"
import { useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axiosInstance from "@/lib/axios"
import Link from "next/link"

const SellersPage = () => {
  const router = useRouter()
  const [filter, setFilter] = useState("All")
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSellers = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get("/admin/get-sellers")
      setSellers(response.data.sellers || [])
    } catch (error) {
      console.error("Error fetching sellers:", error)
      toast.error("Failed to load merchants. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSellers()
  }, [])

  const copyToClipboard = (id) => {
    try {
      navigator.clipboard.writeText(id);
      toast.success(`ID ${id} copied!`, {
        position: "bottom-center",
        autoClose: 1500,
        theme: "dark",
      });
    } catch (err) {
      toast.error("Manual copy required.");
    }
  }

  const filteredSellers = filter === "All" ? sellers : sellers.filter((s) => s.status === filter)

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-2">
            <button 
              onClick={() => router.push("/admin/dashboard")}
              className="group flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors font-bold text-xs uppercase tracking-widest"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
              Back to Dashboard
            </button>
            <div className="flex items-center gap-4">
              <div className="bg-teal-600 p-3 rounded-2xl text-white shadow-lg shadow-teal-200">
                <FaStore size={24} />
              </div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight">Merchant Central</h1>
            </div>
          </div>

          {!loading && (
            <div className="flex bg-white p-1.5 rounded-3xl shadow-sm border border-slate-100">
              {["All", "Active", "Suspended"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-6 py-2.5 rounded-[1.2rem] text-xs font-black uppercase tracking-widest transition-all ${
                    filter === type ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-4">
            <FaSpinner className="animate-spin text-teal-600" size={40} />
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest animate-pulse">Syncing Merchant Data...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredSellers.map((seller) => (
                <div
                  key={seller.id || seller._id}
                  className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-teal-900/5 transition-all duration-500"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center group-hover:bg-teal-50 group-hover:text-teal-500 transition-colors">
                      <FaUserCircle size={32} />
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      seller.status === "Active" ? "bg-teal-50 text-teal-600" : "bg-rose-50 text-rose-600"
                    }`}>
                      {seller.status}
                    </div>
                  </div>

                  <h2 className="text-xl font-black text-slate-800 group-hover:text-teal-600 transition-colors truncate">
                    {seller.name}
                  </h2>
                  <p className="text-sm text-slate-400 font-medium mb-4 truncate">
                    {seller.email}
                  </p>

                  {/* ID INPUT GROUP */}
                  <div className="flex items-center gap-1 mb-6">
                    <div className="relative flex-1">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
                        <FaFingerprint size={12} />
                      </div>
                      <input 
                        readOnly 
                        value={seller.id || seller._id}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-9 pr-3 text-[10px] font-mono font-bold text-slate-600 focus:outline-none cursor-text selection:bg-teal-100"
                        onClick={(e) => e.target.select()}
                      />
                    </div>
                    <button 
                      onClick={() => copyToClipboard(seller.id || seller._id)}
                      className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-slate-400 hover:text-teal-600 hover:bg-white hover:border-teal-100 transition-all active:scale-90"
                    >
                      <FaCopy size={12} />
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div className="space-y-3 mb-8">
                    {/* Listings Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                           <FaBoxOpen size={12} className="text-teal-600" />
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total SKU</p>
                        </div>
                        <p className="text-sm font-bold text-slate-700">{seller.listings || 0}</p>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-4 border-l-2 border-teal-500/20">
                        <div className="flex items-center gap-2 mb-1">
                           <FaEye size={12} className="text-blue-500" />
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active</p>
                        </div>
                        <p className="text-sm font-bold text-slate-700">{seller.activeListings || 0}</p>
                      </div>
                    </div>

                    {/* Financial Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                           <FaChartLine size={12} className="text-amber-500" />
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Revenue</p>
                        </div>
                        <p className="text-sm font-bold text-slate-700">${(seller.sales || 0).toLocaleString()}</p>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-4 border-l-2 border-indigo-500/20">
                        <div className="flex items-center gap-2 mb-1">
                           <FaWallet size={12} className="text-indigo-500" />
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Payout</p>
                        </div>
                        <p className="text-sm font-bold text-slate-700">${(seller.remainingPayout || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Date Row */}
                    <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4">
                      <div className="bg-white p-2 rounded-xl shadow-sm text-blue-500">
                        <FaCalendarAlt size={14} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Partnership Since</p>
                        <p className="text-sm font-bold text-slate-700">
                          {seller.joinedDate ? new Date(seller.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link href={`/seller-details/${seller.id}`} target="_blank" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-teal-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                  >
                    Inspect Merchant Account <FaExternalLinkAlt size={10} />
                  </Link>
                </div>
              ))}
            </div>

            {filteredSellers.length === 0 && (
              <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                <FaStore className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No merchants found in this category</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SellersPage