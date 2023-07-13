import { createSlice } from "@reduxjs/toolkit";

export const tableControlSlice = createSlice({
  name: "tableControl",
  initialState: {
    page: 0,
    size: 5,
    searchParameter: "",
    shouldReload: false,
    sortBy: "createdAt",
    order: "asc",
  },
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setSize(state, action) {
      state.size = action.payload;
      state.page = 0;
    },
    setSortColumn(state, action) {
      state.sortBy = action.payload;
    },
    setSortOrder(state, action) {
      state.order = action.payload;
    },
    updateSearch(state, action) {
      state.searchParameter = action.payload;
    },
    toggleShouldReload(state) {
      state.shouldReload = !state.shouldReload;
    },
  },
});

export const {
  setPage,
  setSize,
  setSortColumn,
  setSortOrder,
  updateSearch,
  toggleShouldReload,
} = tableControlSlice.actions;

export default tableControlSlice.reducer;
