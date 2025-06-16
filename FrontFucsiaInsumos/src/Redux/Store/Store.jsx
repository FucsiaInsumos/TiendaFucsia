import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import authReducer from '../Reducer/authReducer';
import productReducer from '../Reducer/productReducer';
import categoryReducer from '../Reducer/categoryReducer';
import discountRuleReducer from '../Reducer/discountRuleReducer';
import distributorReducer from '../Reducer/distributorReducer';
import cartReducer from '../Reducer/cartReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  categories: categoryReducer,
  discountRules: discountRuleReducer,
  distributors: distributorReducer,
  cart: cartReducer, // Nuevo reducer
  // Agrega otros reducers aquí
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;