import { configureStore } from "@reduxjs/toolkit";

import tableControlSlice from "./slices/tableControlSlice";
import userFormSlice from "./slices/userFormSlice";

const store = configureStore({
  reducer: {
    tableControl: tableControlSlice,
    userForm: userFormSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
