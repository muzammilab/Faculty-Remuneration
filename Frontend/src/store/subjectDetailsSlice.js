import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

export const fetchSubjectDetails = createAsyncThunk(
  'subjectDetails/fetchBySubjectId',
  async (subjectId) => {
    const response = await api.get(`http://localhost:3002/faculty/subject/getList/${subjectId}`);
    return response.data;
  }
);

const subjectDetailsSlice = createSlice({
  name: "subjectDetails",
  initialState: {
    selectedSubject: "",
    selectedSubjectDetails: null,
    termWorkPapers: "",
    termWorkRate: "",
    oralPapers: "",
    oralRate: "",
    semesterPapers: "",
    semesterRate: "",
    loading: false,
    error: null
  },
  reducers: {
    setSelectedSubject: (state, action) => {
      state.selectedSubject = action.payload;
      // Reset all form fields
      state.selectedSubjectDetails = null;
      state.termWorkPapers = "";
      state.termWorkRate = "";
      state.oralPapers = "";
      state.oralRate = "";
      state.semesterPapers = "";
      state.semesterRate = "";
    },

    // Form field setters
    setTermWorkPapers: (state, action) => {
      state.termWorkPapers = action.payload;
    },
    setTermWorkRate: (state, action) => {
      state.termWorkRate = action.payload;
    },
    setOralPapers: (state, action) => {
      state.oralPapers = action.payload;
    },
    setOralRate: (state, action) => {
      state.oralRate = action.payload;
    },
    setSemesterPapers: (state, action) => {
      state.semesterPapers = action.payload;
    },
    setSemesterRate: (state, action) => {
      state.semesterRate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjectDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubjectDetails = action.payload;
      })
      .addCase(fetchSubjectDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch subject details';
      })
  },
});

export const { 
  setSelectedSubject, 
  setTermWorkPapers, setTermWorkRate, 
  setOralPapers, setOralRate, 
  setSemesterPapers, setSemesterRate
} = subjectDetailsSlice.actions;

export default subjectDetailsSlice;