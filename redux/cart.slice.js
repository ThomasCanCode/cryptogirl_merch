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


// reducers/count.ts

import {createSlice} from '@reduxjs/toolkit';

export interface CountState {
  count: number
};

const defaultState : CountState = {
  count: 0,
};

const slice = createSlice({
  name: 'count',
  initialState: defaultState,
  reducers: {
    increment: (state: CountState, action) => {
      state.count++;
    },
    decrement: (state: CountState, action) => {
      state.count--;
    }
  }
});

export const { increment, decrement } = slice.actions;

export default slice.reducer;