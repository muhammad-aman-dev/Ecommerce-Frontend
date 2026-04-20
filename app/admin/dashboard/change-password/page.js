"use client";

import { useState } from "react";
import { 
  FaShieldAlt, FaEye, FaEyeSlash, 
   FaArrowLeft, FaKey 
} from "react-icons/fa";
import axiosInstance from "@/lib/axios";
import { motion } from "framer-motion";
import Swal from 'sweetalert2';
import Link from "next/link";

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState({ new: false, confirm: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      return Swal.fire({
        icon: 'error',
        title: 'Mismatch',
        text: 'Passwords do not match!',
        confirmButtonColor: '#0f172a'
      });
    }

    if (formData.newPassword.length < 8) {
      return Swal.fire({
        icon: 'warning',
        title: 'Too Short',
        text: 'For security, use at least 8 characters.',
        confirmButtonColor: '#0f172a'
      });
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.patch("/admin/update-password", {
        newPassword: formData.newPassword
      });
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Your password has been updated.',
          timer: 2000,
          showConfirmButton: false
        });
        setFormData({ newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || "Something went wrong.",
        confirmButtonColor: '#e11d48'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-10 flex flex-col items-center justify-center font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors mb-6 group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-[3.5rem] p-8 md:p-12 border border-slate-100 shadow-2xl shadow-slate-200/60 relative overflow-hidden">
          
          <header className="mb-10 text-center">
            <div className="bg-indigo-400 w-16 h-16 rounded-4xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-teal-500/20">
              <FaKey size={24} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Set New Password</h1>
            <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-widest">Logged in as Admin</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* NEW PASSWORD */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">New Password</label>
              <div className="relative">
                <input 
                  type={showPass.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-3xl px-6 py-5 text-sm font-bold text-slate-700 focus:border-slate-900 focus:bg-white outline-none transition-all pr-14"
                  placeholder="Enter new password"
                />
                <button type="button" onClick={() => setShowPass(p => ({...p, new: !p.new}))} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900">
                  {showPass.new ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* CONFIRM NEW PASSWORD */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Confirm Password</label>
              <div className="relative">
                <input 
                  type={showPass.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`w-full border-2 rounded-3xl px-6 py-5 text-sm font-bold text-slate-700 outline-none transition-all pr-14 ${
                    formData.confirmPassword && formData.newPassword !== formData.confirmPassword 
                    ? "bg-rose-50 border-rose-100 focus:border-rose-300" 
                    : "bg-slate-50 border-slate-50 focus:border-slate-900 focus:bg-white"
                  }`}
                  placeholder="Repeat for confirmation"
                />
                <button type="button" onClick={() => setShowPass(p => ({...p, confirm: !p.confirm}))} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900">
                  {showPass.confirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* PASSWORD STRENGTH UI (VISUAL ONLY) */}
            {formData.newPassword && (
              <div className="flex gap-1 px-2">
                {[1, 2, 3, 4].map((step) => (
                  <div 
                    key={step} 
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      formData.newPassword.length >= step * 2 ? "bg-indigo-500" : "bg-slate-100"
                    }`}
                  />
                ))}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-6 rounded-4xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-teal-600 transition-all shadow-xl disabled:bg-slate-200 disabled:text-slate-400"
            >
              {isLoading ? "Updating Securely..." : "Change Password Now"}
            </button>
          </form>

          <div className="mt-10 flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
             <div className="bg-white p-2 rounded-lg shadow-sm">
                <FaShieldAlt className="text-teal-500" />
             </div>
             <p className="text-[9px] font-bold text-slate-500 leading-tight uppercase">
               Since you are logged in, we only require your new choice. Make it unique.
             </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChangePasswordPage;