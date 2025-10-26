import { configureStore } from "@reduxjs/toolkit";
import orchildReducer from "../slices/orchildSlice";

export const store = configureStore({
  reducer: {
    orchild: orchildReducer,
  },
});
