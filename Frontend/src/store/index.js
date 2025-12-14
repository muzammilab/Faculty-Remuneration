import { configureStore } from '@reduxjs/toolkit';

import facultyListSlice from './facultyListSlice';
import facultyDataSlice from './facultyDataSlice';
import subjectDetailsSlice from './subjectDetailsSlice';

const remunerationStore = configureStore({
  reducer: {
    facultyList: facultyListSlice.reducer,
    facultyData: facultyDataSlice.reducer,
    subjectDetails: subjectDetailsSlice.reducer,
  },
});

export default remunerationStore;