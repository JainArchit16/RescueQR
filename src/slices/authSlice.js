import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupData: null,
  Loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setsignupData(state, value) {
      state.signupData = value.payload;
    },
  },
});

export const { setsignupData } = authSlice.actions;

export default authSlice.reducer;
