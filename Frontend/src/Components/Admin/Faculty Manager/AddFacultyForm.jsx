import { useState, useEffect } from "react";
import { FaArrowLeft, FaUserPlus, FaUserTie, FaBookOpen, FaEnvelope, FaCalendarAlt, FaLayerGroup, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import Select from "react-select";
import toast from "react-hot-toast";
import AdminDesktopSidebar from "../AdminDesktopSidebar";

function AddFacultyForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    designation: "",
    email: "",
    password: "",
    phone: "",
    travelAllowance: "",
    academicYear: "",
    semesterType: "",
    semester: "",
    subject: "",
  });

  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const departments = [
    "Computer",
    "Mechanical",
    "Electrical",
    "Civil",
    "AIDS",
    "ECS",
  ];
  const designations = [
    "Professor",
    "Associate Professor",
    "Assistant Professor",
    "HoD",
    "External Examiner",
  ];

  const handleSidebarOpen = () => setShowSidebar(true);
  const handleSidebarClose = () => setShowSidebar(false);

  const getSemesterOptions = () => {
    if (formData.semesterType === "Odd") return [1, 3, 5, 7];
    if (formData.semesterType === "Even") return [2, 4, 6, 8];
    return [];
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      if (formData.semester) {
        try {
          const res = await api.get(`/faculty/subject/getList?semester=${formData.semester}`);
          const subjectNames = res.data.map((subj) => subj.name);
          setSubjectOptions(subjectNames);
        } catch (err) {
          console.error("Failed to fetch subjects:", err);
          if (err.response?.status === 401) {
            toast.error("Authentication failed. Please login again.");
            navigate("/login");
          }
        }
      } else {
        setSubjectOptions([]);
      }
    };
    fetchSubjects();
  }, [formData.semester, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAssignment = (e) => {
    e.preventDefault();
    if (formData.semester && formData.subject) {
      const exists = assignedSubjects.some(
        (a) =>
          a.academicYear === formData.academicYear &&
          a.semesterType === formData.semesterType &&
          a.semester === formData.semester &&
          a.subject === formData.subject
      );

      if (!exists) {
        setAssignedSubjects((prev) => [
          ...prev,
          {
            academicYear: formData.academicYear,
            semesterType: formData.semesterType,
            semester: formData.semester,
            subject: formData.subject,
          },
        ]);
      }

      setFormData((prev) => ({ ...prev, subject: "", semester: "" }));
    }
  };

  const handleRemoveAssignment = (index) => {
    setAssignedSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
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
          name: a.subject,
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
      console.log("Faculty created successfully:", response.data);
      setSuccess(true);

      setFormData({
        name: "",
        department: "",
        designation: "",
        email: "",
        password: "",
        phone: "",
        travelAllowance: "",
        academicYear: "",
        semesterType: "",
        semester: "",
        subject: "",
      });
      setAssignedSubjects([]);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Error creating faculty:", err);
      if (err.response?.status === 403) {
        toast.error("A faculty with this email already exists.");
      } else if (err.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
        navigate("/login");
      } else {
        setError(
          err.response?.data?.error ||
            "Failed to create faculty. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/admin/facultymanager");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <AdminDesktopSidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:shadow-md hover:border-gray-300 transition-all"
              >
                <FaArrowLeft size={16} />
                Back
              </button>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Add Faculty Member</h1>
            </div>

            {/* Main Form Card */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Faculty Details */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <FaUserTie className="text-blue-600" size={20} />
                        <h3 className="text-xl font-semibold text-gray-900">Faculty Details</h3>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                          <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter faculty name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                          <Select
                            options={departments.map((dep) => ({
                              value: dep,
                              label: dep,
                            }))}
                            value={
                              formData.department
                                ? {
                                    value: formData.department,
                                    label: formData.department,
                                  }
                                : null
                            }
                            onChange={(selected) =>
                              setFormData((prev) => ({
                                ...prev,
                                department: selected ? selected.value : "",
                              }))
                            }
                            placeholder="Select Department"
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
                                "&:hover": {
                                  borderColor: "#e5e7eb",
                                },
                              }),
                              menu: (provided) => ({
                                ...provided,
                                borderRadius: "12px",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                              }),
                            }}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                          <Select
                            options={designations.map((des) => ({
                              value: des,
                              label: des,
                            }))}
                            value={
                              formData.designation
                                ? {
                                    value: formData.designation,
                                    label: formData.designation,
                                  }
                                : null
                            }
                            onChange={(selected) =>
                              setFormData((prev) => ({
                                ...prev,
                                designation: selected ? selected.value : "",
                              }))
                            }
                            placeholder="Select Designation"
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
                                "&:hover": {
                                  borderColor: "#e5e7eb",
                                },
                              }),
                              menu: (provided) => ({
                                ...provided,
                                borderRadius: "12px",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                              }),
                            }}
                            required
                          />
                        </div>

                        {/* Remuneration */}
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <FaUserPlus className="text-emerald-600" size={18} />
                            <h4 className="text-lg font-semibold text-gray-900">Remuneration Details</h4>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Travel Allowance</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 text-sm">₹</span>
                              </div>
                              <input
                                name="travelAllowance"
                                value={formData.travelAllowance}
                                onChange={handleChange}
                                type="number"
                                min="0"
                                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="Enter Travel Allowance"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact + Assignments */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <FaEnvelope className="text-blue-600" size={20} />
                        <h3 className="text-xl font-semibold text-gray-900">Contact Details</h3>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter email"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                          <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter password"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 text-sm font-medium">+91</span>
                            </div>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 10) {
                                  setFormData({ ...formData, phone: value.replace(/\D/g, "") });
                                }
                              }}
                              className="w-full pl-20 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter 10 digit contact number"
                              maxLength="10"
                              required
                            />
                          </div>
                        </div>

                        {/* Subject Assignments Card */}
                        <div className="bg-gray-50/80 backdrop-blur border border-gray-200 rounded-2xl p-6">
                          <div className="flex items-center gap-3 mb-6">
                            <FaBookOpen className="text-blue-600" size={20} />
                            <h4 className="text-lg font-semibold text-gray-900">Subject Assignments</h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FaCalendarAlt className="text-gray-500" size={14} />
                                Academic Year
                              </label>
                              <select
                                value={formData.academicYear?.slice(0, 4) || ""}
                                onChange={(e) => {
                                  const start = e.target.value;
                                  const end = (parseInt(start) + 1).toString().slice(-2);
                                  setFormData({
                                    ...formData,
                                    academicYear: `${start}-${end}`,
                                  });
                                }}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="">Select Year</option>
                                {Array.from({ length: 6 }, (_, i) => 2023 + i).map((year) => (
                                  <option key={year} value={year}>
                                    {year}
                                  </option>
                                ))}
                              </select>
                              {formData.academicYear && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                                  Academic Year: {formData.academicYear}
                                </span>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FaLayerGroup className="text-gray-500" size={14} />
                                Semester Type
                              </label>
                              <select
                                value={formData.semesterType}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    semesterType: e.target.value,
                                    semester: "",
                                  })
                                }
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              >
                                <option value="">Select Type</option>
                                <option value="Odd">Odd</option>
                                <option value="Even">Even</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
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
                                  setFormData((prev) => ({
                                    ...prev,
                                    semester: selected ? selected.value : "",
                                  }))
                                }
                                placeholder="Select Semester"
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
                                    "&:hover": {
                                      borderColor: "#e5e7eb",
                                    },
                                  }),
                                }}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
                              <Select
                                options={subjectOptions.map((sub) => ({
                                  value: sub,
                                  label: sub,
                                }))}
                                value={
                                  formData.subject
                                    ? {
                                        value: formData.subject,
                                        label: formData.subject,
                                      }
                                    : null
                                }
                                onChange={(selected) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    subject: selected ? selected.value : "",
                                  }))
                                }
                                placeholder="Select Subject"
                                isDisabled={!formData.semester}
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
                                    "&:hover": {
                                      borderColor: "#e5e7eb",
                                    },
                                  }),
                                }}
                              />
                            </div>
                          </div>

                          <button
                            onClick={handleAddAssignment}
                            disabled={!(formData.semester && formData.subject)}
                            className="flex items-center gap-2 px-6 py-2.5 border border-blue-300 rounded-full text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add Assignment
                          </button>

                          {assignedSubjects.length > 0 && (
                            <div className="mt-6">
                              <h6 className="text-sm font-semibold text-gray-900 mb-3">Assigned Subjects:</h6>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {assignedSubjects.map((a, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                  >
                                    <span className="text-sm font-medium text-gray-900">
                                      Semester {a.semester} - {a.subject}
                                    </span>
                                    <button
                                      onClick={() => handleRemoveAssignment(idx)}
                                      className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                      <FaTrash size={12} />
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <FaUserPlus size={18} />
                          Add Faculty
                        </>
                      )}
                    </button>
                  </div>

                  {/* Alerts */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-2xl px-6 py-4 flex items-start gap-3 shadow-sm">
                      <svg className="w-5 h-5 mt-0.5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">{error}</span>
                    </div>
                  )}
                  {success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-2xl px-6 py-4 flex items-start gap-3 shadow-sm">
                      <svg className="w-5 h-5 mt-0.5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Faculty member added successfully!</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddFacultyForm;
