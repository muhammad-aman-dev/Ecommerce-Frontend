'use client'

import { 
  FaGavel, FaUserShield, FaStore, FaBoxOpen, 
  FaCreditCard, FaTruck, FaExclamationTriangle, FaHistory, FaShieldAlt 
} from "react-icons/fa"

const TermsPage = () => {
  const sections = [
    { id: "intro", title: "1. Introduction", icon: <FaGavel /> },
    { id: "accounts", title: "2. User Accounts", icon: <FaUserShield /> },
    { id: "seller-accounts", title: "3. Seller Accounts", icon: <FaStore /> },
    { id: "listings", title: "4. Product Listings", icon: <FaBoxOpen /> },
    { id: "orders", title: "5. Orders & Transactions", icon: <FaCreditCard /> },
    { id: "payouts", title: "6. Seller Payouts", icon: <FaCreditCard /> },
    { id: "delivery", title: "7. Delivery Responsibility", icon: <FaTruck /> },
    { id: "suspension", title: "8. Account Suspension", icon: <FaExclamationTriangle /> },
    { id: "liability", title: "9. Limitation of Liability", icon: <FaShieldAlt /> },
    { id: "changes", title: "10. Changes to Terms", icon: <FaHistory /> },
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
        <div className="mb-20 text-center lg:text-left">
          <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.4em] mb-4 block">Legal Framework</span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
            Terms & <span className="text-teal-500">Conditions.</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest bg-slate-100 inline-block px-4 py-2 rounded-full">Effective March 2026</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:w-1/4 hidden lg:block">
            <div className="sticky top-24 space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 ml-4">Table of Contents</p>
              {sections.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-left text-xs font-black text-slate-500 hover:bg-slate-50 hover:text-teal-600 transition-all group uppercase tracking-widest"
                >
                  <span className="text-slate-300 group-hover:text-teal-500 transition-colors">{item.icon}</span>
                  {item.title}
                </button>
              ))}
            </div>
          </aside>

          {/* Content Area */}
          <div className="lg:w-3/4 space-y-24 pb-40 border-l border-slate-50 lg:pl-16">
            
            {/* 1. Introduction */}
            <section id="intro">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">01. Introduction</h2>
              <div className="text-slate-600 font-medium leading-relaxed space-y-6">
                <p>Welcome to our marketplace platform. By accessing or using our website, you agree to comply with and be bound by these Terms and Conditions.</p>
                <p className="bg-teal-50 border-l-4 border-teal-500 p-6 text-teal-900 rounded-r-2xl italic">
                  "This platform allows independent sellers to list and sell products directly to buyers."
                </p>
              </div>
            </section>

            {/* 2. User Accounts */}
            <section id="accounts">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">02. User Accounts</h2>
              <p className="text-slate-600 font-medium mb-8 uppercase text-xs tracking-widest">Users must create an account to place orders or sell products.</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-4">
                  <p className="font-black text-slate-900 text-sm uppercase tracking-widest">Your Commitments:</p>
                  <ul className="space-y-3 text-sm text-slate-500 font-bold">
                    <li className="flex gap-2">✓ Provide accurate information</li>
                    <li className="flex gap-2">✓ Keep login credentials secure</li>
                    <li className="flex gap-2">✓ Not share accounts with others</li>
                  </ul>
                </div>
                <div className="p-8 bg-slate-900 rounded-[2.5rem] flex flex-col justify-center">
                   <p className="text-teal-400 font-black text-[10px] uppercase tracking-widest mb-2">Security Note</p>
                   <p className="text-white text-sm leading-loose">Passwords are securely stored using <strong>advanced hashing technologies</strong> to protect user data from unauthorized access.</p>
                </div>
              </div>
            </section>

            {/* 3. Seller Accounts */}
            <section id="seller-accounts">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">03. Seller Accounts</h2>
              <div className="space-y-6 text-slate-600 font-medium">
                <p>To sell on the marketplace, sellers must register a dedicated seller account and submit valid identification documents.</p>
                <div className="border-2 border-dashed border-slate-200 p-8 rounded-[3rem] text-center">
                  <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Verification Status</p>
                  <p className="mt-2 text-slate-900 font-black italic">"The platform administrators may approve or reject seller applications at their discretion."</p>
                </div>
              </div>
            </section>

            {/* 4. Product Listings */}
            <section id="listings">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">04. Product Listings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="font-black text-slate-900 text-xs uppercase tracking-widest">Seller Responsibility</p>
                  <ul className="space-y-3 text-slate-500 font-bold text-sm">
                    <li>• Accurate product descriptions</li>
                    <li>• High product quality standards</li>
                    <li>• Pricing and tax accuracy</li>
                    <li>• Full legal compliance</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 flex items-center">
                   <p className="text-red-600 text-sm font-black italic">"Prohibited products may be removed without notice."</p>
                </div>
              </div>
            </section>

            {/* 5 & 6. Transactions and Payouts */}
            <section id="payouts">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">05 & 06. Transactions & Payouts</h2>
              <div className="bg-slate-50 rounded-[3rem] p-10 space-y-8">
                <div className="flex flex-col md:flex-row gap-10">
                  <div className="flex-1">
                    <p className="font-black text-teal-600 text-xs uppercase tracking-widest mb-4">The Payout Flow</p>
                    <p className="text-slate-600 text-sm leading-loose">Seller earnings are released <strong>only after</strong> the buyer confirms delivery and no dispute is opened. All payouts are processed <strong>manually</strong> by administrators.</p>
                  </div>
                  <div className="flex-1 bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50">
                    <p className="font-black text-slate-900 text-[10px] uppercase mb-3">Processing Window</p>
                    <p className="text-slate-400 text-xs font-medium italic">"Processing times may vary depending on banking cycles and manual audits."</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. Delivery */}
            <section id="delivery">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">07. Delivery Responsibility</h2>
              <div className="p-8 border border-slate-100 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-slate-600 font-medium text-sm space-y-2">
                  <p>✓ Shipping the product</p>
                  <p>✓ Providing tracking if available</p>
                  <p>✓ Handling delivery issues</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Disclaimer</p>
                  <p className="text-slate-900 font-black text-sm italic">"The marketplace does not control seller delivery services."</p>
                </div>
              </div>
            </section>

            {/* 8, 9, 10. Final Sections */}
            <div className="grid md:grid-cols-2 gap-10">
              <section id="suspension" className="bg-slate-50 p-8 rounded-[3rem]">
                <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tighter">08. Account Suspension</h3>
                <p className="text-xs text-slate-500 font-bold leading-relaxed italic">"Fraud, fake products, misuse, or policy violations lead to immediate suspension."</p>
              </section>
              <section id="liability" className="bg-teal-50 p-8 rounded-[3rem]">
                <h3 className="text-xl font-black text-teal-900 mb-4 tracking-tighter">09. Limitation of Liability</h3>
                <p className="text-xs text-teal-700 font-bold leading-relaxed">"We are not responsible for product quality, delivery delays, or seller misconduct."</p>
              </section>
            </div>

            <section id="changes" className="pt-20 text-center">
              <h2 className="text-2xl font-black text-slate-900 mb-4">10. Changes to Terms</h2>
              <p className="text-slate-500 text-sm font-medium">We may update these terms at any time. Continued use of the platform means you accept the updated terms.</p>
              <div className="mt-12 pt-12 border-t border-slate-100 flex justify-center gap-10">
                 <button onClick={() => window.print()} className="text-[10px] font-black text-slate-400 hover:text-teal-600 uppercase tracking-widest">Print Terms</button>
                 <button className="text-[10px] font-black text-slate-400 hover:text-teal-600 uppercase tracking-widest">Download PDF</button>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage