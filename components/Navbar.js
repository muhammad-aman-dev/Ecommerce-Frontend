"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { HiMenu, HiX, HiSearch, HiOutlineShoppingCart } from "react-icons/hi"
import { useSelector, useDispatch } from "react-redux"
import { logoutUser } from "@/store/slices/authSlice"
import { setCurrency } from "@/store/slices/currencySlice"

const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const { authUser } = useSelector((state) => state.auth)
  const { currency } = useSelector((state) => state.currency)
  const { itemCount } = useSelector((state) => state.cart)
  

  const dispatch = useDispatch()

  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/seller/")
  ) return null

  const toggleMenu = () => setIsOpen(!isOpen)
  const handleLogout = async () => {
  dispatch(logoutUser());
  setTimeout(() => {
    router.push("/");
  }, 1000);
};
  const handleCurrencyChange = (e) => dispatch(setCurrency(e.target.value))

  // ✅ SEARCH HANDLER
  const handleSearch = () => {
    const query = searchQuery.trim()
    if (!query) return
    router.push(`/search?search=${encodeURIComponent(query)}`)
    setIsOpen(false)
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/categories" },
    { name: "Contact", href: "/contact" },
    { name: "Become Seller", href: "/seller" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full transition-all duration-300">
      <div className="absolute inset-0 bg-teal-600/95 backdrop-blur-md border-b border-white/10 shadow-lg" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="relative overflow-hidden rounded-full ring-2 ring-white/20 group-hover:ring-white/50 transition-all">
            <Image
  src="/tradexonlogo.png"
  alt="TradeXon Logo"
  width={42}
  height={42}
  priority
  className="object-cover group-hover:scale-110 transition-transform duration-300"
/>
          </div>
          <span className="text-xl md:text-2xl font-extrabold tracking-tight text-white italic hidden sm:block">
            Trade<span className="text-teal-200">Xon</span>
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full group">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch()
              }}
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-teal-100/70 rounded-full py-2 pl-10 pr-10 focus:outline-none focus:bg-white focus:text-gray-900 focus:ring-2 focus:ring-teal-300 transition-all"
            />

            {/* 🔍 Clickable Search Icon */}
            <button
              onClick={handleSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            >
              <HiSearch className="text-teal-100 group-focus-within:text-gray-500 text-xl cursor-pointer" />
            </button>
          </div>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-5 font-medium text-[14px]">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-white/90 hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          <div className="h-6 w-px bg-white/20" />

          {/* Currency Dropdown */}
          <select
            value={currency}
            onChange={handleCurrencyChange}
            className="bg-white/10 text-white border border-white/20 rounded px-2 py-1 text-xs focus:outline-none focus:bg-white focus:text-gray-900 transition cursor-pointer"
          >
            <option value="USD">USD</option>
            <option value="PKR">PKR</option>
          </select>

          {/* Cart */}
          <Link href="/cart" className="relative p-2 text-white hover:text-teal-200 transition-colors">
            <HiOutlineShoppingCart className="text-2xl" />
            <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-teal-600">
              {itemCount}
            </span>
          </Link>

          {/* Auth */}
          {!authUser ? (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-white hover:text-teal-200 transition font-semibold text-sm">Login</Link>
              <Link href="/signup" className="bg-white text-teal-700 px-5 py-2 rounded-full hover:bg-teal-50 transition-all font-bold text-xs uppercase">Signup</Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 border-l border-white/10 pl-4">
              <Link href="/profile" className="flex items-center gap-2 group">
                <div className="text-right hidden lg:block">
                  <p className="text-[10px] text-teal-100 leading-none">Welcome,</p>
                  <p className="text-xs font-bold text-white">{authUser.name}</p>
                </div>
                <div className="relative w-8.5 h-8.5 rounded-full overflow-hidden border border-white/30 group-hover:border-white transition-all">
  <Image
    src={authUser.dp || "/default-avatar.png"}
    alt="Profile"
    fill
    sizes="34px"
    className="object-cover"
  />
</div>
              </Link>
              <button onClick={handleLogout} className="text-xs bg-black/20 hover:bg-black/40 text-white px-3 py-1.5 rounded-md transition-all">
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Icons */}
        <div className="md:hidden flex items-center gap-2">
          <Link href="/cart" className="relative p-2 text-white">
            <HiOutlineShoppingCart className="text-2xl" />
            <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-teal-600">
              {itemCount}
            </span>
          </Link>
          <button className="p-2 rounded-lg bg-white/10 text-2xl text-white" onClick={toggleMenu}>
            {isOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-teal-800 border-b border-white/10 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-150 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="p-5 space-y-5">

          {/* Mobile Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch()
              }}
              className="w-full bg-white/10 border border-white/20 text-white rounded-lg py-2.5 pl-10 pr-10"
            />
            <button
              onClick={handleSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            >
              <HiSearch className="text-teal-100 text-xl" />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="text-teal-50 font-medium border-b border-white/5 pb-2">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Currency */}
          <div className="flex items-center justify-between py-2">
            <span className="text-white text-sm font-semibold">Currency</span>
            <select
              value={currency}
              onChange={handleCurrencyChange}
              className="bg-white/10 text-white border border-white/20 rounded px-3 py-1 text-sm"
            >
              <option value="USD">USD</option>
              <option value="PKR">PKR</option>
            </select>
          </div>

          {/* Auth */}
          <div className="pt-2 flex flex-col gap-3">
            {!authUser ? (
              <>
                <Link href="/login" className="w-full py-3 border border-white/30 text-white rounded-xl text-center font-bold">Login</Link>
                <Link href="/signup" className="w-full py-3 bg-white text-teal-700 rounded-xl text-center font-bold">Create Account</Link>
              </>
            ) : (
              <div className="space-y-3">
                <Link href="/profile" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                 <div className="relative w-10 h-10 rounded-full overflow-hidden">
  <Image
    src={authUser.dp || "/default-avatar.png"}
    alt="Profile"
    fill
    sizes="40px"
    className="object-cover"
  />
</div>
                  <span className="font-bold text-white">{authUser.name}</span>
                </Link>
                <button onClick={handleLogout} className="w-full py-3 bg-red-500/20 text-red-100 rounded-xl font-medium">Logout</button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}

export default Navbar