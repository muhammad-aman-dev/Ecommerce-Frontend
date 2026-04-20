"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import GlobalLoader from "@/components/GlobalLoader";
import { toast, ToastContainer } from "react-toastify";
import { FaArrowLeft, FaImage, FaPlus, FaTrash, FaLink, FaHeading, FaUpload } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export default function AdminBannersPageUI() {
  const router = useRouter();
  const { BannersFetched } = useSelector((state) => state.generalData);
  const [Banners, setBanners] = useState([]);
  const [newBanner, setNewBanner] = useState({
    title: "",
    ref: "",
    imageFile: null
  });
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch banners on mount
  useEffect(() => {
    setBanners(BannersFetched || []);
    setIsLoading(false);
  }, [BannersFetched]);

  const handleChange = (e) => {
    setNewBanner({ ...newBanner, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file only!");
      return;
    }
    setNewBanner({ ...newBanner, imageFile: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleClearFields = () => {
    setNewBanner({ title: "", ref: "", imageFile: null });
    setPreview(null);
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!newBanner.title || !newBanner.ref || !newBanner.imageFile) {
        toast.warn("Please fill all fields and select an image");
        return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", newBanner.title);
      formData.append("ref", newBanner.ref);
      formData.append("image", newBanner.imageFile);

      const { data } = await axiosInstance.post("/admin/add-banner", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setBanners([...Banners, data]);
      toast.success("Banner Added Successfully!");
      handleClearFields();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBanner = async (banner) => {
    const result = await Swal.fire({
      title: "Remove Banner?",
      text: "This image will be permanently deleted from the homepage.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.post(`/admin/delete-banner`, { imageLink: banner.imageLink });
      setBanners(Banners.filter((b) => b._id !== banner._id));
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete banner");
    }
  };

  if (isLoading) return <GlobalLoader />;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <button 
          onClick={() => router.push("/admin/dashboard")}
          className="flex items-center gap-2 mb-8 text-slate-500 hover:text-indigo-600 font-bold transition-colors group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                    <FaImage className="text-white text-2xl" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Banner Management</h1>
                    <p className="text-slate-500 font-medium">Control the visual identity of your homepage</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Form Column */}
          <div className="lg:col-span-1">
            <form onSubmit={handleAddBanner} className="bg-white p-8 rounded-4xl shadow-xl shadow-slate-200/50 border border-white sticky top-28">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FaPlus className="text-indigo-600 text-sm" /> Create New Banner
              </h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Banner Title</label>
                  <div className="relative">
                    <FaHeading className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      type="text"
                      name="title"
                      value={newBanner.title}
                      onChange={handleChange}
                      placeholder="e.g. Summer Sale 2024"
                      className="w-full bg-slate-50 border-2 border-slate-50 text-slate-900 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500/20 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Redirect Link (Ref)</label>
                  <div className="relative">
                    <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      type="text"
                      name="ref"
                      value={newBanner.ref}
                      onChange={handleChange}
                      placeholder="/category/fashion"
                      className="w-full bg-slate-50 border-2 border-slate-50 text-slate-900 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500/20 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Banner Graphic</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="hidden" 
                      id="banner-upload" 
                    />
                    <label 
                      htmlFor="banner-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50 group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-all"
                    >
                      <FaUpload className="text-slate-400 group-hover:text-indigo-500 mb-2" />
                      <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-600">Click to upload</span>
                    </label>
                  </div>
                </div>

                {preview && (
                  <div className="relative rounded-2xl overflow-hidden shadow-md border-4 border-white">
                    <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
                    <div className="absolute inset-0 bg-indigo-600/20" />
                  </div>
                )}

                <div className="pt-4 flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:bg-slate-300 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Uploading..." : <><FaPlus /> Publish Banner</>}
                  </button>
                  <button
                    type="button"
                    onClick={handleClearFields}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-2xl transition-all"
                  >
                    Reset Form
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Display Column */}
          <div className="lg:col-span-2">
            {Banners.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-4xl p-20 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <FaImage size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">No Banners Active</h3>
                <p className="text-slate-400 mt-2">Upload your first promotion banner using the form.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Banners.map((banner) => (
                  <div 
                    key={banner._id} 
                    className="group bg-white rounded-4xl shadow-lg shadow-slate-200/50 overflow-hidden border border-white hover:border-indigo-100 transition-all"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={banner.imageLink} 
                        alt={banner.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Active Promotion</p>
                        <h2 className="text-lg font-bold truncate">{banner.title}</h2>
                      </div>
                    </div>
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                        <FaLink size={12} />
                        <span className="truncate max-w-30">{banner.ref}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteBanner(banner)}
                        className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                        title="Delete Banner"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}