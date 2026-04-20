'use client'

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { FaPaperPlane, FaHistory, FaArrowLeft, FaHeadset, FaEnvelopeOpenText, FaClock } from "react-icons/fa"
import { useRouter } from "next/navigation"
import axiosInstance from "@/lib/axios"
import Swal from "sweetalert2"

export default function SellerSupportPage() {
  const router = useRouter()
  const { authSeller } = useSelector((state) => state.auth)
  
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ subject: "", message: "" })

  const fetchMessageHistory = async () => {
    try {
      setLoading(true)
      const { data } = await axiosInstance.get("/seller/support/history")
      setMessages(data.messages)
    } catch (err) {
      console.error("History fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessageHistory()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    Swal.fire({
      title: 'Sending Message...',
      didOpen: () => { Swal.showLoading() }
    })

    try {
      await axiosInstance.post("/seller/support/send", formData)

      Swal.fire({
        icon: 'success',
        title: 'Message Sent',
        text: 'The admin team will review your inquiry shortly.',
        timer: 2500,
        showConfirmButton: false
      })

      setFormData({ subject: "", message: "" })
      fetchMessageHistory() // Refresh history
    } catch (err) {
      Swal.fire("Error", "Failed to deliver message. Please try again.", "error")
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header & Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <button 
              onClick={() => router.push("/seller/dashboard")}
              className="flex items-center gap-2 text-slate-400 hover:text-teal-600 font-bold text-xs uppercase tracking-widest transition-all mb-4"
            >
              <FaArrowLeft /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase italic">
              Help & <span className="text-teal-600">Support</span>
            </h1>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center text-xl">
              <FaHeadset />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support Status</p>
              <p className="text-sm font-bold text-slate-700">Online & Active</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* Message Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 sticky top-8">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em] mb-8 flex items-center gap-2">
                <FaPaperPlane className="text-teal-600" /> New Inquiry
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2 px-1">Inquiry Subject</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g., Payment Issue, Technical Bug"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm text-slate-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2 px-1">Detailed Message</label>
                  <textarea 
                    required
                    rows="6"
                    placeholder="Describe your issue in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm text-slate-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-teal-600 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3"
                >
                  Send to Admin <FaPaperPlane />
                </button>
              </form>
            </div>
          </div>

          {/* History List */}
          <div className="lg:col-span-3">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-150">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em] mb-8 flex items-center gap-2">
                <FaHistory className="text-indigo-600" /> Message History
              </h3>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-50 rounded-3xl animate-pulse" />)}
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-slate-200 text-6xl mb-4 flex justify-center">
                    <FaEnvelopeOpenText />
                  </div>
                  <p className="text-slate-400 font-bold italic">No support tickets found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg._id} className="p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-indigo-100 transition-all group">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                          msg.status === 'Resolved' ? 'bg-teal-100 text-teal-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                          {msg.status || 'Pending'}
                        </span>
                        <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                          <FaClock size={10} /> {new Date(msg.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <h4 className="font-black text-slate-800 text-sm mb-2 group-hover:text-teal-600 transition-colors">
                        {msg.subject}
                      </h4>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}