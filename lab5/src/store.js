import { configureStore } from "@reduxjs/toolkit";
import quizReducer from "./slice/quizSlice";

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
  },
});
