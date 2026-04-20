import BecomeSellerPage from "@/components/BecomeSeller"

export const metadata = {
  // FIX: Resolves the warning for local development
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL),

  title: "Become a Seller | Start Selling on Tradexon Global Marketplace",
  description: "Join Tradexon's exclusive community of premium merchants. Scale your brand globally with our advanced selling tools, low commission rates, and dedicated support.",
  keywords: [
    "sell on Tradexon", 
    "become a merchant", 
    "online marketplace seller", 
    "ecommerce partner", 
    "sell premium goods",
    "global marketplace logistics"
  ],

  openGraph: {
    title: "Scale Your Brand Globally with Tradexon",
    description: "Join the next generation of premium sellers. Apply today for your merchant account.",
    // Updated to relative path
    url: "/become-seller", 
    siteName: "Tradexon Merchant Central",
    images: [
      {
        url: "/default-og.png", 
        width: 1200,
        height: 630,
        alt: "Sell on Tradexon Merchant Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Join the Tradexon Seller Community",
    description: "The tools you need to grow your business are right here.",
    // Consolidated to use your main OG image
    images: ["/default-og.png"], 
  },
}

const page = () => {
  return (
    <main>
      <BecomeSellerPage />
    </main>
  )
}

export default page