"use client"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  FaPlus, FaSearch, FaEye, FaEdit, 
  FaArrowLeft, FaBoxOpen, FaStar, FaCircle, FaInbox 
} from "react-icons/fa"
import { toast, ToastContainer } from "react-toastify"
import axiosInstance from "@/lib/axios"
import { useRouter } from "next/navigation"
import "react-toastify/dist/ReactToastify.css"

export default function SellerProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")

  const router = useRouter();

  // 1. Fetch Products from Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // Adjust this endpoint to your actual backend route
        const { data } = await axiosInstance.get("/seller/products", { withCredentials: true })
        setProducts(data.products)
      } catch (err) {
        toast.error("Failed to load products")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])


  // 3. Search & Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.productId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "All" || p.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [products, searchTerm, categoryFilter])

  // 4. Dynamic Stats
  const stats = [
    { label: "Total Products", value: products.length, icon: <FaBoxOpen className="text-teal-600" /> },
    { label: "Total Views", value: products.reduce((acc, p) => acc + (p.views || 0), 0), icon: <FaEye className="text-blue-600" /> },
    { label: "Featured", value: products.filter(p => p.featured).length, icon: <FaStar className="text-amber-500" /> },
  ]

  // Get unique categories for the dropdown
  const categories = ["All", ...new Set(products.map(p => p.category))]

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-10 font-sans">
      <ToastContainer position="top-right" theme="colored" />
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10">
        <button 
                              onClick={() => router.push("/seller/dashboard")}
                              className="group flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-2 text-sm font-bold uppercase tracking-widest"
                            >
                              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                              Dashboard
                            </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Your Inventory</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Manage, track, and optimize your TradeXon listings.</p>
          </div>
          <Link href="/seller/dashboard/add-product" className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-4 rounded-2xl shadow-xl shadow-teal-600/20 transition-all active:scale-95">
            <FaPlus size={14} /> Add New Product
          </Link>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-xl">
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-slate-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search by product name or ID..."
            className="w-full bg-white border-2 border-slate-100 p-4 pl-14 rounded-2xl focus:outline-none focus:border-teal-500/20 transition-all text-slate-700 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="bg-white border-2 border-slate-100 px-6 py-4 rounded-2xl focus:outline-none text-slate-600 font-bold text-sm cursor-pointer"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* TABLE */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
          {loading ? (
            <div className="p-20 text-center text-slate-400 font-bold">Loading your inventory...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Price</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stock</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                            <Image src={p.images[0] || "/placeholder.jpg"} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" alt={p.name} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm truncate max-w-50">{p.name}</p>
                            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-tight">{p.productId}</p>
                            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-tight">{p._id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${
                          p.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                        }`}>
                          <FaCircle size={6} /> {p.status}
                        </span>
                      </td>
                      <td className="p-6 font-black text-slate-800">${p.price.toLocaleString()}</td>
                      <td className="p-6">
                        <div className="flex flex-col gap-1">
                          <p className={`text-sm font-bold ${p.stock < 10 ? 'text-red-500' : 'text-slate-700'}`}>{p.stock} Units</p>
                          <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${p.stock < 10 ? 'bg-red-500' : 'bg-teal-500'}`} style={{ width: `${Math.min(p.stock, 100)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex justify-end gap-2">
                          <Link href={`/seller/dashboard/products/edit?id=${p._id}`} className="p-3 rounded-xl hover:bg-white hover:shadow-md text-slate-400 hover:text-teal-600 transition-all">
                            <FaEdit size={16} />
                          </Link>
                          </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <FaInbox size={40} className="text-slate-200" />
              <p className="text-slate-400 font-bold">No products found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}