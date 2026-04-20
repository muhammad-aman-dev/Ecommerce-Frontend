'use client'

import { useState } from "react"
import { 
  FaEnvelope, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaPaperPlane, 
  FaHeadset, 
  FaQuestionCircle 
} from "react-icons/fa"
import { toast } from "react-toastify"
import axiosInstance from "@/lib/axios"

const ContactPage = () => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = {
      fullname: e.target.fullname.value,
      email: e.target.email.value,
      subject: e.target.subject.value,
      message: e.target.message.value
    }

    try {
      const { data } = await axiosInstance.post('/general/add-contact', formData)
      toast.success("Message sent! Our team will reach out shortly.")
      e.target.reset()
    } catch (err) {
      console.error(err)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.4em] mb-4 block">
            Customer Care
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">
            How can we help you <span className="text-teal-500">today?</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Whether you're a buyer with a question or a merchant looking to scale, 
            our specialized team is ready to assist.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          
          {/* Left Side: Contact Info Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
              <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-teal-200">
                <FaHeadset size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Live Support</h3>
              <p className="text-slate-500 text-sm font-medium mb-6">Available Mon-Fri, 9am - 6pm EST.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-700 font-bold">
                  <FaPhoneAlt className="text-teal-600" />
                  <span>+1 (555) 000-1234</span>
                </div>
                <div className="flex items-center gap-4 text-slate-700 font-bold">
                  <FaEnvelope className="text-teal-600" />
                  <span>support@tradexon.com</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative">
              <FaMapMarkerAlt className="absolute -right-4 -bottom-4 text-white/5 size-40" />
              <h3 className="text-xl font-black mb-2">Global HQ</h3>
              <p className="text-slate-400 text-sm mb-6">Visit our design district office.</p>
              <p className="font-bold leading-relaxed">
                123 Luxury Avenue,<br />
                Suite 500, New York<br />
                NY 10001, USA
              </p>
            </div>

            <button className="w-full py-6 rounded-4xl border-2 border-dashed border-slate-200 text-slate-400 font-black text-xs uppercase tracking-widest hover:border-teal-500 hover:text-teal-600 transition-all flex items-center justify-center gap-3">
              <FaQuestionCircle /> Visit Help Center
            </button>
          </div>

          {/* Right Side: Message Form */}
          <div className="lg:col-span-3 bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                  <input 
                    required
                    name="fullname"
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                  <input 
                    required
                    name="email"
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Subject</label>
                <select 
                  required
                  name="subject"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-bold text-slate-800 appearance-none"
                >
                  <option>Order Inquiry</option>
                  <option>Seller Registration</option>
                  <option>Technical Issue</option>
                  <option>Partnership</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Message</label>
                <textarea 
                  required
                  name="message"
                  rows="5"
                  placeholder="How can we help?"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-bold text-slate-800 resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-teal-600/20 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:bg-slate-300"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FaPaperPlane size={14} /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ContactPage