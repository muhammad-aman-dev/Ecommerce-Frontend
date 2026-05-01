'use client'

import { useState, useEffect } from "react"
import { FaCheckCircle, FaTimesCircle, FaClock, FaEnvelope, FaUser, FaArrowLeft } from "react-icons/fa"
import { useRouter } from "next/navigation"
import axiosInstance from "@/lib/axios"
import Swal from "sweetalert2"

export default function AdminSellerComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All") 

  const router=useRouter();

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      const { data } = await axiosInstance.get("/admin/seller-support/all")
      setComplaints(data.complaints)
    } catch (err) {
      Swal.fire("Error", "Could not load complaints", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  // Filter Logic
  const filteredComplaints = complaints.filter(item => 
    filter === "All" ? true : item.status === filter
  )

  const handleUpdateStatus = async (id, currentStatus, newStatus) => {
    const isReject = newStatus === "Rejected"
    const actionText = isReject ? "Rejection Reason" : "Resolution Details"
    
    const { value: text, isConfirmed } = await Swal.fire({
      title: `Confirm ${newStatus}`,
      input: 'textarea',
      inputLabel: `Enter ${actionText} to send to the seller`,
      inputPlaceholder: isReject ? 'Explain why this request was rejected...' : 'Explain how this was resolved...',
      showCancelButton: true,
      confirmButtonColor: isReject ? '#ef4444' : '#10b981',
      confirmButtonText: `Submit & Mark as ${newStatus}`,
      inputValidator: (value) => {
        if (!value) return 'You must provide a message for the seller!'
      }
    })

    if (isConfirmed) {
      Swal.fire({ title: 'Updating...', didOpen: () => Swal.showLoading() })
      try {
        await axiosInstance.put(`/admin/support/update/${id}`, {
          status: newStatus,
          adminMessage: text 
        })
        Swal.fire('Updated!', `Complaint marked as ${newStatus}.`, 'success')
        fetchComplaints()
      } catch (err) {
        Swal.fire('Failed', err.response?.data?.message || 'Update failed', 'error')
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
            <button 
                      onClick={() => router.push("/admin/dashboard")}
                      className="flex items-center gap-2 mb-8 text-[11px] font-black uppercase italic tracking-widest text-slate-400 hover:text-orange-600 transition-all group"
                    >
                      <FaArrowLeft className="group-hover:-translate-x-1 transition-transform " /> Back to Dashboard
                    </button>
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase italic">
              Seller <span className="text-orange-600">Complaints</span>
            </h1>
            <p className="text-slate-500 font-medium uppercase text-[10px] tracking-widest mt-1">Management Terminal</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-slate-200">
            {["All", "Pending", "Solved", "Rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === tab 
                    ? "bg-white text-orange-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-4xl animate-pulse" />)}
          </div>
        ) : (
          /* Fixed Height Container with Custom Scrollbar */
          <div className="grid gap-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {filteredComplaints.map((item) => (
              <div key={item._id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        item.status === 'Solved' ? 'bg-emerald-100 text-emerald-600' : 
                        item.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-slate-400 text-[10px] font-bold flex items-center gap-1">
                        <FaClock /> {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-800 mb-2">{item.subject}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl italic">
                      "{item.message}"
                    </p>

                    <div className="mt-4 flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <FaUser className="text-orange-500" /> {item.sellerName}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <FaEnvelope className="text-orange-500" /> {item.sellerEmail}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col gap-3 justify-center">
                    {item.status === "Pending" && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(item._id, item.status, "Solved")}
                          className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                        >
                          <FaCheckCircle /> Resolve
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(item._id, item.status, "Rejected")}
                          className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all"
                        >
                          <FaTimesCircle /> Reject
                        </button>
                      </>
                    )}
                    {item.status !== "Pending" && (
                      <div className="text-center p-4 border-2 border-dashed border-slate-100 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Case Closed</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredComplaints.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <p className="font-black text-slate-300 uppercase tracking-widest">
                  No {filter !== "All" ? filter.toLowerCase() : ""} complaints found
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inline style for the scrollbar aesthetic */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  )
}