import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import api from "../utils/api";

// Thunk 1 ==> Fetch All Subjects List
export const fetchSubjects = createAsyncThunk(
  "subjects/fetchSubjects",
  async (_, { rejectWithValue }) => {
    console.log("Fetching subjects...");
    try {
      const response = await api.get("/faculty/subject/getList");
      console.log("Subjects fetched:", response.data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load subjects";
      console.error("Error fetching subjects:", message);
      return rejectWithValue(message);
    }
  }
);

// Thunk 2 ==> Fetch subjects by semester
export const fetchSubjectsBySemester = createAsyncThunk(
  "subjects/fetchBySemester",
  async ({ semester, department }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/faculty/subject/getList?semester=${semester}&department=${department}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue({
        message: "Failed to fetch subjects by semester (Frontend Error)",
        status: err.response?.status,
      });
    }
  }
);

// Thunk 3 ==> Fetch Subject Details
export const fetchSubjecDetails = createAsyncThunk(
  "subjects/fetchSubjectDetails",
  async (subjectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/faculty/subject/getList/${subjectId}`);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load subject";
      return rejectWithValue(message);
    }
  }
);

// Thunk 4 ==> Create subject
export const createSubject = createAsyncThunk(
  "subjects/createSubject",
  async (subjectData, { rejectWithValue }) => {
    try {
      const response = await api.post("/faculty/subject/create", subjectData);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create subject";
      return rejectWithValue(message);
    }
  }
);

// Thunk 5 ==> Update subject
export const updateSubject = createAsyncThunk(
  "subjects/updateSubject",
  async ({ id, subjectData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/faculty/subject/update/${id}`,
        subjectData
      );
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update subject";
      return rejectWithValue(message);
    }
  }
);

// Thunk 6 ==> Delete subject
export const deleteSubject = createAsyncThunk(
  "subjects/deleteSubject",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/faculty/subject/delete/${id}`);
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
  reducers: {
    clearSubjects: (state) => {
      state.subjects = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
        toast.success("Subjects loaded successfully!");
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // rejectWithValue message is stored in action.payload. So, using it we set the error state
        console.log(action.error.message); // This is a default error message from createAsyncThunk i.e "Rejected" which is not very descriptive
        toast.error(action.payload);
      })

      // Fetch Subjects by Semester
      .addCase(fetchSubjectsBySemester.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectsBySemester.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload.map((subj) => ({
          subjectId: subj._id,
          name: subj.name,
        }));
        toast.success(
          "Subjects for selected semester and department loaded successfully!"
        );
      })
      .addCase(fetchSubjectsBySemester.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Fetch Subject details by id
      .addCase(fetchSubjecDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedSubjectDetails = null; // Clear previous subject details while loading new details
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
        state.subjects.push(action.payload); // Add the newly created subject to the Subjectslist without refetching all subjects
        toast.success("Subject created successfully!");
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Update subject
      .addCase(updateSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        console.log(action.payload._id); // Updated subject data returned from backend after successful update
        const index = state.subjects.findIndex(
          (subject) => subject._id === action.payload._id
        );
        if (index !== -1) {
          state.subjects[index] = action.payload;
        } // Update the subject in the Subjects list without refetching all subjects. Index is the position of the updated subject in the subjects array.
        toast.success("Subject updated successfully!");
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Delete subject
      .addCase(deleteSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        console.log(action.payload); // Response from delete API from backend after successful deletion
        const deletedId = action.meta.arg; // 👈 subjectId you passed to the thunk for deleting the subject
        state.subjects = state.subjects.filter(
          (subject) => subject._id !== deletedId
        );
        toast.success("Subject deleted successfully!");
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearSubjects } = subjectSlice.actions;
export default subjectSlice;
