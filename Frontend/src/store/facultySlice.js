import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import api from "../utils/api";

// Thunk 1 ==> Add new Faculty member
export const addFaculty = createAsyncThunk(
  "faculty/addFaculty",
  async ({ formData, assignedSubjects }, { rejectWithValue }) => {
    try {
      // Build academicAssignments (same logic as component)
      const academicAssignments = [];

      assignedSubjects.forEach((a) => {
        let yearGroup = academicAssignments.find(
          (grp) => grp.academicYear === a.academicYear
        );
        if (!yearGroup) {
          yearGroup = { academicYear: a.academicYear, semesters: [] };
          academicAssignments.push(yearGroup);
        }

        let semGroup = yearGroup.semesters.find(
          (s) => s.semesterType === a.semesterType
        );
        if (!semGroup) {
          semGroup = { semesterType: a.semesterType, subjects: [] };
          yearGroup.semesters.push(semGroup);
        }

        semGroup.subjects.push({
          name: a.subjectName,
          department: a.branch,
          semester: Number(a.semester),
        });
      });

      const facultyData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        department: formData.department,
        designation: formData.designation,
        travelAllowance: Number(formData.travelAllowance),
        academicAssignments,
      };

      const response = await api.post("/admin/faculty/add", facultyData);
      return response.data; // created faculty or message
    } catch (err) {
      // Normalize error for component
      const status = err.response?.status;
      const message = err.response?.data?.message || "Failed to create faculty. Please try again.(Frontend Error)";

      return rejectWithValue({ status, message });
    }
  }
);

// Thunk 2 ==> Update faculty subject assignments 
export const updateFacultyAssignments = createAsyncThunk(
  "faculty/updateFacultyAssignments",
  async ({ id, academicYear, semesterType, subjects }, { rejectWithValue }) => {
    try {
      const res = await api.put(
        `/admin/faculty/${id}/update`,
        {
          academicYear,
          semesterType,
          subjects,
        }
      );
      return res.data; // backend response
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update assignments"
      );
    }
  }
);

// Thunk 3 ==> Remove subject that are already assigned to faculty
export const removeFacultySubject = createAsyncThunk(
  "faculty/removeFacultySubject",
  async (
    { id, academicYear, semesterType, subjectId }, { rejectWithValue }
  ) => {
    try {
      await api.put(`/admin/faculty/${id}/remove-subject`, {
        academicYear,
        semesterType,
        subjectId,
      });

      // return payload needed to update state
      return { academicYear, semesterType, subjectId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to remove subject"
      );
    }
  }
);

// Thunk 4 ==> Fetch all faculty members
export const fetchFaculties = createAsyncThunk(
  "faculty/fetchFaculties",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/faculty/getAll");
      console.log("Faculties fetched", response.data);
      return response.data;
    } catch (err) {
      console.log("Fetch faculty error ==> ", err);
      console.log(err.response?.data?.error); // Log the actual error message from backend
      console.log(err.response?.status); // Log the status code from backend

      const status = err.response?.status;
      const message =
        err.response?.data?.error ||
        "Failed to load faculty data (Frontend Error)";
      return rejectWithValue({ status, message });
    }
  }
);

// Thunk 5 ==> Fetch a single faculty member details by ID
export const fetchFacultyById = createAsyncThunk(
  "faculty/fetchFacultyById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/faculty/getSingle/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status,
        message: "Failed to fetch faculty details",
      });
    }
  }
);

// Thunk 6 ==> Edit faculty member details

