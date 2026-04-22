"use client";

import { useRouter } from "next/navigation";
import { FaArrowLeft, FaTags, FaTrash, FaPlus, FaLayerGroup } from "react-icons/fa";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

const MAX_CATEGORY_LENGTH = 24;

const CategoriesPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/general/get-categories");
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    console.log("Sending request...");
    const trimmed = newCategory.trim();
    if (!trimmed) {
  toast.error("Category name required");
  return;
}

if (trimmed.length > MAX_CATEGORY_LENGTH) {
  toast.error(`Max ${MAX_CATEGORY_LENGTH} characters allowed`);
  return;
}
    
    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/admin/add-category", { name: trimmed });
      setCategories((prev) => [...prev, res.data]);
      setNewCategory("");
      toast.success("Category Added Successfully...");
    } catch (error) {
      console.error("Failed to add category:", error);
      toast.error("Failed to add category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (categories.length <= 4) {
      toast.error("Minimum 4 Categories should remain in website...");
      return;
    }
    const result = await Swal.fire({
      title: 'Delete Category?',
      text: "This action cannot be undone and may affect product listings.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f172a', // slate-900
      cancelButtonColor: '#f43f5e', // rose-500
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        popup: 'rounded-3xl border-none',
        confirmButton: 'rounded-xl px-6 py-3',
        cancelButton: 'rounded-xl px-6 py-3'
      }
    });
    if (!result.isConfirmed) return;
    try {
      await axiosInstance.post("/admin/remove-category", { id });
      setCategories(categories.filter((cat) => cat._id !== id));
      Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
    } catch (error) {
      toast.error("Failed to remove category");
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => router.push("/admin/dashboard")} 
          className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-teal-600 transition-all mb-8 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Dashboard
        </button>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shadow-inner">
                <FaLayerGroup size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">TradeXon</h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Manage store categories</p>
              </div>
            </div>

            <form onSubmit={handleAddCategory} className="flex-1 max-w-lg flex gap-3">
              <div className="relative flex-1">
                <FaTags className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="Electronics, Fashion, etc..."
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)} 
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-14 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-teal-500 outline-none transition-all shadow-sm"
                />
              </div>
              <button 
                type="submit"
                disabled={!newCategory.trim() || isSubmitting}
                className="bg-slate-900 text-white px-8 rounded-2xl hover:bg-teal-600 transition-all disabled:opacity-30 flex items-center justify-center shadow-lg shadow-slate-900/10"
              >
                {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaPlus />}
              </button>
            </form>
          </div>
        </motion.div>

        {/* CATEGORIES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {categories.map((cat, index) => (
              <motion.div 
                key={cat._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white p-6 rounded-4xl border border-slate-100 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50/50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />

                <div className="relative z-10">
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">
                    ID: {cat._id.slice(-6).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-6 group-hover:text-teal-600 transition-colors">
                    {cat.name}
                  </h3>
                  
                  <button 
                    onClick={() => handleDelete(cat._id)} 
                    className="w-full py-3 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center gap-2 border border-dashed border-slate-200 group-hover:border-rose-200 font-bold text-xs uppercase tracking-tighter"
                  >
                    <FaTrash size={12} /> Remove Category
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* EMPTY STATE */}
        {categories.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <FaLayerGroup size={24} />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">No categories found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;