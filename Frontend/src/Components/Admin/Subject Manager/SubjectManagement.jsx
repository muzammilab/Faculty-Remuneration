import { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaTimes, FaBook, FaGraduationCap, FaCheckCircle, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../AdminNavbar";
import AdminMobileSidebar from "../AdminMobileSidebar";
import AdminDesktopSidebar from "../AdminDesktopSidebar";

import { useDispatch, useSelector } from 'react-redux';
import { fetchSubjects, fetchSubjecDetails, createSubject, updateSubject, deleteSubject } from "../../../store/subjectSlice"; 

function SubjectsManagement() {
  const dispatch = useDispatch();
  // Fetch subjects from Redux store
  const { subjects, loading, error } = useSelector((state) => state.subjectSlice); // all fetched subjects are stored here using Redux store and loading state while performing async operations 

  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false); // for showing mobile sidebar
  const [showModal, setShowModal] = useState(false); // for showing add/edit subject modal
  const [searchTerm, setSearchTerm] = useState(""); // search input state used for searching subjects in search bar 

  // Filter states 
  const [selectedBranch, setSelectedBranch] = useState("Computer Engineering"); // for toggling branch buttons
  const [selectedSemester, setSelectedSemester] = useState("all"); // for semester dropdown to show particular semester subjects

  const [editingSubject, setEditingSubject] = useState(null); // to track which subject is being edited
  const [subjectData, setSubjectData] = useState({
    name: "",
    code: "",
    semester: "",
    department: "",
    hasTermWork: false,   // <-- NEW
    hasTermTest: false,
    hasPractical: false,
    hasSemesterExam: false,
  });                       // form data for add/edit subject

  const handleShowModal = (subject = null) => {
    if (subject) {
      setEditingSubject(subject._id);
      setSubjectData({
        name: subject.name,
        code: subject.code,
        semester: subject.semester,
        department: subject.department,
        hasTermWork: subject.hasTermWork, // <-- NEW
        hasTermTest: subject.hasTermTest,
        hasPractical: subject.hasPractical,
        hasSemesterExam: subject.hasSemesterExam,
      });
    } else {
      setEditingSubject(null);
      setSubjectData({
        name: "",
        code: "",
        semester: "",
        department: "",
        hasTermWork: false, // <-- NEW
        hasTermTest: false,
        hasPractical: false,
        hasSemesterExam: false,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false); // to close add/edit subject modal

  const handleSidebarOpen = () => setShowSidebar(true); // to open mobile sidebar
  const handleSidebarClose = () => setShowSidebar(false); // to close mobile sidebar

  // Fetch all subjects on component mount from Redux store
  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  // Handle form input changes while adding/editing subject
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSubjectData({
      ...subjectData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = async () => {
    if (editingSubject) {
      dispatch(updateSubject({ id: editingSubject, subjectData }));
    } else {
      dispatch(createSubject(subjectData));
    }
    handleCloseModal(); // Close modal after saving
  };

  const handleDelete = async (subjectId, subjectName) => {
    if (window.confirm(`Are you sure you want to delete ${subjectName}?`)) {
      dispatch(deleteSubject(subjectId));
    }
  };

  // Get unique branches
  const branches = [
    // "all",
    ...Array.from(new Set(subjects.map((s) => s.department))),
  ];
  const semesters = Array.from({ length: 8 }, (_, i) => i + 1);

  // Advanced filtering
  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch =
      selectedBranch === "all" || s.department === selectedBranch;
    const matchesSemester =
      selectedSemester === "all" || s.semester == selectedSemester;

    return matchesSearch && matchesBranch && matchesSemester;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Mobile Sidebar */}
        <AdminMobileSidebar handleSidebarClose={handleSidebarClose} showSidebar={showSidebar} />

        {/* Desktop Sidebar */}
        <AdminDesktopSidebar />

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <AdminNavbar
            handleSidebarOpen={handleSidebarOpen}
            page="Subjects Management"
            desc="Manage subject records with ease"
          />

          <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl px-4 py-3 flex items-start gap-3 shadow-sm">
                <svg
                  className="h-5 w-5 mt-0.5 text-red-400 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5 flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FaBook className="text-blue-600" size={22} />
                    </div>
                  </div>
                  <div className="w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500">
                      Total Subjects
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {subjects.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5 flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <FaCheckCircle className="text-green-600" size={22} />
                    </div>
                  </div>
                  <div className="w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500">
                      With Term Test
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {subjects.filter((s) => s.hasTermTest).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5 flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <FaCalendarAlt className="text-purple-600" size={22} />
                    </div>
                  </div>
                  <div className="w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500">
                      With Practicals
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {subjects.filter((s) => s.hasPractical).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm p-6">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FaGraduationCap className="text-blue-600" size={16} />
                Filter by Branch & Semester
              </h4>

              <div className="space-y-4">
                {/* Branch Toggle Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Branch
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {branches.map((branch) => (
                      <button
                        key={branch}
                        onClick={() => setSelectedBranch(branch)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                          selectedBranch === branch
                            ? "bg-blue-600 text-white border-blue-600 shadow-md hover:shadow-lg hover:bg-blue-700"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
                        }`}
                      >
                        {branch === "all" ? "All Branches" : branch}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Semester Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Semester
                    </label>
                    <div className="relative">
                      <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className="block w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white hover:border-gray-300 transition-colors appearance-none shadow-sm"
                      >
                        <option value="all">All Semesters</option>
                        {semesters.map((sem) => (
                          <option key={sem} value={sem}>
                            Semester {sem}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Search Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Search
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" size={16} />
                      </div>
                      <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white hover:border-gray-300 transition-colors shadow-sm"
                        placeholder="Search subjects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Subject Button */}
            <div className="justify-items-end">
              <button
                onClick={() => handleShowModal()}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:shadow-md hover:-translate-y-[1px] transition-all text-sm font-medium cursor-pointer border border-blue-600"
              >
                <FaPlus size={14} />
                <span className="hidden sm:inline">Add Subject</span>
              </button>
            </div>

            {/* Table Card with Subject Code Column */}
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                  Subject List
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {filteredSubjects.length}{" "}
                  {filteredSubjects.length === 1 ? "subject" : "subjects"}
                </span>
              </div>

              {loading ? (
                <div className="px-6 py-20 text-center">
                  <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-sm text-gray-500">
                    Loading subjects...
                  </p>
                </div>
              ) : filteredSubjects.length === 0 ? (
                <div className="px-6 py-20 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaBook className="text-gray-400" size={24} />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    No subjects found
                  </h3>
                  <p className="text-sm text-gray-500">
                    {searchTerm ||
                    selectedBranch !== "all" ||
                    selectedSemester !== "all"
                      ? "Try adjusting your filters"
                      : "Get started by adding a new subject"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50/70">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Subject Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Semester
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Assessment
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/60 divide-y divide-gray-100">
                      {filteredSubjects.map((subject) => (
                        <tr
                          key={subject._id}
                          className="hover:bg-blue-50/60 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                              <div className="text-sm font-medium text-gray-900">
                                {subject.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                              Semester {subject.semester}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {subject.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1.5">
                              {subject.hasTermTest && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                  TT
                                </span>
                              )}
                              {subject.hasTermWork && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                  TW
                                </span>
                              )}
                              {subject.hasPractical && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                  PR
                                </span>
                              )}
                              {subject.hasSemesterExam && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                                  SE
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleShowModal(subject)}
                              className="text-blue-600 hover:text-blue-800 mr-3 transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(subject._id, subject.name)
                              }
                              className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal with Subject Code Input */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex justify-center">
          <div className="absolute flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
              onClick={handleCloseModal}
            ></div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle">
              &#8203;
            </span>
            <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all duration-300 ease-out sm:my-8 sm:align-middle sm:max-w-lg sm:w-full scale-95 opacity-0 animate-modalIn">
              <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                      {editingSubject ? "Edit Subject" : "Add New Subject"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Configure subject details and assessment types
                    </p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes size={18} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={subjectData.name}
                      onChange={handleChange}
                      className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition-colors"
                      placeholder="Enter subject name"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Semester <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="semester"
                        value={subjectData.semester}
                        onChange={handleChange}
                        className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition-colors"
                        placeholder="1 - 8"
                        min="1"
                        max="8"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="department"
                        value={subjectData.department}
                        onChange={handleChange}
                        className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition-colors"
                      >
                        <option value="" disabled>
                          Select department
                        </option>
                        <option value="Computer Engineering">Computer Engineering</option>
                        <option value="AIDS Engineering">Artificial Intelligence & Data Science Engineering</option>
                        <option value="ECS Engineering">Electronics & Computer Science Engineering</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="block text-sm font-medium text-gray-700 mb-3">
                      Assessment Types
                    </p>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          name="hasTermWork"
                          checked={subjectData.hasTermWork}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          Has Term Work
                        </span>
                      </label>

                      <label className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          name="hasTermTest"
                          checked={subjectData.hasTermTest}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          Has Term Test
                        </span>
                      </label>

                      <label className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          name="hasPractical"
                          checked={subjectData.hasPractical}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          Has Practical/Oral
                        </span>
                      </label>

                      <label className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          name="hasSemesterExam"
                          checked={subjectData.hasSemesterExam}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          Has Semester Exam
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50/80 px-6 py-3 sm:flex sm:flex-row-reverse gap-3">
                <button
                  onClick={handleSave}
                  className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-sm font-medium text-white hover:shadow-md hover:-translate-y-[1px] transition-all sm:ml-3 sm:w-auto cursor-pointer"
                >
                  {editingSubject ? "Update Subject" : "Save Subject"}
                </button>
                <button
                  onClick={handleCloseModal}
                  className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors sm:mt-0 sm:w-auto cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectsManagement;
