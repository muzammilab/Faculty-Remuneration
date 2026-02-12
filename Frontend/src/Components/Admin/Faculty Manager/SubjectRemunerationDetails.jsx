import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaPrint,
  FaDownload,
  FaCalculator,
  FaInfoCircle,
  FaArrowLeft,
  FaBook,
  FaBars,
  FaUser,
  FaBuilding,
  FaDollarSign,
} from "react-icons/fa";
import AdminDesktopSidebar from "../AdminDesktopSidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSubjectRemuneration,
  fetchSubjectRemuneration,
} from "../../../store/subjectRemunerationSlice";

function SubjectRemunerationDetails() {
  const dispatch = useDispatch();
  const { id, subjectId, academicYear } = useParams();
  const navigate = useNavigate();

  const {
    data: subjectData,
    loading,
    error,
  } = useSelector((state) => state.subjectRemuneration);

  const handleGoBack = () => navigate(`/admin/facultymanager/details/${id}`);

  useEffect(() => {
    dispatch(
      fetchSubjectRemuneration({ facultyId: id, subjectId, academicYear })
    );

    return () => {
      dispatch(clearSubjectRemuneration());
    };
  }, [dispatch, id, subjectId, academicYear]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <AdminDesktopSidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center min-h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">
                  Loading subject remuneration...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-full">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Error loading data
                </h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={handleGoBack}
                  className="px-6 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
                >
                  Back to Faculty Details
                </button>
              </div>
            </div>
          ) : !subjectData ? (
            <div className="flex items-center justify-center min-h-full">
              <p className="text-gray-600">No data available</p>
            </div>
          ) : (
            <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              {/* Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleGoBack}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:shadow-md hover:border-gray-300 transition-all duration-200"
                  >
                    <FaArrowLeft size={16} />
                    Back
                  </button>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                      Remuneration Details
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Subject breakdown and payment summary
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:shadow-md hover:border-gray-300 transition-all whitespace-nowrap">
                    <FaDownload size={16} />
                    Export
                  </button>
                  <button className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:shadow-md hover:border-gray-300 transition-all whitespace-nowrap">
                    <FaPrint size={16} />
                    Print
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subject Profile Card */}
                <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm p-8">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center">
                        <FaBook className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        {subjectData.subjectName}
                      </h2>
                      <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-xl">
                          <FaCalculator />
                          {subjectData.semesterType} Semester
                        </span>
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-800 text-sm font-medium rounded-xl border border-blue-200">
                          Semester {subjectData.semester}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-2 text-gray-700">
                          <FaUser size={14} /> {subjectData.facultyName}
                        </span>
                        <span className="flex items-center gap-2 text-gray-700">
                          <FaBuilding size={14} /> {subjectData.department}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="space-y-4 lg:space-y-6">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-sm font-medium">
                          Academic Year
                        </p>
                        <p className="text-3xl font-bold">
                          {subjectData.academicYear}
                        </p>
                      </div>
                      <FaBook className="text-4xl opacity-75" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">
                          Subject Total
                        </p>
                        <p className="text-3xl font-bold">
                          ₹{subjectData.total?.toLocaleString() || 0}
                        </p>
                      </div>
                      <FaDollarSign className="text-4xl opacity-75" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Breakdown Table */}
              <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <FaCalculator size={20} className="text-blue-600" />
                    Remuneration Breakdown
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Component
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {subjectData.breakdown?.map((item, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 bg-${item.color}-100 rounded-xl flex items-center justify-center`}
                              >
                                <FaCalculator
                                  className={`text-${item.color}-600 text-sm`}
                                />
                              </div>
                              <span className="font-medium text-gray-900">
                                {item.component}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="bg-gray-100 px-3 py-1.5 rounded-md text-sm font-bold text-gray-900">
                              ₹{item.rate}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-bold text-lg text-gray-900">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-xl font-bold text-emerald-600">
                              ₹{item.amount.toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Row */}
                <div className="px-6 py-6 bg-gradient-to-r from-emerald-50 to-blue-50 border-t border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FaInfoCircle size={16} />
                      Reference:{" "}
                      <span className="font-mono font-semibold text-gray-900 ml-1">
                        {subjectData.referenceNumber}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-emerald-700 tracking-tight">
                        ₹{subjectData.total?.toLocaleString() || 0}
                      </div>
                      <div className="text-sm text-emerald-600 font-medium">
                        Total Remuneration
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubjectRemunerationDetails;
