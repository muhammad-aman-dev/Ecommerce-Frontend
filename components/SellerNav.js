'use client'

import { useSelector, useDispatch } from "react-redux"
import { setAuthSeller } from "@/store/slices/authSlice"
import axiosInstance from "@/lib/axios"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa"

const SellerNav = () => {
    const dispatch = useDispatch()
    const pathname = usePathname();
    const router = useRouter()

    const { authSeller } = useSelector((state) => state.auth)
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = async () => {
        try {
            const res = await axiosInstance.post("/logout/seller")
            if (res.status === 200) {
                dispatch(setAuthSeller(null))
                router.push("/seller/login")
            }
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    // Hide nav on specific root seller pages
    if (pathname.endsWith("seller/") || pathname.endsWith("seller")) return null

    return (
        <nav className="sticky top-0 z-50 w-full transition-all duration-300">
            {/* Background with Blur Effect */}
            <div className="absolute inset-0 bg-teal-700/90 backdrop-blur-md border-b border-white/10 shadow-lg" />

            <div className="relative max-w-360 mx-auto px-6 py-3 flex items-center justify-between">
                
                {/* Brand Logo / Title */}
                <Link href="/seller/dashboard" className="flex items-center gap-2 group">
                    <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                        <FaUserCircle className="text-teal-200 text-xl" />
                    </div>
                    <h3 className="font-black text-xl tracking-tight text-white italic">
                        Seller<span className="text-teal-200">Panel</span>
                    </h3>
                </Link>

                {/* Desktop Menu */}
                {authSeller && (
                    <div className="hidden md:flex items-center gap-8">
                        {/* Profile Link */}
                        <Link
                            href="/seller/dashboard/profile"
                            className="flex items-center gap-3 group pl-2 border-l border-white/10"
                        >
                            <div className="text-right">
                                <p className="text-[10px] text-teal-200 font-bold uppercase tracking-widest leading-none">Vendor</p>
                                <p className="text-sm font-bold text-white group-hover:text-teal-100 transition-colors">
                                    {authSeller.name}
                                </p>
                            </div>
                            <div className="relative">
                                <Image
                                    src={authSeller.avatar || "/seller-default.png"}
                                    alt="Profile"
                                    width={38}
                                    height={38}
                                    className="rounded-full border-2 border-white/20 group-hover:border-teal-300 transition-all shadow-md"
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-teal-700 rounded-full"></div>
                            </div>
                        </Link>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="bg-black/40 hover:bg-black/60 text-white px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/10 transition-all active:scale-95"
                        >
                            Logout
                        </button>
                    </div>
                )}

                {/* Mobile Menu Button */}
                {authSeller && (
                    <button
                        className="md:hidden p-2 rounded-xl bg-white/10 text-xl text-white focus:outline-none"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                )}
            </div>

            {/* Mobile Dropdown Menu */}
            <div className={`md:hidden absolute w-full bg-teal-800 border-b border-white/10 transition-all duration-300 ease-in-out overflow-hidden ${
                menuOpen && authSeller ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
            }`}>
                <div className="p-6 flex flex-col gap-5">
                    <Link
                        href="/seller/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl"
                    >
                        <Image
                            src={authSeller?.avatar || "/seller-default.png"}
                            alt="Profile"
                            width={45}
                            height={45}
                            className="rounded-full border-2 border-teal-400"
                        />
                        <div>
                            <p className="text-white font-bold">{authSeller?.name}</p>
                            <p className="text-xs text-teal-300 italic">Manage Account</p>
                        </div>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-black py-3 rounded-xl font-bold text-white active:scale-[0.98] transition-all"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default SellerNav