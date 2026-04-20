"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaDollarSign, FaBox, FaStar, FaChartLine, FaCheckCircle, FaBullhorn, FaInfoCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axiosInstance from "@/lib/axios";

export default function BusinessInsightsPage() {
  const router = useRouter();
  const [range, setRange] = useState("year");
  const [data, setData] = useState({ chartData: [], stats: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const { data: res } = await axiosInstance.get(`/seller/insights?range=${range}`);
        setData({
          chartData: res.chartData || [],
          stats: {
            revenue: res.totalRevenue || 0,
            sales: res.totalSales || 0,
            rating: res.averageRating || 0,
            listings: res.activeListings || 0
          }
        });
      } catch (err) { 
        console.error("Fetch error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchInsights();
  }, [range]);

  const noSales = data.stats.sales === 0;
  const hasListings = data.stats.listings > 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-12 text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-2">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-teal-700 text-[11px] font-black uppercase tracking-widest hover:-translate-x-1 transition-transform">
              <FaArrowLeft /> Back to Shop
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Shop <span className="text-teal-700">Intelligence</span></h1>
          </div>

          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            {['month', 'year', 'all'].map((t) => (
              <button 
                key={t} 
                onClick={() => setRange(t)} 
                className={`px-8 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                  range === t ? 'bg-teal-700 text-white shadow-lg shadow-teal-900/20' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </header>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total Revenue" value={`$${data.stats.revenue?.toLocaleString()}`} icon={<FaDollarSign />} color="text-teal-700" bg="bg-teal-50" />
          <StatCard label="Order Volume" value={data.stats.sales} icon={<FaCheckCircle />} color="text-teal-700" bg="bg-teal-50" />
          <StatCard label="Store Rating" value={data.stats.rating ? data.stats.rating.toFixed(1) : "0.0"} icon={<FaStar />} color="text-teal-700" bg="bg-teal-50" />
          <StatCard label="Active Items" value={data.stats.listings} icon={<FaBox />} color="text-teal-700" bg="bg-teal-50" />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Line Chart Section */}
          <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/40 border border-white relative overflow-hidden">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Growth Matrix</h3>
                <p className="text-lg font-bold text-slate-800 tracking-tight">Revenue History</p>
              </div>
              <FaChartLine className="text-teal-700/10 text-4xl" />
            </div>

            <div className="h-100 w-full">
              {loading ? (
                <div className="h-full w-full flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-xs">Syncing...</div>
              ) : noSales ? (
                /* Dynamic Empty State - No Action Buttons */
                <div className="h-full w-full bg-slate-50/50 rounded-4xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-10 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    {hasListings ? <FaBullhorn className="text-teal-600 text-xl" /> : <FaBox className="text-teal-600 text-xl" />}
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">
                    {hasListings ? "Chart Awaiting Sales" : "Inventory Needed"}
                  </h4>
                  <p className="text-sm text-slate-500 max-w-72 leading-relaxed italic">
                    {hasListings 
                      ? "Your listings are active. Once you receive your first order, the revenue trend will appear here." 
                      : "Add items to your shop to begin tracking your performance analytics."}
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#0f766e', strokeWidth: 1 }} />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#0f766e" 
                      strokeWidth={4} 
                      dot={{ r: 6, fill: '#0f766e', strokeWidth: 3, stroke: '#fff' }} 
                      activeDot={{ r: 8, fill: '#0f766e' }}
                      animationDuration={2000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Side Info Panels */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <FaInfoCircle className="text-teal-700" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Status Report</h4>
              </div>
              <div className="space-y-6">
                <StatusItem label="Platform Standing" status={data.stats.rating > 4 ? "Excellent" : "Standard"} color="text-teal-700" />
                <StatusItem label="Market Presence" status={hasListings ? "Active" : "Inactive"} color={hasListings ? "text-teal-700" : "text-slate-400"} />
                <StatusItem label="Sync Status" status="Live" color="text-emerald-500" />
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Efficiency Tips</h4>
              <div className="space-y-2">
                <TipItem text="Optimize titles for search" />
                <TipItem text="Respond quickly to Orders" />
                <TipItem text="Update stock regularly" />
                <TipItem text="Monitor daily traffic" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, bg }) {
  return (
    <div className="bg-white p-8 rounded-4xl border border-slate-200 shadow-sm flex items-center gap-6 group">
      <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center text-xl`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p>
        <h4 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h4>
      </div>
    </div>
  );
}

function StatusItem({ label, status, color }) {
  return (
    <div className="border-b border-slate-50 pb-4 last:border-0 last:pb-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</p>
      <p className={`text-sm font-black ${color}`}>{status}</p>
    </div>
  );
}

function TipItem({ text }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-transparent">
      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 opacity-40" />
      <p className="text-xs font-bold text-slate-600">{text}</p>
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-2xl border border-slate-800">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{payload[0].payload.name}</p>
        <p className="text-xl font-black tracking-tight text-teal-400">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};