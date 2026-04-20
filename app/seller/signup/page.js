"use client"
import { useState } from "react"
import axiosInstance from "@/lib/axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import imageCompression from "browser-image-compression"
import { FaStore, FaEnvelope, FaLock, FaPhone, FaKey, FaIdCard, FaCloudUploadAlt, FaArrowRight } from "react-icons/fa"
import Link from "next/link"

export default function SellerSignUp() {
  const [step, setStep] = useState(1)
  const [loadingOtp, setLoadingOtp] = useState(false)
  const [loadingVerify, setLoadingVerify] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [phone, setPhone] = useState("")
  const [idFront, setIdFront] = useState(null)
  const [idBack, setIdBack] = useState(null)
  const [previewFront, setPreviewFront] = useState(null)
  const [previewBack, setPreviewBack] = useState(null)

  // ---------------- LOGIC UNTOUCHED ----------------
  const compressImage = async (file) => {
    const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, initialQuality: 0.9, useWebWorker: true }
    try {
      return await imageCompression(file, options)
    } catch (error) {
      console.error("Compression error:", error)
      return file
    }
  }

  const handleSendOtp = async () => {
    if (!name || !email || !password || !phone) {
      toast.error("Please fill all fields")
      return
    }
    if (password.length < 8 || password.length > 16) {
      toast.error("Password must be 8-16 characters")
      return
    }
    try {
      setLoadingOtp(true)
      await axiosInstance.post("/auth/send-otp", { email })
      toast.success("OTP sent to your email")
      setStep(2)
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP")
    } finally {
      setLoadingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Please enter OTP")
    if (!idFront || !idBack) return toast.error("Please upload ID photos")

    try {
      setLoadingVerify(true)
      const formData = new FormData()
      formData.append("name", name); formData.append("email", email);
      formData.append("password", password); formData.append("phone", phone);
      formData.append("otp", otp); formData.append("idFront", idFront);
      formData.append("idBack", idBack)

      await axiosInstance.post("/seller/signup-request", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      toast.success("Request submitted! Pending admin approval.")
      setTimeout(() => window.location.reload(), 2500)
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed")
    } finally {
      setLoadingVerify(false)
    }
  }

  const handleIdFrontChange = async (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith("image/")) return toast.error("Images only")
    const compressed = await compressImage(file)
    setIdFront(compressed)
    setPreviewFront(URL.createObjectURL(compressed))
  }

  const handleIdBackChange = async (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith("image/")) return toast.error("Images only")
    const compressed = await compressImage(file)
    setIdBack(compressed)
    setPreviewBack(URL.createObjectURL(compressed))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f9f9] px-4 py-12">
      <ToastContainer position="top-right" />

      <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl shadow-teal-900/10 p-8 md:p-12 border border-teal-50">
        
        {/* Progress Stepper */}
        <div className="flex items-center justify-center mb-10 gap-4">
          <div className={`h-2 w-16 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-teal-500' : 'bg-gray-200'}`} />
          <div className={`h-2 w-16 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-teal-500' : 'bg-gray-200'}`} />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Become a Seller</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Join our marketplace and start growing today</p>
        </div>

        {/* STEP 1: ACCOUNT INFO */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative group">
              <FaStore className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
              <input
                className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:outline-none focus:border-teal-500/20 focus:bg-white transition-all"
                placeholder="Store Name"
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="relative group">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
              <input
                className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:outline-none focus:border-teal-500/20 focus:bg-white transition-all"
                placeholder="Email Address"
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
              <input
                type="password"
                className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:outline-none focus:border-teal-500/20 focus:bg-white transition-all"
                placeholder="Password (8-16 characters)"
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="relative group">
              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
              <input
                className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:outline-none focus:border-teal-500/20 focus:bg-white transition-all"
                placeholder="Phone Number"
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            <button
              onClick={handleSendOtp}
              disabled={loadingOtp}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-teal-100 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loadingOtp ? "Sending..." : <>Continue <FaArrowRight size={14} /></>}
            </button>
          </div>
        )}

        {/* STEP 2: VERIFICATION */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="relative group">
              <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                className="w-full bg-teal-50 border-2 border-teal-100 p-4 pl-12 rounded-2xl focus:outline-none focus:border-teal-500 text-center text-xl font-bold tracking-widest"
                placeholder="000000"
                onChange={e => setOtp(e.target.value)}
              />
              <p className="text-[10px] text-center mt-2 text-slate-400 font-bold uppercase tracking-wider">Check your email for OTP</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ID Front */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">ID Front</label>
                <div className="relative h-40 group">
                  <input type="file" accept="image/*" onChange={handleIdFrontChange} className="hidden" id="front-id" />
                  <label htmlFor="front-id" className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50 hover:bg-teal-50 hover:border-teal-200 transition-all overflow-hidden">
                    {previewFront ? (
                      <img src={previewFront} alt="Front" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <FaCloudUploadAlt className="text-slate-300 group-hover:text-teal-500 text-2xl" />
                        <span className="text-[10px] font-bold text-slate-400 mt-2">Upload Front</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* ID Back */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">ID Back</label>
                <div className="relative h-40 group">
                  <input type="file" accept="image/*" onChange={handleIdBackChange} className="hidden" id="back-id" />
                  <label htmlFor="back-id" className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50 hover:bg-teal-50 hover:border-teal-200 transition-all overflow-hidden">
                    {previewBack ? (
                      <img src={previewBack} alt="Back" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <FaCloudUploadAlt className="text-slate-300 group-hover:text-teal-500 text-2xl" />
                        <span className="text-[10px] font-bold text-slate-400 mt-2">Upload Back</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={handleVerifyOtp}
                disabled={loadingVerify}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-teal-100 transition-all disabled:bg-slate-300"
              >
                {loadingVerify ? "Processing Request..." : "Submit Registration"}
              </button>
              <button 
                onClick={() => setStep(1)} 
                className="text-xs font-bold text-slate-400 hover:text-teal-600 transition-colors uppercase tracking-widest"
              >
                Go Back to Account Info
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-[10px] text-slate-400 mt-10 font-medium leading-relaxed">
          By signing up, you agree to our <Link href={"/seller-policy"} className="text-teal-600 underline">Seller Policy</Link> <br /> 
          and acknowledge our <Link href={"/privacy-policy"} className="text-teal-600 underline">Privacy Policy</Link>.
        </p>
        <div className="mt-10 pt-6 border-t border-slate-50 text-center">
            <p className="text-slate-500 text-sm font-medium">
                Already Seller?{" "}
                <Link href="/seller/login" className="text-teal-600 font-bold hover:underline ml-1 transition-all">
                Login to Seller Account
                </Link>
            </p>
          </div>
      </div>
    </div>
  )
}