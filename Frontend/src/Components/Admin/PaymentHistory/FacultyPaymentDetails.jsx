import { useEffect, useState } from "react";
import {
  FaPrint,
  FaFileExport,
  FaArrowLeft,
  FaUser,
  FaCalendar,
  FaDollarSign,
  FaCalculator,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import AdminDesktopSidebar from "../AdminDesktopSidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchFacultyPaymentDetails } from "../../../store/paymentSlice";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

function FacultyPaymentDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, academicYear, semesterType } = useParams();

  const { facultyPaymentDetails, loading } = useSelector(
    (state) => state.paymentSlice
  );

  const isLoading = loading.paymentDetailList;
  const remuneration = facultyPaymentDetails;

  const handleGoBack = () => navigate("/admin/paymenthistory");

  useEffect(() => {
    dispatch(
      fetchFacultyPaymentDetails({ facultyId: id, academicYear, semesterType })
    );
  }, [dispatch, id, academicYear, semesterType]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
      unpaid: "bg-amber-100 text-amber-800 border-amber-200",
      Failed: "bg-red-100 text-red-800 border-red-200",
    };
    const config =
      statusConfig[status] || "bg-gray-100 text-gray-800 border-gray-200";

    return (
      <span
        className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold border ${config}`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

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
                  Loading payment details...
                </p>
              </div>
            </div>
          ) : !remuneration?.payment ? (
            <div className="flex items-center justify-center min-h-full">
              <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Payment not found
                </h2>
                <button
                  onClick={handleGoBack}
                  className="px-6 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
                >
                  Back to Payment History
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
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:shadow-md hover:border-gray-300 transition-all duration-200"
                  >
                    <FaArrowLeft size={16} />
                    Back
                  </button>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                      Payment Details
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Detailed breakdown and payment summary
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:shadow-md hover:border-gray-300 transition-all whitespace-nowrap">
                    <FaFileExport size={16} />
                    Export
                  </button>
                  <button
                    onClick={() => {
                      const paymentId = remuneration?.payment?._id;
                      if (paymentId) {
                        window.open(
                          `${API_BASE}/payment/generate-pdf/${paymentId}`,
                          "_blank"
                        );
                      }
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-sm"
                  >
                    <FaPrint size={16} />
                    Generate Slip
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Overview Card */}
                <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm p-8">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center">
                        <FaDollarSign className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        {remuneration.facultyName}
                      </h2>
                      <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold rounded-xl">
                          <FaCalendar />
                          {remuneration.payment?.academicYear}
                        </span>
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-sm font-medium rounded-xl border border-emerald-200">
                          {remuneration.payment?.semesterType} Semester
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-2 text-gray-700">
                          <FaUser size={14} />
                          Total: ₹
                          {parseFloat(
                            remuneration.payment?.totalAmount || 0
                          ).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-2 text-gray-700">
                          {getStatusBadge(remuneration.payment?.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="space-y-4 lg:space-y-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">
                          Subjects Count
                        </p>
                        <p className="text-3xl font-bold">
                          {remuneration.breakdown?.length || 0}
                        </p>
                      </div>
                      <FaCalculator className="text-4xl opacity-75" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-sm font-medium">
                          Total Amount
                        </p>
                        <p className="text-3xl font-bold">
                          ₹
                          {parseFloat(
                            remuneration.payment?.totalAmount || 0
                          ).toLocaleString()}
                        </p>
                      </div>
                      <FaDollarSign className="text-4xl opacity-75" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject Breakdown Table */}
              <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <FaCalculator size={20} className="text-blue-600" />
                    Subject Breakdown
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Term Work
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Oral/Practical
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Semester Papers
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Semester
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {remuneration.breakdown?.map((item, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {item.subjectName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            ₹{item.termTestAssessment?.rate || 0} ×{" "}
                            {item.termTestAssessment?.count || 0} = ₹
                            {item.termTestAssessment?.amount || 0}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            ₹{item.oralPracticalAssessment?.rate || 0} ×{" "}
                            {item.oralPracticalAssessment?.count || 0} = ₹
                            {item.oralPracticalAssessment?.amount || 0}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            ₹{item.paperChecking?.rate || 0} ×{" "}
                            {item.paperChecking?.count || 0} = ₹
                            {item.paperChecking?.amount || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Semester {item.semester}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-lg text-emerald-700">
                            ₹
                            {parseFloat(
                              item.subjectTotal || 0
                            ).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm p-6 lg:p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <FaDollarSign size={20} className="text-emerald-600" />
                  Payment Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-500">
                      Travel Allowance
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₹
                      {parseFloat(
                        remuneration.payment?.travelAllowance || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-500">
                      Calculated Remuneration
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₹
                      {parseFloat(
                        remuneration.payment?.totalRemuneration || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-sm font-semibold text-gray-900">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-emerald-700">
                      ₹
                      {parseFloat(
                        remuneration.payment?.totalAmount || 0
                      ).toLocaleString()}
                    </span>
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

export default FacultyPaymentDetails;
