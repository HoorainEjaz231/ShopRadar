import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

export const CartSlice = createSlice({
  name: 'Cart',
  initialState,
  reducers: {
   
    addToCart: (state, action) => {
      state.items = [...state.items, action.payload]
    },
    RemoveFromCart: (state, action) => {
       let newCart = [...state.items]
       let itemIndex = state.items.findIndex(item=> item.id == action.payload.id)
       if(itemIndex>=0){
            newCart.splice(itemIndex,1)
       }else{
            console.log("Cant Remove the Item that is not added to cart")
       }
       state.items = newCart;
      },
    EmptyCart: (state, action) => {
       state.items = []
     },
  },
})

// Action creators are generated for each case reducer function
export const { addToCart, RemoveFromCart, EmptyCart } = CartSlice.actions

export const selectCartItems = state=> state.cart.items

export const selectCartItemsById = (state, id) => state.cart.items.filter(item=> item.id == id)

export const selectCartTotal = state=> state.cart.items.reduce((total,item)=> total= total+item.price, 0)

export default CartSlice.reducer
