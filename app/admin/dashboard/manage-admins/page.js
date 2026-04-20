'use client'

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { FaTrash, FaShieldAlt, FaUserShield, FaLock, FaEnvelope, FaArrowLeft } from "react-icons/fa"
import { useRouter } from "next/navigation"
import axiosInstance from "@/lib/axios"
import Swal from "sweetalert2"

export default function ManageAdminsPage() {
  const router = useRouter()
  const { authAdmin } = useSelector((state) => state.auth)
  
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [newAdmin, setNewAdmin] = useState({ email: "", password: "" })

  if (!authAdmin || authAdmin.role !== "super admin") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center text-3xl md:text-4xl mb-6 shadow-xl shadow-red-500/10">
          <FaShieldAlt />
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">Access Denied</h1>
        <p className="text-slate-500 font-medium mt-2 text-sm md:text-base">Only Super Admins can access this terminal.</p>
        <button 
          onClick={() => router.push("/admin/dashboard")}
          className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    )
  }

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const { data } = await axiosInstance.get("/admin/get-all-admins")
      const subAdmins = data.filter(admin => admin.role === "admin")
      setAdmins(subAdmins)
    } catch (err) {
      Swal.fire("Error", "Failed to load administrators", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    if (!newAdmin.email || !newAdmin.password) {
      return Swal.fire("Required", "Please fill all fields", "warning")
    }

    Swal.fire({
      title: 'Creating Admin...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading() }
    })

    try {
      await axiosInstance.post("/admin/add-admin", { ...newAdmin, role: "admin" })
      Swal.fire({
        icon: 'success',
        title: 'Authorized!',
        text: 'New admin account has been created.',
        timer: 2000,
        showConfirmButton: false
      })
      setNewAdmin({ email: "", password: "" })
      fetchAdmins()
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Could not add admin", "error")
    }
  }

  const handleRemove = async (id) => {
    const result = await Swal.fire({
      title: 'Revoke Access?',
      text: "This admin will no longer be able to access the portal.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d9488',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove them',
      background: '#fff',
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl font-bold px-6 py-3',
        cancelButton: 'rounded-xl font-bold px-6 py-3'
      }
    })

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Processing...',
        didOpen: () => { Swal.showLoading() }
      })

      try {
        await axiosInstance.delete(`/admin/remove-admin/${id}`)
        Swal.fire('Deleted!', 'Administrator access has been revoked.', 'success')
        fetchAdmins()
      } catch (err) {
        Swal.fire('Failed', 'Could not remove administrator.', 'error')
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f9f9] p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between md:items-center gap-6">
          <div className="flex flex-col">
            <button 
              onClick={() => router.push("/admin/dashboard")}
              className="group flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-4 md:mb-6 text-xs font-black uppercase tracking-[0.2em]"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight uppercase italic">
              Admin <span className="text-teal-600">Control</span>
            </h1>
            <p className="text-slate-500 font-medium uppercase text-[10px] tracking-widest mt-1">Super Admin Clearance Level</p>
          </div>
          <div className="self-start md:self-center bg-white px-4 py-2 rounded-2xl border border-teal-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Live</span>
          </div>
        </header>

        {/* Changed lg:grid-cols-3 to handle stacking on mobile/tablet */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
          
          {/* Create Section */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white p-6 md:p-8 rounded-4xl md:rounded-[2.5rem] shadow-sm border border-teal-50">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em] mb-6 md:mb-8 text-center lg:text-left">Authorize New</h3>
              
              <form onSubmit={handleAddAdmin} className="space-y-4 md:space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase px-1">Admin Email</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600/30" />
                    <input 
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 font-bold text-sm focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                      placeholder="email@tradexon.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase px-1">Access Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600/30" />
                    <input 
                      type="password"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 font-bold text-sm focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-900 text-white p-4 md:p-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-teal-600 transition-all shadow-xl shadow-slate-900/10 mt-4 active:scale-95"
                >
                  Create Identity
                </button>
              </form>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white p-6 md:p-8 rounded-4xl md:rounded-[2.5rem] shadow-sm border border-slate-100 min-h-75 md:min-h-125">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em] mb-6 md:mb-8 text-center lg:text-left">Managed Personnel</h3>

              {loading ? (
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 rounded-3xl animate-pulse" />)}
                </div>
              ) : (
                <div className="grid gap-4">
                  {admins.map((admin) => (
                    <div key={admin._id} className="flex flex-col overflow-auto sm:flex-row items-center justify-between p-4 md:p-5 bg-slate-50 rounded-[1.8rem] border border-transparent hover:border-teal-100 hover:bg-white transition-all gap-4">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl shrink-0 flex items-center justify-center text-teal-600 shadow-sm border border-slate-100">
                          <FaUserShield size={20} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-black text-slate-800 text-xs md:text-sm tracking-tight truncate">{admin.email}</p>
                          <p className="text-[9px] font-black text-teal-500 uppercase tracking-widest mt-1">Level: {admin.role}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleRemove(admin._id)}
                        className="w-full sm:w-11 h-11 bg-white text-red-400 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all border border-slate-100 shrink-0"
                      >
                        <FaTrash size={14} />
                        <span className="sm:hidden ml-2 font-black uppercase text-[10px] tracking-widest">Revoke Access</span>
                      </button>
                    </div>
                  ))}
                  {admins.length === 0 && (
                    <div className="text-center py-20 text-slate-300 font-black uppercase tracking-widest text-[10px]">No Administrators Registered</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}