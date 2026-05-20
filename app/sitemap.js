const BASE_URL = "https://tradexon.store";

export default function sitemap() {
  const lastModified = new Date();

  const staticRoutes = [
    { url: `${BASE_URL}`, priority: 1, changeFrequency: "daily" },

    { url: `${BASE_URL}/login`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE_URL}/signup`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE_URL}/cart`, priority: 0.7, changeFrequency: "weekly" },
    { url: `${BASE_URL}/contact`, priority: 0.6, changeFrequency: "monthly" },

    { url: `${BASE_URL}/search`, priority: 0.8, changeFrequency: "daily" },

    {
      url: `${BASE_URL}/privacy-policy`,
      priority: 0.3,
      changeFrequency: "yearly",
    },
    {
      url: `${BASE_URL}/terms-and-conditions`,
      priority: 0.3,
      changeFrequency: "yearly",
    },
    {
      url: `${BASE_URL}/seller-policy`,
      priority: 0.3,
      changeFrequency: "yearly",
    },

    // Product category pages
    {
      url: `${BASE_URL}/products/best-sellers`,
      priority: 0.9,
      changeFrequency: "daily",
    },
    {
      url: `${BASE_URL}/products/featured-products`,
      priority: 0.9,
      changeFrequency: "daily",
    },
    {
      url: `${BASE_URL}/products/new-arrivals`,
      priority: 0.9,
      changeFrequency: "daily",
    },
    {
      url: `${BASE_URL}/products/trending-products`,
      priority: 0.9,
      changeFrequency: "daily",
    },
  ];

  return staticRoutes.map((route) => ({
    url: route.url,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}