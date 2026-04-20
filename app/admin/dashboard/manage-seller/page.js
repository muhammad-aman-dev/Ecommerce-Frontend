'use client'

import { useRouter } from "next/navigation"
import { FaArrowLeft, FaFingerprint, FaSpinner, FaExchangeAlt, FaShieldAlt } from "react-icons/fa"
import { useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import Swal from "sweetalert2" // Import SweetAlert2
import "react-toastify/dist/ReactToastify.css"
import axiosInstance from "@/lib/axios"

const ManageSellersPage = () => {
  const router = useRouter()
  const [sellerId, setSellerId] = useState("")
  const [loading, setLoading] = useState(false)

  const handleToggleStatus = async (e) => {
    e.preventDefault()
    
    const idToProcess = sellerId.trim()

    if (!idToProcess) {
      return toast.warning("Please enter a valid Merchant ID")
    }

    // --- SweetAlert2 Confirmation ---
    const result = await Swal.fire({
      title: "Confirm Status Change?",
      text: `You are about to toggle the access status for Merchant ID: ${idToProcess}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d9488", // Teal 600
      cancelButtonColor: "#e11d48",  // Rose 600
      confirmButtonText: "Yes, Execute!",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      customClass: {
        title: "font-sans font-black text-slate-800",
        htmlContainer: "font-sans font-medium text-slate-500",
        confirmButton: "rounded-2xl px-6 py-3 font-bold uppercase text-xs tracking-widest",
        cancelButton: "rounded-2xl px-6 py-3 font-bold uppercase text-xs tracking-widest"
      }
    })

    if (result.isConfirmed) {
      executeToggle(idToProcess)
    }
  }

  const executeToggle = async (id) => {
    console.log(id)
    try {
      setLoading(true)
      const response = await axiosInstance.post("/admin/toggle-seller-status", { id })

      if (response.data.success) {
        // Success Alert
        await Swal.fire({
          title: "Command Executed",
          text: response.data.message || "Merchant status has been flipped successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: "#ffffff",
        })
        
        setSellerId("") // Clear input on success
      }
    } catch (error) {
      console.error("Toggle Error:", error)
      const errorMsg = error.response?.data?.message || "Failed to update merchant status."
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans flex items-center justify-center">
      <ToastContainer />
      
      <div className="w-full max-w-xl">
        {/* Navigation */}
        <button 
          onClick={() => router.push("/admin/dashboard")}
          className="group flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-6 text-xs font-black uppercase tracking-[0.2em]"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 p-8 md:p-12 overflow-hidden relative">
          <FaShieldAlt className="absolute -right-10 -bottom-10 text-slate-50 size-64 -rotate-12 pointer-events-none" />

          <div className="relative z-10">
            <div className="bg-teal-600 w-16 h-16 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg shadow-teal-200">
              <FaExchangeAlt size={28} />
            </div>

            <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
              Merchant Access Control
            </h1>
            <p className="text-slate-500 mb-10 font-medium">
              Enter a Merchant's Object ID to flip their status between <b>Active</b> and <b>Suspended</b>.
            </p>

            <form onSubmit={handleToggleStatus} className="space-y-6">
              <div className="relative group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5 mb-2 block">
                  Merchant Object ID
                </label>
                <div className="relative">
                  <FaFingerprint className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 64f1a2b3c4d5e6f7..."
                    value={sellerId}
                    onChange={(e) => setSellerId(e.target.value)}
                    className="w-full bg-slate-50 pl-14 pr-6 py-5 rounded-2xl border-2 border-transparent focus:border-teal-500/20 focus:bg-white focus:outline-none focus:shadow-xl focus:shadow-teal-900/5 transition-all font-mono text-sm text-slate-700"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg ${
                  loading 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                    : "bg-slate-900 text-white hover:bg-teal-600 hover:shadow-teal-200 active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Processing...
                  </>
                ) : (
                  "Execute Toggle Command"
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed px-10">
          Warning: Toggling status affects merchant login ability and visibility of all associated listings immediately.
        </p>
      </div>
    </div>
  )
}

export default ManageSellersPage