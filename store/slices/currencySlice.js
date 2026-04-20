// redux/currencySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

// Async thunk to fetch exchange rates from backend
export const fetchExchangeRates = createAsyncThunk(
  "currency/fetchExchangeRates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/rates/get-rates");
      return response.data.rates;
    } catch (error) {
      console.error("Failed to fetch exchange rates:", error);
      return rejectWithValue(error.response?.data || "Fetch error");
    }
  }
);

const initialState = {
  currency: typeof window !== "undefined"
    ? localStorage.getItem("currency") || "USD"
    : "USD",
  exchangeRates: { USD: 1, PKR: 283 },
  loading: false,
  error: null,
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency(state, action) {
      localStorage.setItem("currency",action.payload)
      state.currency = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchangeRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.loading = false;
        state.exchangeRates = action.payload;
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch rates";
      });
  },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;