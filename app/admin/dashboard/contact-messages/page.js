'use client'

import { useState, useEffect, use } from 'react'
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa'
import { toast } from 'react-toastify'
import axiosInstance from '@/lib/axios'
import { useRouter } from 'next/navigation'

const ContactAdmin = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axiosInstance.get('/admin/get-contacts')
        setMessages(data.data || [])
      } catch (err) {
        toast.error("Failed to load messages")
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [])

  // 2️⃣ Handle Status Update with axiosInstance
  const updateStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post(`/admin/contacts/modify-status`, { id, status: newStatus })
      setMessages(messages.map(m => m._id === id ? { ...m, status: newStatus } : m))
      toast.success(`Marked as ${newStatus}`)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      toast.error("Update failed")
      console.error(err)
    }
  }

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-400">LOADING DATABASE...</div>

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Modern Back Button */}
                <button
                  onClick={() => router.push("/admin/dashboard")}
                  className="group flex items-center gap-2 mb-8 text-teal-600 font-bold transition-all hover:gap-4"
                >
                  <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                  <span>Admin Panel</span>
                </button>
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Inbound Inquiries</h1>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-2">Tradexon Customer Relations</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black text-teal-600">{messages.length}</span>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Messages</p>
          </div>
        </div>

        {/* Messages List */}
        <div className="grid gap-6">
          {messages.map((msg) => (
            <div key={msg._id} className="bg-white border border-slate-200 rounded-4xl p-8 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
                
                {/* User Info */}
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">From</p>
                  <p className="font-black text-slate-900">{msg.fullname}</p>
                  <p className="text-sm text-slate-500 font-medium lowercase">{msg.email}</p>
                </div>

                {/* Subject & Message Preview */}
                <div className="lg:col-span-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Subject: {msg.subject}</p>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 italic">
                    "{msg.message}"
                  </p>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col items-end justify-between gap-4">
                  {/* Dynamic Status Badge */}
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    msg.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                    msg.status === 'read' ? 'bg-blue-100 text-blue-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {msg.status}
                  </span>

                  {/* Quick Action Buttons */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateStatus(msg._id, 'closed')}
                      className="p-3 bg-slate-100 hover:bg-green-500 hover:text-white rounded-xl transition-all text-slate-500" 
                      title="Close Ticket"
                    >
                      <FaCheckCircle size={14} />
                    </button>
                  </div>
                </div>

              </div>
              
              {/* Timestamp */}
              <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Received: {new Date(msg.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ContactAdmin