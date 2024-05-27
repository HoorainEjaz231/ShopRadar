import { configureStore } from '@reduxjs/toolkit'
import CartSlice from './slices/CartSlices'
import  ShopSlice  from './slices/ShopSlices'

export const store = configureStore({
  reducer: {
   cart: CartSlice,
   Shop: ShopSlice,
  },
})
