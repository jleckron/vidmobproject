import { configureStore } from "@reduxjs/toolkit";

import tableControlSlice from "./slices/tableControlSlice";
import editableUserSlice from "./slices/editableUserSlice";

const store = configureStore({
  reducer: {
    tableControl: tableControlSlice,
    editableUser: editableUserSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
