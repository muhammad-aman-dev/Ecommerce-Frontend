'use client';

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { FaTimesCircle, FaArrowLeft, FaBox, FaExclamationTriangle, FaFilter, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function RejectedOrdersCardsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending"); // Choices: "all" | "pending" | "refunded"
  const router = useRouter();

  const fetchRejectedOrders = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/rejected-orders");
      setOrders(data.orders || []);
    } catch (error) {
      toast.error("Failed to load rejected orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRejectedOrders();
  }, []);

  // Filter logic based on tab choice
  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.sellerRejectionRefundStatus === filter;
  });

  const handleMarkAsRefunded = async (order) => {
    const itemsHtml = order.items.map(item => `
      <div class="flex items-center gap-3 border-b border-slate-100 py-2">
        <img src="${item.image || 'https://via.placeholder.com/40'}" class="w-10 h-10 object-cover rounded-lg border border-slate-200" alt="" />
        <div class="flex-1 text-left">
          <p class="text-xs font-bold text-slate-800 line-clamp-1">${item.name}</p>
          <p class="text-[10px] text-slate-400 font-medium">
            Qty: ${item.quantity} × $${item.priceUSD} USD 
            ${item.variations ? `| ${Object.entries(item.variations).map(([k, v]) => `${k}: ${v}`).join(', ')}` : ''}
          </p>
        </div>
      </div>
    `).join('');

    const result = await Swal.fire({
      title: 'Confirm Gateway Refund',
      html: `
        <div class="text-left font-sans text-sm text-slate-700">
          <div class="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
            <p class="text-[10px] font-black uppercase text-slate-400 mb-1">Order Tracking ID</p>
            <p class="font-mono font-bold text-slate-900 mb-3">${order.orderId}</p>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div><strong class="text-slate-400 uppercase text-[9px] block">Gateway:</strong> ${order.payment?.provider || 'PayFast'}</div>
              <div><strong class="text-slate-400 uppercase text-[9px] block">Method:</strong> ${order.payment?.method || 'Card'}</div>
              <div class="col-span-2 mt-1 select-all">
                <strong class="text-slate-400 uppercase text-[9px] block">Gateway ID:</strong> 
                <span class="font-mono bg-white px-1.5 py-0.5 border rounded border-slate-200">${order.payment?.paymentId || 'N/A'}</span>
              </div>
            </div>
          </div>
          <p class="text-[10px] font-black uppercase text-slate-400 mb-2">Items</p>
          <div class="max-h-40 overflow-y-auto mb-4 px-1">${itemsHtml}</div>
          <div class="flex justify-between items-baseline border-t border-slate-200 pt-3 mb-4">
            <span class="text-xs font-black uppercase text-slate-400">Refund Amount:</span>
            <div class="text-right">
              <span class="text-xl font-black text-rose-600 block">$${order.totalAmountUSD} USD</span>
            </div>
          </div>
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2 text-xs text-amber-800 font-medium">
            <span>⚠️</span>
            <p>Ensure you have completed the transaction return on your payment gateway panel first.</p>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Verify & Settle Record',
      cancelButtonColor: '#64748b',
      confirmButtonColor: '#0d9488',
      customClass: {
        popup: 'rounded-[2rem] font-sans px-4 py-6 max-w-lg',
        confirmButton: 'rounded-xl font-bold uppercase tracking-widest text-[10px] px-6 py-3',
        cancelButton: 'rounded-xl font-bold uppercase tracking-widest text-[10px] px-6 py-3'
      }
    });

    if (result.isConfirmed) {
      try {
        const { data } = await axiosInstance.patch(`/admin/process-rejected-refund/${order._id}`, {
          sellerRejectionRefundStatus: 'refunded'
        });

        if (data.success) {
          toast.success("Order status updated to refunded.");
          fetchRejectedOrders();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update record");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-6 group">
          <FaArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
        </button>

        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Rejected <span className="text-red-600">Orders</span>
            </h1>
            <p className="text-slate-500 font-medium">Process refunds for orders cancelled by merchants.</p>
          </div>
          
          {/* Quick Counter Card */}
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 self-start md:self-auto">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FaTimesCircle />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 leading-none">Awaiting Action</p>
              <p className="text-xl font-bold text-slate-800">
                {orders.filter(o => o.sellerRejectionRefundStatus === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        {/* Choice Filter Tabs */}
        <div className="flex border-b border-slate-200 gap-2 mb-8 overflow-x-auto pb-1">
          {[
            { id: "pending", label: "Pending Processing" },
            { id: "refunded", label: "Fully Processed" },
            { id: "all", label: "All Logs" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-5 py-2.5 rounded-t-2xl text-[11px] font-black uppercase tracking-wider transition-all border-t border-x whitespace-nowrap -mb-[5px] ${
                filter === tab.id
                  ? "bg-white border-slate-200 text-indigo-600 shadow-sm"
                  : "bg-transparent border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label} ({
                tab.id === 'all' ? orders.length : orders.filter(o => o.sellerRejectionRefundStatus === tab.id).length
              })
            </button>
          ))}
        </div>

        {/* Cards Grid Layout */}
        {loading ? (
          <div className="text-center py-20 animate-pulse text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Fetching order records...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-100 shadow-sm">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">No matching records found here.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <div 
                key={order._id}
                className="bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Card Header Info */}
                <div className="p-6 border-b border-slate-50 bg-slate-50/40">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono font-black text-slate-900 text-base">{order.orderId}</span>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                      order.sellerRejectionRefundStatus === 'pending' 
                        ? 'bg-amber-50 text-amber-600 border-amber-100' 
                        : 'bg-teal-50 text-teal-600 border-teal-100'
                    }`}>
                      {order.sellerRejectionRefundStatus === 'pending' ? 'Pending' : 'Processed'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    Buyer: <span className="font-bold text-slate-700">{order.buyer?.name}</span> ({order.buyer?.email})
                  </div>
                </div>

                {/* Card Body - Products List */}
                <div className="p-6 space-y-4 flex-1">
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2">Cancelled Items</p>
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center text-xs">
                          <img 
                            src={item.image || "https://via.placeholder.com/40"} 
                            className="w-8 h-8 rounded-lg object-cover border border-slate-100" 
                            alt="" 
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-800 truncate">{item.name}</p>
                            <p className="text-[10px] text-slate-400">Qty: {item.quantity} · ${item.priceUSD} USD</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Faulty Merchant info */}
                  <div className="bg-rose-50/50 border border-rose-100/60 rounded-2xl p-3 text-xs">
                    <p className="text-[9px] font-black uppercase text-rose-500 mb-1">Canceled By Merchant</p>
                    <p className="font-bold text-slate-800">{order.sellerName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{order.sellerEmail}</p>
                  </div>

                  {/* Gateway Metadata Reference */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 font-mono text-[11px] text-slate-600">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1 font-sans">Gateway Info</p>
                    <div className="flex justify-between font-sans font-bold text-slate-700 text-[10px] uppercase mb-1">
                      <span>{order.payment?.provider}</span>
                      <span>{order.payment?.method}</span>
                    </div>
                    <span className="block text-[10px] truncate select-all bg-white px-1 py-0.5 border border-slate-200 rounded">
                      ID: {order.payment?.paymentId}
                    </span>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Total Payout Due</p>
                    <span className="font-black text-slate-900 text-lg">${order.totalAmountUSD?.toFixed(2)} USD</span>
                  </div>

                  {order.sellerRejectionRefundStatus === 'pending' ? (
                    <button 
                      onClick={() => handleMarkAsRefunded(order)} 
                      className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 transition-all shadow-sm"
                    >
                      Process Refund
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-teal-600 font-black uppercase text-[10px] tracking-wider">
                      <FaCheckCircle size={12} /> Settled
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}