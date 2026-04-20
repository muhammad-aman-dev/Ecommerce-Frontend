'use client'

import { 
  FaRocket, 
  FaChartBar, 
  FaGlobe, 
  FaShieldAlt, 
  FaUserPlus, 
  FaBoxOpen, 
  FaCreditCard,
  FaFileAlt // Added for the policy icon
} from "react-icons/fa"
import Link from "next/link"

const BecomeSellerPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative py-24 px-6 overflow-hidden border-b border-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="bg-teal-50 text-teal-600 text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.4em] mb-8">
            Partner with Tradexon
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[1.1]">
            Scale your brand to <br />
            <span className="text-teal-500">global heights.</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl font-medium leading-relaxed mb-10">
            Join the most exclusive community of merchants. We provide the tools, 
            the audience, and the technology. You provide the vision.
          </p>
          <Link 
            href="/seller/signup" 
            className="bg-slate-900 text-white px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/20 hover:bg-teal-600 transition-all hover:-translate-y-1"
          >
            Start Selling Today
          </Link>
        </div>
        
        {/* Subtle Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-200 h-200 bg-teal-50/50 rounded-full blur-[120px]" />
      </section>

      {/* 2. THE PROCESS (Visual Steps) */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-20">
            {[
              { 
                icon: <FaUserPlus />, 
                title: "Register", 
                desc: "Create your merchant account and verify your identity in minutes." 
              },
              { 
                icon: <FaBoxOpen />, 
                title: "Upload Items", 
                desc: "Use our bulk upload tools or easy UI to list your premium inventory." 
              },
              { 
                icon: <FaCreditCard />, 
                title: "Get Paid", 
                desc: "Receive automated payouts directly to your bank every 14 days." 
              }
            ].map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-teal-600 text-2xl shadow-xl shadow-slate-200 mb-8 group-hover:bg-teal-600 group-hover:text-white transition-all duration-500">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{step.title}</h3>
                <p className="text-slate-500 font-medium leading-loose text-sm">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* ADDED: POLICY LINK BAR */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <FaFileAlt size={14} />
               </div>
               <div>
                  <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Transparency is our Priority</p>
                  <p className="text-[10px] text-slate-400 font-bold">Review our fulfillment and payout rules before you start.</p>
               </div>
            </div>
            <Link 
              href="/seller-policy" 
              className="text-teal-600 font-black text-[10px] uppercase tracking-widest hover:bg-teal-50 px-6 py-3 rounded-xl transition-all border border-teal-100"
            >
              Read Seller Policy →
            </Link>
          </div>
        </div>
      </section>

      {/* 3. BENEFITS GRID */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-8">
                Why the world's best sellers <br />
                <span className="text-teal-600 italic font-serif">choose us.</span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { icon: <FaGlobe />, label: "Global Reach", sub: "Millions of active users" },
                  { icon: <FaChartBar />, label: "Analytics", sub: "Deep sales insights" },
                  { icon: <FaShieldAlt />, label: "Protection", sub: "Fraud-prevention tools" },
                  { icon: <FaRocket />, label: "No Limits", sub: "Unlimited listings" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="text-teal-500 mt-1">{item.icon}</div>
                    <div>
                      <p className="font-black text-slate-900 text-sm uppercase tracking-widest">{item.label}</p>
                      <p className="text-slate-500 text-xs font-bold">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Callout Card */}
            <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <span className="text-teal-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Merchant Stats</span>
                <p className="text-4xl font-black mb-2">15.4%</p>
                <p className="text-slate-400 text-sm font-bold mb-8 uppercase tracking-widest">Average Sales Increase</p>
                <div className="w-full h-2 bg-slate-800 rounded-full mb-12">
                   <div className="w-[75%] h-full bg-teal-500 rounded-full" />
                </div>
                <p className="italic text-slate-300 text-lg leading-relaxed">
                  "Tradexon didn't just give us a storefront; they gave us a sophisticated ecosystem to manage our entire operation."
                </p>
                <p className="mt-6 font-black text-teal-400 text-sm">— Artisan Tech Co.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FINAL CALL TO ACTION */}
      <section className="py-24 px-6 bg-slate-50 text-center">
         <div className="max-w-3xl mx-auto bg-white p-12 md:p-20 rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-8">Ready to grow?</h2>
            <p className="text-slate-500 font-bold mb-10 text-lg italic">The next big merchant on Tradexon could be you.</p>
            <Link 
              href="/seller/signup" 
              className="inline-block bg-teal-600 text-white px-16 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-teal-600/20 hover:scale-105 transition-all mb-8"
            >
              Apply to Sell
            </Link>
            
            {/* ADDED: FINAL DISCREET LINK */}
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              By applying, you agree to our <Link href="/seller-policy" className="text-teal-600 hover:underline">Seller Policy</Link> and <Link href="/terms-and-conditions" className="text-teal-600 hover:underline">Terms</Link>.
            </p>
         </div>
      </section>
    </div>
  )
}

export default BecomeSellerPage