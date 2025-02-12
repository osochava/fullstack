import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./notificationReducer";

const store = configureStore({
  reducer: { notification: notificationReducer },
});
console.log(store.getState());
export default store;
