'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  FaCheckCircle, FaTimesCircle, FaBoxOpen, 
  FaUser, FaArrowLeft, FaTruck, FaShieldAlt 
} from 'react-icons/fa'
import { useEffect } from 'react'
import axiosInstance from '@/lib/axios'

function ReturnPageContent() {
  const searchParams = useSearchParams()
  
  // Directly pull the status and basketId from the URL queries
  const statusQuery = searchParams.get('result')
  const basketId = searchParams.get('basketId')
  const errCode = searchParams.get('err_code')

useEffect(() => {
  const notifyFailedPayment = async () => {
    try {
      await axiosInstance.post('/payment/webhook/payfast-checkcode', {
        basketId,
        err_code: errCode,
      })
    } catch (error) {
      console.error('Failed to notify backend:', error)
    }
  }

  const successCodes = ['00', '000']
  const isFailure =
    basketId &&
    errCode &&
    !successCodes.includes(errCode)

  if (isFailure) {
    notifyFailedPayment()
  }
}, [basketId, errCode])

  // Check if the URL explicitly states success, otherwise default to failure layout
  const isSuccess = statusQuery === 'success'

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-10 text-center relative overflow-hidden">
        
        {/* Top Decorative Aesthetic Lines */}
        <div className={`absolute top-0 left-0 right-0 h-2 ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`} />

        {isSuccess ? (
          /* ================= SUCCESS STATE LAYOUT ================= */
          <div className="space-y-6 animate-fade-in">
            {/* Animated Icon Container */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 text-emerald-500 mb-2 animate-bounce">
              <FaCheckCircle className="size-14" />
            </div>

            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payment Verified!</h1>
              {basketId && (
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Basket ID: {basketId}</p>
              )}
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl text-left border border-slate-100 space-y-3">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FaTruck className="text-orange-500" /> What happens next?
              </p>
              <ul className="text-xs font-semibold text-slate-600 space-y-2 list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span> The vendor in Pakistan has been notified to begin picking and packing your items.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">✓</span> Funds will remain protected until you physically mark the order as received.
                </li>
              </ul>
            </div>

            <div className="pt-4 space-y-3">
              <Link 
                href="/profile" 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-xs tracking-widest py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/10"
              >
                <FaUser /> View Order in Profile
              </Link>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <FaShieldAlt /> Tradexon Escrow Security Applied
              </p>
            </div>
          </div>
        ) : (
          /* ================= FAILURE STATE LAYOUT ================= */
          <div className="space-y-6 animate-fade-in">
            {/* Animated Icon Container */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-50 text-red-500 mb-2 animate-pulse">
              <FaTimesCircle className="size-14" />
            </div>

            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Transaction Failed</h1>
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest mt-1">
                Payment Aborted
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl text-left border border-slate-100 space-y-3">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FaBoxOpen className="text-red-500" /> Troubleshooting Guide
              </p>
              <ul className="text-xs font-semibold text-slate-600 space-y-2 list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span> Double-check your account limits if using your JazzCash or EasyPaisa wallet.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span> For credit cards, ensure that international/online ecommerce triggers are unlocked via your bank application.
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <Link 
                href="/cart" 
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black uppercase text-xs tracking-widest py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-600/10"
              >
                <FaArrowLeft /> Return to Cart & Retry
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default function PayFastReturnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="font-black text-xs text-slate-400 uppercase tracking-widest animate-pulse">
          Resolving Authorization Tokens...
        </p>
      </div>
    }>
      <ReturnPageContent />
    </Suspense>
  )
}