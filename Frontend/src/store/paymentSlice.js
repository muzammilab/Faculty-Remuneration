import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";

// Fetch all payments
export const fetchPayments = createAsyncThunk(
  "payments/fetchPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/payment/getAll");
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load payments";
      return rejectWithValue(message);
    }
  }
);

// Mark payment as paid
export const makePaymentPaid = createAsyncThunk(
  "payments/makePaymentPaid",
  async (paymentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No authentication token found");
      }
      const response = await api.post(`/make-payment/${paymentId}`);
      return { paymentId, data: response.data };
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to mark payment as paid";
      return rejectWithValue(message);
    }
  }
);

// create payment
export const createPayment = createAsyncThunk(
  "payments/createPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/payment/create`, paymentData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create payment"
      );
    }
  }
);

// fetch paid payment list
export const fetchPaidPayments = createAsyncThunk(
  "payments/fetchPaidPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/payment/getAll");

      // filter only paid
      return response.data.filter((payment) => payment.status === "paid");
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load payment history"
      );
    }
  }
);

// Fetch single faculty payment details
export const fetchFacultyPaymentDetails = createAsyncThunk(
  "payments/fetchFacultyPaymentDetails",
  async ({ facultyId, academicYear, semesterType }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/admin/payment/getSinglePayment/${facultyId}/${academicYear}`
      );

      const selectedPayment = response.data.payments.find(
        (p) => p.semesterType.toLowerCase() === semesterType.toLowerCase()
      );

      if (!selectedPayment) {
        return rejectWithValue("Payment not found");
      }

      return {
        facultyName: response.data.facultyName,
        payment: selectedPayment,
        breakdown: selectedPayment.subjectBreakdown,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch payment details"
      );
    }
  }
);

// Fetch faculty payments (grouped data)
export const fetchFacultyPayments = createAsyncThunk(
  "payments/fetchFacultyPayments",
  async (facultyId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/admin/payment/getSinglePayment/${facultyId}`);

      const payments = res.data.payments;
      const grouped = {};

      payments.forEach((p) => {
        const year = p.academicYear;
        const semType =
          p.semesterType === "Odd" ? "Odd Semester" : "Even Semester";

        if (!grouped[year]) grouped[year] = {};
        if (!grouped[year][semType]) grouped[year][semType] = {};

        p.subjectBreakdown.forEach((sb) => {
          const semName = `Semester ${sb.semester}`;
          if (!grouped[year][semType][semName])
            grouped[year][semType][semName] = {};

          grouped[year][semType][semName][sb.subjectName] = {
            paymentId: p._id,
            subjectId: sb.subjectId?._id || sb.subjectId,
            termWork: sb.termTestAssessment?.amount || 0,
            oralPractical: sb.oralPracticalAssessment?.amount || 0,
            semesterPapers: sb.paperChecking?.amount || 0,
            amount: `₹${sb.subjectTotal.toLocaleString()}`,
            status: p.status === "unpaid" ? "Pending" : "Completed",
            dueDate: new Date(p.createdAt).toLocaleDateString("en-GB"),
          };
        });
      });

      return grouped;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load faculty payments"
      );
    }
  }
);

const paymentSlice = createSlice({
  name: "payments",
  initialState: {
    payments: [],
    paidPayments: [],
    facultyPaymentDetails: null,
    facultyPayments: {}, // used in facultyPayments.jsx for faculty panel(payments sidebar)
    loading: {
      list: false,
      paidList: false,
      paymentDetailList: false,
      facultyPayments: false,
    },
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all payments
      .addCase(fetchPayments.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading.list = false;
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading.list = false;
        state.error = action.payload;
      })
      //   Mark payment as paid
      .addCase(makePaymentPaid.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(makePaymentPaid.fulfilled, (state, action) => {
        state.loading.list = false;
        const payment = state.payments.find(
          (p) => p._id === action.payload.paymentId
        );
        if (payment) {
          payment.status = "paid";
        }
      })
      .addCase(makePaymentPaid.rejected, (state, action) => {
        state.loading.list = false;
        state.error = action.payload;
      })
      // CREATE PAYMENTS
      .addCase(createPayment.pending, (state) => {
        //  state.loading.create = true;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        //  state.loading.create = false;
        state.payments.unshift(action.payload); // optional instant update
      })
      .addCase(createPayment.rejected, (state, action) => {
        // state.loading.create = false;
        state.error = action.payload;
      })
      //Fetch Paid Payments
      .addCase(fetchPaidPayments.pending, (state) => {
        state.loading.paidList = true;
        state.error = null;
      })
      .addCase(fetchPaidPayments.fulfilled, (state, action) => {
        state.loading.paidList = false;
        state.paidPayments = action.payload;
      })
      .addCase(fetchPaidPayments.rejected, (state, action) => {
        state.loading.paidList = false;
        state.error = action.payload;
      })
      // Fetch faculty payment details
      .addCase(fetchFacultyPaymentDetails.pending, (state) => {
        state.loading.paymentDetailList = true;
        state.error = null;
        state.facultyPaymentDetails = null;
      })
      .addCase(fetchFacultyPaymentDetails.fulfilled, (state, action) => {
        state.loading.paymentDetailList = false;
        state.facultyPaymentDetails = action.payload;
      })
      .addCase(fetchFacultyPaymentDetails.rejected, (state, action) => {
        state.loading.paymentDetailList = false;
        state.facultyPaymentDetails = null;
        state.error = action.payload;
      })
      //fetching faculty Payments in faculty panel
      .addCase(fetchFacultyPayments.pending, (state) => {
        state.loading.facultyPayments = true;
        state.error = null;
      })
      .addCase(fetchFacultyPayments.fulfilled, (state, action) => {
        state.loading.facultyPayments = false;
        state.facultyPayments = action.payload;
      })
      .addCase(fetchFacultyPayments.rejected, (state, action) => {
        state.loading.facultyPayments = false;
        state.error = action.payload;
      });
  },
});

export default paymentSlice;
