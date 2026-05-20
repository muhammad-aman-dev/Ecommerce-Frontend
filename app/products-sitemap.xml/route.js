import { NextResponse } from "next/server";

const BASE_URL = "https://tradexon.store";

function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/general/sitemap-products`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    const products = data.products || [];

    const urls = products
      .map((product) => {
        const slug = createSlug(product.name);

        return `
<url>
<loc>${BASE_URL}/products/${slug}-${product.id}</loc>
<lastmod>${new Date(product.updatedAt).toISOString()}</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    return new NextResponse("Error generating sitemap", {
      status: 500,
    });
  }
}