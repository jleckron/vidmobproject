import { createSlice } from "@reduxjs/toolkit";

const EMPTY_USER = {
  _id: 0,
  firstName: "",
  lastName: "",
  email: "",
  createdAt: "",
  updatedAt: "",
};

export const editableUserSlice = createSlice({
  name: "editableUser",
  initialState: {
    user: EMPTY_USER,
  },
  reducers: {
    setUser(state, action) {
      state.user = { ...action.payload };
    },

    updateField(state, action) {
      const { field, value } = action.payload;
      state.user = { ...state.user, [field]: value };
    },
    clearUser(state) {
      state.user = { ...EMPTY_USER };
    },
  },
});

export const { setUser, clearUser } = editableUserSlice.actions;

export default editableUserSlice.reducer;
