'use client'

import { 
  FaUserShield, FaLock, FaIdCard, FaDatabase, 
  FaShareAlt, FaUserEdit, FaCookieBite, FaShieldAlt 
} from "react-icons/fa"

const PrivacyPolicy = () => {
  const sections = [
    { id: "collection", title: "1. Information Collection", icon: <FaDatabase /> },
    { id: "security", title: "2. Password Security", icon: <FaLock /> },
    { id: "verification", title: "3. Seller Identity", icon: <FaIdCard /> },
    { id: "usage", title: "4. Data Usage", icon: <FaUserShield /> },
    { id: "sharing", title: "6. Data Sharing", icon: <FaShareAlt /> },
    { id: "rights", title: "7. Your Rights", icon: <FaUserEdit /> },
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
        
        {/* Header Section */}
        <div className="mb-20">
          <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.4em] mb-4 block">Data Protection</span>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">
            Privacy <span className="text-teal-500">Policy.</span>
          </h1>
          <div className="flex items-center gap-6">
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Version 2.1 • March 2026</p>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Sidebar Nav */}
          <aside className="lg:w-1/4 hidden lg:block">
            <div className="sticky top-24 space-y-1">
              {sections.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-left text-xs font-black text-slate-500 hover:bg-teal-50 hover:text-teal-600 transition-all group uppercase tracking-widest"
                >
                  <span className="text-slate-300 group-hover:text-teal-500">{item.icon}</span>
                  {item.title}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:w-3/4 space-y-24 pb-40 lg:pl-16 border-l border-slate-50">
            
            {/* 1. Information We Collect */}
            <section id="collection">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">01. Information We Collect</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-50 rounded-[2.5rem]">
                  <p className="font-black text-slate-900 text-xs uppercase tracking-widest mb-6">User & Technical Data</p>
                  <ul className="space-y-4 text-sm text-slate-600 font-bold">
                    <li className="flex items-center gap-3"><FaUserShield className="text-teal-500" /> Full Name & Email</li>
                    <li className="flex items-center gap-3"><FaUserShield className="text-teal-500" /> Phone & Credentials</li>
                    <li className="flex items-center gap-3"><FaCookieBite className="text-teal-500" /> IP & Browser Type</li>
                  </ul>
                </div>
                <div className="p-8 bg-teal-900 rounded-[2.5rem] text-white">
                  <p className="font-black text-teal-400 text-xs uppercase tracking-widest mb-6">Seller Specifics</p>
                  <ul className="space-y-4 text-sm font-medium opacity-90">
                    <li>• Business Legal Information</li>
                    <li>• Government-issued ID photos</li>
                    <li>• Merchant verification status</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 2. Password Security */}
            <section id="security">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">02. Password Security</h2>
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
                <FaShieldAlt className="absolute -right-10 -top-10 text-white/5 size-60" />
                <div className="relative z-10 text-center md:text-left">
                  <p className="text-lg font-medium leading-relaxed">
                    User passwords are <span className="text-teal-400 font-black italic underline">never</span> stored in plain text. We utilize enterprise-grade **cryptographic hashing** (Salted Argon2/bcrypt) to ensure that even our own developers cannot view your credentials.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Seller Identity */}
            <section id="verification">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">03. Seller Verification</h2>
              <div className="border-2 border-dashed border-slate-200 p-10 rounded-[3rem]">
                <p className="text-slate-600 font-medium leading-loose mb-6">
                  To prevent fraud and maintain the integrity of our premium marketplace, sellers must provide identification. 
                </p>
                <div className="flex flex-wrap gap-4">
                  {["Admin Review Only", "Encrypted Storage", "Private Metadata"].map((tag, i) => (
                    <span key={i} className="bg-slate-50 px-4 py-2 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Usage & 5. Data Security */}
            <section id="usage">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">04. Data Usage & Safety</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { t: "Verification", d: "Authenticating seller identity" },
                  { t: "Transactions", d: "Facilitating secure payouts" },
                  { t: "Security", d: "Preventing platform fraud" }
                ].map((item, i) => (
                  <div key={i} className="p-6 border border-slate-100 rounded-3xl">
                    <p className="font-black text-slate-900 text-xs uppercase tracking-widest mb-2">{item.t}</p>
                    <p className="text-slate-500 text-xs font-bold leading-relaxed">{item.d}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Sharing */}
            <section id="sharing">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">06. Data Sharing Policy</h2>
              <p className="text-slate-500 font-black italic mb-8">"We do not sell, trade, or rent user data to third-party marketers."</p>
              <div className="bg-slate-50 p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-12">
                <div className="flex-1 space-y-4">
                  <p className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Authorized Partners</p>
                  <p className="text-sm text-slate-600 font-medium">Data is only shared with payment processors (e.g., Safepay) to handle your transactions securely.</p>
                </div>
                <div className="flex-1 space-y-4">
                  <p className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Legal Compliance</p>
                  <p className="text-sm text-slate-600 font-medium">Information may be disclosed to legal authorities only when required by applicable law.</p>
                </div>
              </div>
            </section>

            {/* 7. Rights */}
            <section id="rights">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">07. Your Global Rights</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 bg-teal-50 rounded-[3rem]">
                  <p className="text-teal-900 font-black text-xl mb-4">Request Data Removal</p>
                  <p className="text-teal-700 text-sm font-medium mb-6">You have the right to request the complete deletion of your account and all associated data.</p>
                  <button className="text-teal-600 font-black text-[10px] uppercase tracking-widest hover:underline underline-offset-4">
                    Submit Request →
                  </button>
                </div>
                <div className="p-8 bg-white border border-slate-100 rounded-[3rem]">
                  <p className="text-slate-900 font-black text-xl mb-4">Update Profile</p>
                  <p className="text-slate-500 text-sm font-medium mb-6">Maintain your data accuracy by updating your profile settings at any time.</p>
                  <button className="text-slate-400 font-black text-[10px] uppercase tracking-widest cursor-not-allowed">
                    Access Settings
                  </button>
                </div>
              </div>
            </section>

            {/* Extra Added Content: Cookies */}
            <section className="pt-20 border-t border-slate-100">
               <div className="flex items-center gap-4 text-slate-400">
                 <FaCookieBite />
                 <p className="text-[10px] font-black uppercase tracking-widest">Cookie Policy: We use session cookies to keep you logged in and analyze traffic. Continuing to use Tradexon constitutes consent.</p>
               </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy