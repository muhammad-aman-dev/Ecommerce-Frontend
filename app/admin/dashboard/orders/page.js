'use client'

import { useState, useEffect } from "react"
import { FaArrowLeft, FaSearch, FaBox, FaUser, FaMoneyBillWave, FaTruck, FaGlobe } from "react-icons/fa"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import axiosInstance from "@/lib/axios"
import "react-toastify/dist/ReactToastify.css"

export default function TrackOrderPage() {
  const router = useRouter()
  const [searchId, setSearchId] = useState("")
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [originalStatus, setOriginalStatus] = useState({ seller: "", buyer: "" })

  const handleSearch = async () => {
    if (!searchId.trim()) return toast.warning("Please enter an Order ID")
    
    setLoading(true)
    try {
      // Searching by the custom orderId field (ORD-XXXXXX)
      const { data } = await axiosInstance.get(`/admin/orders/${searchId.trim()}`)
      setOrder(data)
      setOriginalStatus({ 
        seller: data.sellerStatus || "pending", 
        buyer: data.buyerStatus || "pending" 
      })
      setHasChanges(false)
    } catch (err) {
      setOrder(null)
      toast.error(err.response?.data?.message || "Order not found")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!order) return
    const isChanged = 
      order.sellerStatus !== originalStatus.seller || 
      order.buyerStatus !== originalStatus.buyer
    setHasChanges(isChanged)
  }, [order?.sellerStatus, order?.buyerStatus, originalStatus])

  const handleUpdate = async () => {
    try {
      await axiosInstance.put(`/admin/orders/update-status/${order._id}`, {
        sellerStatus: order.sellerStatus,
        buyerStatus: order.buyerStatus
      })
      setOriginalStatus({ seller: order.sellerStatus, buyer: order.buyerStatus })
      setHasChanges(false)
      toast.success("Statuses updated in database!")
    } catch (err) {
      toast.error("Update failed. Check server logs.")
    }
  }

  const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-sans">
      <ToastContainer position="top-right" theme="colored" />

      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => router.push("/admin/dashboard")}
          className="flex items-center gap-2 mb-8 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-teal-600 transition-all group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>

        <header className="mb-10 flex justify-between items-start">
  <div>
    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
      Order <span className="text-teal-600 italic">Control</span>
    </h1>
    <p className="text-slate-500 font-medium">Schema-aligned tracking & status override.</p>
  </div>
  {order?.isPaidToSeller && (
    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-2xl border border-green-200 flex items-center gap-2">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="text-[10px] font-black uppercase tracking-widest">Paid & Finalized</span>
    </div>
  )}
</header>

        {/* Search Input */}
        <div className="flex gap-3 mb-12 bg-white p-2 rounded-3xl shadow-sm border border-slate-100">
          <input
            type="text"
            placeholder="Enter Order ID (e.g., ORD-123456)"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-6 py-3 rounded-2xl bg-transparent focus:outline-none font-bold text-slate-700"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl hover:bg-teal-600 transition-all font-black uppercase text-xs tracking-widest flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? "Fetching..." : <><FaSearch /> Track</>}
          </button>
        </div>

        {order && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Customer & Financial Info */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Buyer Section */}
              <div className="lg:col-span-2 bg-white p-8 rounded-4xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6 text-teal-600">
                  <FaUser size={20} />
                  <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">Buyer Information</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name & Contact</p>
                    <p className="text-lg font-black text-slate-900">{order.buyer?.name}</p>
                    <p className="text-slate-500 text-sm font-medium">{order.buyer?.email}</p>
                    <p className="text-slate-500 text-sm font-medium">{order.buyer?.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shipping Address</p>
                    <p className="text-sm text-slate-700 font-bold leading-relaxed">
                      {order.buyer?.address?.line1}<br />
                      {order.buyer?.address?.line2 && <>{order.buyer.address.line2}<br /></>}
                      {order.buyer?.address?.city}, {order.buyer?.address?.state || ''} {order.buyer?.address?.postalCode}<br />
                      <span className="text-teal-600 uppercase text-[10px]">{order.buyer?.address?.country}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6 text-amber-500">
                  <FaMoneyBillWave size={20} />
                  <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">Payment</h3>
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
                  <p className="text-3xl font-black text-slate-900">
                    {order.currency} {order.totalAmountLocal?.toLocaleString()}
                  </p>
                  <p className="text-xs font-bold text-slate-400 mt-1 italic">≈ ${order.totalAmountUSD?.toFixed(2)} USD</p>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                      order.payment?.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                      {order.payment?.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{order.payment?.provider}</span>
                  </div>
                </div>
                <FaGlobe className="absolute -bottom-4 -right-4 text-slate-200 size-24 -rotate-12" />
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50">
  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Refund Status</p>
  <span className={`text-[10px] font-black uppercase ${
    order.refundStatus === 'approved' ? 'text-rose-600' : 
    order.refundStatus === 'requested' ? 'text-amber-600' : 'text-slate-400'
  }`}>
    {order.refundStatus || 'None'}
  </span>
</div>        
         </div>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  <div className="bg-white p-6 rounded-3xl border border-slate-100">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Created</p>
    <p className="text-sm font-black text-slate-900">{formatDate(order.createdAt)}</p>
  </div>
    <div className="bg-white p-6 rounded-3xl border border-slate-100">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dispatched</p>
    <p className="text-sm font-black text-teal-600">{order.dispatchedAt ? formatDate(order.dispatchedAt) : "Pending"}</p>
  </div>
  <div className="bg-white p-6 rounded-3xl border border-slate-100">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Buyer Action</p>
    <p className="text-sm font-black text-indigo-600">{order.buyerStatusUpdateDate ? formatDate(order.buyerStatusUpdateDate) : "Awaiting"}</p>
  </div>
  <div className={`p-6 rounded-3xl border ${order.isPaidToSeller ? 'bg-green-50 border-green-100' : 'bg-white border-slate-100'}`}>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Seller Payout</p>
    <p className={`text-sm font-black ${order.isPaidToSeller ? 'text-green-600' : 'text-amber-500'}`}>
      {order.isPaidToSeller ? "Released" : "Held in Escrow"}
    </p>
    {!order.isPaidToSeller && order.payoutEligibleDate && (
      <p className="text-[8px] font-bold text-slate-400 mt-1">
        Release Date: {formatDate(order.payoutEligibleDate)}
      </p>
    )}
  </div>
</div>
            {/* Items Section */}
            <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em] mb-8 flex items-center gap-2">
                <FaBox className="text-teal-600" /> Package Contents ({order.items?.length})
              </h3>
              <div className="divide-y divide-slate-50">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-6 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center gap-6">
                    <img 
                      src={item.image || "/placeholder.png"} 
                      alt={item.name} 
                      className="w-20 h-20 rounded-2xl object-cover bg-slate-50 shadow-inner" 
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-white bg-slate-900 px-2 py-0.5 rounded uppercase">Item</span>
                        <p className="font-black text-slate-900 uppercase tracking-tight">{item.name}</p>
                      </div>
                      
                      {/* Variations Loop */}
                      <div className="flex flex-wrap items-center gap-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Qty: {item.quantity}</span>
                        {item.variations && Object.entries(item.variations).map(([key, value]) => (
                          value && (
                            <div key={key} className="flex items-center text-[11px] font-bold uppercase text-slate-400">
                              <span className="mx-2 text-slate-200">|</span>
                              <span className="text-slate-500">{key}:</span>
                              <span className="ml-1 text-teal-600">{value}</span>
                            </div>
                          )
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Seller: {item.sellerName}</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-bold ">Seller Email: {item.sellerEmail}</p>
                    </div>
                    <div className="md:text-right flex md:flex-col justify-between items-center md:items-end">
                      <div className="text-left md:text-right">
                        <p className="font-black text-slate-900 text-sm">{order.currency} {item.priceLocal?.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">${item.priceUSD} USD</p>
                      </div>
                      <span className="md:mt-2 text-[10px] font-black text-teal-600 bg-teal-50 px-3 py-1 rounded-full uppercase italic">
                        {item.sellerStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Override Controls */}
            <div className="bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
               <div className="relative z-10">
                {/* Inside the relative z-10 div of Status Override */}
{order.isPaidToSeller && (
  <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
    <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
      ⚠️ Warning: Order Finalized
    </p>
    <p className="text-slate-400 text-[10px] font-medium mt-1">
      Money has already been released to the seller. Changing statuses now may require manual balance adjustments.
    </p>
  </div>
)}
                 <div className="flex items-center justify-between mb-10">
                   <div>
                     <h3 className="font-black uppercase text-xs tracking-[0.3em] text-teal-400 flex items-center gap-2">
                        <FaTruck /> Master Status Override
                     </h3>
                     <p className="text-slate-400 text-xs font-bold mt-1">Manual database synchronization for Order ID: {order.orderId}</p>
                   </div>
                   <div className="hidden md:block text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase">Internal ID</p>
                      <p className="text-[10px] font-mono text-slate-600">{order._id}</p>
                   </div>
                 </div>
                 
                 <div className="grid md:grid-cols-2 gap-10">
                    {/* Seller Status Dropdown */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Global Seller Progress</label>
                      <select 
                        value={order.sellerStatus}
                        disabled={order.isPaidToSeller}
                        onChange={(e) => setOrder({...order, sellerStatus: e.target.value})}
                        className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl p-5 font-bold text-sm text-teal-100 focus:border-teal-500 outline-none appearance-none transition-all cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped (In Transit)</option>
                        <option value="delivered">Delivered (Fulfillment Complete)</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Buyer Status Dropdown */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Buyer Receipt Confirmation</label>
                      <select 
                        value={order.buyerStatus}
                        disabled={order.isPaidToSeller}
                        onChange={(e) => setOrder({...order, buyerStatus: e.target.value})}
                        className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl p-5 font-bold text-sm text-indigo-100 focus:border-indigo-500 outline-none appearance-none transition-all cursor-pointer"
                      >
                        <option value="pending">Pending (Waiting for Buyer)</option>
                        <option value="received">Received (Buyer Confirmed)</option>
                        <option value="cancelled">Cancelled / Refunded</option>
                      </select>
                    </div>
                 </div>

                 {hasChanges && (
                   <div className="mt-12 pt-10 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <p className="text-xs font-bold text-amber-400 uppercase tracking-widest animate-pulse">
                        Unsaved changes detected in status
                      </p>
                      <button 
                        onClick={handleUpdate}
                        className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-slate-900 font-black px-12 py-5 rounded-2xl uppercase text-xs tracking-widest shadow-xl shadow-teal-500/30 transition-all active:scale-95"
                      >
                        Push Changes to Database
                      </button>
                   </div>
                 )}
               </div>
               {/* Decorative Element */}
               <div className="absolute -top-12 -left-12 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}