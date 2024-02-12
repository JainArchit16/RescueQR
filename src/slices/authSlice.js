import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupData: null,
  Loading: false,
  accountType: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setsignupData(state, value) {
      state.signupData = value.payload;
    },
    setAccountType(state, value) {
      state.accountType = value.payload;
    },
  },
});

export const { setsignupData, setAccountType } = authSlice.actions;

export default authSlice.reducer;
