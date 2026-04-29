// app/categories/page.js
export const dynamic = "force-dynamic";
import axiosInstance from "@/lib/axios";
import CategoryExplorerClient from "./CategoryExplorerPage";

// 🔹 Shared fetch with caching
const getCategoriesData = async () => {
  try {
    const response = await axiosInstance.get(
  `/general/getproductsbycategories`);
       console.log(response.data.productsByCategory)
    return response.data.productsByCategory || {};
  } catch (error) {
    console.error("Fetch error:", error);
    return {};
  }
};

// --- SEO (STABLE / HYBRID) ---
export async function generateMetadata() {
  return {
    title: "Explore Categories | Tradexon Marketplace",

    // 🔒 Static description (SEO stable)
    description:
      "Browse top categories like Electronics, Fashion, Home & more on Tradexon Marketplace. Discover quality products from verified sellers across Pakistan.",

    keywords: [
      "online shopping Pakistan",
      "buy electronics online",
      "fashion store Pakistan",
      "home products Pakistan",
      "Tradexon marketplace",
    ],

    openGraph: {
      title: "Shop by Category | Tradexon",
      description:
        "Discover premium products across multiple categories on Tradexon Marketplace.",
      type: "website",
    },
  };
}

const CategoriesPage = async () => {
  const initialData = await getCategoriesData();

  return (
    <main>
      <CategoryExplorerClient initialCategories={initialData} />
    </main>
  );
};

export default CategoriesPage;