import { Geist, Geist_Mono, Inter, Poppins, Quicksand } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "./provider";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";

// Font Configurations
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500", "600"] });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["400", "500", "700"] });
const quicksand = Quicksand({ variable: "--font-quicksand", subsets: ["latin"], weight: ["400", "500", "700"] });

// --- GLOBAL SEO METADATA ---
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000"),
  title: {
    default: "TradeXon | Premium Multi-Vendor Marketplace",
    template: "%s | TradeXon",
  },
  description: "Discover a world of premium products on TradeXon. Shop electronics, fashion, and more from verified global merchants with secure payments.",
  keywords: ["TradeXon", "Online Shopping", "Multi-vendor Marketplace", "Ecommerce", "Buy Electronics", "Fashion Store"],
  authors: [{ name: "TradeXon Team" }],
  
  openGraph: {
    title: "TradeXon | Global Marketplace",
    description: "Shop premium products from verified sellers worldwide.",
    url: "/",
    siteName: "TradeXon",
    images: [
      {
        url: "/default-og.png", // Make sure this exists in your public folder
        width: 1200,
        height: 630,
        alt: "TradeXon Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "TradeXon Marketplace",
    description: "Your trusted destination for global trade.",
    images: ["/default-og.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

// --- VIEWPORT SETTINGS ---
export const viewport = {
  themeColor: "#0d9488", // Teal-600 to match your brand
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  // Combine all font variables
  const fontVariables = `${geistSans.variable} ${geistMono.variable} ${inter.variable} ${poppins.variable} ${quicksand.variable}`;

  return (
    <html lang="en">
      <body className={`${fontVariables} font-inter antialiased bg-stone-50 text-slate-900`}>
        <Providers>
          <Navbar />
          {/* Main wrapper to ensure footer stays at bottom if content is short */}
          <main className="min-h-[80vh]">
            {children}
          </main>
          <Footer />
        </Providers>
        
        <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </body>
    </html>
  );
}