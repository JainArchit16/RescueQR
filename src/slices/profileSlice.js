import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profileData: [],
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    setProfileData(state, value) {
      state.profileData = value.payload;
    },
  },
});

export const { setProfileData } = profileSlice.actions;

export default profileSlice.reducer;
