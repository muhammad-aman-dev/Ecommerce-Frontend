import PrivacyPolicy from "./PrivacyPolicy"

export const metadata = {
  // ADD THIS LINE TO FIX THE WARNING
  metadataBase: new URL("http://localhost:3000"),

  title: "Privacy Policy | Tradexon Data Protection",
  description: "Learn how Tradexon collects, protects, and manages your personal data. Read our commitment to password hashing, seller verification, and user rights.",
  keywords: [
    "Tradexon privacy", 
    "data protection", 
    "secure marketplace", 
    "seller ID verification", 
    "account security"
  ],

  openGraph: {
    title: "Your Privacy at Tradexon",
    description: "Our commitment to keeping your personal and business data secure.",
    url: "/privacy-policy", // Next.js will now auto-prefix this with localhost:3000
    siteName: "Tradexon",
    images: [
      {
        url: "/default-og.png", 
        width: 1200,
        height: 630,
        alt: "Tradexon Privacy & Security",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Tradexon Privacy Policy",
    description: "Encryption, verification, and your data rights.",
    images: ["/default-og.png"],
  },

  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
}

const page = () => {
  return (
    <main>
      <PrivacyPolicy />
    </main>
  )
}

export default page