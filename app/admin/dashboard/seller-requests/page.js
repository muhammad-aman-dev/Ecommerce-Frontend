'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FaArrowLeft, FaUserShield, FaIdCard, FaCheckCircle, FaTimesCircle } from "react-icons/fa"
import axiosInstance from "@/lib/axios"
import GlobalLoader from "@/components/GlobalLoader"
import { toast } from "react-toastify"
import Swal from "sweetalert2"

const SellerRequestsPage = () => {
  const router = useRouter()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({})

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.post("/admin/getSellersRequests")
      setRequests(res.data.map(req => ({ ...req, status: "Pending Verification" })))
    } catch (err) {
      console.error("Error fetching seller requests:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleAction = async (email, goal) => {
    try {
      setActionLoading(prev => ({ ...prev, [email]: true }))
      await axiosInstance.post("/admin/addSeller", {
        sellerSignEmail: email,
        goal
      })

      setRequests(prev => prev.filter(req => req.email !== email))

      Swal.fire({
        icon: "success",
        title: goal === "accept" ? "Access Granted" : "Request Denied",
        text: `Seller registration has been ${goal === "accept" ? "approved" : "rejected"}.`,
        confirmButtonColor: "#0d9488",
        timer: 2000,
      })
    } catch (err) {
      console.error(`Error ${goal} seller:`, err)
      toast.error(`System error: Failed to ${goal} seller.`)
    } finally {
      setActionLoading(prev => ({ ...prev, [email]: false }))
    }
  }

  const confirmAction = (email, goal) => {
    Swal.fire({
      title: `<span style="color:#1f2937">${goal === "accept" ? "Approve Seller?" : "Reject Seller?"}</span>`,
      html: `Confirming action for: <b>${email}</b>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: goal === "accept" ? "#0d9488" : "#dc2626",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: goal === "accept" ? "Verify & Approve" : "Reject Application",
      reverseButtons: true,
      customClass: {
        popup: 'rounded-3xl shadow-2xl border border-gray-100',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleAction(email, goal)
      }
    })
  }

  if (loading) return <GlobalLoader />

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Modern Back Button */}
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="group flex items-center gap-2 mb-8 text-teal-600 font-bold transition-all hover:gap-4"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Admin Panel</span>
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-teal-600">
              <FaUserShield size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Seller Verification</h1>
              <p className="text-slate-500 font-medium mt-1">
                Security clearance for new vendor registrations
              </p>
            </div>
          </div>
          
          <div className="px-6 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
            <span className="text-slate-400 font-medium">Pending Queue: </span>
            <span className="text-teal-600 font-bold">{requests.length}</span>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                    {req.name}
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">{req.email}</p>
                  <p className="text-sm text-slate-500 font-medium">{req.phone}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  {req.status}
                </div>
              </div>

              {/* Document Showcase */}
              <div className="p-6 flex-1">
                <div className="flex items-center gap-2 mb-4 text-slate-400">
                  <FaIdCard />
                  <span className="text-xs font-bold uppercase tracking-widest">Identification Documents</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Front Side</p>
                    <div className="relative aspect-3/2 rounded-xl overflow-hidden border-2 border-slate-100 bg-slate-50 group">
                      <img
                        src={req.cnicFront}
                        alt="CNIC Front"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Back Side</p>
                    <div className="relative aspect-3/2 rounded-xl overflow-hidden border-2 border-slate-100 bg-slate-50 group">
                      <img
                        src={req.cnicBack}
                        alt="CNIC Back"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex gap-4">
                <button
                  onClick={() => confirmAction(req.email, "accept")}
                  disabled={actionLoading[req.email]}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-100 hover:bg-teal-700 hover:shadow-teal-200 active:scale-95 transition-all disabled:opacity-50"
                >
                  <FaCheckCircle />
                  {actionLoading[req.email] ? "Granting..." : "Approve Seller"}
                </button>

                <button
                  onClick={() => confirmAction(req.email, "reject")}
                  disabled={actionLoading[req.email]}
                  className="px-6 py-3.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold transition-all active:scale-95 border border-transparent hover:border-red-100 disabled:opacity-50"
                >
                  <FaTimesCircle size={20} />
                </button>
              </div>
            </div>
          ))}

          {requests.length === 0 && !loading && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <FaUserShield size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Queue is Clear</h3>
              <p className="text-slate-500">There are no pending seller verification requests.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SellerRequestsPage