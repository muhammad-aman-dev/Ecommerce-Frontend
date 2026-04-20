'use client'

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import {
  FaBoxOpen,
  FaPlus,
  FaShoppingCart,
  FaEdit,
  FaUser,
  FaKey,
  FaChevronRight,
  FaChartLine,
  FaHeadset, 
  FaExclamationTriangle
} from "react-icons/fa";
import { useSelector } from "react-redux";

const sellerModules = [
  {
    id: 1,
    title: "Add Product",
    description: "Add a new product to your store",
    icon: <FaPlus />,
    route: "/seller/dashboard/add-product",
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  {
    id: 2,
    title: "My Products",
    description: "View and manage your products",
    icon: <FaBoxOpen />,
    route: "/seller/dashboard/products",
    color: "text-teal-600",
    bg: "bg-teal-50"
  },
  {
    id: 3,
    title: "Update Product Status",
    description: "Mark products as active or inactive",
    icon: <FaEdit />,
    route: "/seller/dashboard/update-product-status",
    color: "text-cyan-600",
    bg: "bg-cyan-50"
  },
  {
    id: 4,
    title: "Orders",
    description: "Fulfill pending orders and track shipments",
    icon: <FaShoppingCart />,
    route: "/seller/dashboard/orders",
    color: "text-sky-600",
    bg: "bg-sky-50"
  },
  {
    id: 5,
    title: "Business Insights",
    description: "View your total revenue and growth trends.",
    icon: <FaChartLine />,
    route: "/seller/dashboard/insights",
    color: "text-indigo-600",
    bg: "bg-indigo-50"
  },
  {
    id: 6,
    title: "Profile",
    description: "Update your profile information",
    icon: <FaUser />,
    route: "/seller/dashboard/profile",
    color: "text-slate-600",
    bg: "bg-slate-100"
  },
  {
    id: 7,
    title: "Change Password",
    description: "Update your account password",
    icon: <FaKey />,
    route: "/seller/dashboard/change-password",
    color: "text-amber-600",
    bg: "bg-amber-50"
  },
  {
    id: 8,
    title: "Contact Admin",
    description: "Send a message to the marketplace administrator",
    icon: <FaHeadset />,
    route: "/seller/dashboard/contact-admin",
    color: "text-rose-600",
    bg: "bg-rose-50"
  }
]

export default function SellerDashboardPage() {
  const { authSeller } = useSelector((state) => state.auth)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !authSeller) return null;

  // Assuming the role is 'active' (adjust case-sensitivity as per your DB)
  const isActive = authSeller?.status === "Active";

  return (
    <div className="min-h-screen bg-[#f0f9f9] p-6 lg:p-10">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
          Seller<span className="text-teal-600">Portal</span>
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          {isActive 
            ? "Everything you need to manage your shop and boost your sales." 
            : "Your account is restricted, but you must still fulfill pending orders."}
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {!isActive ? (
          /* --- SUSPENDED VIEW --- */
          <div className="space-y-8">
            {/* Warning Card */}
            <div className="bg-white border-2 border-rose-100 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-sm">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center text-4xl shrink-0 animate-pulse">
                <FaExclamationTriangle />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Account Suspended</h2>
                <p className="text-slate-500 font-medium mt-2 leading-relaxed">
                  You cannot add new products or edit your inventory. However, you are <strong>still required to fulfill all active orders</strong>. 
                  Use the tabs below to manage your pending shipments or appeal the suspension.
                </p>
              </div>
            </div>

            {/* Show only Orders (4) and Contact Admin (8) */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sellerModules
                .filter(m => m.id === 4 || m.id === 8)
                .map((mod) => (
                  <ModuleCard key={mod.id} mod={mod} router={router} />
                ))
              }
            </div>
          </div>
        ) : (
          /* --- ACTIVE VIEW --- */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sellerModules.map((mod) => (
              <ModuleCard key={mod.id} mod={mod} router={router} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ModuleCard({ mod, router }) {
  return (
    <div
      onClick={() => router.push(mod.route)}
      className="group bg-white rounded-4xl p-6 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-transparent hover:border-teal-100 flex flex-col justify-between"
    >
      <div>
        <div className={`w-14 h-14 rounded-2xl ${mod.bg} ${mod.color} flex items-center justify-center text-2xl mb-6 group-hover:rotate-12 transition-transform`}>
          {mod.icon}
        </div>

        <h2 className="text-xl font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
          {mod.title}
        </h2>
        <p className="text-slate-500 text-sm mt-2 leading-relaxed">
          {mod.description}
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-teal-500 transition-colors">
          Manage
        </span>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-teal-600 group-hover:text-white transition-all">
          <FaChevronRight size={12} />
        </div>
      </div>
    </div>
  )
}