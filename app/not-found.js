"use client"

import Link from "next/link"
import Image from "next/image"

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-teal-50 text-teal-900 px-6">
      {/* Illustration */}
      <div className="mb-8">
        <Image
          src="/404-illustration.png" // You can replace with your own
          alt="Page not found"
          width={300}
          height={300}
          className="animate-bounce"
        />
      </div>

      {/* Heading */}
      <h1 className="text-6xl font-extrabold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Oops! Page not found</h2>
      <p className="text-center text-lg mb-8 max-w-md">
        The page you are looking for does not exist or has been moved. Check the URL or return to the homepage.
      </p>

      {/* Action Button */}
      <Link
        href={process.env.NEXT_PUBLIC_FRONTEND_URL}
        className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-full shadow-md transition"
      >
        Go to Homepage
      </Link>
    </div>
  )
}

export default NotFoundPage