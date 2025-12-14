import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Async thunk to fetch faculty list
export const fetchFacultyList = createAsyncThunk(
  'facultyList/fetchFacultyList',
  async () => {
    const response = await api.get('http://localhost:3002/admin/faculty/getAll');
    return response.data;
  }
);

const facultyListSlice = createSlice({
  name: "facultyList",
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // When fetch starts
      .addCase(fetchFacultyList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // When fetch succeeds
      .addCase(fetchFacultyList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.error = null;
      })
      // When fetch fails
      .addCase(fetchFacultyList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  }
});

export default facultyListSlice;