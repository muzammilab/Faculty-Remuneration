import { configureStore } from '@reduxjs/toolkit';
import subjectSlice from './subjectSlice';
import facultySlice from './facultySlice';

const remunerationStore = configureStore({
  reducer: {
    subjectSlice: subjectSlice.reducer,
    facultySlice: facultySlice.reducer,
  },
});

export default remunerationStore;