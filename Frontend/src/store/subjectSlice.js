import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Thunk 1 ==> Fetch All Subjects List
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

// Thunk 2 ==> Fetch Subject Details  
export const fetchSubjecDetails = createAsyncThunk(
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

// Thunk 3 ==> Create subject
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

// Thunk 4 ==> Update subject
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

// Thunk 5 ==> Delete subject
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
name: "subjectData",
initialState: {
  subjects: [],
  selectedSubjectDetails: null,
  loading: false,
  error: null,
},
reducers: {},
extraReducers: (builder) => {
  builder
    // Fetch Subjects
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

    // Fetch Subject details by id
    .addCase(fetchSubjecDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.selectedSubjectDetails = null;
    })
    .addCase(fetchSubjecDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedSubjectDetails = action.payload;
    })
    .addCase(fetchSubjecDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.selectedSubjectDetails = null;
    })

    // Create subject
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

    // Update subject
    .addCase(updateSubject.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateSubject.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      const index = state.list.findIndex(
        (subject) => subject.id === action.payload.id
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    })
    .addCase(updateSubject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Delete subject
    .addCase(deleteSubject.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteSubject.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.list = state.list.filter(
        (subject) => subject.id !== action.payload.id
      );
    })
    .addCase(deleteSubject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
}
})

export default subjectSlice;