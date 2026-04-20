import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

// ---------------- THUNK ----------------
export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/general/get-categories");
      return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch categories");
    }
  }
);

// ---------------- SLICE ----------------
const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default categorySlice.reducer;