import TermsPage from "./TermsAndConditions"

export const metadata = {
  // FIX: This clears the metadataBase warning for local development
  metadataBase: new URL("http://localhost:3000"),

  title: "Terms and Conditions | Tradexon Marketplace",
  description: "Read the official Terms and Conditions for Tradexon. Understand our policies on user accounts, seller payouts, delivery responsibilities, and marketplace usage.",
  keywords: [
    "Tradexon terms", 
    "marketplace policies", 
    "seller agreement", 
    "buyer protection", 
    "payout terms"
  ],
  
  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Tradexon Legal - Terms and Conditions",
    description: "The legal framework governing our premium global marketplace.",
    // Updated to relative path; metadataBase will prefix it
    url: "/terms-and-conditions", 
    siteName: "Tradexon",
    images: [
      {
        url: "/default-og.png", 
        width: 1200,
        height: 630,
        alt: "Tradexon Legal Policies",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions | Tradexon",
    description: "Review our marketplace usage policies and seller guidelines.",
    images: ["/default-og.png"],
  },
}

const page = () => {
  return (
    <main>
      <TermsPage />
    </main>
  )
}

export default page