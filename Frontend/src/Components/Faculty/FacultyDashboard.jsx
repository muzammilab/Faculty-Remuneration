import { useEffect, useState } from "react";
import {
  FaUser,
  FaBus,
  FaChalkboardTeacher,
  FaEdit,
  FaBook,
  FaCalendarAlt,
} from "react-icons/fa";
import AdminNavbar from "../Admin/AdminNavbar";
import FacultyMobileSidebar from "./FacultyMobileSidebar";
import FacultyDesktopSidebar from "./FacultyDesktopSidebar";
import api from "../../utils/api";

function FacultyDashboard() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [facultyData, setFacultyData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSidebarOpen = () => setShowSidebar(true);
  const handleSidebarClose = () => setShowSidebar(false);

  useEffect(() => {
    const facultyId = localStorage.getItem("facultyId");
    const token = localStorage.getItem("token");

    if (!facultyId || !token) {
      console.error("No facultyId or token found in localStorage");
      setLoading(false);
      return;
    }

    const fetchFacultyData = async () => {
      try {
        const facultyRes = await api.get(
          `/admin/faculty/getSingle/${facultyId}`
        );
        console.log("Getting Faculty Details for Dashboard");
        console.log(facultyRes.data);
        setFacultyData(facultyRes.data);
      } catch (err) {
        console.error("Error fetching Faculty Data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, []);

  // Calculate total subjects
  const totalSubjects =
    facultyData?.assignedSubjects?.reduce(
      (acc, yg) =>
        acc + yg.semesters.reduce((s, sg) => s + sg.subjects.length, 0),
      0
    ) || 0;

  const {
    name,
    email,
    phone,
    department,
    designation,
    employeeId,
    travelAllowance,
    assignedSubjects,
  } = facultyData || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Mobile Sidebar */}
        <FacultyMobileSidebar
          handleSidebarClose={handleSidebarClose}
          showSidebar={showSidebar}
        />

        {/* Desktop Sidebar */}
        <FacultyDesktopSidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <AdminNavbar
            handleSidebarOpen={handleSidebarOpen}
            page="Dashboard"
            desc="Welcome to your faculty dashboard"
          />

          <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-full">
                    <p className="text-emerald-100 text-sm font-medium mb-1">
                      Travel Allowance
                    </p>
                    {loading ? (
                      <div className="h-9 w-32 bg-white/20 rounded animate-pulse"></div>
                    ) : (
                      <p className="text-3xl font-bold">
                        ₹{travelAllowance?.toLocaleString() || 0}
                      </p>
                    )}
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <FaBus className="text-3xl opacity-90" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-full">
                    <p className="text-blue-100 text-sm font-medium mb-1">
                      Assigned Subjects
                    </p>
                    {loading ? (
                      <div className="h-9 w-32 bg-white/20 rounded animate-pulse"></div>
                    ) : (
                      <p className="text-3xl font-bold">
                        {totalSubjects} Active
                      </p>
                    )}
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <FaChalkboardTeacher className="text-3xl opacity-90" />
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                      <FaUser className="text-blue-600" size={18} />
                      Profile Information
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Your personal and professional details
                    </p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:shadow-md hover:border-gray-300 transition-all">
                    <FaEdit size={14} />
                    Edit Profile
                  </button>
                </div>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                        <div className="h-3 w-20 bg-gray-300 rounded animate-pulse mb-3"></div>
                        <div className="h-5 w-full bg-gray-300 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                        Full Name
                      </div>
                      <div className="font-bold text-gray-900">{name}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                        Email
                      </div>
                      <div className="font-bold text-gray-900 truncate">
                        {email}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                        Phone Number
                      </div>
                      <div className="font-bold text-gray-900">{phone}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                        Department
                      </div>
                      <div className="font-bold text-gray-900">
                        {department}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                        Designation
                      </div>
                      <div className="font-bold text-gray-900">
                        {designation}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                        Employee ID
                      </div>
                      <div className="font-bold text-gray-900">
                        {employeeId || "x-x-x-x"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Subjects */}
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                  <FaBook className="text-blue-600" size={18} />
                  Assigned Subjects
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Your current teaching assignments
                </p>
              </div>

              {loading ? (
                <div className="p-6 space-y-6">
                  {[...Array(2)].map((_, idx) => (
                    <div key={idx}>
                      <div className="h-12 bg-blue-50 rounded-xl mb-4 animate-pulse"></div>
                      <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Subject Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Semester
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {[...Array(3)].map((_, rowIdx) => (
                              <tr key={rowIdx}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="h-5 bg-gray-200 rounded animate-pulse w-40"></div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-24"></div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : assignedSubjects && assignedSubjects.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {assignedSubjects.map((yearGroup, yIdx) => (
                    <div key={yIdx} className="p-6">
                      <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <FaCalendarAlt className="text-blue-600" size={16} />
                        <h4 className="text-base font-bold text-blue-800">
                          Academic Year: {yearGroup.academicYear}
                        </h4>
                      </div>

                      {yearGroup.semesters.map((semGroup, sIdx) => (
                        <div key={sIdx} className="mb-6 last:mb-0">
                          <div className="flex items-center gap-3 mb-3 pl-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <p className="font-semibold text-gray-700">
                              {semGroup.semesterType} Semester
                            </p>
                          </div>

                          <div className="overflow-x-auto rounded-xl border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Subject Name
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Semester
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-100">
                                {semGroup.subjects.map((subj, subjIdx) => (
                                  <tr
                                    key={subjIdx}
                                    className="hover:bg-gray-50 transition-colors"
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                        <span className="font-medium text-gray-900">
                                          {subj.name}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                        Semester {subj.semester}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                        Active
                                      </span>
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
                <div className="px-6 py-12 text-center">
                  <FaBook className="mx-auto h-12 w-12 text-gray-400 mb-4 opacity-50" />
                  <p className="text-sm text-gray-500">No assigned subjects</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center text-gray-500 text-sm py-6 border-t border-gray-200 mt-8">
            <div className="px-4 sm:px-6 lg:px-8">
              Role: <span className="font-bold text-gray-900">Faculty</span> | ©{" "}
              {new Date().getFullYear()} Rizvi College of Engineering
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboard;
