const BASE_URL = "https://www.tradexon.store";

export default function sitemap() {
  const routes = [
    "",
    "/login",
    "/signup",
    "/cart",
    "/contact",
    "/search",
    "/privacy-policy",
    "/terms-and-conditions",
    "/seller-policy",
    "/products/best-sellers",
    "/products/featured-products",
    "/products/new-arrivals",
    "/products/trending-products",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}