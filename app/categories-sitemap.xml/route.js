import { NextResponse } from "next/server";

const BASE_URL = "https://tradexon.store";

export async function GET() {
  try {
    const categories = [
      "Fashion",
      "Electronics",
      "Accessories",
      "Shoes",
      "Gaming",
    ];

    const urls = categories
      .map((category) => {
        const slug = category.toLowerCase();

        return `
          <url>
            <loc>${BASE_URL}/category/${slug}</loc>
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