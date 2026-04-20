import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";

export const useCategoryPagination = (category) => {
  const [products, setProducts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const fetchCategoryProducts = useCallback(async (isLoadMore = false) => {
    if (!category) return;

    try {
      setIsLoading(true);
      
      // Build URL with cursor as query strings (lastScore, lastId)
      let url = "/general/products/category-products";
      if (isLoadMore && cursor) {
        url += `?lastScore=${cursor.lastScore}&lastId=${cursor.lastId}`;
      }

      // Send the category in the body as per your controller: const { category } = req.body;
      const { data } = await axiosInstance.post(url, { category });

      if (data.success) {
        setProducts((prev) => (isLoadMore ? [...prev, ...data.products] : data.products));
        setCursor(data.nextCursor);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Category Fetch Error:", error);
      toast.error("Error loading category products");
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [category, cursor]);

  // Reset and fetch when the category changes (e.g., user clicks a different link)
  useEffect(() => {
    setProducts([]);
    setCursor(null);
    setIsInitialLoading(true);
    fetchCategoryProducts(false);
  }, [category]);

  return {
    products,
    hasMore,
    isLoading,
    isInitialLoading,
    loadMore: () => fetchCategoryProducts(true),
  };
};