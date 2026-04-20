"use client"
import { useState } from "react"
import axiosInstance from "@/lib/axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaShieldAlt, FaLock, FaEnvelope } from "react-icons/fa"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // ---------------- LOGIC UNTOUCHED ----------------
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill all fields")
      return
    }

    setIsLoggingIn(true)

    try {
      await axiosInstance.post(
        "/auth/admin-login", 
        { email, password },
        { withCredentials: true }
      )
      toast.success("Login successful!")
      setTimeout(() => window.location.href = "/admin/dashboard", 1500)
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials")
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-4 relative">
      
      {/* Background Accent - Adjusted to be lighter so text is visible */}
      <div className="absolute top-0 left-0 w-full h-72 bg-slate-100 border-b border-slate-200" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0% 100%)' }}></div>

      <ToastContainer position="top-right" />

      <div className="w-full max-w-md relative">
        
        {/* Header Section - Text changed to slate-900 for high visibility */}
        <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-white rounded-2xl shadow-lg mb-4 text-indigo-600 border border-slate-100">
                <FaShieldAlt size={32} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                ADMIN<span className="text-indigo-600">CORE</span>
            </h1>
            <p className="text-slate-500 font-bold text-sm mt-2 uppercase tracking-widest">Secure Access Point</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-300/50 p-10 space-y-8 border border-white">
          
          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Admin Email</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-indigo-500/30 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                  placeholder="admin@system.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Security Key</label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="password"
                  className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-indigo-500/30 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className={`w-full py-4 rounded-2xl font-black text-white transition-all shadow-xl active:scale-[0.97] mt-4 tracking-wide
                ${isLoggingIn 
                  ? "bg-slate-300 cursor-not-allowed shadow-none" 
                  : "bg-slate-900 hover:bg-indigo-600 shadow-indigo-200"
                }`}
            >
              {isLoggingIn ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </span>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </div>

          <div className="pt-4 text-center">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">
              Authorized Access Only
            </p>
            <p className="text-[12px] text-indigo-600 mt-2 font-black cursor-pointer hover:text-indigo-800 transition-colors">
                Systems Recovery Support
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}