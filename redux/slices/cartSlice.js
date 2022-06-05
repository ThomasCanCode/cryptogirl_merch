import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  cart: []
}

const cart = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      console.log('from slice')
      console.log(state.cart)
      const itemExists = state.cart.find((item) => item.id === action.payload.id);
      if (itemExists) {
        itemExists.quantity++;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
        console.log(action.payload.options)
      }
    },
    incrementQuantity: (state, action) => {
      const item = state.cart.find((item) => item.id === action.payload.product);
      item.quantity++;
    },
    decrementQuantity: (state, action) => {
      const item = state.find((item) => item.id === action.payload);
      if (item.quantity === 1) {
        const index = state.findIndex((item) => item.id === action.payload);
        state.splice(index, 1);
      } else {
        item.quantity--;
      }
    },
    removeFromCart: (state, action) => {
      const index = state.findIndex((item) => item.id === action.payload);
      state.splice(index, 1);
    },
  }
})
export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} = cart.actions;

export default cart.reducer









// import { createSlice } from '@reduxjs/toolkit';
// import { configureStore } from '@reduxjs/toolkit';



// const cartSlice = createSlice({
//   name: 'cart',
//   initialState: [],
//   reducers: {
//     addToCart: (state, action) => {
//       const itemExists = state.find((item) => item.id === action.payload.id);
//       if (itemExists) {
//         itemExists.quantity++;
//       } else {
//         state.push({ ...action.payload, quantity: 1 });
//         console.log(action.payload.options)
//       }
//     },
//     incrementQuantity: (state, action) => {
//       const item = state.find((item) => item.id === action.payload.product);
//       item.quantity++;
//     },
//     decrementQuantity: (state, action) => {
//       const item = state.find((item) => item.id === action.payload);
//       if (item.quantity === 1) {
//         const index = state.findIndex((item) => item.id === action.payload);
//         state.splice(index, 1);
//       } else {
//         item.quantity--;
//       }
//     },
//     removeFromCart: (state, action) => {
//       const index = state.findIndex((item) => item.id === action.payload);
//       state.splice(index, 1);
//     },
//   },
// });

// export const {
//   addToCart,
//   incrementQuantity,
//   decrementQuantity,
//   removeFromCart,
// } = cartSlice.actions;

// export const cartReducer = cartSlice.reducer;

// const reducer = {
//   cart: cartReducer,
// };

// const store = configureStore({
//   reducer,
// });

// export default store;
