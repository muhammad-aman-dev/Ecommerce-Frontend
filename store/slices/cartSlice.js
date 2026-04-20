// store/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // cart items
  itemCount: 0, // new state for total quantity
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Hydrate cart from localStorage on app load
    hydrateCart: (state) => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("cart");
        state.items = saved ? JSON.parse(saved) : [];
        state.itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
      }
    },

    // Add or increment cart item
    addToCart: (state, action) => {
      const newItem = action.payload;

      const existIndex = state.items.findIndex(
        (i) =>
          i.productId === newItem.productId &&
          JSON.stringify(i.variations) === JSON.stringify(newItem.variations)
      );

      if (existIndex >= 0) {
        const oldQuantity = state.items[existIndex].quantity;
        state.items[existIndex].quantity += newItem.quantity;

        // Ensure quantity does not exceed stock
        if (state.items[existIndex].quantity > newItem.stock) {
          state.items[existIndex].quantity = newItem.stock;
        }

        // Update itemCount by the actual added quantity
        state.itemCount += state.items[existIndex].quantity - oldQuantity;
      } else {
        state.items.push(newItem);
        state.itemCount += newItem.quantity;
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    // Remove item per product + variation
    removeFromCart: (state, action) => {
      const { productId, variations } = action.payload;
      const itemToRemove = state.items.find(
        (i) =>
          i.productId === productId &&
          JSON.stringify(i.variations) === JSON.stringify(variations)
      );

      if (itemToRemove) {
        state.itemCount -= itemToRemove.quantity;
      }

      state.items = state.items.filter(
        (i) =>
          i.productId !== productId ||
          JSON.stringify(i.variations) !== JSON.stringify(variations)
      );

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    // Update quantity safely
    updateQuantity: (state, action) => {
      const { productId, variations, quantity, stock } = action.payload;
      const item = state.items.find(
        (i) =>
          i.productId === productId &&
          JSON.stringify(i.variations) === JSON.stringify(variations)
      );

      if (item) {
        const oldQuantity = item.quantity;
        item.quantity = Math.max(1, Math.min(quantity, stock));
        state.itemCount += item.quantity - oldQuantity; // adjust total
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, hydrateCart } =
  cartSlice.actions;

export default cartSlice.reducer;