'use client'

import Slider from "react-slick"
import Image from "next/image"
import Link from "next/link"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

// Custom Arrow Components for a more premium feel
const NextArrow = ({ onClick }) => (
  <div 
    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg cursor-pointer transition-all text-teal-600 hidden md:block"
    onClick={onClick}
  >
    <FaChevronRight size={20} />
  </div>
)

const PrevArrow = ({ onClick }) => (
  <div 
    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg cursor-pointer transition-all text-teal-600 hidden md:block"
    onClick={onClick}
  >
    <FaChevronLeft size={20} />
  </div>
)

const HeroCarousel = () => {
  const { BannersFetched } = useSelector((state) => state.generalData)
  const [slides, setslides] = useState([])

  useEffect(() => {
    if (BannersFetched) setslides(BannersFetched)
  }, [BannersFetched])

  const settings = {
    dots: true,
    infinite: true,
    speed: 800, // Smoother transition
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: dots => (
      <div style={{ bottom: "20px" }}>
        <ul className="custom-dots"> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div className="w-3 h-3 mx-1 bg-white/50 rounded-full transition-all hover:bg-teal-400 dot-inner"></div>
    )
  }

  if (!slides || slides.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="w-full h-64 md:h-96 bg-slate-100 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-slate-200">
           <p className="text-slate-400 font-medium">No banners available at the moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 group relative">
      <Slider {...settings} className="hero-slider">
        {slides.map((slide, index) => (
          <Link key={index} href={slide.ref || "/"}>
            <div className="relative w-full h-62.5 sm:h-87.5 md:h-112.5 lg:h-125 overflow-hidden rounded-4xl md:rounded-[3rem] cursor-pointer shadow-2xl shadow-teal-900/10">
              
              {/* Image with subtle overlay for depth */}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent z-0" />
              
              <Image
                src={slide.imageLink}
                alt={slide.title || "Banner"}
                fill
                priority={index === 0} // Load first slide immediately
                sizes="(max-width: 768px) 100vw, 
       (max-width: 1280px) 92vw, 
       1200px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
              />

              {/* Optional Text Overlay - Only if your banners have titles */}
              {slide.title && (
                <div className="absolute bottom-10 left-10 z-10 hidden md:block">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl max-w-md">
                        <h2 className="text-white text-3xl font-black mb-2 leading-tight">
                            {slide.title}
                        </h2>
                        <span className="text-teal-300 font-bold uppercase tracking-widest text-xs">
                            Shop Collection
                        </span>
                    </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </Slider>

      {/* Custom Styles for Slick Dots */}
      <style jsx global>{`
        .hero-slider .slick-dots li {
          width: auto;
          height: auto;
        }
        .hero-slider .slick-dots li.slick-active .dot-inner {
          width: 30px;
          background-color: #0d9488 !important; /* teal-600 */
        }
        .hero-slider .slick-list {
          margin: 0 -10px;
        }
      `}</style>
    </div>
  )
}

export default HeroCarousel