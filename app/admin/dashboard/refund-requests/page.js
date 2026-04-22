'use client';

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { FaUndoAlt, FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function RefundRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchRequests = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/refund-requests");
      setRequests(data.requests);
    } catch (error) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleProcessRefund = async (request) => {
    const result = await Swal.fire({
      title: 'Review Refund Request',
      html: `
        <div class="text-left">
          <p class="text-[10px] font-black uppercase text-slate-400 mb-2">Order: ${request.orderDisplayId}</p>
          <p class="text-sm text-slate-700 mb-4"><strong>Reason:</strong> ${request.reason}<br/>"${request.message}"</p>
          <label class="text-[10px] font-black uppercase text-slate-400">Admin Response</label>
          <textarea id="admin-note" class="swal2-textarea rounded-xl text-sm mt-1" placeholder="Reason for decision..."></textarea>
        </div>
      `,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Approve & Refund',
      denyButtonText: 'Reject Request',
      confirmButtonColor: '#0d9488',
      denyButtonColor: '#e11d48',
      customClass: {
        popup: 'rounded-[2rem] font-sans px-4 py-6',
        confirmButton: 'rounded-xl font-bold uppercase tracking-widest text-[10px] px-6 py-3',
        denyButton: 'rounded-xl font-bold uppercase tracking-widest text-[10px] px-6 py-3',
        cancelButton: 'rounded-xl font-bold uppercase tracking-widest text-[10px] px-6 py-3'
      },
      preConfirm: () => {
        const note = document.getElementById('admin-note').value;
        if (!note) {
          Swal.showValidationMessage('Please provide a response');
          return false;
        }
        return note;
      }
    });

    // Check if user clicked Approve (Confirmed) or Reject (Denied)
    if (result.isConfirmed || result.isDenied) {
      const status = result.isConfirmed ? 'approved' : 'rejected';
      const adminNote = result.value || document.getElementById('admin-note').value;

      try {
        const { data } = await axiosInstance.patch(`/admin/process-refund/${request._id}`, {
          status,
          adminNote
        });

        if (data.success) {
          toast.success(`Refund ${status}!`);
          fetchRequests(); // Refresh list
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Action failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-6 group">
          <FaArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
        </button>

        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Refund<span className="text-rose-600">Requests</span></h1>
            <p className="text-slate-500 font-medium">Manage buyer dispute claims.</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><FaUndoAlt /></div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 leading-none">Pending</p>
              <p className="text-xl font-bold text-slate-800">{requests.filter(r => r.status === 'pending').length}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/30">
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400">Order Information</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400">Buyer</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400">Amount</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan="5" className="px-8 py-20 text-center animate-pulse text-[10px] font-black uppercase text-slate-400">Loading...</td></tr>
                ) : requests.length === 0 ? (
                  <tr><td colSpan="5" className="px-8 py-20 text-center text-[10px] font-black uppercase text-slate-400">No requests</td></tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <span className="font-bold text-slate-900 block">{req.orderDisplayId}</span>
                        <span className="text-[9px] text-slate-400 font-black uppercase">ID: {req._id.slice(-6)}</span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-slate-700 text-sm">{req.buyerEmail}</p>
                        <p className="text-[10px] text-rose-500 font-black uppercase">{req.reason}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-black text-slate-900">${req.amountUSD} USD</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${
                          req.status === 'pending' ? 'bg-blue-50 text-blue-600' :
                          req.status === 'approved' ? 'bg-teal-50 text-teal-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        {req.status === 'pending' ? (
                          <button onClick={() => handleProcessRefund(req)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 transition-all shadow-md ml-auto">
                            Process
                          </button>
                        ) : (
                          <span className="text-[9px] font-black uppercase text-slate-300">Archived</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}