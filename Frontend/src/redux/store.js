import { configureStore } from "@reduxjs/toolkit";
import subjectSlice from "./slices/subjectSlice.js";
import paymentSlice from "./slices/paymentSlice.js";
import subjectRemunerationSlice from "./slices/subjectRemunerationSlice.js";

const store = configureStore({
  reducer: {
    // Add your reducers here
    subjects: subjectSlice,
    payments: paymentSlice,
    subjectRemuneration: subjectRemunerationSlice,
  },
});

export default store;