// Thunk 7 ==> Delete faculty member
export const deleteFaculty = createAsyncThunk(
  "faculty/deleteFaculty",
  async (facultyId, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/faculty/delete/${facultyId}`);
      return facultyId; // return id so we can update state in extraReducers
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Delete failed (Frontend Error)"
      );
    }
  }
);

const facultySlice = createSlice({
  name: "faculty",
  initialState: {
    facultyList: [],
    facultyDetails: null,
    lastCreated: null, // to hold last created faculty info if needed (in Thunk 1)
    updateSuccess: false, // to track successful updates (in Thunk 2)
    loading: {
      addFacultyLoading: false,
      updateAssignmentLoading: false,
      fetchFacultiesLoading: false,
      fetchFacultyByIdLoading: false,
    },
    error: null,
  },
  reducers: {
    resetUpdateState: (state) => { // Used in Pages ==> [1] UpdateAssignment.jsx 
      state.updateSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ******** Thunk 1 ******** Used in Pages ==> [1] AddFacultyForm.jsx ✅ 
      .addCase(addFaculty.pending, (state) => {
        state.loading.addFacultyLoading = true;
        state.error = null;
      })
      .addCase(addFaculty.fulfilled, (state, action) => {
        state.loading.addFacultyLoading = false;
        state.lastCreated = action.payload;
        toast.success("Faculty created successfully");
      })
      .addCase(addFaculty.rejected, (state, action) => {
        state.loading.addFacultyLoading = false;
        state.error = action.payload;
        toast.error(action.payload?.message);
      })

      // ******** Thunk 2 ******** Used in Pages ==> [1] UpdateAssignment.jsx ✅
      .addCase(updateFacultyAssignments.pending, (state) => {
        state.loading.updateAssignmentLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateFacultyAssignments.fulfilled, (state) => {
        state.loading.updateAssignmentLoading = false;
        state.updateSuccess = true;
        toast.success("Faculty assignments updated successfully");
      })
      .addCase(updateFacultyAssignments.rejected, (state, action) => {
        state.loading.updateAssignmentLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // ******** Thunk 3 ******** Used in Pages ==> [1] UpdateAssignment.jsx (No Loading Required)
      .addCase(removeFacultySubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFacultySubject.fulfilled, (state, action) => {
        const { academicYear, semesterType, subjectId } = action.payload;

        if (!state.facultyDetails) return;

        state.facultyDetails.assignedSubjects =
          state.facultyDetails.assignedSubjects
            .map((yearBlock) => {
              if (yearBlock.academicYear !== academicYear) return yearBlock;

              return {
                ...yearBlock,
                semesters: yearBlock.semesters
                  .map((semBlock) => {
                    if (semBlock.semesterType !== semesterType) return semBlock;

                    return {
                      ...semBlock,
                      subjects: semBlock.subjects.filter(
                        (subj) => subj.subjectId !== subjectId
                      ),
                    };
                  })
                  .filter((s) => s.subjects.length > 0),
              };
            })
            .filter((y) => y.semesters.length > 0);

        state.loading = false;
        toast.success("Subject removed from faculty assignments");
      })
      .addCase(removeFacultySubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // ******** Thunk 4 ******** Used in Pages ==> [1] FacultyManagement.jsx ✅ 
      .addCase(fetchFaculties.pending, (state) => {
        state.loading.fetchFacultiesLoading = true;
        state.error = null;
      })
      .addCase(fetchFaculties.fulfilled, (state, action) => {
        state.loading.fetchFacultiesLoading = false;
        state.facultyList = action.payload;
        toast.success("Faculty List loaded successfully");
      })
      .addCase(fetchFaculties.rejected, (state, action) => {
        state.loading.fetchFacultiesLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      
      // ******** Thunk 5 ******** Used in Pages ==> [1] FacultyDetails.jsx ✅ [2] UpdateAssignment.jsx (No Loading Required)
      .addCase(fetchFacultyById.pending, (state) => {
        state.loading.fetchFacultyByIdLoading = true;
        state.error = null;
      })
      .addCase(fetchFacultyById.fulfilled, (state, action) => {
        state.loading.fetchFacultyByIdLoading = false;
        state.facultyDetails = action.payload;
        toast.success("Faculty details loaded successfully");
      })
      .addCase(fetchFacultyById.rejected, (state, action) => {
        state.loading.fetchFacultyByIdLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // ******** Thunk 6 ********

      // ******** Thunk 7 ********  Used in Pages ==> [1] FacultyManagement.jsx ✅  
      .addCase(deleteFaculty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFaculty.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const facultyId = action.payload; // ID of deleted faculty member
        state.facultyList = state.facultyList.filter(
          (faculty) => faculty._id !== facultyId
        ); // Update with fresh list after deletion
        toast.success("Faculty deleted successfully");
      })
      .addCase(deleteFaculty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetUpdateState } = facultySlice.actions;
export default facultySlice;
