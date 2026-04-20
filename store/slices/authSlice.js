import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";

// ---------------- ASYNC THUNKS ----------------

// Get Authenticated User
export const getAuthUser = createAsyncThunk(
  "auth/getAuthUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/user/me");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/logout"); // backend logout endpoint
      toast.success(res.data.message || "Logged out successfully");
      return null; // no payload needed, we just clear authUser
    } catch (error) {
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

// ---------------- SLICE ----------------
const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isCheckingAuth: false,
    authSeller : null,
    authAdmin : null
  },
  reducers: {
     setAuthSeller: (state, action) => {
      state.authSeller = action.payload;
    },
    // Set Auth Admin
    setAuthAdmin: (state, action) => {
      state.authAdmin = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Get Auth User
    builder
      .addCase(getAuthUser.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(getAuthUser.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.authUser = action.payload;
        console.log(action.payload);
      })
      .addCase(getAuthUser.rejected, (state, action) => {
        state.isCheckingAuth = false;
        state.authUser = null;
        toast.error(action.payload || "Authentication failed");
      });

    // Logout User
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isCheckingAuth = false;
        state.authUser = null; // clear user state
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isCheckingAuth = false;
        toast.error(action.payload || "Logout failed");
      });
  },
});

export const { setAuthSeller, setAuthAdmin } = authSlice.actions;

export default authSlice.reducer;