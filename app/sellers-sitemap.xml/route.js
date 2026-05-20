import { NextResponse } from "next/server";

const BASE_URL = "https://tradexon.store";

export async function GET() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/general/all-sellers`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    const sellers = data.sellers || [];

    const urls = sellers
      .map((seller) => {
        return `
          <url>
            <loc>
              ${BASE_URL}/seller-details/${seller._id}
            </loc>
            <changefreq>weekly</changefreq>
            <priority>0.7</priority>
          </url>
        `;
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
    return new NextResponse("Error", {
      status: 500,
    });
  }
}