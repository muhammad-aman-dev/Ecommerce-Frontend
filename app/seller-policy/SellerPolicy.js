'use client'

import { 
  FaUserEdit, FaIdCard, FaClipboardCheck, FaTruckLoading, 
  FaBox, FaWallet, FaBan, FaShieldAlt 
} from "react-icons/fa"

const SellerPolicy = () => {
  const sections = [
    { id: "registration", title: "1. Registration", icon: <FaUserEdit /> },
    { id: "verification", title: "2. Verification", icon: <FaIdCard /> },
    { id: "listings", title: "3. Product Rules", icon: <FaClipboardCheck /> },
    { id: "shipping", title: "4. Shipping", icon: <FaTruckLoading /> },
    { id: "fulfillment", title: "5. Fulfillment", icon: <FaBox /> },
    { id: "payments", title: "6. Payments", icon: <FaWallet /> },
    { id: "violations", title: "7. Violations", icon: <FaBan /> },
  ]

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-20">
          <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.4em] mb-4 block">Merchant Guidelines</span>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">
            Seller <span className="text-teal-500">Policy.</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest bg-slate-100 inline-block px-4 py-2 rounded-full">Version 1.0 • March 2026</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Sidebar */}
          <aside className="lg:w-1/4 hidden lg:block">
            <div className="sticky top-24 space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 ml-4">Merchant Navigation</p>
              {sections.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-left text-xs font-black text-slate-500 hover:bg-slate-50 hover:text-teal-600 transition-all group uppercase tracking-widest"
                >
                  <span className="text-slate-300 group-hover:text-teal-500">{item.icon}</span>
                  {item.title}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:w-3/4 space-y-24 pb-40 lg:pl-16 border-l border-slate-50">
            
            {/* 1 & 2. Registration and Verification */}
            <section id="registration">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">01 & 02. Registration & Verification</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-4">
                  <p className="font-black text-slate-900 text-xs uppercase tracking-widest">Entry Requirements</p>
                  <ul className="space-y-3 text-sm text-slate-500 font-bold">
                    <li>• Creation of a dedicated Seller Account</li>
                    <li>• Submission of valid Government-issued ID</li>
                    <li>• Business tax information (if applicable)</li>
                  </ul>
                </div>
                <div className="p-8 bg-teal-900 rounded-[2.5rem] text-white relative overflow-hidden">
                  <FaShieldAlt className="absolute -right-4 -bottom-4 text-white/10 size-32" />
                  <p className="text-teal-400 font-black text-[10px] uppercase tracking-widest mb-4">Admin Audit</p>
                  <p className="text-sm leading-relaxed opacity-90">
                    Our administrators manually review all documents. Incomplete or suspicious applications will be rejected to ensure platform integrity.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Product Listing Rules */}
            <section id="listings">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">03. Product Listing Rules</h2>
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white">
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { t: "Authenticity", d: "Products must be 100% genuine brands." },
                    { t: "Accuracy", d: "Descriptions must match the item exactly." },
                    { t: "Visuals", d: "Images must represent the actual product." }
                  ].map((rule, i) => (
                    <div key={i} className="space-y-2">
                      <p className="text-teal-400 font-black text-[10px] uppercase tracking-widest">{rule.t}</p>
                      <p className="text-sm font-medium opacity-80">{rule.d}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-10 pt-10 border-t border-white/10 text-center text-xs text-slate-400 italic">
                  "Fake or illegal items are strictly prohibited and will be removed without notice."
                </p>
              </div>
            </section>

            {/* 4 & 5. Shipping & Fulfillment */}
            <section id="shipping">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">04 & 05. Shipping & Fulfillment</h2>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Sellers manage their own logistics. You are responsible for packaging quality and choosing reliable delivery partners to ensure items reach buyers safely.
                  </p>
                  <div className="flex gap-4">
                    <span className="bg-slate-100 px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">Self-Shipping</span>
                    <span className="bg-slate-100 px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">Tracking Required</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <p className="font-black text-slate-900 text-xs uppercase tracking-widest mb-4">The Workflow</p>
                  <ol className="space-y-4 text-sm text-slate-500 font-bold list-decimal pl-4">
                    <li>Prepare the product immediately after payment notification.</li>
                    <li>Ship via a trusted courier service.</li>
                    <li>Upload valid tracking data to the Tradexon Dashboard.</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* 6. Seller Payments */}
            <section id="payments">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">06. Seller Payments</h2>
              <div className="bg-teal-50 p-10 rounded-[3rem] border border-teal-100 flex flex-col md:flex-row items-center gap-10">
                <div className="w-16 h-16 bg-teal-600 rounded-3xl flex items-center justify-center text-white text-2xl shadow-lg shadow-teal-200">
                  <FaWallet />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <p className="text-teal-900 font-black text-xl mb-2">Manual Payout Approval</p>
                  <p className="text-teal-700 text-sm font-medium leading-relaxed">
                    Payments are released once the buyer confirms receipt. Our team manually processes every transaction to guarantee safety for both parties.
                  </p>
                </div>
              </div>
            </section>

            {/* 7. Violations */}
            <section id="violations">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">07. Violations & Penalties</h2>
              <div className="bg-red-50 p-10 rounded-[3rem] border border-red-100">
                <div className="flex items-center gap-4 mb-8">
                  <FaBan className="text-red-500 size-6" />
                  <p className="text-red-900 font-black text-lg">Zero Tolerance Policy</p>
                </div>
                <div className="grid sm:grid-cols-3 gap-6">
                  {[
                    "Counterfeit Goods",
                    "Non-Shipment",
                    "Fraudulent Activity"
                  ].map((v, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl text-center shadow-sm border border-red-100">
                      <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">{v}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-8 text-center text-red-700 font-bold text-xs uppercase tracking-[0.2em]">
                  Consequence: Immediate Account Suspension
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerPolicy