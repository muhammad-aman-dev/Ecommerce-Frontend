"use client"

import { useSelector } from "react-redux"

export default function GlobalLoader() {
  const { isCheckingAuth } = useSelector((state) => state.auth)

  if (!isCheckingAuth) return null

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-900/10 backdrop-blur-md pointer-events-auto">
      <div className="flex flex-col items-center gap-6">
        
        {/* Premium Pulsing Logo/Spinner Area */}
        <div className="relative flex items-center justify-center">
          {/* Outer Ripple */}
          <div className="absolute w-20 h-20 bg-teal-400/30 rounded-full animate-ping"></div>
          
          {/* Inner Spinner */}
          <div className="w-16 h-16 border-[3px] border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
          
          {/* Center Core */}
          <div className="absolute w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Text with elegant tracking */}
        <div className="text-center">
          <p className="text-teal-900 font-black text-xs uppercase tracking-[0.3em] ml-[0.3em]">
            Authenticating
          </p>
          <div className="flex justify-center gap-1 mt-2">
            <span className="w-1 h-1 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1 h-1 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1 h-1 bg-teal-600 rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        div {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}