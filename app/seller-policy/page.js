import SellerPolicy from "./SellerPolicy"

export const metadata = {
  // FIX: Resolves the social media image warning for local development
  metadataBase: new URL("http://localhost:3000"),

  title: "Seller Policy | Tradexon Merchant Guidelines",
  description: "Review the official Tradexon Seller Policy. Learn about merchant registration, product listing rules, shipping responsibilities, and payout procedures.",
  keywords: [
    "Tradexon seller rules", 
    "merchant policy", 
    "sell online guidelines", 
    "payout verification", 
    "shipping responsibility"
  ],

  // 1. Open Graph (For sharing with potential merchants)
  openGraph: {
    title: "Sell on Tradexon - Official Seller Policy",
    description: "Everything you need to know about becoming a premium merchant on Tradexon.",
    url: "/seller-policy", 
    siteName: "Tradexon Merchant Central",
    images: [
      {
        url: "/default-og.png", 
        width: 1200,
        height: 630,
        alt: "Tradexon Merchant Guidelines",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // 2. Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Tradexon Merchant Guidelines",
    description: "Professional standards for our global seller community.",
    images: ["/default-og.png"],
  },

  // 3. Robots
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
}

const page = () => {
  return (
    <main>
      <SellerPolicy />
    </main>
  )
}

export default page