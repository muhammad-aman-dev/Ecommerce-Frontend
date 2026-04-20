import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";

export const useProductPagination = (endpoint) => {
  const [products, setProducts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const fetchProducts = useCallback(async (isLoadMore = false) => {
    try {
      setIsLoading(true);
      
      // Build the URL with cursor if loading more
      let url = endpoint;
      if (isLoadMore && cursor) {
        const params = new URLSearchParams({
          lastScore: cursor.lastScore,
          lastId: cursor.lastId,
        }).toString();
        url += `?${params}`;
      }

      const { data } = await axiosInstance.get(url);

      if (data.success) {
        setProducts((prev) => (isLoadMore ? [...prev, ...data.products] : data.products));
        setCursor(data.nextCursor);
        setHasMore(data.hasMore);
      }
    } catch (error) {
  console.error("Pagination Error:", error.response?.data || error.message);
  toast.error("Could not fetch more products.");
} finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [endpoint, cursor]);

  useEffect(() => {
    fetchProducts();
  }, [endpoint]);

  return { products, hasMore, isLoading, isInitialLoading, loadMore: () => fetchProducts(true) };
};