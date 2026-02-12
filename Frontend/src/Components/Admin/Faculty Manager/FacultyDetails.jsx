import { useEffect, useState } from "react";
import {
  FaBars,
  FaEdit,
  FaArrowLeft,
  FaUser,
  FaPhone,
  FaBuilding,
  FaEnvelope,
  FaBook,
  FaDollarSign,
} from "react-icons/fa";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
import { useNavigate, useParams } from "react-router-dom";
import AdminDesktopSidebar from "../AdminDesktopSidebar";

import { useDispatch, useSelector } from "react-redux";
import { fetchFacultyById } from "../../../store/facultySlice";
import api from "../../../utils/api";

function FacultyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [remuneration, setRemuneration] = useState([]);
  // const [faculty, setFaculty] = useState(null);
  // const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const {
    facultyDetails: faculty,
    loading,
    error,
  } = useSelector((state) => state.facultySlice);
  const isLoading = loading.fetchFacultyByIdLoading;

  const handleGoBack = () => navigate("/admin/facultymanager");

  // Fetch faculty details
  useEffect(() => {
    if (id) {
      dispatch(fetchFacultyById(id));
      console.log("Faculty details are", faculty);
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (!faculty?.assignedSubjects?.length) return;

    const uniqueYears = [
      ...new Set(
        faculty.assignedSubjects.map((yg) => yg?.academicYear).filter(Boolean)
      ),
    ];

    const fetchPayments = async () => {
      try {
        const results = await Promise.all(
          uniqueYears.map((year) =>
            api.get(`/admin/payment/getSinglePayment/${id}/${year}`)
          )
        );
        const merged = results.flatMap((r) => r.data.breakdown || []);
        setRemuneration({ breakdown: merged });
      } catch (err) {
        console.error("Error fetching remuneration:", err);
      }
    };
    fetchPayments();
  }, [faculty, id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <AdminDesktopSidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">
                  Loading faculty details...
                </p>
              </div>
            </div>
          ) : !faculty ? (
            <div className="flex items-center justify-center min-h-full">
              <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Faculty not found
                </h2>
                <button
                  onClick={handleGoBack}
                  className="px-6 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
                >
                  Back to Faculty List
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              {/* Header */}
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
                      Faculty Profile
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Detailed information and remuneration summary
                    </p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:shadow-md hover:border-gray-300 transition-all whitespace-nowrap">
                  <FaEdit size={16} />
                  Edit Profile
                </button>
              </div>

              {/* Profile Card */}
              <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm p-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={faculty.profileImg || "/F1.jpg"}
                      alt={faculty.name}
                      className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl border-4 border-white shadow-lg object-cover ring-2 ring-gray-200/50"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {faculty.name}
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-xl">
                        <FaBook />
                        {faculty.designation}
                      </span>
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-800 text-sm font-medium rounded-xl border border-blue-200">
                        {faculty.department}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-2 text-gray-700">
                        <FaUser size={14} /> ID:{" "}
                        <strong>{faculty.employeeId}</strong>
                      </span>
                      <span className="flex items-center gap-2 text-gray-700">
                        <FaPhone size={14} /> {faculty.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Core Details */}
                <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm p-6 lg:p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                    <FaUser size={20} className="text-blue-600" />
                    Core Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start p-4 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-500">
                        Email
                      </span>
                      <span className="font-semibold text-gray-900 truncate max-w-[250px]">
                        {faculty.email}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-500">
                        Department
                      </span>
                      <span className="font-semibold text-gray-900">
                        {faculty.department}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-500">
                        Designation
                      </span>
                      <span className="font-semibold text-gray-900">
                        {faculty.designation}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-500">
                        Employee ID
                      </span>
                      <span className="font-semibold text-gray-900">
                        {faculty.employeeId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-500">
                        Phone
                      </span>
                      <span className="font-semibold text-gray-900">
                        {faculty.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="space-y-4 lg:space-y-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">
                          Total Subjects
                        </p>
                        <p className="text-3xl font-bold">
                          {faculty.assignedSubjects?.reduce(
                            (acc, yg) =>
                              acc +
                              yg.semesters.reduce(
                                (s, sg) => s + sg.subjects.length,
                                0
                              ),
                            0
                          ) || 0}
                        </p>
                      </div>
                      <FaBook className="text-4xl opacity-75" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-sm font-medium">
                          Total Earnings
                        </p>
                        <p className="text-3xl font-bold">
                          ₹
                          {remuneration.breakdown
                            ?.reduce(
                              (sum, item) =>
                                sum + parseFloat(item.subjectTotal || 0),
                              0
                            )
                            ?.toLocaleString() || 0}
                        </p>
                      </div>
                      <FaDollarSign className="text-4xl opacity-75" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Subjects */}
              <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <FaBook size={20} className="text-blue-600" />
                    Assigned Subjects
                  </h3>
                  <button
                    onClick={() =>
                      navigate(`/admin/facultymanager/update/${id}`, {
                        state: {
                          facultyName: faculty.name,
                          facultyDepartment: faculty.department,
                        },
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-xl text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all cursor-pointer"
                  >
                    Update Assignments
                  </button>
                </div>

                {faculty.assignedSubjects?.length > 0 ? (
                  faculty.assignedSubjects.map((yearGroup, yIdx) => (
                    <div key={yIdx}>
                      <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                        <h4 className="text-lg font-semibold text-blue-800">
                          Academic Year: {yearGroup.academicYear}
                        </h4>
                      </div>
                      {yearGroup.semesters.map((semGroup, sIdx) => (
                        <div
                          key={sIdx}
                          className="px-6 py-4 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="font-semibold text-gray-700">
                              {semGroup.semesterType} Semester
                            </span>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Subject
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Semester
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Branch
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {semGroup.subjects.map((subj, subjIdx) => (
                                  <tr
                                    key={subjIdx}
                                    className="hover:bg-gray-50 transition-colors"
                                  >
                                    <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                      {subj.name}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Semester {subj.semester}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                      {subj.department}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
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
                  ))
                ) : (
                  <div className="text-center py-12 px-6">
                    <FaBook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      No subjects assigned
                    </h4>
                    <p className="text-gray-500 mb-4">
                      This faculty member has no subject assignments.
                    </p>
                  </div>
                )}
              </div>

              {/* Remuneration Summary */}
              <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <FaDollarSign size={20} className="text-emerald-600" />
                    Remuneration Summary
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {remuneration.breakdown?.length || 0} payment records found
                  </p>
                </div>

                {remuneration.breakdown?.length > 0 ? (
                  [
                    ...new Set(
                      remuneration.breakdown.map((i) => i.academicYear)
                    ),
                  ].map((year, yIdx) => {
                    const yearGroup = remuneration.breakdown.filter(
                      (i) => i.academicYear === year
                    );

                    return (
                      <div key={yIdx}>
                        <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100">
                          <h4 className="text-lg font-semibold text-emerald-800">
                            Academic Year: {year}
                          </h4>
                        </div>

                        {["Odd", "Even"].map((semType, sIdx) => {
                          const semGroup = yearGroup.filter(
                            (i) => i.semesterType === semType
                          );
                          if (!semGroup.length) return null;

                          return (
                            <div
                              key={sIdx}
                              className="px-6 py-4 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <span className="font-semibold text-gray-700">
                                  {semType} Semester
                                </span>
                              </div>
                              <div className="overflow-x-auto mb-4">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-73">
                                        {" "}
                                        {/* OLD --> pr-0 , NEW --> w-85 */}
                                        Subject
                                      </th>
                                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-60">
                                        {" "}
                                        {/* OLD --> w-24, NEW --> w-60 */}
                                        Semester
                                      </th>
                                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-60">
                                        {" "}
                                        {/* OLD --> w-24, NEW --> w-60 */}
                                        Branch
                                      </th>
                                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Amount
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {semGroup.map((item, idx) => (
                                      <tr
                                        key={idx}
                                        className="hover:bg-gray-50 transition-colors"
                                      >
                                        <td className="px-4 py-4 pr-0">
                                          <button
                                            onClick={() =>
                                              navigate(
                                                `/admin/facultymanager/details/${id}/subject/${item.subjectId}/${item.academicYear}`
                                              )
                                            }
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline transition-colors cursor-pointer"
                                          >
                                            {item.subjectName}
                                          </button>
                                        </td>
                                        <td className="px-4 py-4 w-30 text-center">
                                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                            Semester {item.semester}
                                          </span>
                                        </td>
                                        <td className="px-4 py-4 w-36 text-center">
                                          <span className="inline-flex px-2 py-1 text-sm font-medium text-gray-900 whitespace-nowrap">
                                            {item.department}
                                          </span>
                                        </td>
                                        <td className="px-4 py-4 text-center font-semibold text-lg text-emerald-700">
                                          ₹{" "}
                                          {parseFloat(
                                            item.subjectTotal
                                          ).toLocaleString()}
                                        </td>
                                      </tr>
                                    ))}
                                    <tr className="bg-emerald-50">
                                      <td
                                        colSpan={3}
                                        className="px-4 py-4 text-center"
                                      >
                                        <button
                                          onClick={() => {
                                            const paymentId =
                                              semGroup[0]?.paymentId;
                                            if (paymentId) {
                                              window.open(
                                                `${API_BASE}/payment/generate-pdf/${paymentId}`,
                                                "_blank"
                                              );
                                            }
                                          }}
                                          className="flex items-center gap-2 px-4 py-2 border border-emerald-300 rounded-xl text-sm font-medium text-emerald-700 bg-white hover:bg-emerald-50 transition-all cursor-pointer"
                                        >
                                          Generate {semType} Slip
                                        </button>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          );
                        })}

                        {/* Yearly Slip */}
                        <div className="px-6 py-4 bg-emerald-50 border-t border-emerald-100">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() =>
                                window.open(
                                  `${API_BASE}/payment/generate-pdf/${id}/${year}`,
                                  "_blank"
                                )
                              }
                              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-sm cursor-pointer"
                            >
                              Generate Yearly Slip
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 px-6">
                    <FaDollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      No payment records
                    </h4>
                    <p className="text-gray-500">
                      No remuneration data available for this faculty.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FacultyDetails;
