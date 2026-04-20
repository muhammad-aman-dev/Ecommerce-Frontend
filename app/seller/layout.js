import SellerNav from "@/components/SellerNav";

export const metadata = {
  title: 'Seller - TradeXon',
  description: 'Create Seller Account and Manage your orders and earn with TradeXon'
}

export default function SellerLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SellerNav />
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}