import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  course: null,
  editCourse: false,
};

const courseSlice = createSlice({
  name: "course",
  initialState: initialState,
  reducers: {
    setCourse: (state, action) => {
      state.course = action.payload;
    },
    setEditCourse: (state, action) => {
      state.editCourse = action.payload;
    },
  },
});

export const {
  setStep,
  setCourse,
  setEditCourse,
  resetCourseState,
  setPaymentLoading,
} = courseSlice.actions;

export default courseSlice.reducer;
