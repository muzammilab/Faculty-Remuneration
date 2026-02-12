import { useEffect, useState } from "react";
import {
  FaPrint,
  FaFileInvoiceDollar,
  FaCalculator,
  FaMoneyBillWave,
  FaInfoCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import FacultySidebar from "./FacultySidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSubjectRemuneration,
  fetchSubjectRemuneration,
} from "../../store/subjectRemunerationSlice";

function SubjectRemuneration() {
  const dispatch = useDispatch();
  const { id, subjectId, academicYear } = useParams();
  const navigate = useNavigate();

  const {
    data: subjectData,
    loading,
    error,
  } = useSelector((state) => state.subjectRemuneration);

  useEffect(() => {
    const facultyId = localStorage.getItem("facultyId");
    if ((facultyId && subjectId, academicYear)) {
      dispatch(
        fetchSubjectRemuneration({
          facultyId,
          subjectId,
          academicYear,
        })
      );
    }
    return () => {
      dispatch(clearSubjectRemuneration());
    };
  }, [dispatch, id, subjectId, academicYear]);

  const handleGoBack = () => {
    navigate(`/faculty/payments`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="w-72 bg-gradient-to-b from-white to-slate-50 border-r border-gray-200">
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto p-6">
                <FacultySidebar />
              </div>
              <div className="p-6 border-t border-gray-200 bg-white/60 backdrop-blur">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Role
                </div>
                <div className="text-sm text-gray-900 mt-1 font-medium">
                  Faculty Member
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Back Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
              >
                <FaArrowLeft size={14} />
                Back to Payments
              </button>
            </div>

            {loading ? (
              // Loading State
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 font-semibold">
                    Loading remuneration details...
                  </p>
                </div>
              </div>
            ) : error ? (
              // Error State
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <FaInfoCircle className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-red-900 font-semibold">
                      Error Loading Data
                    </h3>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Subject Information Card */}
                <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        <FaCalculator className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                          Subject Information
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Basic details about the subject and faculty
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <FaInfoCircle className="text-gray-400" size={14} />
                          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                            Subject Name
                          </span>
                        </div>
                        <div className="font-bold text-gray-900">
                          {subjectData?.subjectName}
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <FaInfoCircle className="text-gray-400" size={14} />
                          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                            Academic Year
                          </span>
                        </div>
                        <div className="font-bold text-gray-900">
                          {subjectData?.academicYear}
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <FaInfoCircle className="text-gray-400" size={14} />
                          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                            Semester Type
                          </span>
                        </div>
                        <div className="font-bold text-gray-900">
                          {subjectData?.semesterType}
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <FaInfoCircle className="text-gray-400" size={14} />
                          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                            Semester
                          </span>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800 border border-cyan-200">
                          Semester {subjectData?.semester}
                        </span>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <FaInfoCircle className="text-gray-400" size={14} />
                          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                            Faculty Member
                          </span>
                        </div>
                        <div className="font-bold text-gray-900">
                          {subjectData?.facultyName}
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <FaInfoCircle className="text-gray-400" size={14} />
                          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                            Department
                          </span>
                        </div>
                        <div className="font-bold text-gray-900">
                          {subjectData?.department}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remuneration Breakdown Card */}
                <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                        <FaMoneyBillWave
                          className="text-emerald-600"
                          size={20}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                          Remuneration Breakdown
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Detailed calculation of each component
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Component
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Rate (₹)
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Amount (₹)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {subjectData?.breakdown.map((item, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 bg-${item.color}-50 rounded-xl flex items-center justify-center`}
                                >
                                  <FaCalculator
                                    className={`text-${item.color}-600`}
                                    size={16}
                                  />
                                </div>
                                <span className="font-medium text-gray-900">
                                  {item.component}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                ₹{item.rate}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="font-bold text-gray-900">
                                {item.quantity}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="font-bold text-emerald-600">
                                ₹{item.amount.toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Total Remuneration Card */}
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-8 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <FaFileInvoiceDollar className="text-4xl opacity-90" />
                      </div>
                      <div>
                        <p className="text-emerald-100 text-sm font-medium mb-1">
                          Total Remuneration
                        </p>
                        <h2 className="text-4xl font-bold">
                          ₹{subjectData?.total.toLocaleString()}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
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

export default SubjectRemuneration;
