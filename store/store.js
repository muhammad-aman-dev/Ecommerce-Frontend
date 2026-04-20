import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import categoryReducer from "@/store/slices/categorySlice";
import currencyReducer from "@/store/slices/currencySlice";
import generalDataReducer from "@/store/slices/generalDataSlice";
import cartReducer from "@/store/slices/cartSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    generalData: generalDataReducer,
    currency: currencyReducer,
    cart: cartReducer,
  },
});

export default store;