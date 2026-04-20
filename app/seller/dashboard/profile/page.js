"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaUser,
  FaShieldAlt,
  FaChartLine,
  FaBoxOpen,
  FaStar,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHeadset,
  FaArrowRight,
  FaDollarSign,
  FaArrowLeft,
} from "react-icons/fa";
import axiosInstance from "@/lib/axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const SellerProfilePage = () => {
  const [seller, setSeller] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchSellerDetails();
  }, []);

  const fetchSellerDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/seller/getmydetails");
      if (response.data.success) {
        setSeller(response.data.seller);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Fetch Failed",
        text: "Could not load your profile details.",
        confirmButtonColor: "#0f172a",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawRequest = async () => {
    // Threshold Check: Must be greater than $30
    if (seller.balance < 30) {
      return Swal.fire({
        icon: "warning",
        title: "Minimum Limit Not Met",
        text: "You need a minimum balance of $30 to request a withdrawal.",
        confirmButtonColor: "#0f172a",
      });
    }

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post("/seller/request-withdrawal");
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Request Sent",
          text: "Your withdrawal request has been submitted to the admin.",
          confirmButtonColor: "#14b8a6",
        });
        fetchSellerDetails(); // Refresh balance
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text: error.response?.data?.message || "Something went wrong.",
        confirmButtonColor: "#e11d48",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-4 md:p-10 animate-pulse">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between mb-10 gap-6">
            <div className="flex gap-6 items-center">
              <div className="w-20 h-20 bg-slate-200 rounded-4xl"></div>
              <div className="space-y-2">
                <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
                <div className="h-4 w-32 bg-slate-200 rounded-lg"></div>
              </div>
            </div>
            <div className="h-24 w-64 bg-slate-200 rounded-[2.5rem]"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-white rounded-[2.5rem] border border-slate-100"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!seller) return null;

  const statCards = [
    {
      label: "All-Time Revenue",
      value: `$${seller.revenue?.toLocaleString() || 0}`,
      icon: <FaDollarSign />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Sales",
      value: seller.sales || 0,
      icon: <FaChartLine />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Listings",
      value: seller.activeListings || 0,
      icon: <FaBoxOpen />,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Avg Rating",
      value: `${seller.rating ? seller.rating.toFixed(2) : 0} / 5`,
      icon: <FaStar />,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push("/seller/dashboard")}
          className="group flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-2 text-sm font-bold uppercase tracking-widest"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Dashboard
        </button>
        <header className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-4xl bg-slate-900 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-slate-200">
              {seller.name?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                  {seller.name}
                </h1>
                <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                  <FaCheckCircle /> {seller.status}
                </span>
              </div>
              <p className="text-slate-400 font-bold mt-1 tracking-wide flex items-center gap-2 italic">
                <FaShieldAlt className="text-slate-300" /> Verified Tradexon
                Partner
              </p>
            </div>
          </div>

          <div className="bg-white border-2 border-slate-900 px-8 py-5 rounded-[2.5rem] shadow-xl flex items-center gap-6">
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                Available to Withdraw
              </p>
              <p className="text-3xl font-black text-slate-900 italic">
                ${seller.balance?.toLocaleString() || 0}
              </p>
            </div>
            <button
              onClick={handleWithdrawRequest}
              disabled={isSubmitting}
              className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-teal-600 transition-all shadow-lg disabled:bg-slate-300"
            >
              <FaArrowRight className={isSubmitting ? "animate-ping" : ""} />
            </button>
          </div>
        </header>

        {/* REVENUE CAUTION NOTE */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-2xl flex items-center gap-4"
        >
          <FaExclamationTriangle className="text-amber-500 shrink-0" />
          <p className="text-[11px] font-bold text-amber-800 leading-relaxed uppercase tracking-tight">
            <span className="font-black">Notice:</span> Balance and Revenue
            fields update automatically only after the{" "}
            <span className="underline">Buyer marks the order as Received</span>
            .
          </p>
        </motion.div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm"
            >
              <div
                className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-lg`}
              >
                {stat.icon}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <p className="text-xl font-black text-slate-900 italic">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: PERSONAL INFO */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center gap-2">
                <FaUser className="text-slate-900" /> Identity Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    Email Address
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {seller.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    Phone Number
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {seller.phone}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    Store Created
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {new Date(seller.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* DOCUMENTS */}
              <div className="mt-10 pt-10 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                  Verification Documents
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative aspect-video rounded-2xl overflow-hidden border bg-slate-100">
                    <Image
  src={seller.idFrontLink}
  alt="Front ID"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover opacity-80 hover:opacity-100 transition-opacity"
/>
                  </div>
                  <div className="relative aspect-video rounded-2xl overflow-hidden border bg-slate-100">
                    <Image
  src={seller.idBackLink}
  alt="Back ID"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover opacity-80 hover:opacity-100 transition-opacity"
/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: PAYOUT & ADMIN CONTACT */}
          <div className="lg:col-span-5 space-y-6">
            {/* PAYOUT CARD */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl"></div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-8">
                Payout Status
              </h2>

              <div className="space-y-8">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    Remaining Payout (Owed by Admin)
                  </p>
                  <p className="text-4xl font-black italic tracking-tight">
                    ${seller.remainingPayout?.toLocaleString() || 0}
                  </p>
                </div>

                <button
                  onClick={handleWithdrawRequest}
                  disabled={isSubmitting}
                  className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 py-5 rounded-4xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-3 disabled:bg-slate-700 disabled:text-slate-400"
                >
                  {isSubmitting ? "Processing..." : "Request Withdrawal"}
                </button>

                <div className="grid grid-cols-2 pt-4 gap-4 border-t border-slate-800">
                  <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                      Total Reviews
                    </p>
                    <p className="text-lg font-black">
                      {seller.numReviews || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                      Withdrawal Limit
                    </p>
                    <p className="text-lg font-black text-teal-400 italic font-sans">
                      $30.00+
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ADMIN CONTACT NOTE */}
            <div className="bg-white rounded-[3rem] p-8 border-2 border-dashed border-slate-200 flex flex-col items-center text-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <FaHeadset className="text-slate-400 text-xl" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Need to change details?
              </p>
              <p className="text-xs font-bold text-slate-600 leading-relaxed">
                For security, profile edits and account closures are handled by
                administrators.
              </p>
              <a
                href="mailto:admin@tradexon.com"
                className="mt-4 text-slate-900 font-black text-[10px] uppercase underline tracking-widest hover:text-teal-600 transition-colors"
              >
                Contact Admin Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfilePage;
