import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  enquiries: [],
};

const enquirySlice = createSlice({
  name: 'enquiry',
  initialState,
  reducers: {
    addEnquiry: (state, action) => {
      state.enquiries.push({
        ...action.payload,
        createdAt: new Date().toISOString(), // auto timestamp
      });
    },
  },
});

export const { addEnquiry } = enquirySlice.actions;
export default enquirySlice.reducer;
