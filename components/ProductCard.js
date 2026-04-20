'use client'

import Image from "next/image"
import Link from "next/link"
import { FaEye } from "react-icons/fa"

const ProductCard = ({ product }) => {

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition border overflow-hidden">

      {/* Product Image */}

      <div className="relative w-full h-52 bg-gray-100">

        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          className="object-cover object-center hover:scale-105 transition duration-300"
        />

      </div>

      {/* Content */}

      <div className="p-4">

        <h2 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-1">
          {product.name}
        </h2>

        <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4">

          <span className="text-teal-600 font-bold text-base md:text-lg">
            ${product.price}
          </span>

          <Link
            href={`/products/${product._id}`}
            className="flex items-center gap-2 bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700 transition text-sm"
          >
            <FaEye/>
            View
          </Link>

        </div>

      </div>

    </div>
  )
}

export default ProductCard