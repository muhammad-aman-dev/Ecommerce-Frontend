'use client'

import { 
  FaGlobe, FaBoxOpen, FaClock, FaPassport, 
  FaPlaneDeparture, FaHandHoldingUsd, FaTruck, FaMapMarkerAlt,
  FaCheckCircle, FaUndoAlt
} from "react-icons/fa"

const ShippingPolicy = () => {
  const sections = [
    { id: "fulfillment", title: "1. Seller-Managed Logistics", icon: <FaTruck /> },
    { id: "timelines", title: "2. Transit & Timelines", icon: <FaClock /> },
    { id: "customs", title: "3. Duties & Customs", icon: <FaPassport /> },
    { id: "confirmation", title: "4. Buyer Confirmation", icon: <FaCheckCircle /> },
    { id: "returns", title: "5. 7-Day Return Window", icon: <FaUndoAlt /> },
    { id: "undelivered", title: "6. Failed Delivery", icon: <FaBoxOpen /> },
  ]

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-20">
          <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em] mb-4 block">Global Logistics & Returns</span>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">
            Shipping & <span className="text-orange-500">Delivery.</span>
          </h1>
          <div className="flex items-center gap-6">
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Version 1.1 • May 2026</p>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Sidebar Nav */}
          <aside className="lg:w-1/4 hidden lg:block">
            <div className="sticky top-24 space-y-1">
              {sections.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-left text-xs font-black text-slate-500 hover:bg-orange-50 hover:text-orange-600 transition-all group uppercase tracking-widest"
                >
                  <span className="text-slate-300 group-hover:text-orange-500">{item.icon}</span>
                  {item.title}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:w-3/4 space-y-24 pb-40 lg:pl-16 border-l border-slate-50">
            
            {/* 1. Seller-Managed Fulfillment */}
            <section id="fulfillment">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">01. Seller-Managed Logistics</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-50 rounded-[2.5rem]">
                  <p className="font-black text-slate-900 text-xs uppercase tracking-widest mb-6">Vendor Responsibility</p>
                  <p className="text-slate-600 text-sm font-semibold leading-relaxed mb-4">
                    Sellers are fully responsible for independent fulfillment logistics from Pakistan, selecting their preferred premium international carrier (DHL, FedEx, Pakistan Post EMS), and securing safe passage to customs terminals.
                  </p>
                  <ul className="space-y-4 text-sm text-slate-600 font-bold">
                    <li className="flex items-center gap-3"><FaMapMarkerAlt className="text-orange-500" /> Direct-from-Vendor Origin</li>
                    <li className="flex items-center gap-3"><FaPlaneDeparture className="text-orange-500" /> Mandatory Valid Tracking Link</li>
                  </ul>
                </div>
                <div className="p-8 bg-orange-950 rounded-[2.5rem] text-white">
                  <p className="font-black text-orange-400 text-xs uppercase tracking-widest mb-6">Processing Windows</p>
                  <p className="text-sm font-medium opacity-90 leading-relaxed mb-4">
                    Because goods must pass domestic export clearance checks before leaving Pakistan, standard processing timelines apply:
                  </p>
                  <ul className="space-y-4 text-sm font-medium opacity-90">
                    <li>• In-Stock Products: 2 – 4 Business Days</li>
                    <li>• Tailored / Handcrafted items: 7 – 14 Business Days</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 2. Transit & Timeline */}
            <section id="timelines">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">02. International Transit Timelines</h2>
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
                <FaTruck className="absolute -right-10 -top-10 text-white/5 size-60" />
                <div className="relative z-10 w-full">
                  <p className="text-lg font-medium leading-relaxed mb-6">
                    Estimated delivery windows begin once the seller transfers custody of the parcel to their chosen carrier and uploads the dispatch reference.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-xs font-black text-orange-400 uppercase tracking-widest">Express Airfreight</p>
                      <p className="text-xl font-black">5 – 9 Business Days</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Standard International</p>
                      <p className="text-xl font-black">12 – 22 Business Days</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Duties & Customs */}
            <section id="customs">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">03. Cross-Border Customs & Tariffs</h2>
              <div className="border-2 border-dashed border-slate-200 p-10 rounded-[3rem]">
                <p className="text-slate-600 font-medium leading-loose mb-6">
                  Since products leave Pakistan, international packages face destination import assessments. <strong>All global buyers are explicitly accountable for processing and paying domestic customs duties, local VAT, or regional clearance fees</strong> required to liberate packages from national borders.
                </p>
                <div className="flex flex-wrap gap-4">
                  {["DDU Terms", "Cross-Border Cargo", "Import Declarations"].map((tag, i) => (
                    <span key={i} className="bg-slate-50 px-4 py-2 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Buyer Confirmation */}
            <section id="confirmation">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">04. Mandatory Delivery Confirmation</h2>
              <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2.5rem]">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500 rounded-2xl text-white text-lg">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-emerald-950 mb-2">Mark as Received</h3>
                    <p className="text-sm text-emerald-800 font-medium leading-relaxed mb-4">
                      To secure your order completion status, buyers are <strong>strictly required to manually update their transaction terminal and click "Mark as Received"</strong> immediately upon physical acceptance of the global shipment.
                    </p>
                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">
                      * Failure to confirm within 48 hours of carrier-verified delivery tracking may result in automated completion of the order file.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Return Window Policy */}
            <section id="returns">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">05. Strict 7-Day Return Protection</h2>
              <p className="text-slate-500 font-black italic mb-8">"Safe transactions backed by a finite windows format."</p>
              <div className="bg-slate-50 p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-12">
                <div className="flex-1 space-y-4">
                  <p className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">7-Day Countdown</p>
                  <p className="text-sm text-slate-600 font-medium text-justify">
                    Buyers possess a strict window of <strong>7 calendar days</strong> following delivery confirmation to log an authorized return claim via the resolution console. Once this milestone passes, funds unlock permanently to the vendor in Pakistan.
                  </p>
                </div>
                <div className="flex-1 space-y-4">
                  <p className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Return Freight Terms</p>
                  <p className="text-sm text-slate-600 font-medium text-justify">
                    Because merchandise must return to origin hubs in Pakistan, international reverse shipping labels are subject to inspection rules. Return freight policies must be aligned directly with the seller during dispute filing.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Failed Delivery */}
            <section id="undelivered">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">06. Address Integrity & Failed Shipments</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 bg-orange-50 rounded-[3rem]">
                  <p className="text-orange-900 font-black text-xl mb-4">Incorrect Address Input</p>
                  <p className="text-orange-700 text-sm font-medium mb-6">If a parcel fails delivery because the customer entered flawed parameters, the buyer holds exclusive liability for auxiliary dispatch adjustments or redirection costs.</p>
                </div>
                <div className="p-8 bg-white border border-slate-100 rounded-[3rem]">
                  <p className="text-slate-900 font-black text-xl mb-4">Unclaimed Cargo</p>
                  <p className="text-slate-500 text-sm font-medium mb-6">Parcels abandoned at local border checkpoints or refused entry by the customer are strictly non-refundable due to steep cross-border penalty duties assigned to return logistics back to Pakistan.</p>
                </div>
              </div>
            </section>

            {/* Bottom Disclaimer */}
            <section className="pt-20 border-t border-slate-100">
               <div className="flex items-center gap-4 text-slate-400">
                 <FaHandHoldingUsd />
                 <p className="text-[10px] font-black uppercase tracking-widest">
                   Escrow Rule: System payouts remain locked until delivery verification rules match. Tradexon steps in as a neutral mediator only if tracking documentation clashes with buyer verification assertions.
                 </p>
               </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingPolicy;