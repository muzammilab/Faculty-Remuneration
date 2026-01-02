import { useState, useEffect } from "react";
import { FaArrowLeft, FaBookOpen, FaCalendarAlt, FaLayerGroup, FaPlus, FaTrash, FaUser, FaBuilding, FaSave, FaEdit } from "react-icons/fa";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import AdminDesktopSidebar from "../AdminDesktopSidebar";
import Select from "react-select";
import toast from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";
import { fetchFacultyById, removeFacultySubject, updateFacultyAssignments, resetUpdateState } from "../../../store/facultySlice";
import { fetchSubjectsBySemester, clearSubjects } from "../../../store/subjectSlice";

function UpdateAssignment() {
  const dispatch = useDispatch();
  const { facultyDetails: faculty, updateSuccess, loading, error } = useSelector((state) => state.facultySlice);
  const { subjects: subjectOptions } = useSelector((state) => state.subjectSlice);
  const isLoading = loading.updateAssignmentLoading;
  // const faculty = facultyDetails || {};
  // const subjectOptions = subjects;

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const { facultyName, facultyDepartment } = location.state || {};

  const branchOptions = [
    { value: "Computer Engineering", label: "Computer Engineering" },
    { value: "AIDS Engineering", label: "Artificial Intelligence & Data Science Engineering" },
    { value: "ECS Engineering", label: "Electronics & Computer Science Engineering" },
    { value: "Mechanical Engineering", label: "Mechanical Engineering" },
    { value: "Civil Engineering", label: "Civil Engineering" },
  ];

  // const [faculty, setFaculty] = useState([]);
  // const [subjectOptions, setSubjectOptions] = useState([]);
  const [formData, setFormData] = useState({
    academicYear: "",
    semesterType: "",
    branch: "", // ← NEW
    semester: "",
    subject: "",
    subjectName: "", // ← NEW
    subjects: [],
  });

  // Fetch faculty details
  useEffect(() => {
    if (id) {
      dispatch(fetchFacultyById(id));
      console.log("Faculty details are ", faculty);
    }
  }, [id, dispatch]);

  // Fetch subjects based on selected semester and department from redux store
  useEffect(() => {
    if (formData.semester && formData.branch) {
      dispatch(
        fetchSubjectsBySemester({
          semester: formData.semester,
          department: formData.branch,
        })
      )
        .unwrap()
        .catch((err) => {
          if (err?.status === 401) {
            toast.error("Authentication failed. Please login again.");
            navigate("/login");
          }
        });
    } else {
      dispatch(clearSubjects());
    }
  }, [formData.semester, formData.branch, dispatch, navigate]);

  const handleDeleteSubject = async (academicYear, semesterType, subjectId) => {
    if (!subjectId) {
      console.error("Missing subjectId for deletion");
      return;
    }

      dispatch(
        removeFacultySubject({
          id,
          academicYear,
          semesterType,
          subjectId,
        })
      )
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (formData.semester && formData.subject && formData.branch) { // ← ADDed formData.branch
      if (
        !formData.subjects.some(
          (s) => s.name === formData.subject && s.semester === formData.semester
        )
      ) {
        setFormData((prev) => ({
          ...prev,
          subjects: [
            ...prev.subjects,
            { subjectId: formData.subject, name: formData.subjectName, semester: formData.semester, branch: formData.branch /* ← NEW branch field */ },
          ],
        }));
        setFormData((prev) => ({ ...prev, subject: "" }));
      }
    }
  };

  const handleRemoveAssignment = (index) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(
      updateFacultyAssignments({
        id: id,
        academicYear: formData.academicYear,
        semesterType: formData.semesterType,
        subjects: formData.subjects,
      })
    )
  };

  useEffect(() => {
    if (updateSuccess) {
      // Reset form after updating faculties assigned subjects
      setFormData({
        academicYear: "",
        semesterType: "",
        branch: "",  // ← NEW
        semester: "",
        subject: "",
        subjectName: "", // ← NEW
        subjects: [],
      });

      // very important: reset redux flag (i.e. reset the updateSuccess to false)
      dispatch(resetUpdateState());
    }
  }, [updateSuccess, dispatch]);

  const getSemesterOptions = () => {
    if (formData.semesterType === "Odd") return [1, 3, 5, 7];
    if (formData.semesterType === "Even") return [2, 4, 6, 8];
    return [];
  };

  const handleGoBack = () => {
    navigate(`/admin/facultymanager/details/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <AdminDesktopSidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* NEW Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleGoBack}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer"
                >
                  <FaArrowLeft size={16} />
                  Back
                </button>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                    Update Assignments
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Update faculty subjects for a new academic year or semester
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Update Form Card */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm p-8">
                  {facultyName && (
                    <div className="flex items-center gap-3 mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <FaUser className="text-gray-500" size={18} />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          Faculty: {facultyName}
                        </h4>
                        {/* Add department display */}
                        {facultyDepartment && (
                          <p className="text-sm text-gray-500 mt-1">Department: {facultyDepartment}</p>  // ← ADD THIS
                        )}
                        {/* <p className="text-sm text-gray-600">ID: {id}</p> */} {/* <-- Just for checking */}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Academic Year & Semester Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-500" size={16} />
                          Academic Year
                        </label>
                        <select
                          value={formData.academicYear?.slice(0, 4) || ""}
                          onChange={(e) => {
                            const start = e.target.value;
                            const end = (parseInt(start) + 1)
                              .toString()
                              .slice(-2);
                            setFormData({
                              ...formData,
                              academicYear: `${start}-${end}`,
                            });
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Year</option>
                          {Array.from({ length: 6 }, (_, i) => 2024 + i).map(
                            (year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            )
                          )}
                        </select>
                        {formData.academicYear && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-3">
                            Selected: {formData.academicYear}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <FaLayerGroup className="text-gray-500" size={16} />
                          Semester Type
                        </label>
                        <select
                          value={formData.semesterType}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              semesterType: e.target.value,
                              branch: "",  // ← NEW
                              semester: "",
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Semester Type</option>
                          <option value="Odd">Odd</option>
                          <option value="Even">Even</option>
                        </select>
                      </div>
                    </div>

                    {/* NEW: Engineering Branch Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <FaBuilding className="text-gray-500" size={16} />
                        Engineering Branch
                      </label>
                      <Select
                        options={branchOptions}
                        value={
                          formData.branch
                            ? {
                                value: formData.branch,
                                label: branchOptions.find((b) => b.value === formData.branch)?.label || formData.branch,
                              }
                            : null
                        }
                        onChange={(selected) =>
                          setFormData({
                            ...formData,
                            branch: selected ? selected.value : "",
                            semester: "",
                          })
                        }
                        placeholder="Select Engineering Branch"
                        isDisabled={!formData.semesterType}
                        className="basic-select"
                        classNamePrefix="select"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            padding: "4px",
                            minHeight: "48px",
                            boxShadow: "none",
                          }),
                        }}
                      />
                      {formData.branch && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-3 block">
                          Selected Branch: {branchOptions.find((b) => b.value === formData.branch)?.label}
                        </span>
                      )}
                    </div>

                    {/* Semester & Subject */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Semester
                        </label>
                        <Select
                          options={getSemesterOptions().map((sem) => ({
                            value: sem,
                            label: `Semester ${sem}`,
                          }))}
                          value={
                            formData.semester
                              ? {
                                  value: formData.semester,
                                  label: `Semester ${formData.semester}`,
                                }
                              : null
                          }
                          onChange={(selected) =>
                            setFormData({
                              ...formData,
                              semester: selected ? selected.value : "",
                            })
                          }
                          placeholder="Select Semester"
                          isDisabled={!formData.semesterType || !formData.branch}
                          className="basic-select"
                          classNamePrefix="select"
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              border: "1px solid #e5e7eb",
                              borderRadius: "12px",
                              padding: "4px",
                              minHeight: "48px",
                              boxShadow: "none",
                            }),
                          }}
                        />
                      </div>

                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Subjects
                          </label>
                          <Select
                            options={subjectOptions.map((sub) => ({
      value: sub.subjectId,
      label: sub.name,
    }))}

    value={
      formData.subject
        ? {
            value: formData.subject,
            label: formData.subjectName,
          }
        : null
    }

    onChange={(selected) => {
      console.log('Selected:', selected);
      setFormData((prev) => ({
        ...prev,
        subject: selected ? selected.value : "",
        subjectName: selected ? selected.label : "",
      }))
    }}
                            placeholder="Select Subject"
                            isDisabled={!formData.semester || !formData.branch}
                            className="basic-select"
                            classNamePrefix="select"
                            styles={{
                              control: (provided) => ({
                                ...provided,
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                padding: "4px",
                                minHeight: "48px",
                                boxShadow: "none",
                              }),
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddSubject}
                          disabled={!(formData.semester && formData.subject && formData.branch)}
                          className="flex items-center justify-center w-12 h-12 bg-blue-50 border-2 border-blue-200 text-blue-700 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md cursor-pointer"
                        >
                          <FaPlus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* New Assigned Subjects List */}
                    {formData.subjects.length > 0 && (
                      <div>
                        <h6 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          New Assignments:
                        </h6>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {formData.subjects.map((subj, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                            >
                              {/* NEW display of selected subjects */}
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">
                                  {subj.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Sem {subj.semester} • {subj.branch}
                                </span>
                              </div>
                              <button
                                onClick={() => handleRemoveAssignment(index)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                              >
                                <FaTrash size={12} />
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* NEW BUTTON */}
                    <div className="flex justify-center pt-4 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={isLoading || formData.subjects.length === 0}
                        className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaSave size={18} /> {/* or FaCheck / FaEdit */}
                            Save Assignments
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                </div>
              </div>

              {/* Previously Assigned Subjects Table */}
              <div>
                <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm p-8 sticky top-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                      <FaBookOpen className="text-blue-600" size={20} />
                      Previous Assignments
                    </h3>
                  </div>

                  {faculty?.assignedSubjects &&
                  faculty.assignedSubjects.length > 0 ? (
                    <div className="space-y-6">
                      {faculty.assignedSubjects.map((yearGroup, yIdx) => (
                        <div key={yIdx}>
                          <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <h4 className="text-lg font-semibold text-blue-800">
                              Academic Year: {yearGroup.academicYear}
                            </h4>
                          </div>

                          {yearGroup.semesters.map((semGroup, sIdx) => (
                            <div key={sIdx} className="mb-6">
                              <div className="flex items-center gap-3 mb-4 pl-6">
                                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                <h5 className="text-sm font-semibold text-gray-700">
                                  {semGroup.semesterType} Semester
                                </h5>
                              </div>

                              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Subject Name
                                      </th>
                                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Branch
                                      </th>
                                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Semester
                                      </th>
                                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Action
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-100">
                                    {semGroup.subjects.map((subj, subjIdx) => (
                                      <tr
                                        key={subjIdx}
                                        className="hover:bg-gray-50 transition-colors"
                                      >
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                          {subj.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                          {subj.department}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                                            Semester {subj.semester}
                                          </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                          <button
                                            onClick={() =>
                                              handleDeleteSubject(
                                                yearGroup.academicYear,
                                                semGroup.semesterType,
                                                subj.subjectId
                                              )
                                            }
                                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-xl hover:bg-red-200 hover:shadow-md transition-all cursor-pointer"
                                          >
                                            <FaTrash size={14} />
                                            Remove
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FaBookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        No assigned subjects
                      </h4>
                      <p className="text-gray-500">
                        No subjects assigned to this faculty yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateAssignment;
