import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemIndex = state.items.findIndex(item => item.ProductID === action.payload.ProductID);
      if (itemIndex >= 0) {
        state.items[itemIndex].quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    RemoveFromCart: (state, action) => {
      const itemIndex = state.items.findIndex(item => item.ProductID === action.payload.id);
      if (itemIndex >= 0) {
        state.items[itemIndex].quantity -= 1;
        if (state.items[itemIndex].quantity === 0) {
          state.items.splice(itemIndex, 1);
        }
      }
    },
    EmptyCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, RemoveFromCart, EmptyCart } = cartSlice.actions;

export const selectCartItems = state => state.cart.items;

export const selectCartItemsById = createSelector(
  [selectCartItems, (state, id) => id],
  (items, id) => items.filter(item => item.ProductID === id)
);

export const selectCartTotal = state => state.cart.items.reduce((total, item) => total + item.Price * item.quantity, 0);

export default cartSlice.reducer;
