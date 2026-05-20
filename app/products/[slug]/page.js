import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";

// extract MongoDB ID
function extractId(slug = "") {
  return slug.split("-").pop();
}

// fetch product
async function getProduct(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/general/get-product/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data.product;
}

// SEO
export async function generateMetadata({ params }) {
  const { slug } = await params; // ✅ NEXT 15 FIX

  const id = extractId(slug);
  if (!id) return {};

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/general/get-product/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return {};

  const { product } = await res.json();

  if (!product) return {};

  return {
    title: `${product.name} | Buy Online`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.length
        ? [{ url: product.images[0] }]
        : [],
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params; // ✅ NEXT 15 FIX

  if (!slug) {
    return <div>Invalid product URL</div>;
  }

  const id = extractId(slug);

  if (!id) {
    return <div>Invalid product ID</div>;
  }

  const product = await getProduct(id);

  if (!product) return notFound();

  return <ProductClient product={product} />;
}