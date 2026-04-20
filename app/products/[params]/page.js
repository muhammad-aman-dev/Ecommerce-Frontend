"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import axiosInstance from "@/lib/axios";
import {
  FaShoppingCart,
  FaShieldAlt,
  FaTruck,
  FaMinus,
  FaPlus,
  FaBarcode,
  FaExclamationCircle,
  FaStore,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import ProductDescription from "@/components/ProductDescription";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import Link from "next/link";

export default function ProductPage() {
  const { params } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [basePrice, setBasePrice] = useState(0);
  const [maxStock, setMaxStock] = useState(0);

  const { currency, exchangeRates } = useSelector((state) => state.currency);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/general/get-product/${params}`);
        const data = response.data.product;
        setProduct(data);
        setSelectedImage(data.images[0]);
        setBasePrice(data.price);
        setMaxStock(data.stock);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
        toast.error("Could not load product details");
      }
    };
    if (params) fetchProduct();
  }, [params]);

  useEffect(() => {
    if (!product) return;
    let extraPrice = 0;
    let availableStock = product.stock;

    Object.keys(selectedVariations).forEach((optionName) => {
      const selectedValue = selectedVariations[optionName];
      const variationOption = product.variations.find((v) => v.option === optionName);
      const valueDetails = variationOption?.values.find((val) => val.value === selectedValue);

      if (valueDetails) {
        extraPrice += valueDetails.price;
        availableStock = valueDetails.stock;
      }
    });

    setBasePrice(product.price + extraPrice);
    setMaxStock(availableStock);
    if (quantity > availableStock) setQuantity(availableStock || 1);
  }, [selectedVariations, product, quantity]);

  const handleVariationChange = (option, value) => {
    setSelectedVariations((prev) => ({ ...prev, [option]: value }));
  };

  const handleAddToCart = () => {
    if (!product) return;
    const variationKeys = product.variations.map((v) => v.option);
    const allSelected = variationKeys.every((k) => selectedVariations[k]);
    if (product.variations.length > 0 && !allSelected) {
      toast.error(`Please select ${variationKeys.join(", ")}`);
      return;
    }
    if (quantity > maxStock) {
      toast.error(`Cannot add more than available stock (${maxStock})`);
      return;
    }
    dispatch(addToCart({
      productId: product.productId,
      name: product.name,
      priceUSD: basePrice,
      quantity,
      image: product.images[0],
      variations: selectedVariations,
      seller: product.seller,
      sellerName: product.sellerName,
      stock: maxStock,
    }));
    toast.success("Added to cart!");
  };
  console.log(product?.sellerId)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-teal-600 font-bold tracking-widest uppercase text-xs">Loading Product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6 text-center">
        <div>
          <FaExclamationCircle size={50} className="text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-800">Product Not Found</h2>
          <button onClick={() => (window.location.href = "/")} className="bg-teal-600 text-white px-8 py-3 rounded-2xl font-bold mt-4">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32 lg:pb-12 lg:py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
        
        {/* IMAGE GALLERY */}
        <div className="space-y-6 lg:sticky lg:top-24 h-fit">
          <div className="relative aspect-square rounded-4xl md:rounded-[3rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-2xl shadow-teal-900/5">
            <Image src={selectedImage} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-6 md:p-10 transition-all duration-500" loading="eager" priority />
          </div>
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all snap-start ${
                  selectedImage === img ? "border-teal-500 shadow-lg scale-95" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img} alt={`view-${idx}`} fill sizes="100px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="flex flex-col justify-center">
          {/* BADGES */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-teal-100">
              <FaStore className="text-[10px]" />
              <Link href={`/seller-details/${product?.sellerId}`} target="_blank" className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider">
                {product.sellerName || "Official Store"}
              </Link>
              <FaCheckCircle className="text-[10px]" title="Verified Seller" />
            </div>
            <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-teal-100">
              <FaBarcode className="text-[10px]" />
              <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider">
                {product.productId || "Product ID"}
              </span>
              <FaCheckCircle className="text-[10px]" title="Verified Seller" />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6 tracking-tight">
            {product.name}
          </h1>

          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-xl mb-6 italic">
            {product.description}
          </p>

          <div className="mb-8 flex flex-wrap items-center gap-4 md:gap-6">
            <span className="text-4xl md:text-5xl font-black text-teal-600 tracking-tighter">
              {currency} {(basePrice * (exchangeRates[currency] || 1)).toFixed(2)}
            </span>
            <div className="px-4 py-1.5 bg-slate-100 rounded-lg text-slate-600 text-xs md:text-sm font-bold">
              Stock: {maxStock}
            </div>
          </div>

          {/* VARIATIONS */}
          {product.variations.map((v) => (
            <div key={v.option} className="mb-6 md:mb-8">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Pick {v.option}</h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {v.values.map((val) => (
                  <button
                    key={val.value}
                    onClick={() => handleVariationChange(v.option, val.value)}
                    disabled={val.stock === 0}
                    className={`px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm transition-all border-2 ${
                      selectedVariations[v.option] === val.value
                        ? "bg-slate-900 border-slate-900 text-white shadow-xl -translate-y-1"
                        : "bg-slate-50 border-slate-50 text-slate-500 hover:border-teal-200"
                    } ${val.stock === 0 ? "opacity-20 cursor-not-allowed" : ""}`}
                  >
                    {val.value}
                    {val.price > 0 && (
                      <span className="opacity-50 text-[10px] md:text-xs ml-2">
                        +{currency} {(val.price * (exchangeRates[currency] || 1)).toFixed(2)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* QUANTITY & ADD TO CART - Hidden on phone, replaced by sticky bar */}
          <div className="hidden lg:flex flex-row gap-5 mb-10">
            <div className="flex items-center justify-between bg-slate-50 p-2 rounded-3xl border border-slate-100 min-w-40">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-teal-600 transition-colors">
                <FaMinus size={10} />
              </button>
              <span className="font-black text-slate-800 text-lg">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-teal-600 transition-colors">
                <FaPlus size={10} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={maxStock <= 0}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-3xl py-5 px-10 font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-teal-600/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:bg-slate-200"
            >
              <FaShoppingCart size={18} />
              {maxStock <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>

          {/* TRUST TILES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-10 border-t border-slate-100">
            <Link href={`/seller-details/${product.sellerId}`} target="_blank" className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center text-teal-600 shadow-sm border border-slate-100">
                <FaStore size={18} />
              </div>
              <div>
                <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-400">Sold by</p>
                <p className="font-bold text-sm md:text-base text-slate-800">{product.sellerName || "Elite Merchant"}</p>
              </div>
            </Link>
            
            <div className="flex gap-4">
               <div className="flex-1 text-center sm:text-left space-y-1">
                <FaTruck className="text-teal-500 mb-1 mx-auto sm:mx-0" />
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Shipping</p>
                <p className="text-[9px] text-slate-500">Global Delivery</p>
              </div>
              <div className="flex-1 text-center sm:text-left space-y-1">
                <FaShieldAlt className="text-teal-500 mb-1 mx-auto sm:mx-0" />
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Audit</p>
                <p className="text-[9px] text-slate-500">Secure Order</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED DESCRIPTION */}
      <div className="mt-16 md:mt-24 pt-10 md:pt-16 border-t border-slate-50">
        <div className="max-w-4xl">
          <h2 className="text-[10px] font-black text-teal-600 uppercase tracking-[0.4em] mb-4">Specifications</h2>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 tracking-tight">The Story Behind The Product</h3>
          <div className="prose prose-slate max-w-none">
            <div className="text-slate-600 leading-loose whitespace-pre-line text-base md:text-lg border-l-4 border-teal-500 pl-6 md:pl-8">
              <ProductDescription description={product.detailedDescription} />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM ACTION BAR (Sticky on Phone) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-6 flex items-center gap-3 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between bg-slate-100 p-1 rounded-2xl border border-slate-200 w-32 shrink-0">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center bg-white rounded-xl shadow-sm"><FaMinus size={8}/></button>
          <span className="font-black text-slate-800 text-sm">{quantity}</span>
          <button onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))} className="w-9 h-9 flex items-center justify-center bg-white rounded-xl shadow-sm"><FaPlus size={8}/></button>
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={maxStock <= 0}
          className="flex-1 bg-teal-600 text-white rounded-2xl py-4 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:bg-slate-300"
        >
          <FaShoppingCart size={14} />
          {maxStock <= 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}