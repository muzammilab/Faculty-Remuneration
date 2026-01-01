import { useState, useEffect } from "react";
import { FaSearch, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminNavbar from "../AdminNavbar";
import AdminMobileSidebar from "../AdminMobileSidebar";
import AdminDesktopSidebar from "../AdminDesktopSidebar";

import { useDispatch, useSelector } from "react-redux";
import { fetchFaculties, deleteFaculty } from "../../../store/facultySlice";

function FacultyManagement() {

  const dispatch = useDispatch();
  const { facultyList, loading, error } = useSelector((state) => state.facultySlice);
  const isLoading = loading.fetchFacultiesLoading;

  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSidebarOpen = () => setShowSidebar(true);
  const handleSidebarClose = () => setShowSidebar(false);

  useEffect(() => {
    dispatch(fetchFaculties())
      .unwrap() // Used when API fails or succeeds, do I need to do something immediately in THIS component?” If NO 👉 don’t use .unwrap(), If YES 👉 use .unwrap()
      .catch((err) => {
        console.log(err);
        if (err?.status === 401) {
          toast.error("Authentication failed. Please login again.");
          navigate("/login");
        }
      });
  }, [dispatch, navigate]);

  const handleFacultyClick = (facultyId) => {
    navigate(`/admin/facultymanager/details/${facultyId}`);
  };

  const handleAddFaculty = () => {
    navigate("/admin/facultymanager/add");
  };

  const handleEditFaculty = (facultyId) => {
    navigate(`/admin/facultymanager/edit/${facultyId}`);
  };

  const handleDeleteFaculty = async (facultyId, facultyName) => {
    if (window.confirm(`Are you sure you want to delete ${facultyName}?`)) {
      dispatch(deleteFaculty(facultyId));
    }
  };

  const filteredFaculties = facultyList.filter(
    (faculty) =>
      faculty.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Mobile Sidebar */}
        <AdminMobileSidebar handleSidebarClose={handleSidebarClose} showSidebar={showSidebar} />

        {/* Desktop Sidebar */}
        <AdminDesktopSidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <AdminNavbar
            handleSidebarOpen={handleSidebarOpen}
            page="Faculty Management"
            desc="Manage faculty member information"
          />

          <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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

            {/* Search Bar */}
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm">
              <div className="p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" size={16} />
                      </div>
                      <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition-colors"
                        placeholder="Search by faculty name, role, email or department"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Faculty Button */}
            <div className="flex justify-end">
              <button
                onClick={handleAddFaculty}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg transition-shadow text-sm font-semibold cursor-pointer"
              >
                <FaUserPlus size={16} />
                Add Faculty
              </button>
            </div>

            {/* Faculty Table */}
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm overflow-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Faculty List</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {filteredFaculties.length} {filteredFaculties.length === 1 ? "faculty" : "faculties"}
                </span>
              </div>

              {isLoading ? (
                <div className="px-6 py-20 text-center">
                  <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-sm text-gray-500">Loading faculty data...</p>
                </div>
              ) : filteredFaculties.length === 0 ? (
                <div className="px-6 py-20 text-center">
                  <p className="text-sm text-gray-500">No faculty members found.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50/70">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile Number</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/60 divide-y divide-gray-100">
                    {filteredFaculties.map((faculty) => (
                      <tr key={faculty._id} className="hover:bg-blue-50/60 transition-colors cursor-default">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleFacultyClick(faculty._id)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                            style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                          >
                            {faculty.name}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {faculty.department}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {faculty.designation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {faculty.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {faculty.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditFaculty(faculty._id)}
                            className="text-blue-600 hover:text-blue-800 mr-3 transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteFaculty(faculty._id, faculty.name)}
                            className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyManagement;
