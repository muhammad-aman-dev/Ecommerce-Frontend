"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import axiosInstance from "@/lib/axios";
import GlobalLoader from "@/components/GlobalLoader";
import { FaTimes, FaCloudUploadAlt, FaPlus, FaTag, FaWarehouse, FaCubes, FaArrowLeft } from "react-icons/fa";
import imageCompression from "browser-image-compression";
import "easymde/dist/easymde.min.css";
import ProductDescription from "@/components/ProductDescription";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), { ssr: false });

export default function AddProductPage() {
  const { authSeller } = useSelector((state) => state.auth);
  const router = useRouter();
  const [editorValue, setEditorValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productData, setProductData] = useState({
    name: "", description: "", price: "", stock: "", category: "",
    images: [], seller: authSeller?.email || "", variations: [],
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [variationOption, setVariationOption] = useState("");
  const [variationValues, setVariationValues] = useState("");
  const [variationPrices, setVariationPrices] = useState("");
  const [variationStocks, setVariationStocks] = useState("");

  const compressionOptions = { maxSizeMB: 0.6, maxWidthOrHeight: 1600, useWebWorker: true };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/general/get-categories");
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (error) { console.error("Category fetch failed", error); }
      finally { setIsLoading(false); }
    };
    fetchCategories();
  }, []);

  const onEditorChange = useCallback((value) => setEditorValue(value), []);

  const editorOptions = useMemo(() => ({
    autofocus: false, spellChecker: false, placeholder: "Describe the benefits and features...",
    status: false, toolbar: ["heading", "|", "bold", "italic", "|", "unordered-list", "ordered-list"],
  }), []);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (productData.images.length + files.length > 6) {
      setErrors("Maximum 6 images allowed");
      return;
    }
    try {
      const compressedImages = await Promise.all(
        files.map(async (file) => {
          const compressedFile = await imageCompression(file, compressionOptions);
          return { file: compressedFile, preview: URL.createObjectURL(compressedFile) };
        })
      );
      setProductData((prev) => ({ ...prev, images: [...prev.images, ...compressedImages] }));
      setErrors("");
    } catch (err) { setErrors("Image compression failed"); }
  };

  const removeImage = (index) => {
    setProductData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const addVariation = () => {
    if (!variationOption || !variationValues) {
      setErrors("Variation option and values are required");
      return;
    }
    const values = variationValues.split(",").map((v) => v.trim());
    const prices = variationPrices.split(",").map((p) => parseFloat(p.trim()) || 0);
    const stocks = variationStocks.split(",").map((s) => parseInt(s.trim()) || 0);

    if (values.length !== prices.length || values.length !== stocks.length) {
      setErrors("Values, Prices, and Stocks count must match");
      return;
    }

    const newVariation = {
      option: variationOption,
      values: values.map((v, i) => ({ value: v, price: prices[i], stock: stocks[i] })),
    };

    setProductData((prev) => ({ ...prev, variations: [...prev.variations, newVariation] }));
    setVariationOption(""); setVariationValues(""); setVariationPrices(""); setVariationStocks(""); setErrors("");
  };

  const removeVariation = (index) => {
    setProductData((prev) => ({ ...prev, variations: prev.variations.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    if (productData.images.length < 2) return setErrors("Please upload at least 2 images");
    if (!editorValue.trim()) return setErrors("Detailed Description is required");

    const confirmResult = await Swal.fire({
      title: "Confirm Listing",
      text: "Ready to put this product up for sale?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, List It",
      confirmButtonColor: "#0d9488"
    });

    if (!confirmResult.isConfirmed) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("detailedDescription", editorValue);
      formData.append("price", productData.price);
      formData.append("stock", productData.stock);
      formData.append("category", productData.category);
      formData.append("seller", productData.seller);
      formData.append("variations", JSON.stringify(productData.variations));

      for (let img of productData.images) {
        formData.append("images", img.file);
      }

      await axiosInstance.post("/seller/add-product", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      await Swal.fire({ title: "Success!", text: "Your product is now listed.", icon: "success", timer: 2000 });
      setProductData({ name: "", description: "", price: "", stock: "", category: "", images: [], seller: authSeller?.email || "", variations: [] });
      setEditorValue("");
    } catch (err) {
      setErrors("Failed to create product. Check all fields.");
    } finally { setIsSubmitting(false); }
  };

  if (isLoading) return <GlobalLoader />;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <button 
                      onClick={() => router.push("/seller/dashboard")}
                      className="group flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-2 text-sm font-bold uppercase tracking-widest"
                    >
                      <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                      Dashboard
                    </button>
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-800">New Listing</h1>
            <p className="text-slate-500">Add a product to your catalog</p>
          </div>
          <div className="hidden md:block text-right">
            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-widest">Seller: {authSeller?.email}</span>
          </div>
        </header>

        {errors && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium">{errors}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Basic Info */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6 text-teal-600">
              <FaTag /> <h2 className="font-bold text-slate-800">General Information</h2>
            </div>
            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Name</label>
                <input
                  type="text"
                  value={productData.name}
                  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-50 p-3 rounded-xl focus:border-teal-500/20 focus:bg-white outline-none transition-all"
                  placeholder="e.g. Wireless Noise Cancelling Headphones"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Short Description (Summary)</label>
                <textarea
                  value={productData.description}
                  onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-50 p-3 rounded-xl focus:border-teal-500/20 focus:bg-white outline-none transition-all h-20"
                  placeholder="A brief catchy summary..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Detailed Description */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-800 mb-6">Full Product Details</h2>
            <div className="prose-teal">
              <SimpleMdeReact value={editorValue} onChange={onEditorChange} options={editorOptions} />
            </div>
          </div>

          {/* Section 3: Pricing & Category */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6 text-teal-600">
              <FaWarehouse /> <h2 className="font-bold text-slate-800">Inventory & Pricing</h2>
            </div>
            <div className="flex items-center gap-3 mb-6 text-sm text-red-600">
              <p>!note please adjust shipping cost in base price</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Base Price (Must be in $)</label>
                <input
                  type="number" min="0" value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-50 p-3 rounded-xl focus:bg-white focus:border-teal-500/20 outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Initial Stock</label>
                <input
                  type="number" min="0" value={productData.stock}
                  onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-50 p-3 rounded-xl focus:bg-white focus:border-teal-500/20 outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
                <select
                  value={productData.category}
                  onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-50 p-3 rounded-xl focus:bg-white focus:border-teal-500/20 outline-none"
                  required
                >
                  <option value="">Select</option>
                  {categories.map((cat) => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Images */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6 text-teal-600">
              <FaCloudUploadAlt /> <h2 className="font-bold text-slate-800">Media Gallery</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {productData.images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100">
                  <img src={img.preview} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-lg">
                    <FaTimes size={10} />
                  </button>
                </div>
              ))}
              {productData.images.length < 6 && (
                <label className="aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-teal-50 hover:border-teal-200 transition-all">
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                  <FaPlus className="text-slate-300" />
                  <span className="text-[10px] font-bold text-slate-400 mt-2">Add Image</span>
                </label>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest">Min 2, Max 6 images allowed</p>
          </div>

          {/* Section 5: Variations */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6 text-teal-600">
              <FaCubes /> <h2 className="font-bold text-slate-800">Variations (Optional)</h2>
            </div>
            <div className="flex items-center gap-3 mb-6 text-sm text-red-600">
              <p>!note that variations prices will be added to base price</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl mb-4">
              <input placeholder="Option (Size)" value={variationOption} onChange={(e) => setVariationOption(e.target.value)} className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-teal-500/20" />
              <input placeholder="Values (S,M)" value={variationValues} onChange={(e) => setVariationValues(e.target.value)} className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-teal-500/20" />
              <input placeholder="Prices (10,12)" value={variationPrices} onChange={(e) => setVariationPrices(e.target.value)} className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-teal-500/20" />
              <input placeholder="Stocks (5,5)" value={variationStocks} onChange={(e) => setVariationStocks(e.target.value)} className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-teal-500/20" />
              <button type="button" onClick={addVariation} className="md:col-span-4 bg-slate-800 text-white p-3 rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors">Add Variation Set</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {productData.variations.map((v, i) => (
                <div key={i} className="bg-teal-50 border border-teal-100 p-3 rounded-2xl flex items-center gap-3">
                  <div className="text-sm">
                    <span className="font-bold text-teal-700">{v.option}: </span>
                    <span className="text-slate-600">{v.values.map(val => val.value).join(", ")}</span>
                  </div>
                  <button type="button" onClick={() => removeVariation(i)} className="text-red-400 hover:text-red-600"><FaTimes size={14}/></button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit" disabled={isSubmitting}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-5 rounded-3xl shadow-xl shadow-teal-100 transition-all disabled:bg-slate-300"
          >
            {isSubmitting ? "Finalizing Listing..." : "Publish Product to Marketplace"}
          </button>
        </form>

        {/* Live Preview */}
        {editorValue && (
          <div className="mt-12 opacity-80">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Live Content Preview</h3>
            <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-200">
              <ProductDescription description={editorValue} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}