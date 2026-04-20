import ContactPage from "@/components/Contact"

export const metadata = {
  // FIX: Resolves the social image warning for localhost
  metadataBase: new URL("http://localhost:3000"),

  title: "Contact Us | Tradexon Premium Marketplace Support",
  description: "Get in touch with the Tradexon support team. Whether you're a merchant looking to sell or a buyer with an inquiry, we're here to help you 24/7.",
  keywords: ["Tradexon contact", "customer support", "sell on Tradexon", "marketplace help"],
  
  openGraph: {
    title: "Contact Tradexon Support",
    description: "Expert assistance for the modern marketplace.",
    // Updated to relative path
    url: "/contact", 
    siteName: "Tradexon",
    images: [
      {
        url: "/default-og.png", 
        width: 1200,
        height: 630,
        alt: "Tradexon Support Team",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Contact Tradexon",
    description: "How can we help you today? Reach out to the Tradexon team.",
    images: ["/default-og.png"],
  },
}

const page = () => {
  return (
      <main>
        <ContactPage/>
      </main>
  )
}

export default page