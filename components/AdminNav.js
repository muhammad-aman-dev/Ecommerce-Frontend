'use client'

import { useSelector, useDispatch } from "react-redux"
import { setAuthAdmin } from "@/store/slices/authSlice"
import axiosInstance from "@/lib/axios"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaBars, FaTimes, FaShieldAlt } from "react-icons/fa"

const AdminNav = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const { authAdmin } = useSelector((state) => state.auth)
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = async () => {
        try {
            const res = await axiosInstance.post("/logout/admin")
            if (res.status === 200) {
                dispatch(setAuthAdmin(null))
                router.push("/admin/login")
            }
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    return (
        <nav className="sticky top-0 z-50 w-full transition-all duration-300">
            {/* Dark Professional Backdrop */}
            <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-700 shadow-xl" />

            <div className="relative max-w-360 mx-auto px-6 py-3 flex items-center justify-between">
                
                {/* Logo Section */}
                <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                    <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/30 transition-all">
                        <FaShieldAlt className="text-indigo-400 text-xl" />
                    </div>
                    <h3 className="font-black text-xl tracking-tighter text-white uppercase">
                        Admin<span className="text-indigo-400">Core</span>
                    </h3>
                </Link>

                {/* Desktop Menu */}
                {authAdmin && (
                    <div className="hidden md:flex items-center gap-8">
                        {/* Admin Identity */}
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-3 group px-3 py-1.5 rounded-2xl hover:bg-white/5 transition-all"
                        >
                            <div className="text-right">
                                <p className={`text-[10px] font-black uppercase tracking-[0.15em] leading-none mb-1 ${
                                    authAdmin.role === 'super admin' ? 'text-amber-400' : 'text-indigo-400'
                                }`}>
                                    {authAdmin.role}
                                </p>
                                <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                                    {authAdmin.email}
                                </p>
                            </div>
                            <div className="relative">
                                <Image
                                    src={authAdmin.avatar || "/admin-default.png"}
                                    alt="Profile"
                                    width={36}
                                    height={36}
                                    className="rounded-full border-2 border-slate-700 group-hover:border-indigo-500 transition-all shadow-lg"
                                />
                                {/* Pulsing "Active" Indicator */}
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                                </span>
                            </div>
                        </Link>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="bg-red-500/10 hover:bg-red-50 text-red-500 hover:text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-red-500/20 transition-all duration-200 active:scale-95"
                        >
                            Logout
                        </button>
                    </div>
                )}

                {/* Mobile Menu Toggle */}
                {authAdmin && (
                    <button
                        className="md:hidden p-2 text-2xl text-slate-300 focus:outline-none hover:text-white transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                )}
            </div>

            {/* Mobile Dropdown */}
            <div className={`md:hidden absolute w-full bg-slate-900 border-b border-slate-700 transition-all duration-300 ease-in-out overflow-hidden ${
                menuOpen && authAdmin ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
            }`}>
                <div className="p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                        <Image
                            src={authAdmin?.avatar || "/admin-default.png"}
                            alt="Profile"
                            width={44}
                            height={44}
                            className="rounded-full border-2 border-indigo-500"
                        />
                        <div className="overflow-hidden">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Administrator</p>
                            <p className="text-white font-medium truncate">{authAdmin?.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold text-white transition-colors shadow-lg shadow-red-900/20"
                    >
                        Secure Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default AdminNav