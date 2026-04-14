import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import api from "../utils/api";

/* =========================================================
   Thunk 1 ==> Fetch All Enrollment Records
========================================================= */
export const fetchEnrollments = createAsyncThunk(
  "enrollment/fetchEnrollments",
  async (_, { rejectWithValue }) => {
    console.log("Fetching enrollment records...");

    try {
      const response = await api.get("/admin/enrollment/list");
      console.log("Enrollment records fetched:", response.data);

      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load enrollment records";

      console.error("Error fetching enrollments:", message);

      return rejectWithValue(message);
    }
  },
);

/*=================================================================
   Thunk 2 ==> Fetch Single Enrollment Details (CURRENTLY NOT USED)
=================================================================== */
export const fetchEnrollmentDetails = createAsyncThunk(
  "enrollment/fetchEnrollmentDetails",
  async (recordId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/enrollment/list/${recordId}`);

      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load enrollment details";

      return rejectWithValue(message);
    }
  },
);

/* =========================================================
   Thunk 3 ==> Create Enrollment Record
========================================================= */
export const createEnrollment = createAsyncThunk(
  "enrollment/createEnrollment",
  async (enrollmentData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/admin/enrollment/create",
        enrollmentData,
      );

      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to create enrollment record";

      return rejectWithValue(message);
    }
  },
);

/* =========================================================
   Thunk 4 ==> Update Enrollment Record
========================================================= */
export const updateEnrollment = createAsyncThunk(
  "enrollment/updateEnrollment",
  async ({ id, enrollmentData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/admin/enrollment/update/${id}`,
        enrollmentData,
      );

      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update enrollment record";

      return rejectWithValue(message);
    }
  },
);

/* =========================================================
   Thunk 5 ==> Delete Enrollment Record (CURRENTLY NOT USED)
========================================================= */
export const deleteEnrollment = createAsyncThunk(
  "enrollment/deleteEnrollment",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/enrollment/delete/${id}`);

      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to delete enrollment record";

      return rejectWithValue(message);
    }
  },
);

/* ===============================================================================
   Thunk 6 ==> Fetch Subjects from Enrollment Record to assign subjects to faculty
================================================================================== */
export const fetchSubjectsFromEnrollment = createAsyncThunk(
  "enrollment/fetchSubjectsFromEnrollment",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/enrollment/subjects`, {
        params: filters,
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch subjects",
      );
    }
  },
);

/* =========================================================
   Slice
========================================================= */
const enrollmentSlice = createSlice({
  name: "enrollmentData",

  initialState: {
    entries: [],
    subjects: [],
    selectedEnrollmentDetails: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearEnrollments: (state) => {
      state.entries = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===============================
         Fetch All Enrollments
      =============================== */
      .addCase(fetchEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;

        toast.success("Enrollment records loaded successfully!");
      })
      .addCase(fetchEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        toast.error(action.payload);
      })

      /* ===============================
         Fetch Enrollment Details
      =============================== */
      .addCase(fetchEnrollmentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedEnrollmentDetails = null;
      })

      .addCase(fetchEnrollmentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEnrollmentDetails = action.payload;
      })

      .addCase(fetchEnrollmentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedEnrollmentDetails = null;
      })

      /* ===============================
         Create Enrollment
      =============================== */
      .addCase(createEnrollment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createEnrollment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.entries.unshift(action.payload);

        toast.success("Enrollment record created successfully!");
      })

      .addCase(createEnrollment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        toast.error(action.payload);
      })

      /* ===============================
         Update Enrollment
      =============================== */
      .addCase(updateEnrollment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateEnrollment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const index = state.entries.findIndex(
          (record) => record._id === action.payload._id,
        );

        if (index !== -1) {
          state.entries[index] = action.payload;
        }

        toast.success("Enrollment record updated successfully!");
      })

      .addCase(updateEnrollment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        toast.error(action.payload);
      })

      /* ===============================
         Delete Enrollment
      =============================== */
      .addCase(deleteEnrollment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteEnrollment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const deletedId = action.meta.arg;

        state.entries = state.entries.filter(
          (record) => record._id !== deletedId,
        );

        toast.success("Enrollment record deleted successfully!");
      })

      .addCase(deleteEnrollment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        toast.error(action.payload);
      })

      /* ==============================
         Fetch Subjects from Enrollment
      ================================= */
      .addCase(fetchSubjectsFromEnrollment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectsFromEnrollment.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload || [];
        toast.success("Subjects loaded successfully from Enrollment Schema!");
      })
      .addCase(fetchSubjectsFromEnrollment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEnrollments } = enrollmentSlice.actions;

export default enrollmentSlice;
