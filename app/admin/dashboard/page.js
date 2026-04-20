'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  FaUsers,
  FaUserPlus,
  FaUserShield,
  FaBoxOpen,
  FaUser,
  FaShoppingCart,
  FaChartLine,
  FaTags,
  FaFlag,
  FaMoneyBillWave,
  FaImage,
  FaKey,
  FaChevronRight,
  FaGlobeAmericas,
  FaStar
} from "react-icons/fa";
import axiosInstance from "@/lib/axios";
import Swal from "sweetalert2";

const modules = [
  // --- SECTION 1: USER MANAGEMENT ---
  {
    id: 1,
    title: "Seller Requests",
    description: "Approve or reject seller verification requests",
    icon: <FaUserPlus />,
    route: "/admin/dashboard/seller-requests",
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    id: 2,
    title: "Sellers",
    description: "Manage all registered sellers",
    icon: <FaUsers />,
    route: "/admin/dashboard/sellers",
    color: "text-indigo-600",
    bg: "bg-indigo-50"
  },
  {
    id: 3,
    title: "Merchant Control",
    description: "Manage and toggle seller status",
    icon: <FaUserShield />, 
    route: "/admin/dashboard/manage-seller", 
    color: "text-rose-600",
    bg: "bg-rose-100"
  },
  {
    id: 4,
    title: "Add or Remove Admins",
    description: "Manage platform Admins",
    icon: <FaUser />,
    route: "/admin/dashboard/manage-admins",
    color: "text-violet-600",
    bg: "bg-violet-50"
  },

  // --- SECTION 2: INVENTORY & OPERATIONS ---
  {
    id: 5,
    title: "Products",
    description: "View and manage all marketplace products",
    icon: <FaBoxOpen />,
    route: "/admin/dashboard/products",
    color: "text-amber-600",
    bg: "bg-amber-50"
  },
  {
    id: 6,
    title: "Categories",
    description: "Manage product categories and hierarchy",
    icon: <FaTags />,
    route: "/admin/dashboard/categories",
    color: "text-rose-600",
    bg: "bg-rose-50"
  },
  {
    id: 7,
    title: "Orders",
    description: "Track all marketplace orders and shipping",
    icon: <FaShoppingCart />,
    route: "/admin/dashboard/orders",
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  {
    id: 8,
    title: "Payments",
    description: "Manage seller payouts and transactions",
    icon: <FaMoneyBillWave />,
    route: "/admin/dashboard/payments",
    color: "text-green-600",
    bg: "bg-green-50"
  },

  // --- SECTION 3: MARKETING & GROWTH ---
  {
    id: 9,
    title: "Featured Products",
    description: "Select top products for homepage spotlight",
    icon: <FaStar />, 
    route: "/admin/dashboard/featured",
    color: "text-yellow-600",
    bg: "bg-yellow-50"
  },
  {
    id: 10,
    title: "Banner Management",
    description: "Add and manage homepage sliders",
    icon: <FaImage />,
    route: "/admin/dashboard/banners",
    color: "text-fuchsia-600",
    bg: "bg-fuchsia-50"
  },
  {
    id: 11,
    title: "Analytics",
    description: "View sales trends and platform metrics",
    icon: <FaChartLine />,
    route: "/admin/dashboard/analytics",
    color: "text-cyan-600",
    bg: "bg-cyan-50"
  },

  // --- SECTION 4: SYSTEM & SUPPORT ---
  {
    id: 12,
    title: "Contact Messages",
    description: "Review customer queries and complaints",
    icon: <FaFlag />,
    route: "/admin/dashboard/contact-messages",
    color: "text-red-600",
    bg: "bg-red-50"
  },
  {
    id: 13,
    title: "Exchange Rates",
    description: "Global USD to Local currency settings",
    icon: <FaGlobeAmericas />,
    route: "/admin/dashboard/exchange-rates",
    color: "text-teal-600",
    bg: "bg-teal-50"
  },
  {
    id: 14,
    title: "Account Security",
    description: "Update admin password and credentials",
    icon: <FaKey />,
    route: "/admin/dashboard/change-password",
    color: "text-slate-900",
    bg: "bg-slate-200"
  },
  {
    id: 99, // Special ID for the manual trigger
    title: "Force Payout Check",
    description: "Manually execute the maturation check for all orders now",
    icon: <FaMoneyBillWave />,
    route: "#", // No route because it's a function call
    color: "text-amber-600",
    bg: "bg-amber-100"
  }
];

export default function DashboardPage() {
  const { authAdmin } = useSelector((state) => state.auth);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleManualPayout = async () => {
  if (isProcessing) return;

  // 1. Initial Confirmation Dialog
  const result = await Swal.fire({
    title: 'Force Manual Payout?',
    text: "This will check all orders and release funds for those that have met the maturation period.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4f46e5', // Indigo-600 to match your theme
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Yes, execute now',
    customClass: {
      popup: 'rounded-3xl',
      confirmButton: 'rounded-xl px-6 py-3 font-bold',
      cancelButton: 'rounded-xl px-6 py-3 font-bold'
    }
  });

  if (!result.isConfirmed) return;

  setIsProcessing(true);

  // 2. The API Request
  try {
    const response = await axiosInstance.post("/admin/manual-payout-trigger");

    // 3. Success Alert
    await Swal.fire({
      title: 'Success!',
      text: `${response.data.message || 'Payout cycle completed successfully.'}`,
      icon: 'success',
      confirmButtonColor: '#10b981', 
      customClass: {
        popup: 'rounded-3xl'
      }
    });

  } catch (error) {
    // 4. Error Alert
    Swal.fire({
      title: 'Execution Failed',
      text: error.response?.data?.message || "Something went wrong while processing payouts.",
      icon: 'error',
      confirmButtonColor: '#ef4444', // Red-500
      customClass: {
        popup: 'rounded-3xl'
      }
    });
  } finally {
    setIsProcessing(false);
  }
};

  if (!mounted || !authAdmin) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="animate-pulse text-slate-400 font-medium">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Admin<span className="text-indigo-600">Dashboard</span>
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Welcome back, {authAdmin?.name || 'Admin'}. Here is what's happening today.
        </p>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {modules.map((mod) => {
          // Robust Role Check: Hide "Manage Admins" (ID 4) for non-super admins
          // Adjust logic if your super-admin role has a different name (e.g., "superadmin")
          if (mod.id === 4 && authAdmin?.role === "admin") {
            return null;
          }

          return (
            <div
              key={mod.id}
              onClick={() => {
                if (mod.id === 99) {
                  handleManualPayout();
                } else {
                  router.push(mod.route);
                }
              }}
              className="group relative bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Icon Header */}
                <div className={`w-14 h-14 rounded-2xl ${mod.bg} ${mod.color} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {mod.icon}
                </div>

                {/* Text Content */}
                <h2 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {mod.title}
                </h2>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  {isProcessing && mod.id === 99 ? "Processing payouts..." : mod.description}
                </p>
              </div>

              {/* Action Area */}
              <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-500 transition-colors">
                  Manage
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <FaChevronRight size={12} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}