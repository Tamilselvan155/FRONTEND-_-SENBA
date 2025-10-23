// "use client";
// import { createSlice } from "@reduxjs/toolkit";
//  const items= [
//     {
//       id: 1,
//       name: "Havit HV-G69 USB Gamepad",
//       price: 35,
//       image: "https://via.placeholder.com/80x80.png?text=Gamepad",
//     },
//     {
//       id: 2,
//       name: "Macbook Pro – 512/16GB",
//       price: 500,
//       image: "https://via.placeholder.com/80x80.png?text=Macbook",
//     },
//   ];

// const initialState = {
//  items,
// //   total: items.length,
// };

// const wishlistSlice = createSlice({
//   name: "wishlist",
//   initialState,
//   reducers: {
//     removeFromWishlist: (state, action) => {
//       state.items = state.items.filter((item) => item.id !== action.payload);
//     //   total = state.items.length;
//     },
//     clearWishlist: (state) => {
//       state.items = [];
//     },
//   },
// });

// export const { removeFromWishlist, clearWishlist } = wishlistSlice.actions;
// export default wishlistSlice.reducer;



"use client";
import { createSlice } from "@reduxjs/toolkit";

// Load wishlist from localStorage if available
const loadWishlist = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return { total: 0, wishlistItems: {} };
};

const initialState = loadWishlist();

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const { productId } = action.payload;
      if (!state.wishlistItems[productId]) {
        state.wishlistItems[productId] = 1; // only 1 per wishlist
        state.total += 1;
      }
      localStorage.setItem("wishlist", JSON.stringify(state));
    },
    removeFromWishlist: (state, action) => {
      const { productId } = action.payload;
      if (state.wishlistItems[productId]) {
        delete state.wishlistItems[productId];
        state.total -= 1;
      }
      localStorage.setItem("wishlist", JSON.stringify(state));
    },
    clearWishlist: (state) => {
      state.wishlistItems = {};
      state.total = 0;
      localStorage.setItem("wishlist", JSON.stringify(state));
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

