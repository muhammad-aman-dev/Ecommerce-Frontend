'use client'

import { FaTerminal, FaShieldAlt, FaServer } from "react-icons/fa"

const AdminFooter = () => {
  return (
    <footer className="bg-slate-200/50 border-t border-slate-300 py-6 px-8">
      <div className="max-w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* System ID & Version */}
        <div className="flex items-center gap-6 text-slate-500">
          <div className="flex items-center gap-2">
            <FaTerminal className="text-teal-600" size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Tradexon Admin v2.1.0</span>
          </div>
          <div className="flex items-center gap-2">
            <FaServer className="text-teal-600" size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest text-green-600">System: Healthy</span>
          </div>
        </div>

        {/* Admin Quick Actions */}
        <div className="flex gap-8">
          <button className="text-[10px] font-black text-slate-600 hover:text-teal-600 uppercase tracking-widest transition-colors">System Logs</button>
          <button className="text-[10px] font-black text-slate-600 hover:text-teal-600 uppercase tracking-widest transition-colors">Security Audit</button>
          <button className="text-[10px] font-black text-slate-600 hover:text-teal-600 uppercase tracking-widest transition-colors">Support Tickets</button>
        </div>

        {/* Security Badge */}
        <div className="flex items-center gap-2 text-slate-400">
          <FaShieldAlt size={12} />
          <span className="text-[10px] font-black uppercase tracking-widest">Encrypted Session</span>
        </div>
      </div>
    </footer>
  )
}

export default AdminFooter