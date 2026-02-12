import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

/* 🔹 Async Thunk */
export const fetchSubjectRemuneration = createAsyncThunk(
  "subjectRemuneration/fetch",
  async ({ facultyId, subjectId, academicYear }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/admin/payment/getSinglePayment/${facultyId}/${subjectId}/${academicYear}`
      );

      const breakdownItem = res.data.breakdown[0];

      return {
        facultyName: res.data.facultyName,
        department: res.data.department,
        subjectName: breakdownItem.subjectName,
        academicYear: breakdownItem.academicYear,
        semesterType: breakdownItem.semesterType,
        semester: breakdownItem.semester,
        total: breakdownItem.subjectTotal,
        referenceNumber: `REF-${Date.now()}`,
        breakdown: [
          {
            component: "Term Work Papers Assessed",
            rate: breakdownItem.termTestAssessment.rate,
            quantity: breakdownItem.termTestAssessment.count,
            amount: breakdownItem.termTestAssessment.amount,
            color: "blue",
          },
          {
            component: "Oral/Practicals",
            rate: breakdownItem.oralPracticalAssessment.rate,
            quantity: breakdownItem.oralPracticalAssessment.count,
            amount: breakdownItem.oralPracticalAssessment.amount,
            color: "emerald",
          },
          {
            component: "Semester Papers Assessed",
            rate: breakdownItem.paperChecking.rate,
            quantity: breakdownItem.paperChecking.count,
            amount: breakdownItem.paperChecking.amount,
            color: "indigo",
          },
        ],
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load remuneration details"
      );
    }
  }
);

/* 🔹 Slice */
const subjectRemunerationSlice = createSlice({
  name: "subjectRemuneration",
  initialState: {
    loading: false,
    error: "",
    data: null,
  },
  reducers: {
    clearSubjectRemuneration: (state) => {
      state.loading = false;
      state.error = "";
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjectRemuneration.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchSubjectRemuneration.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSubjectRemuneration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubjectRemuneration } = subjectRemunerationSlice.actions;
export default subjectRemunerationSlice;
