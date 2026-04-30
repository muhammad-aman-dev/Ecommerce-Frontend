"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/store/slices/cartSlice";
import Image from "next/image";
import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaShoppingBag,
  FaSpinner,
  FaStore,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items } = useSelector((state) => state.cart);
  const { currency, exchangeRates } = useSelector((state) => state.currency);
  const { authUser } = useSelector((state) => state.auth);

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    phone: "",
    paymentMethod: "card",
  });

  useEffect(() => {
    if (authUser) {
      const nameParts = authUser.name ? authUser.name.split(" ") : ["", ""];
      setCheckoutData((prev) => ({
        ...prev,
        firstName: authUser.firstName || nameParts[0] || "",
        lastName: authUser.lastName || nameParts.slice(1).join(" ") || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
        address: authUser.address || "",
        city: authUser.city || "",
        country: authUser.country || "",
        postalCode: authUser.postalCode || "",
      }));
    }
  }, [authUser]);

  const groupedBySeller = useMemo(() => {
    return items.reduce((acc, item) => {
      if (!acc[item.seller]) acc[item.seller] = [];
      acc[item.seller].push(item);
      return acc;
    }, {});
  }, [items]);

  const convertPrice = (priceUSD) =>
    (priceUSD * (exchangeRates[currency] || 1)).toFixed(2);

  const itemsToPay = useMemo(
    () =>
      items.filter(
        (item) =>
          selectedItems[`${item.productId}-${JSON.stringify(item.variations)}`],
      ),
    [items, selectedItems],
  );

  const totalAmount = useMemo(
    () =>
      itemsToPay.reduce(
        (sum, i) =>
          sum + i.priceUSD * (exchangeRates[currency] || 1) * i.quantity,
        0,
      ),
    [itemsToPay, currency, exchangeRates],
  );

  const handleQuantityChange = (item, newQty) => {
    if (newQty < 1) return;
    if (newQty > item.stock)
      return toast.error(`Cannot exceed stock: ${item.stock}`);
    dispatch(
      updateQuantity({
        productId: item.productId,
        variations: item.variations,
        quantity: newQty,
        stock: item.stock,
      }),
    );
  };

  const handleRemove = (item) => {
    dispatch(
      removeFromCart({
        productId: item.productId,
        variations: item.variations,
      }),
    );
    const key = `${item.productId}-${JSON.stringify(item.variations)}`;
    setSelectedItems((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const handleSelectItem = (item) => {
    const key = `${item.productId}-${JSON.stringify(item.variations)}`;
    setSelectedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOpenCheckout = () => {
    if (!authUser && !checkoutData.email) {
      toast.info("Please provide your email to checkout.");
      return;
    }
    if (itemsToPay.length === 0) {
      toast.error("Select items to pay for.");
      return;
    }
    const totalUSD = itemsToPay.reduce(
      (sum, i) => sum + i.priceUSD * i.quantity,
      0,
    );
    if (totalUSD < 10) {
      toast.error("Minimum order amount $10 USD.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleFinalOrder = async (e) => {
    e.preventDefault();
    if (isProcessing) return;
    if (!checkoutData.email) {
      toast.error("Email is required for payment.");
      return;
    }

    const orderData = {
      items: itemsToPay,
      buyer: {
        ...checkoutData,
        fullName: `${checkoutData.firstName} ${checkoutData.lastName}`.trim(),
        userId: authUser?._id || null,
      },
      currency,
      exchangeRates,
      totalAmount,
      totalUSD: itemsToPay.reduce((sum, i) => sum + i.priceUSD * i.quantity, 0),
    };

    try {
      setIsProcessing(true);
      const { data } = await axiosInstance.post(
        "/payment/create-invoice",
        orderData,
      );
      if (data.paymentUrl) {
        toast.success("Redirecting to Safepay checkout...");
        itemsToPay.forEach((item) => handleRemove(item));
        setSelectedItems({});
        setIsModalOpen(false);
        window.location.href = data.paymentUrl;
      } else {
        toast.error(data.message || "Failed to initiate payment.");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-12 relative font-sans">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-row justify-between items-center mb-6 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Shopping Cart
          </h1>
          {items.length > 0 && (
            <button
              onClick={() => dispatch(clearCart())}
              className="text-red-500 hover:bg-red-50 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors font-medium text-sm md:text-base"
            >
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-8 md:p-12 text-center rounded-3xl shadow-sm border">
            <FaShoppingBag className="text-5xl md:text-6xl mx-auto mb-6 text-slate-200" />
            <h3 className="font-bold text-xl md:text-2xl text-slate-800">
              Your cart is empty
            </h3>
            <p className="text-slate-500 mt-2 text-sm md:text-base">
              Looks like you haven't added anything yet.
            </p>
            <Link
              href="/"
              className="mt-8 inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 md:px-10 md:py-4 rounded-full font-bold shadow-lg transition-all transform hover:-translate-y-1"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(groupedBySeller).map(([seller, sellerItems]) => (
                <div
                  key={seller}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                >
                  <div className="bg-slate-50/50 px-4 md:px-6 py-3 md:py-4 border-b flex items-center gap-3">
                    <div className="p-2 bg-teal-100 rounded-lg text-teal-700">
                      <FaStore size={16} />
                    </div>
                    <span className="font-bold text-slate-800 text-base md:text-lg">
                      {sellerItems[0]?.sellerName || "Merchant"}
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {sellerItems.map((item, idx) => {
                      const key = `${item.productId}-${JSON.stringify(item.variations)}`;
                      const isSelected = !!selectedItems[key];
                      return (
                        <div
                          key={idx}
                          className={`p-4 md:p-5 flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-4 transition-colors ${isSelected ? "bg-teal-50/30" : "hover:bg-slate-50/50"}`}
                        >
                          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectItem(item)}
                              className="w-5 h-5 accent-teal-600 cursor-pointer rounded border-slate-300 shrink-0"
                            />
                            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                              <Image
                                src={item.image}
                                fill
                                sizes="(max-width: 768px) 64px, (max-width: 1024px) 80px, 80px"
                                className="object-cover"
                                alt={item.name}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-slate-800 truncate text-base md:text-lg">
                                {item.name}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-teal-600 font-extrabold text-lg md:text-xl">
                                  {currency} {convertPrice(item.priceUSD)}
                                </span>
                                {item.variations && (
                                  <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase font-bold">
                                    Variations
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-4 mt-2 md:mt-0">
                            <div className="flex items-center bg-white border border-slate-200 rounded-xl shadow-sm p-1">
                              <button
                                onClick={() =>
                                  handleQuantityChange(item, item.quantity - 1)
                                }
                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                              >
                                <FaMinus size={10} />
                              </button>
                              <span className="px-3 font-bold text-slate-800 text-sm md:text-base">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(item, item.quantity + 1)
                                }
                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                              >
                                <FaPlus size={10} />
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemove(item)}
                              className="p-2 text-slate-300 hover:text-red-500 transition-colors shrink-0"
                            >
                              <FaTrash size={18} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:sticky lg:top-28 h-fit bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100">
              <h2 className="font-black text-xl md:text-2xl text-slate-900 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-500 text-base md:text-lg">
                  <span>Selected Items</span>
                  <span className="font-semibold text-slate-800">
                    {itemsToPay.length}
                  </span>
                </div>
                <div className="flex justify-between items-center font-black text-2xl md:text-3xl border-t border-slate-100 pt-6">
                  <span className="text-slate-900">Total</span>
                  <span className="text-teal-600">
                    {currency} {totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleOpenCheckout}
                disabled={itemsToPay.length === 0}
                className={`w-full py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg shadow-lg transition-all transform active:scale-95 ${
                  itemsToPay.length === 0
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-200"
                }`}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-slate-900/70 backdrop-blur-md p-0 md:p-4">
          <div className="bg-white w-full max-w-2xl rounded-t-4xl md:rounded-[2.5rem] shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 md:p-3 rounded-full bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all shadow-sm"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="p-6 md:p-12 overflow-y-auto">
              <div className="mb-6 md:mb-8">
                <h2 className="font-black text-2xl md:text-3xl text-slate-900">
                  Shipping Details
                </h2>
                <p className="text-slate-500 mt-2 text-sm md:text-base">
                  Complete your information to finalize the order.
                </p>
              </div>

              <form
                onSubmit={handleFinalOrder}
                className="space-y-4 md:space-y-5"
              >
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-2 text-teal-600 font-bold text-xs md:text-sm uppercase tracking-wider">
                    <FaUser size={12} /> Personal Information
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      required
                      value={checkoutData.firstName}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          firstName: e.target.value,
                        })
                      }
                      className="w-full md:w-1/2 p-3 md:p-4 rounded-2xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-sm md:text-base"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      required
                      value={checkoutData.lastName}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          lastName: e.target.value,
                        })
                      }
                      className="w-full md:w-1/2 p-3 md:p-4 rounded-2xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-sm md:text-base"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative w-full md:w-1/2">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        required
                        value={checkoutData.email}
                        onChange={(e) =>
                          setCheckoutData({
                            ...checkoutData,
                            email: e.target.value,
                          })
                        }
                        className="w-full p-3 md:p-4 pl-11 rounded-2xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-sm md:text-base"
                      />
                    </div>
                    <div className="relative w-full md:w-1/2">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 rotate-90" />
                      <input
                        type="text"
                        placeholder="Phone Number"
                        required
                        value={checkoutData.phone}
                        onChange={(e) =>
                          setCheckoutData({
                            ...checkoutData,
                            phone: e.target.value,
                          })
                        }
                        className="w-full p-3 md:p-4 pl-11 rounded-2xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-sm md:text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4 pt-2 md:pt-4">
                  <div className="flex items-center gap-2 text-teal-600 font-bold text-xs md:text-sm uppercase tracking-wider">
                    <FaMapMarkerAlt size={12} /> Delivery Address
                  </div>
                  <input
                    type="text"
                    placeholder="Street Address"
                    required
                    value={checkoutData.address}
                    onChange={(e) =>
                      setCheckoutData({
                        ...checkoutData,
                        address: e.target.value,
                      })
                    }
                    className="w-full p-3 md:p-4 rounded-2xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-sm md:text-base"
                  />

                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      required
                      value={checkoutData.city}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          city: e.target.value,
                        })
                      }
                      className="w-full md:w-1/2 p-3 md:p-4 rounded-2xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-sm md:text-base"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      required
                      value={checkoutData.country}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          country: e.target.value,
                        })
                      }
                      className="w-full md:w-1/2 p-3 md:p-4 rounded-2xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-sm md:text-base"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="ZIP Code"
                    required
                    value={checkoutData.postalCode}
                    onChange={(e) =>
                      setCheckoutData({
                        ...checkoutData,
                        postalCode: e.target.value,
                      })
                    }
                    className="w-full md:w-1/3 p-3 md:p-4 rounded-2xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-sm md:text-base"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-4 md:py-5 rounded-3xl font-black text-lg md:text-xl shadow-xl transition-all mt-4 md:mt-6 transform active:scale-95 flex items-center justify-center gap-3 ${
                    isProcessing
                      ? "bg-slate-400 cursor-not-allowed shadow-none"
                      : "bg-teal-600 text-white shadow-teal-200 hover:bg-teal-700"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <FaSpinner className="animate-spin" /> Processing...
                    </>
                  ) : (
                    `Confirm & Pay ${currency} ${totalAmount.toFixed(2)}`
                  )}
                </button>
                <p className="text-center text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-widest">
                  Secure Checkout Powered by Safepay
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
