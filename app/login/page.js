"use client"
import { useState } from "react"
import axiosInstance from "@/lib/axios"
import Image from "next/image"
import Link from "next/link" // Added Link for better routing
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaEnvelope, FaLock, FaKey, FaArrowLeft, FaChevronRight } from "react-icons/fa"

export default function Login() {
  const [step, setStep] = useState(1) // 1=login,2=forgot email,3=otp
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [isChangingPass, setisChangingPass] = useState(false)
  const [isSendingOTP, setisSendingOTP] = useState(false)
  const [newPassword, setNewPassword] = useState("")

  // Logic remains identical
  const handleLogin = async () => {
    if (!email || !password) return toast.error("Please fill all fields")
    try {
      await axiosInstance.post("/auth/login", { email, password }, { withCredentials: true })
      toast.success("Login successful!")
      setTimeout(() => window.location.href = "/", 1500)
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials")
    }
  }

  const handleSendOtp = async () => {
    if (!email) return toast.error("Please enter your email")
    setisSendingOTP(true);
    try {
      await axiosInstance.post("/auth/send-otp", { email }, { withCredentials: true })
      toast.success("OTP sent to your email"); setStep(3)
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP")
    } finally { setisSendingOTP(false) }
  }

  const handleResetPassword = async () => {
    if (!otp || !newPassword) return toast.error("Please enter OTP and new password")
    setisChangingPass(true);
    try {
      await axiosInstance.post("/auth/verify-reset-otp", { email, otp, password: newPassword }, { withCredentials: true })
      toast.success("Password reset successfully!")
      setTimeout(() => window.location.href = "/login", 1000)
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed")
    } finally { setisChangingPass(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <ToastContainer position="top-right" theme="colored" />

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(13,148,136,0.05)] border border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="pt-10 pb-6 px-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 mb-4">
            {step === 1 ? <FaLock size={24} /> : step === 2 ? <FaEnvelope size={24} /> : <FaKey size={24} />}
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {step === 1 ? "Welcome Back" : step === 2 ? "Forgot Access?" : "New Security"}
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            {step === 1 ? "Enter your details to access your account" : "Don't worry, we'll help you get back in"}
          </p>
        </div>

        <div className="p-10 pt-0 space-y-5">
          {/* STEP 1: Login */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="group relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                <input
                  className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:outline-none focus:border-teal-500/20 focus:bg-white transition-all text-slate-700"
                  placeholder="Email Address"
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="group relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                <input
                  type="password"
                  className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:outline-none focus:border-teal-500/20 focus:bg-white transition-all text-slate-700"
                  placeholder="Password"
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-teal-600/10 flex items-center justify-center gap-2 group transition-all active:scale-[0.98]"
              >
                Sign In <FaChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => setStep(2)}
                className="w-full text-center text-xs font-bold text-teal-600 uppercase tracking-widest hover:text-teal-700 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* STEP 2: Forgot Password */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="group relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                <input
                  className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:outline-none focus:border-teal-500/20 focus:bg-white transition-all"
                  placeholder="Enter registered email"
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <button
                onClick={handleSendOtp}
                disabled={isSendingOTP}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50"
              >
                {isSendingOTP ? "Processing..." : "Send Reset Code"}
              </button>

              <button 
                onClick={() => setStep(1)}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest"
              >
                <FaArrowLeft size={12} /> Back to Sign In
              </button>
            </div>
          )}

          {/* STEP 3: Reset Password */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  className="w-full bg-teal-50 border-2 border-teal-100 p-4 rounded-2xl text-center text-2xl font-black tracking-[0.5em] text-teal-700 focus:outline-none focus:border-teal-400"
                  placeholder="000000"
                  maxLength={6}
                  onChange={e => setOtp(e.target.value)}
                />
                <p className="text-[10px] text-center mt-2 text-teal-600 font-bold uppercase tracking-wider">Verification Code</p>
              </div>

              <div className="group relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                <input
                  type="password"
                  className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:outline-none focus:border-teal-500/20 focus:bg-white transition-all"
                  placeholder="New Secure Password"
                  onChange={e => setNewPassword(e.target.value)}
                />
              </div>

              <button
                onClick={handleResetPassword}
                disabled={isChangingPass}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-600/10 transition-all"
              >
                {isChangingPass ? "Verifying..." : "Update Password"}
              </button>
            </div>
          )}

          {/* Social Login Separator */}
          {step === 1 && (
            <div className="pt-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-slate-100 flex-1"></div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">OR</span>
                <div className="h-px bg-slate-100 flex-1"></div>
              </div>

              <a href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`} className="block group">
                <div className="flex items-center justify-center gap-3 bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 group-hover:bg-white group-hover:border-slate-100 group-hover:shadow-sm transition-all">
                  <Image src="/google.svg" width={20} height={20} alt="Google" />
                  <span className="text-slate-600 font-bold text-sm">Continue with Google</span>
                </div>
              </a>

              <p className="text-center text-slate-500 text-sm mt-8">
                New here?{" "}
                <Link href="/signup" className="text-teal-600 font-bold hover:underline underline-offset-4">Create Account</Link>
              </p>
            </div>
          )}
        </div>

        {/* ADDED: PREMIUM LEGAL FOOTER */}
        <div className="bg-slate-50 border-t border-slate-100 p-6 flex justify-center items-center gap-6">
          <Link 
            href="/terms-and-conditions" 
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-teal-600 transition-colors"
          >
            Terms of Service
          </Link>
          <div className="w-1 h-1 rounded-full bg-slate-200"></div>
          <Link 
            href="/privacy-policy" 
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-teal-600 transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}