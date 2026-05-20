const BASE_URL = "https://tradexon.store";

export default function sitemap() {
  const lastModified = new Date();

  return [
    // Static Pages
    {
      url: `${BASE_URL}`,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/cart`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-and-conditions`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/seller-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },

    // Product Listing Pages
    {
      url: `${BASE_URL}/products/best-sellers`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/products/featured-products`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/products/new-arrivals`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/products/trending-products`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },

    // Dynamic sitemap references
    {
      url: `${BASE_URL}/products-sitemap.xml`,
      lastModified,
    },
    {
      url: `${BASE_URL}/categories-sitemap.xml`,
      lastModified,
    },
    {
      url: `${BASE_URL}/sellers-sitemap.xml`,
      lastModified,
    },
  ];
}