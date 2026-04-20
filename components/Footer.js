'use client'

import Link from "next/link"
import { FaInstagram, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa"
import { usePathname } from "next/navigation"

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname();

  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/seller/")
  ) return null

  return (
    <footer className="bg-slate-100 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          
          {/* Brand & Tagline */}
          <div className="max-w-sm">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-4">
              TRADE<span className="text-teal-600 drop-shadow-[0_0_10px_rgba(20,184,166,0.2)]">XON</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-semibold">
              The modern marketplace for premium goods. Bridging the gap between 
              world-class sellers and conscious consumers.
            </p>
          </div>

          {/* Navigation - Updated Links */}
          <div className="flex flex-wrap gap-x-16 gap-y-6">
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Platform</span>
              <Link href="/categories" className="text-sm font-bold text-slate-700 hover:text-teal-600 transition-colors">Browse Categories</Link>
              {/* Corrected path to match BecomeSellerPage metadata */}
              <Link href="/become-seller" className="text-sm font-bold text-slate-700 hover:text-teal-600 transition-colors">Become a Seller</Link>
              <Link href="/seller-policy" className="text-sm font-bold text-slate-700 hover:text-teal-600 transition-colors">Seller Policy</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Support</span>
              <Link href="/contact" className="text-sm font-bold text-slate-700 hover:text-teal-600 transition-colors">Contact Us</Link>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-6">
            {[FaInstagram, FaTwitter, FaLinkedinIn, FaGithub].map((Icon, i) => (
              <Link key={i} href="#" className="text-slate-600 hover:text-teal-600 transition-all hover:scale-110">
                <Icon size={22} />
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar - Updated Legal Slugs */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-200 gap-4">
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
            © {currentYear} TRADEXON INC.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy-policy" className="text-[11px] font-black text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">Privacy Policy</Link>
            {/* Updated to match metadata slug: /terms-and-conditions */}
            <Link href="/terms-and-conditions" className="text-[11px] font-black text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer