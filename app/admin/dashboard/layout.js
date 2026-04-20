'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import GlobalLoader from "@/components/GlobalLoader";
import { useDispatch } from "react-redux";
import { setAuthAdmin } from "@/store/slices/authSlice";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // prevent state update if unmounted

    async function checkAuth() {
      try {
        const res = await axiosInstance.get("/auth/admin/me");
        if (!isMounted) return;
        setAdmin(res.data);
        dispatch(setAuthAdmin(res.data));
      } catch (error) {
        if (!isMounted) return;
        router.replace("/admin/login"); // safer redirect
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []); // run only once on mount

  if (loading) return <GlobalLoader />;

  if (!admin) return null; // redirect already handled

  return (
    <div className="min-h-screen bg-teal-50">
      <div className="p-6">{children}</div>
    </div>
  );
}