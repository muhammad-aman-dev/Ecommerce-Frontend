"use client"
import { useState } from "react"
import axiosInstance from "@/lib/axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/navigation"
import { FaEnvelope, FaLock, FaKey, FaArrowLeft, FaStore } from "react-icons/fa"

export default function SellerLogin() {
  const router = useRouter();
  const [step, setStep] = useState(1) // 1=login, 2=forgot email, 3=otp
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [isChangingPass, setisChangingPass] = useState(false)
  const [isSendingOTP, setisSendingOTP] = useState(false)
  const [newPassword, setNewPassword] = useState("")

  // ---------------- LOGIC UNTOUCHED ----------------
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await axiosInstance.post("/auth/seller-login", { email, password }, { withCredentials: true });
      toast.success(`Login successful!`);
      setTimeout(() => router.push(`/seller/dashboard`), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    }
  };

  const handleSendOtp = async () => {
    if (!email) return toast.error("Please enter your email")
    setisSendingOTP(true)
    try {
      await axiosInstance.post("/auth/send-otp", { email }, { withCredentials: true })
      toast.success("OTP sent to your email")
      setStep(3)
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP")
    } finally {
      setisSendingOTP(false)
    }
  }

  const handleResetPassword = async () => {
    if (!otp || !newPassword) return toast.error("Fill all fields")
    setisChangingPass(true)
    try {
      await axiosInstance.post("/seller/modifyPassword", { email, otp, password: newPassword }, { withCredentials: true })
      toast.success("Password reset successfully!")
      setTimeout(() => setStep(1), 1000)
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed")
    } finally {
      setisChangingPass(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f9f9] p-4">
      <ToastContainer position="top-right" />

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-teal-900/10 p-10 border border-teal-50">
        
        {/* Branding Icon */}
        <div className="flex justify-center mb-6">
            <div className="p-4 bg-teal-50 rounded-2xl text-teal-600">
                <FaStore size={32} />
            </div>
        </div>

        <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                {step === 1 ? "Seller Login" : step === 2 ? "Recovery" : "New Password"}
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">
                {step === 1 ? "Manage your shop and orders" : "Reset your secure access"}
            </p>
        </div>

        {/* STEP 1: LOGIN */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-400">
            <div className="relative group">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
              <input
                className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:outline-none focus:border-teal-500/20 focus:bg-white transition-all text-slate-900"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
              <input
                type="password"
                className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:outline-none focus:border-teal-500/20 focus:bg-white transition-all text-slate-900"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-100 transition-all active:scale-[0.98]"
            >
              Sign In
            </button>

            <div className="text-right">
                <button
                className="text-xs font-bold text-teal-600 hover:text-teal-700 uppercase tracking-widest transition-colors"
                onClick={() => setStep(2)}
                >
                Forgot Password?
                </button>
            </div>
          </div>
        )}

        {/* STEP 2: FORGOT PASSWORD EMAIL */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-400">
            <div className="relative group">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:outline-none focus:border-teal-500/20 focus:bg-white transition-all text-slate-900"
                placeholder="Enter registered email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <button
              onClick={handleSendOtp}
              disabled={isSendingOTP}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-100 transition-all disabled:bg-slate-300"
            >
              {isSendingOTP ? 'Sending OTP...' : 'Send Verification Code'}
            </button>

            <button
              className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-teal-600 uppercase tracking-widest transition-colors"
              onClick={() => setStep(1)}
            >
              <FaArrowLeft size={10} /> Back to Login
            </button>
          </div>
        )}

        {/* STEP 3: OTP + RESET */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-400">
            <div className="relative">
              <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                className="w-full bg-teal-50 border-2 border-teal-100 p-4 pl-12 rounded-2xl focus:outline-none focus:border-teal-500 text-center text-xl font-bold tracking-[0.5em] text-teal-700"
                placeholder="000000"
                value={otp}
                onChange={e => setOtp(e.target.value)}
              />
            </div>

            <div className="relative group">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
              <input
                type="password"
                className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:outline-none focus:border-teal-500/20 focus:bg-white transition-all text-slate-900"
                placeholder="New Secure Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleResetPassword}
              disabled={isChangingPass}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-100 transition-all disabled:bg-slate-300"
            >
              {isChangingPass ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}

        {/* Signup Link */}
        {step === 1 && (
          <div className="mt-10 pt-6 border-t border-slate-50 text-center">
            <p className="text-slate-500 text-sm font-medium">
                New to the platform?{" "}
                <a href="/seller/signup" className="text-teal-600 font-bold hover:underline ml-1 transition-all">
                Create Seller Account
                </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}