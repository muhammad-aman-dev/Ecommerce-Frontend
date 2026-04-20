"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { 
  FaSave, FaArrowLeft, FaShieldAlt, FaBox, FaTags, 
  FaCloudUploadAlt, FaTimes, FaPlus, FaCubes, FaWarehouse 
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "@/lib/axios";
import imageCompression from "browser-image-compression";
import "easymde/dist/easymde.min.css";
import "react-toastify/dist/ReactToastify.css";
import ProductDescription from "@/components/ProductDescription"; // Assuming this handles Markdown rendering

const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), { ssr: false });

export default function EditProduct() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  
  const [product, setProduct] = useState({
    name: "",
    description: "",
    detailedDescription: "",
    price: "",
    stock: "",
    category: "",
    status: "Active",
    images: [], 
    variations: []
  });

  // Variation Temp States
  const [varOption, setVarOption] = useState("");
  const [varValues, setVarValues] = useState("");
  const [varPrices, setVarPrices] = useState("");
  const [varStocks, setVarStocks] = useState("");

  const editorOptions = useMemo(() => ({
    autofocus: false,
    spellChecker: false,
    status: false,
    placeholder: "Describe the full technical details and benefits...",
    toolbar: ["heading", "|", "bold", "italic", "|", "unordered-list", "ordered-list"],
  }), []);

  useEffect(() => {
    const fetchData = async () => {
      if (!productId) {
        toast.error("No Product ID found");
        return router.push("/seller/dashboard/products");
      }
      try {
        const [prodRes, catRes] = await Promise.all([
          axiosInstance.get(`/seller/products/${productId}`),
          axiosInstance.get("/general/get-categories")
        ]);

        if (prodRes.data.success) {
          const p = prodRes.data.product;
          setProduct({
            ...p,
            // Map existing strings to our image object structure
            images: p.images.map(img => ({ file: null, preview: img, isExisting: true }))
          });
          
          const dbCats = Array.isArray(catRes.data) ? catRes.data.map(c => c.name) : [];
          setAvailableCategories(Array.from(new Set([...dbCats, p.category])));
        }
      } catch (err) {
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (product.images.length + files.length > 6) return toast.warning("Maximum 6 images allowed");
    
    try {
      const compressed = await Promise.all(files.map(async file => {
        const compFile = await imageCompression(file, { maxSizeMB: 0.6, maxWidthOrHeight: 1600, useWebWorker: true });
        return { file: compFile, preview: URL.createObjectURL(compFile), isExisting: false };
      }));
      setProduct(prev => ({ ...prev, images: [...prev.images, ...compressed] }));
    } catch (err) {
      toast.error("Image compression failed");
    }
  };

  const removeImage = (index) => {
    setProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const addVariation = () => {
    if (!varOption || !varValues) return toast.error("Option (e.g. Size) and Values are required");
    
    const values = varValues.split(",").map(v => v.trim());
    const prices = varPrices.split(",").map(p => parseFloat(p.trim()) || 0);
    const stocks = varStocks.split(",").map(s => parseInt(s.trim()) || 0);

    if (values.length !== prices.length || values.length !== stocks.length) {
      return toast.error("Counts for Values, Prices, and Stocks must match (comma separated)");
    }

    const newVar = {
      option: varOption,
      values: values.map((v, i) => ({ value: v, price: prices[i], stock: stocks[i] }))
    };

    setProduct(prev => ({ ...prev, variations: [...prev.variations, newVar] }));
    setVarOption(""); setVarValues(""); setVarPrices(""); setVarStocks("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (product.images.length < 2) return toast.error("Please provide at least 2 images");
    
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("detailedDescription", product.detailedDescription);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      formData.append("category", product.category);
      formData.append("status", product.status);
      formData.append("variations", JSON.stringify(product.variations));

      // Separate existing URLs from new File uploads
      const existingUrls = product.images.filter(img => img.isExisting).map(img => img.preview);
      formData.append("existingImages", JSON.stringify(existingUrls));

      product.images.forEach(img => {
        if (!img.isExisting) formData.append("images", img.file);
      });

      await axiosInstance.put(`/seller/update-product/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Product updated successfully!");
      router.push("/seller/dashboard/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed. Check all fields.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-300 animate-pulse tracking-widest uppercase">Fetching Data...</div>;

  const isSuspended = product.status === "Suspended By Admin";

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-10 font-sans text-slate-800">
      <ToastContainer theme="colored" position="bottom-right" />
      
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-end mb-8">
          <div>
            <button 
              onClick={() => router.push("/seller/dashboard/products")} 
              className="flex items-center gap-2 text-slate-400 hover:text-teal-600 font-bold mb-2 transition-colors group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" size={12} /> BACK TO INVENTORY
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Edit Listing</h1>
          </div>
          <div className="hidden md:block text-right">
            <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-4 py-2 rounded-full uppercase tracking-widest border border-teal-100">
              Product ID: {product.productId}
            </span>
            <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-4 py-2 rounded-full uppercase tracking-widest border border-teal-100">
              Main ID: {productId}
            </span>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: STATUS & SECURITY */}
          <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${isSuspended ? 'bg-red-50/50 border-red-100' : 'bg-white border-slate-100'}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${isSuspended ? 'bg-red-100 text-red-600' : 'bg-teal-50 text-teal-600'}`}>
                  {isSuspended ? <FaShieldAlt /> : <FaBox />}
                </div>
                <div>
                  <h3 className="font-black text-lg">Listing Visibility</h3>
                  <p className="text-xs text-slate-500 font-medium">Control if this product is visible to buyers.</p>
                </div>
              </div>

              <div className="w-full md:w-64">
                <select 
                  name="status"
                  value={product.status}
                  onChange={handleChange}
                  disabled={isSuspended}
                  className={`w-full p-4 rounded-2xl font-bold text-sm outline-none transition-all ${
                    isSuspended 
                    ? "bg-red-100 text-red-700 cursor-not-allowed border-none" 
                    : "bg-slate-50 border-2 border-transparent focus:border-teal-500/20 text-slate-700"
                  }`}
                >
                  {isSuspended && <option value="Suspended">Suspended by Admin</option>}
                  <option value="Active">Active</option>
                  <option value="Out Of Stock">Out Of Stock</option>
                  <option value="Suspend">Suspend</option>
                </select>
                {isSuspended && <p className="text-[9px] text-red-500 font-black mt-2 text-center tracking-widest uppercase">Locked by Administration</p>}
              </div>
            </div>
          </div>

          {/* SECTION 2: GENERAL INFORMATION */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
             <div className="flex items-center gap-3 mb-2">
                <FaTags className="text-teal-600" />
                <h3 className="font-black text-lg text-slate-900">General Details</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Product Name</label>
                  <input 
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 p-4 rounded-2xl font-bold focus:bg-white focus:ring-4 focus:ring-teal-500/5 transition-all outline-none border border-transparent focus:border-teal-500/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Category</label>
                  <select 
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    className="w-full bg-slate-50 p-4 rounded-2xl font-bold focus:bg-white transition-all outline-none border border-transparent focus:border-teal-500/20"
                    required
                  >
                    {availableCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Short Description (SEO Summary)</label>
                <textarea 
                  name="description"
                  rows="2"
                  value={product.description}
                  onChange={handleChange}
                  className="w-full bg-slate-50 p-4 rounded-2xl font-medium focus:bg-white transition-all outline-none border border-transparent focus:border-teal-500/20 resize-none"
                  required
                />
             </div>
          </div>

          {/* SECTION 3: PRICING & INVENTORY */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8 text-teal-600">
              <FaWarehouse /> <h2 className="font-black text-lg text-slate-900">Inventory & Pricing</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 text-center block">Base Price ($)</label>
                <input 
                  type="number" 
                  name="price"
                  value={product.price} 
                  onChange={handleChange}
                  className="w-full bg-slate-50 p-6 rounded-4xl text-center text-4xl font-black text-teal-600 outline-none border-2 border-transparent focus:border-teal-500/20 transition-all shadow-inner" 
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 text-center block">Main Stock (Units)</label>
                <input 
                  type="number" 
                  name="stock"
                  value={product.stock} 
                  onChange={handleChange}
                  className="w-full bg-slate-50 p-6 rounded-4xl text-center text-4xl font-black text-slate-800 outline-none border-2 border-transparent focus:border-teal-500/20 transition-all shadow-inner" 
                  required
                />
              </div>
            </div>
            <p className="text-[10px] text-red-400 font-bold mt-6 uppercase tracking-widest text-center">! Pricing logic: Variation prices add to this base amount</p>
          </div>

          {/* SECTION 4: FULL DESCRIPTION (MARKDOWN) */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
            <h3 className="font-black text-lg mb-6">Full Product Content</h3>
            <div className="prose-teal">
              <SimpleMdeReact 
                value={product.detailedDescription} 
                onChange={(val) => setProduct(p => ({...p, detailedDescription: val}))} 
                options={editorOptions} 
              />
            </div>
          </div>

          {/* SECTION 5: MEDIA GALLERY */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
            <div className="flex items-center gap-2 mb-6 text-teal-600">
              <FaCloudUploadAlt /> <h3 className="font-black text-lg text-slate-900">Media Gallery</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {product.images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-100">
                  <img src={img.preview} className="w-full h-full object-cover" alt="Preview" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(i)} 
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <FaTimes size={10}/>
                  </button>
                  {!img.isExisting && (
                    <div className="absolute bottom-0 left-0 right-0 bg-teal-500 text-[8px] text-white font-black text-center py-1 uppercase tracking-widest">New</div>
                  )}
                </div>
              ))}
              {product.images.length < 6 && (
                <label className="aspect-square border-4 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-teal-50/50 hover:border-teal-200 transition-all group">
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                  <FaPlus className="text-slate-200 group-hover:text-teal-300 transition-colors" size={24} />
                  <span className="text-[10px] font-black text-slate-300 group-hover:text-teal-400 mt-2 uppercase tracking-tighter">Add Image</span>
                </label>
              )}
            </div>
          </div>

          {/* SECTION 6: VARIATIONS */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
            <div className="flex items-center gap-2 mb-6 text-teal-600">
              <FaCubes /> <h3 className="font-black text-lg text-slate-900">Variations Manager</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <input placeholder="Option (e.g. Color)" value={varOption} onChange={e => setVarOption(e.target.value)} className="p-4 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/20 font-bold text-sm" />
              <input placeholder="Values (Red,Blue)" value={varValues} onChange={e => setVarValues(e.target.value)} className="p-4 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/20 font-bold text-sm" />
              <input placeholder="Prices (0,10)" value={varPrices} onChange={e => setVarPrices(e.target.value)} className="p-4 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/20 font-bold text-sm" />
              <input placeholder="Stocks (5,5)" value={varStocks} onChange={e => setVarStocks(e.target.value)} className="p-4 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/20 font-bold text-sm" />
              <button 
                type="button" 
                onClick={addVariation} 
                className="md:col-span-4 bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-teal-600 transition-all shadow-lg active:scale-95"
              >
                Sync Variation Set
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {product.variations.map((v, i) => (
                <div key={i} className="bg-teal-50 border border-teal-100 pl-5 pr-3 py-3 rounded-2xl flex items-center gap-4 group">
                  <div className="text-xs">
                    <span className="font-black text-teal-700 uppercase tracking-widest">{v.option}: </span>
                    <span className="font-bold text-slate-600">{v.values.map(val => val.value).join(", ")}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setProduct(p => ({...p, variations: p.variations.filter((_, idx) => idx !== i)}))} 
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <FaTimes size={14}/>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* FINAL SUBMIT ACTION */}
          <div className="sticky bottom-8 z-10">
            <button 
              type="submit" 
              disabled={saving}
              className="w-full bg-teal-600 text-white py-7 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-teal-200 hover:bg-teal-700 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center gap-4"
            >
              {saving ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  UPDATING DATABASE...
                </>
              ) : (
                <><FaSave /> COMMIT PRODUCT CHANGES</>
              )}
            </button>
          </div>

          {/* LIVE CONTENT PREVIEW */}
          {product.detailedDescription && (
            <div className="mt-20 opacity-40 hover:opacity-100 transition-opacity">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 text-center">Live Preview Mode</h3>
              <div className="bg-white p-10 rounded-[3rem] border-4 border-dashed border-slate-100">
                 <ProductDescription description={product.detailedDescription} />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}