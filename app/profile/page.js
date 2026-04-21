"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { 
  FaBox, FaClock, FaUser, FaUpload, 
  FaLock, FaCheckCircle, FaUndoAlt, FaCalendarAlt,
  FaEnvelope, FaIdBadge, FaSpinner, FaInfoCircle, FaStar
} from "react-icons/fa";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";
import Swal from "sweetalert2";

const ProfilePage = () => {
  const fileInputRef = useRef(null);
  const { authUser } = useSelector((state) => state.auth);
  const { currency: currentCurrency, exchangeRates } = useSelector((state) => state.currency);
  
  const [activeTab, setActiveTab] = useState("all-orders");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Avatar States
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(authUser?.dp || "/default-avatar.png");
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  // Password States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Rating Modal States
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [rating, setRating] = useState(5);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  useEffect(() => {
    if (authUser) {
      setPreviewUrl(authUser.dp || "/default-avatar.png");
      fetchOrders();
    }
  }, [authUser]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/auth/my-orders");
      if (response.data.success) {
        // Sort by date descending (Newest first)
        const sorted = response.data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sorted);
      }
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const isRefundEligible = (statusDate) => {
    if (!statusDate) return false;
    const receivedDate = new Date(statusDate);
    const today = new Date();
    const diffDays = Math.ceil(Math.abs(today - receivedDate) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  // --- HANDLERS ---
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressedFile = await imageCompression(file, { maxSizeMB: 0.3, maxWidthOrHeight: 1024 });
      setSelectedFile(compressedFile);
      setPreviewUrl(URL.createObjectURL(compressedFile));
    } catch (error) { toast.error("Compression failed"); }
  };

  const handleUpdateAvatar = async () => {
    if (!selectedFile) return;
    setIsUpdatingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", selectedFile);
    try {
      const { data } = await axiosInstance.put("/auth/update-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        toast.success("Avatar Updated Successfully");
        setSelectedFile(null);
      }
    } catch (error) { toast.error("Upload failed"); } 
    finally { setIsUpdatingAvatar(false); }
  };

  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();
    if (!newPassword || !confirmPassword) return toast.error("Fill all fields");
    if (newPassword !== confirmPassword) return toast.error("Passwords match error");
    if (newPassword.length < 8) return toast.error("Too short (min 8)");

    setIsChangingPassword(true);
    try {
      const { data } = await axiosInstance.post("/auth/change-user-password", { password: newPassword });
      if (data.success) {
        toast.success("Password Updated!");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleOpenRatingModal = (id) => {
    setSelectedOrderId(id);
    setRating(5); 
    setShowRatingModal(true);
  };

  const handleConfirmReceipt = async () => {
    setIsSubmittingRating(true);
    try {
      const { data } = await axiosInstance.patch(`/auth/update-status/${selectedOrderId}`, { 
        buyerStatus: "received",
        rating: rating 
      });
      if (data.success) { 
        toast.success("Order Received & Rated!"); 
        setShowRatingModal(false);
        fetchOrders(); 
      }
    } catch (error) { 
        toast.error("Failed to update status"); 
    } finally {
        setIsSubmittingRating(false);
    }
  };

 const handleRequestRefund = async (orderId) => {
  const { value: formValues } = await Swal.fire({
    title: "Request Refund",
    html: `
      <div class="text-left">
        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Select Reason</label>
        <select id="swal-reason" class="swal2-input rounded-xl! text-sm! mt-1! mb-4! border-slate-200! focus:border-rose-500! focus:ring-0!">
          <option value="Item not as described">Item not as described</option>
          <option value="Damaged product">Damaged product</option>
          <option value="Missing parts">Missing parts</option>
          <option value="Late delivery">Late delivery</option>
          <option value="Other">Other</option>
        </select>
        
        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Explanation</label>
        <textarea id="swal-message" class="swal2-textarea rounded-xl! text-sm! mt-1! border-slate-200! focus:border-rose-500! focus:ring-0!" placeholder="Please provide details about the issue..."></textarea>
      </div>
    `,
    showCancelButton: true,
    confirmButtonColor: "#e11d48", // rose-600
    cancelButtonColor: "#64748b", // slate-500
    confirmButtonText: "Submit Request",
    customClass: {
      popup: 'rounded-[2rem] font-sans px-4 py-6',
      confirmButton: 'rounded-xl font-bold uppercase tracking-widest text-[10px] px-8 py-3',
      cancelButton: 'rounded-xl font-bold uppercase tracking-widest text-[10px] px-8 py-3'
    },
    preConfirm: () => {
      const reason = document.getElementById('swal-reason').value;
      const message = document.getElementById('swal-message').value;
      if (!message) {
        Swal.showValidationMessage('Please provide an explanation');
        return false;
      }
      return { reason, message };
    }
  });

  if (formValues) {
    try {
      const { data } = await axiosInstance.patch(`/auth/request-refund/${orderId}`, {
        reason: formValues.reason,
        message: formValues.message
      });

      if (data.success) {
        Swal.fire({
          title: "Requested!",
          text: "Admin will review your request shortly.",
          icon: "success",
          confirmButtonColor: "#0d9488", // teal-600
          customClass: { 
            popup: 'rounded-[2rem]',
            confirmButton: 'rounded-xl font-bold uppercase tracking-widest text-[10px] px-8 py-3',
          }
        });
        fetchOrders(); // Refresh status in UI
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Refund request failed");
    }
  }
};

  // --- IMPROVED FILTERING LOGIC ---
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "pending") {
      // Show only orders where buyer hasn't marked 'received' AND seller hasn't rejected
      const isRejected = order.sellerStatus === "cancelled" || order.sellerStatus === "rejected";
      return order.buyerStatus === "pending" && !isRejected;
    }
    // "all-orders" returns everything
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 pt-6 md:pt-10 px-4 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* SIDEBAR */}
        <div className="lg:col-span-3 space-y-4 md:space-y-6">
          <div className="bg-white rounded-4xl md:rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-slate-100 text-center">
            <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-4 group">
              <Image 
                src={previewUrl} 
                alt="User" 
                fill 
                sizes="(max-width: 768px) 96px, 112px"
                className="rounded-full object-cover border-4 border-slate-50 shadow-md transition-transform group-hover:scale-105" 
              />
            </div>
            <h2 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tighter truncate">
              {authUser?.name}
            </h2>
            <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mt-1">
              Verified User
            </p>
          </div>

          <nav className="bg-white rounded-2xl md:rounded-3xl p-1.5 shadow-sm border border-slate-100 flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar">
            {[
              { id: "all-orders", label: "History", icon: <FaBox /> }, 
              { id: "pending", label: "Pending", icon: <FaClock /> }, 
              { id: "settings", label: "Security", icon: <FaUser /> }
            ].map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`flex-1 lg:w-full flex items-center justify-center lg:justify-start gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all whitespace-nowrap ${
                  activeTab === tab.id ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                {tab.icon} <span className="inline-block">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* MAIN AREA */}
        <div className="lg:col-span-9 min-h-[60vh]">
          <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 shadow-sm border border-slate-100 h-full flex flex-col">
            
            {activeTab === "settings" ? (
              <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase">Security & Account</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-slate-50 p-5 md:p-6 rounded-3xl border border-slate-100 transition-hover hover:border-slate-200">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><FaIdBadge/> Full Name</p>
                    <p className="text-sm md:text-md font-bold text-slate-700">{authUser?.name}</p>
                  </div>
                  <div className="bg-slate-50 p-5 md:p-6 rounded-3xl border border-slate-100 transition-hover hover:border-slate-200">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><FaEnvelope/> Email Address</p>
                    <p className="text-sm md:text-md font-bold text-slate-700 break-all">{authUser?.email}</p>
                  </div>
                </div>

                <section className="bg-teal-50/30 p-6 md:p-8 rounded-4xl md:rounded-[2.5rem] border border-teal-100/50">
                  <h4 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] mb-6 text-teal-700">Update Profile Avatar</h4>
                  <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0">
                       <Image src={previewUrl} fill alt="preview" className="rounded-2xl object-cover border-2 border-white shadow-lg" />
                    </div>
                    <div className="space-y-3 w-full">
                      <button
  onClick={() => fileInputRef.current.click()}
  className="w-full bg-white text-slate-800 border-2 border-dashed border-slate-200 py-3 md:py-4 rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:border-teal-500 transition-all px-4"
>
  <span className="block w-full overflow-hidden whitespace-nowrap text-ellipsis">
    {selectedFile
      ? selectedFile.name.length > 25
        ? selectedFile.name.slice(0, 25) + "..."
        : selectedFile.name
      : "Select New Image"}
  </span>
</button>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                      {selectedFile && (
                        <button onClick={handleUpdateAvatar} disabled={isUpdatingAvatar} className="w-full bg-teal-600 text-white py-3 md:py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-700 shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                          {isUpdatingAvatar ? <FaSpinner className="animate-spin" /> : <FaUpload />} Save Avatar
                        </button>
                      )}
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h4 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Security Credentials</h4>
                  <div className="grid gap-3 md:gap-4">
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Secure Password" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-500 transition-all outline-none" />
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Secure Password" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-500 transition-all outline-none" />
                  </div>
                  <button 
                    onClick={handleChangePassword} 
                    disabled={isChangingPassword}
                    className="w-full bg-slate-900 text-white py-4 md:py-5 rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-widest hover:bg-teal-600 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isChangingPassword ? <FaSpinner className="animate-spin" /> : <FaLock />} Update Password
                  </button>
                </section>
              </div>
            ) : (
              <div className="flex flex-col h-full overflow-hidden">
                <div className="shrink-0">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase">
                    {activeTab === "pending" ? "Pending Orders" : "Recent Orders"}
                  </h3>
                  
                  {/* REFUND NOTICE BANNER */}
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8 flex items-start gap-3">
                    <FaInfoCircle className="text-amber-500 shrink-0 mt-1 md:mt-0.5" />
                    <p className="text-[10px] md:text-[11px] font-bold text-amber-800 leading-relaxed uppercase tracking-wider">
                      Note: If the seller rejects your order for any reason, the Admin will refund your amount to your original payment method within a few working days.
                    </p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 md:pr-4 custom-scrollbar space-y-4 md:space-y-6">
                  {isLoading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-40 md:h-48 bg-slate-50 animate-pulse rounded-[4xl] md:rounded-[2.5rem]" />)
                  ) : filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => {
                      const rate = exchangeRates[currentCurrency] || 1;
                      const canRefund = order.buyerStatus === "received" && isRefundEligible(order.buyerStatusUpdateDate);
                      
                      const isRejected = order.sellerStatus === "cancelled" || order.sellerStatus === "rejected";
                      const formattedDate = new Intl.DateTimeFormat('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }).format(new Date(order.createdAt));

                      return (
                        <div key={order._id} className="group border border-slate-100 rounded-[4xl] md:rounded-[2.5rem] p-5 md:p-8 bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                            <span className="text-[9px] md:text-[10px] font-black text-slate-400 bg-slate-50 px-3 md:px-4 py-1.5 rounded-full border border-slate-100 uppercase tracking-widest">#{order.orderId}</span>
                            <span className="flex items-center gap-1.5 text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                <FaCalendarAlt className="text-slate-300" /> {formattedDate}
                              </span>
                            <div className="flex gap-2 flex-wrap">
                              {/* SELLER STATUS BADGE */}
                              <span className={`px-3 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest ${
                                isRejected ? 'bg-rose-50 text-rose-600' : 
                                order.sellerStatus === 'shipped' || order.sellerStatus === 'delivered' ? 'bg-teal-50 text-teal-600' : 'bg-orange-50 text-orange-600'
                              }`}>
                                Seller: {isRejected ? "Rejected" : order.sellerStatus}
                              </span>
                              
                              {/* BUYER STATUS BADGE */}
                              <span className={`px-3 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest ${order.buyerStatus === 'received' ? 'bg-teal-50 text-teal-600' : 'bg-orange-50 text-orange-600 animate-pulse'}`}>
                                {order.buyerStatus}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-3 mb-6 md:mb-8">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-start md:items-center gap-4">
                                <p className="text-[13px] md:text-sm font-bold text-slate-700 leading-tight">
                                  <span className="text-teal-600 font-black mr-2">x{item.quantity}</span> {item.name || item.productId?.name}
                                </p>
                                <p className="text-[13px] md:text-sm font-black text-slate-900 whitespace-nowrap">{currentCurrency} {(item.priceUSD * rate).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-6 border-t border-slate-100 gap-6">
                            <div className="grid grid-cols-2 md:block md:space-y-1 w-full md:w-auto">
                              <div>
                                <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Final Amount</p>
                                <p className="text-lg md:text-2xl font-black text-slate-900">USD {order.totalAmountUSD.toFixed(2)}</p>
                              </div>
                              <div className="text-right md:text-left">
                                <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Paid Total</p>
                                <p className="text-lg md:text-2xl font-black text-slate-900">{order.currency} {order.totalAmountLocal.toFixed(2)}</p>
                              </div>
                            </div>
                            {/* REFUND STATUS BADGE */}
{order.refundStatus && order.refundStatus !== "none" && (
  <span className={`px-3 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest ${
    order.refundStatus === 'requested' ? 'bg-blue-50 text-blue-600' : 
    order.refundStatus === 'approved' ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'
  }`}>
    Refund: {order.refundStatus}
  </span>
)}
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                              {order.buyerStatus === "pending" && !isRejected && (
                                <button onClick={() => handleOpenRatingModal(order._id)} className="flex-1 bg-teal-600 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all">
                                  Mark Received
                                </button>
                              )}
                              {canRefund && order.refundStatus === "none" && (
  <button 
    onClick={() => handleRequestRefund(order._id)}
    className="flex-1 bg-white text-rose-500 border-2 border-rose-100 px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-rose-50 flex items-center justify-center gap-2 transition-all"
  >
    <FaUndoAlt size={10} /> Request Refund
  </button>
)}

{/* Displaying state if already requested */}
{order.refundStatus === "requested" && (
  <div className="flex-1 text-center py-3.5 border-2 border-dashed border-blue-100 rounded-xl md:rounded-2xl">
     <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Refund Processing...</p>
  </div>
)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-20 md:py-32 text-center border-4 border-dashed border-slate-50 rounded-[2.5rem] md:rounded-[3rem]">
                      <p className="font-black text-slate-300 text-[10px] md:text-[11px] uppercase tracking-[0.4em]">Empty Vault</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RATING MODAL OVERLAY */}
      {showRatingModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-2 rotate-3">
                <FaCheckCircle size={32} />
              </div>
              
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Rate Experience</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">Help the community by rating this seller</p>
              </div>

              {/* STAR SELECTION */}
              <div className="flex justify-center gap-3 md:gap-4 py-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setRating(star)}
                    onClick={() => setRating(star)}
                    className={`text-3xl md:text-4xl transition-all duration-300 transform hover:scale-125 ${
                      star <= rating ? "text-amber-400 drop-shadow-md" : "text-slate-200"
                    }`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button 
                  onClick={handleConfirmReceipt}
                  disabled={isSubmittingRating}
                  className="w-full bg-slate-900 text-white py-4 md:py-5 rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] hover:bg-teal-600 transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  {isSubmittingRating ? <FaSpinner className="animate-spin" /> : "Confirm & Submit"}
                </button>
                <button 
                  onClick={() => setShowRatingModal(false)}
                  className="w-full bg-transparent text-slate-400 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest hover:text-slate-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;