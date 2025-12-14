import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Thunk 1: Fetch faculty data
export const fetchFacultyData = createAsyncThunk(
  "facultyData/fetchFacultyData",
  async (facultyId) => {
    const response = await api.get(
      `http://localhost:3002/admin/payment/faculty/${facultyId}`
    );
    return response.data;
  }
);

// Thunk 2: Fetch semesters for faculty
export const fetchFacultySemesters = createAsyncThunk(
  'facultyData/fetchFacultySemesters',
  async (facultyId) => {
    const response = await api.get(`http://localhost:3002/admin/payment/faculty/${facultyId}/semesters`);
    return response.data;
  }
);

// Thunk 3: Fetch Subjects for faculty by semester
export const fetchSubjectsBySemester = createAsyncThunk(
  'facultyData/fetchSubjectsBySemester',
  async ({ facultyId, semesterJson }) => {
    const semesterObj = JSON.parse(semesterJson);
    const { semester: sem, academicYear, semesterType } = semesterObj;
    
    const response = await api.get(
      `http://localhost:3002/admin/payment/faculty/${facultyId}/semester/${sem}/year/${academicYear}/semType/${semesterType}/subjects`
    );
    return response.data;
  }
);

const facultyDataSlice = createSlice({
  name: "facultyData",
  initialState: {
    selectedFaculty: "",
    facultyData: null,
    semesters: [],
    selectedSemester: "",
    subjects: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedFaculty: (state, action) => {
      state.selectedFaculty = action.payload;
      state.selectedSemester = "";
    },
    setSelectedSemester: (state, action) => {
      state.selectedSemester = action.payload;
      // state.subjects = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // *** 1st ***
      // Faculty data loading
      .addCase(fetchFacultyData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Faculty data fetched
      .addCase(fetchFacultyData.fulfilled, (state, action) => {
        state.loading = false;
        state.facultyData = action.payload;
      })
      // Faculty data fetch failed
      .addCase(fetchFacultyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // *** 2nd ***
      // Semesters loading
      .addCase(fetchFacultySemesters.pending, (state) => {
        state.loading = true;
      })
      // Semesters fetched
      .addCase(fetchFacultySemesters.fulfilled, (state, action) => {
        state.loading = false;
        state.semesters = action.payload;
      })
      // Semesters fetch failed
      .addCase(fetchFacultySemesters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // *** 3rd ***
      // Subjects loading
      .addCase(fetchSubjectsBySemester.pending, (state) => {
        state.loading = true;
      })
      // Subjects fetched
      .addCase(fetchSubjectsBySemester.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      // Subjects fetch failed
      .addCase(fetchSubjectsBySemester.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export const { setSelectedFaculty, setSelectedSemester } = facultyDataSlice.actions;
export default facultyDataSlice;
