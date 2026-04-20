"use client";

import { Provider, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import store from "@/store/store";
import { getAuthUser } from "@/store/slices/authSlice";
import { getCategories } from "@/store/slices/categorySlice";
import { fetchBanners } from "@/store/slices/generalDataSlice";
import { fetchExchangeRates } from "@/store/slices/currencySlice"; 
import { hydrateCart } from "@/store/slices/cartSlice"; // <-- updated action
import GlobalLoader from "@/components/GlobalLoader";

function AuthLoader({ children }) {
  const dispatch = useDispatch();

  const { isCheckingAuth } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.category);
  const { isLoadingGeneralData } = useSelector((state) => state.generalData);
  const { loading: isRatesLoading } = useSelector((state) => state.currency); 

  useEffect(() => {
    dispatch(getAuthUser());
    dispatch(getCategories());
    dispatch(fetchBanners()); 
    dispatch(fetchExchangeRates()); 

    // HYDRATE CART FROM LOCALSTORAGE (client only)
    if (typeof window !== "undefined") {
      dispatch(hydrateCart());
    }
  }, [dispatch]);

  // Show global loader if any essential data is loading
  if (isCheckingAuth || isLoading || isLoadingGeneralData || isRatesLoading) {
    return <GlobalLoader />;
  }

  return children;
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthLoader>{children}</AuthLoader>
    </Provider>
  );
}