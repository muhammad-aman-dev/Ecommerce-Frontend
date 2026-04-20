import SellerStorefront from "@/components/SellerStoreFront";

export default async function Page({ params }) {
  const { id } = await params;

  return (
    <main>
      <SellerStorefront sellerId={id} />
    </main>
  );
}