import AdminNav from "@/components/AdminNav";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: 'Admin - TradeXon',
  description: 'Manage Activities on TradeXon',
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <main className="p-6">{children}</main>
      <ToastContainer closeOnClick />
    </div>
  );
}