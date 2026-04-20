'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import GlobalLoader from "@/components/GlobalLoader";
import { useDispatch } from "react-redux";
import { setAuthSeller } from "@/store/slices/authSlice";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [seller, setseller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/auth/seller/me");
        setseller(res.data);
        dispatch(setAuthSeller(res.data));
      } catch (error) {
        router.push("/seller/login"); // redirect if not authenticated
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return <GlobalLoader />;

  if (!seller) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Not Authenticated</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-50">
      <div className="p-6">{children}</div>
    </div>
  );
}