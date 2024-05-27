import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  restaurants: null,
}

export const ShopSlice = createSlice({
  name: 'Shop',
  initialState,
  reducers: {
   
    setShop: (state, action) => {
      state.Shop = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setShop } = ShopSlice.actions;

export const selectShop  = state => state.Shop.Shop;

export default ShopSlice.reducer
