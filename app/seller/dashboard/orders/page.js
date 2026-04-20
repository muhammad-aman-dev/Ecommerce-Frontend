"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaBox,
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaArrowLeft,
  FaMoneyBillWave,
  FaTimesCircle,
  FaCalendarCheck,
} from "react-icons/fa";
import axiosInstance from "@/lib/axios";
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from "@/components/InvoiceTemplate";
import Swal from 'sweetalert2';
import { useRouter } from "next/navigation";

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    fetchSellerOrders();
  }, []);

  const fetchSellerOrders = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/seller/my-orders");
      if (response.data.success) {
        const sortedOrders = response.data.orders.sort((a, b) => {
          const priority = { pending: 1, shipped: 2, delivered: 3, cancelled: 4 };
          if (priority[a.sellerStatus] !== priority[b.sellerStatus]) {
            return priority[a.sellerStatus] - priority[b.sellerStatus];
          }
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setOrders(sortedOrders);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Sync Failed',
        text: 'Could not fetch your latest orders.',
        confirmButtonColor: '#0f172a'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    // Determine context for SweetAlert
    let actionText = "update";
    let confirmColor = "#0f172a";

    if (newStatus === "shipped") { actionText = "dispatch"; confirmColor = "#0d9488"; }
    else if (newStatus === "delivered") { actionText = "mark as delivered"; confirmColor = "#4f46e5"; }
    else if (newStatus === "cancelled") { actionText = "reject"; confirmColor = "#e11d48"; }

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText} this order?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}!`,
      confirmButtonColor: confirmColor,
      cancelButtonColor: '#64748b',
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.patch(`/seller/order-status/${orderId}`, {
          sellerStatus: newStatus,
        });
        if (response.data.success) {
          Swal.fire({
            title: 'Success!',
            text: `Order status updated to ${newStatus}.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          fetchSellerOrders();
        }
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || "Action failed", 'error');
      }
    }
  };

  const filteredOrders = filter === "all" 
    ? orders.filter(o => o.sellerStatus !== "cancelled") 
    : orders.filter((o) => o.sellerStatus === filter);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <button 
                              onClick={() => router.push("/seller/dashboard")}
                              className="group flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-2 text-sm font-bold uppercase tracking-widest"
                            >
                              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                              Dashboard
                            </button>
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Order Management
            </h1>
            <p className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mt-2">
              {orders.filter((o) => o.sellerStatus === "pending").length} Action Required
            </p>
          </div>

          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
            {["all", "pending", "shipped", "delivered"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === tab
                    ? "bg-slate-900 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ORDERS LIST */}
        <div className="space-y-6">
          {isLoading ? (
            [1, 2, 3].map((i) => <div key={i} className="h-64 bg-white animate-pulse rounded-[3rem]" />)
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className={`bg-white rounded-[3rem] border-2 transition-all overflow-hidden ${
                  order.sellerStatus === "pending" ? "border-teal-500 shadow-xl shadow-teal-500/5" : "border-slate-100 shadow-sm"
                }`}
              >
                {/* TOP BAR */}
                <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <span className="bg-slate-900 text-white px-5 py-2 rounded-full text-[11px] font-black tracking-widest">
                      {order.orderId}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
                      <FaClock className="text-slate-300" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* DISPATCHED AT DATE DISPLAY */}
                    {order.dispatchedAt && (
                      <div className="flex items-center gap-2 text-indigo-600">
                        <FaCalendarCheck size={12} />
                        <div className="flex flex-col leading-none">
                          <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400">Dispatched</span>
                          <span className="text-[10px] font-black italic">{new Date(order.dispatchedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}

                    <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl ${order.payment.status === "captured" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}>
                      {order.payment.status}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border-2 ${order.sellerStatus === "pending" ? "border-teal-500 text-teal-600 bg-white" : "border-slate-200 text-slate-400"}`}>
                      {order.sellerStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* BUYER INFO */}
                  <div className="lg:col-span-4 p-8 border-r border-slate-50 bg-slate-50/30">
                    <div className="flex items-center gap-2 mb-6 text-slate-400">
                      <FaUser size={12} />
                      <h4 className="text-[10px] font-black uppercase tracking-widest">Ship To</h4>
                    </div>
                    <div className="space-y-4">
                      <p className="text-base font-black text-slate-800 tracking-tight">{order.buyer.name}</p>
                      <div className="flex items-center gap-2 text-slate-500 mt-1">
                        <FaPhone size={10} className="text-slate-300" />
                        <p className="text-xs font-bold">{order.buyer.phone}</p>
                      </div>
                      <div className="pt-5 border-t border-slate-100">
                        <div className="flex gap-3">
                          <FaMapMarkerAlt className="text-rose-400 shrink-0 mt-1" size={14} />
                          <div className="text-[12px] leading-relaxed text-slate-600 font-bold">
                            <p>{order.buyer.address.line1}</p>
                            <p>{order.buyer.address.city}, {order.buyer.address.postalCode}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ITEMS & ACTIONS */}
                  <div className="lg:col-span-8 p-8 flex flex-col justify-between">
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-50">
                          <div className="flex items-center gap-5">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-100">
                              <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                            </div>
                            <p className="text-sm font-black text-slate-800 uppercase">{item.name}</p>
                          </div>
                          <p className="font-black text-slate-900 italic">{order.currency} {item.priceLocal.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 pt-8 border-t-2 border-dashed border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4 bg-slate-900 text-white px-6 py-4 rounded-4xl shadow-xl">
                        <div className="bg-teal-500 p-3 rounded-2xl"><FaMoneyBillWave size={18} /></div>
                        <div>
                          <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest">Total</span>
                          <p className="text-2xl font-black italic">{order.currency} {order.totalAmountLocal.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full sm:w-auto">
                        {isClient && (
                          <PDFDownloadLink 
                            document={<InvoicePDF order={order} />} 
                            fileName={`Invoice-${order.orderId}.pdf`}
                            className="flex-1 sm:flex-none bg-white hover:bg-slate-900 hover:text-white text-slate-900 border-2 border-slate-900 px-6 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                          >
                            {({ loading }) => loading ? "..." : <><FaBox size={14}/> Invoice</>}
                          </PDFDownloadLink>
                        )}

                        {/* STATUS BUTTON LOGIC */}
                        {order.sellerStatus === "pending" && (
                          <>
                            <button onClick={() => handleUpdateStatus(order._id, "shipped")} className="flex-1 sm:flex-none bg-teal-600 hover:bg-teal-700 text-white px-8 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg transition-all hover:-translate-y-1">
                              <FaTruck size={14} /> Dispatch
                            </button>
                            <button onClick={() => handleUpdateStatus(order._id, "cancelled")} className="flex-1 sm:flex-none bg-white hover:bg-rose-50 text-rose-500 border-2 border-rose-100 px-8 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all">
                              Reject
                            </button>
                          </>
                        )}

                        {order.sellerStatus === "shipped" && (
                          <button onClick={() => handleUpdateStatus(order._id, "delivered")} className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg transition-all hover:-translate-y-1">
                            <FaCheckCircle size={14} /> Mark Delivered
                          </button>
                        )}

                        {(order.sellerStatus === "delivered" || order.sellerStatus === "cancelled") && (
                          <div className={`flex items-center gap-3 px-8 py-4 rounded-3xl border ${order.sellerStatus === 'cancelled' ? 'text-rose-500 bg-rose-50 border-rose-100' : 'text-teal-600 bg-teal-50 border-teal-100'}`}>
                             {order.sellerStatus === 'cancelled' ? <FaTimesCircle /> : <FaCheckCircle />}
                            <span className="text-[10px] font-black uppercase tracking-widest">{order.sellerStatus}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 text-center bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
              <h3 className="text-slate-400 font-black uppercase tracking-widest text-sm italic">Warehouse Empty</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerOrdersPage;