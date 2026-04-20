// store/slices/generalDataSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

// Async thunk to fetch banners
export const fetchBanners = createAsyncThunk(
  "generalData/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/general/get-banners");
      return response.data; // expected to be an array
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch banners"
      );
    }
  }
);

const generalDataSlice = createSlice({
  name: "generalData",
  initialState: {
    BannersFetched: [],
    isLoadingGeneralData: false,
    error: null,
  },
  reducers: {
    // Replace entire banners array
    setBanners: (state, action) => {
      state.BannersFetched = action.payload;
    },
    // Clear banners
    clearBanners: (state) => {
      state.BannersFetched = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.isLoadingGeneralData = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.isLoadingGeneralData = false;
        state.BannersFetched = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.isLoadingGeneralData = false;
        state.error = action.payload;
        state.BannersFetched = [];
      });
  }
});

export const { setBanners, clearBanners } = generalDataSlice.actions;

export default generalDataSlice.reducer;