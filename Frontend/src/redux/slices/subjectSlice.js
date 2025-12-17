import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Fetch Subjects
export const fetchSubjects = createAsyncThunk(
  "subjects/fetchSubjects",
  async (_, { rejectWithValue }) => {
    console.log("Fetching subjects...");
    try {
      const response = await api.get(
        "http://localhost:3002/faculty/subject/getList"
      );
      console.log("Subjects fetched:", response.data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load subjects";
      return rejectWithValue(message);
    }
  }
);

// Fetch subject details for dropdown selection
export const fetchSubjectDetails = createAsyncThunk(
  "subjects/fetchSubjectDetails",
  async (subjectId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `http://localhost:3002/faculty/subject/getList/${subjectId}`
      );
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load subject";
      return rejectWithValue(message);
    }
  }
);

//Create subject
export const createSubject = createAsyncThunk(
  "subjects/createSubject",
  async (subjectData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "http://localhost:3002/faculty/subject/create",
        subjectData
      );
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create subject";
      return rejectWithValue(message);
    }
  }
);

//Update subject
export const updateSubject = createAsyncThunk(
  "subjects/updateSubject",
  async ({ id, subjectData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `http://localhost:3002/faculty/subject/update/${id}`,
        subjectData
      );
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update subject";
      return rejectWithValue(message);
    }
  }
);

//Delete subject
export const deleteSubject = createAsyncThunk(
  "subjects/deleteSubject",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `http://localhost:3002/faculty/subject/delete/${id}`
      );
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete subject";
      return rejectWithValue(message);
    }
  }
);

const subjectSlice = createSlice({
  name: "subjects",
  initialState: {
    list: [],
    loading: false,
    error: null,
    selectedSubjectDetails: null,
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Fetch subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //create subject
      .addCase(createSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.list.push(action.payload);
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //update subject
      .addCase(updateSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.list.findIndex(
          (subject) => subject._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //delete subject
      .addCase(deleteSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(
          (subject) => subject._id !== action.meta.arg
        );
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Fetch subject details by id
      .addCase(fetchSubjectDetails.pending, (state) => {
        // state.loading = true;
        state.error = null;
        state.selectedSubjectDetails = null;
      })
      .addCase(fetchSubjectDetails.fulfilled, (state, action) => {
        // state.loading = false;
        state.selectedSubjectDetails = action.payload;
      })
      .addCase(fetchSubjectDetails.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.payload;
        state.selectedSubjectDetails = null;
      });
  },
});
export const {} = subjectSlice.actions;
export default subjectSlice.reducer;
