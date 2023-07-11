import { createSlice } from "@reduxjs/toolkit";

const EMPTY_USER = {
  _id: 0,
  firstName: "",
  lastName: "",
  email: "",
  createdAt: "",
  updatedAt: "",
};

const EMPTY_FORM_ERRORS = {
  firstName: "",
  lastName: "",
  email: "",
};

export const userFormSlice = createSlice({
  name: "userForm",
  initialState: {
    user: { ...EMPTY_USER },
    formErrors: { ...EMPTY_FORM_ERRORS },
  },
  reducers: {
    setUser(state, action) {
      state.user = { ...action.payload };
    },

    updateUserField(state, action) {
      const { field, value } = action.payload;
      state.user = { ...state.user, [field]: value };

      let newError = "";
      switch (field) {
        //matches email against regex for 'non-whitespace'@'letter/number route'.'letter/number domain'
        case "email": {
          newError = !value.match(
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-]*$/
          )
            ? "Invalid entry"
            : "";
          break;
        }
        //matches first and last name against regex of only letters
        default: {
          newError = !value.match(/^[A-Za-z']+$/) ? "Invalid Entry" : "";
        }
      }
      state.formErrors = { ...state.formErrors, [field]: newError };
    },
    updateFormErrorField(state, action) {
      const { field, value } = action.payload;
      state.formErrors = { ...state.formErrors, [field]: value };
    },
    clearForm(state) {
      state.user = { ...EMPTY_USER };
      state.formErrors = { ...EMPTY_FORM_ERRORS };
    },
  },
});

export const { setUser, updateUserField, updateFormErrorField, clearForm } =
  userFormSlice.actions;

export default userFormSlice.reducer;
