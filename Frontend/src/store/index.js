import { configureStore } from "@reduxjs/toolkit";
import subjectSlice from "./subjectSlice";
import facultySlice from "./facultySlice";
import subjectRemunerationSlice from "./subjectRemunerationSlice";
import paymentSlice from "./paymentSlice";
import authSlice from "./authSlice";
import enrollmentSlice from "./enrollmentSlice";

const remunerationStore = configureStore({
  reducer: {
    subjectSlice: subjectSlice.reducer,
    facultySlice: facultySlice.reducer,
    subjectRemuneration: subjectRemunerationSlice.reducer,
    paymentSlice: paymentSlice.reducer,
    authSlice: authSlice.reducer,
    enrollmentSlice: enrollmentSlice.reducer,
  },
});

export default remunerationStore;
