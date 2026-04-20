"use client"
import { useState } from "react"
import axiosInstance from "@/lib/axios"
import Image from "next/image"
import Link from "next/link" // Added Link for routing
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaUser, FaEnvelope, FaLock, FaShieldAlt, FaArrowLeft, FaChevronRight } from "react-icons/fa"

export default function SignUp() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // --- LOGIC (Identical to provided code) ---
  const handleSendOtp = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill all fields")
      return
    }
    if (password.length < 8 || password.length > 16) {
      toast.error("Password must be between 8 to 16 characters...")
      return
    }

    setIsLoading(true)
    try {
      await axiosInstance.post("/auth/send-otp", { email }, { withCredentials: true })
      toast.success("OTP sent to your email")
      setStep(2)
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter OTP")
      return
    }

    setIsLoading(true)
    try {
      await axiosInstance.post(
        "/auth/verify-otp",
        { name, email, password, otp },
        { withCredentials: true }
      )
      toast.success("Account created successfully!")
      setTimeout(() => { window.location.href = "/" }, 1500)
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 font-sans">
      <ToastContainer position="top-right" theme="colored" />

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(13,148,136,0.05)] border border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="pt-10 pb-6 px-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 mb-4 transition-transform hover:scale-110 duration-300">
            {step === 1 ? <FaUser size={24} /> : <FaShieldAlt size={24} />}
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {step === 1 ? "Join Us" : "Verify Email"}
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            {step === 1 ? "Start your journey with a few clicks" : `We sent a code to ${email}`}
          </p>
        </div>

        <div className="p-10 pt-0 space-y-5">
          {/* STEP 1: Basic Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="group relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                <input
                  className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:outline-none focus:border-teal-500/20 focus:bg-white transition-all text-slate-700"
                  placeholder="Full Name"
                  onChange={e => setName(e.target.value)}
                  value={name}
                />
              </div>

              <div className="group relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                <input
                  className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:outline-none focus:border-teal-500/20 focus:bg-white transition-all text-slate-700"
                  placeholder="Email Address"
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                />
              </div>

              <div className="group relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                <input
                  type="password"
                  className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:outline-none focus:border-teal-500/20 focus:bg-white transition-all text-slate-700"
                  placeholder="Password (8-16 chars)"
                  onChange={e => setPassword(e.target.value)}
                  value={password}
                />
              </div>

              <button
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-teal-600/10 flex items-center justify-center gap-2 group transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Create Account"} 
                {!isLoading && <FaChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="relative">
                <input
                  className="w-full bg-teal-50 border-2 border-teal-100 p-4 rounded-2xl text-center text-2xl font-black tracking-[0.5em] text-teal-700 focus:outline-none focus:border-teal-400"
                  placeholder="000000"
                  onChange={e => setOtp(e.target.value)}
                />
                <p className="text-[10px] text-center mt-3 text-teal-600 font-bold uppercase tracking-widest italic">Secure Verification</p>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-600/10 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? "Verifying..." : "Confirm & Sign Up"}
              </button>

              <button 
                onClick={() => setStep(1)}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-teal-600 uppercase tracking-widest transition-colors"
              >
                <FaArrowLeft size={12} /> Edit Account Details
              </button>
            </div>
          )}

          {/* Footer Branding & Social */}
          {step === 1 && (
            <>
              <div className="flex items-center gap-4 py-4">
                <div className="h-px bg-slate-100 flex-1"></div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">OR</span>
                <div className="h-px bg-slate-100 flex-1"></div>
              </div>

              <a href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`} className="block group">
                <div className="flex items-center justify-center gap-3 bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 group-hover:bg-white group-hover:border-slate-100 group-hover:shadow-sm transition-all">
                  <Image src="/google.svg" width={20} height={20} alt="Google" />
                  <span className="text-slate-600 font-bold text-sm">Join with Google</span>
                </div>
              </a>

              <p className="text-center text-slate-500 text-sm mt-8">
                Already a member?{" "}
                <Link href="/login" className="text-teal-600 font-bold hover:underline underline-offset-4 decoration-2">Sign In</Link>
              </p>
            </>
          )}
        </div>

        {/* --- ADDED: LEGAL FOOTER --- */}
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