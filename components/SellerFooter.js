'use client'

import Link from "next/link"
import { FaHeadset, FaBook, FaChartLine } from "react-icons/fa"

const SellerFooter = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 pt-10 pb-6 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          
          {/* Seller Branding */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-teal-200">
              <FaChartLine size={14} />
            </div>
            <span className="font-black text-slate-800 tracking-tight">TRADEXON <span className="text-teal-600">MERCHANT</span></span>
          </div>

          {/* Seller Resources */}
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            <Link href="/seller/academy" className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors">
              <FaBook size={14} />
              <span className="text-xs font-bold">Seller Academy</span>
            </Link>
            <Link href="/seller/support" className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors">
              <FaHeadset size={14} />
              <span className="text-xs font-bold">Merchant Support</span>
            </Link>
          </div>

          {/* Status */}
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Store Online</span>
          </div>
        </div>

        {/* Legal */}
        <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 TRADEXON SELLER CENTRAL</p>
          <div className="flex gap-6">
            <Link href="/seller/terms" className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">Merchant Agreement</Link>
            <Link href="/seller/policy" className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default SellerFooter