import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMoneyBillWave,
  FaHistory,
  FaFileInvoiceDollar,
  FaDownload,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import AdminNavbar from "../Admin/AdminNavbar";
import FacultyMobileSidebar from "./FacultyMobileSidebar";
import FacultyDesktopSidebar from "./FacultyDesktopSidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchFacultyPayments } from "../../store/paymentSlice";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

function FacultyPayments() {
  const dispatch = useDispatch();

  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [expandedItems, setExpandedItems] = useState({});
  const navigate = useNavigate();

  const { facultyPayments, loading } = useSelector(
    (state) => state.paymentSlice
  );
  const isLoading = loading.facultyPayments;
  const paymentData = facultyPayments;

  const handleSidebarOpen = () => setShowSidebar(true);
  const handleSidebarClose = () => setShowSidebar(false);

  useEffect(() => {
    const facultyId = localStorage.getItem("facultyId");
    if (facultyId) {
      dispatch(fetchFacultyPayments(facultyId));
    }
  }, [dispatch]);

  const toggleExpanded = (path) => {
    setExpandedItems((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Completed
          </span>
        );
      case "Processing":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
            Processing
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            Unknown
          </span>
        );
    }
  };

  const renderSubjectCard = (subjectName, subjectData, yearPath) => (
    <div
      key={subjectName}
      className="mb-3 bg-white border border-gray-200 rounded-xl shadow-sm p-4"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h6 className="font-bold text-gray-900 mb-1">{subjectName}</h6>
        </div>
        <div className="text-right">
          <div className="font-bold text-emerald-600 mb-2">
            {subjectData.amount}
          </div>
          {getStatusBadge(subjectData.status)}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-gray-500 text-sm">
          {subjectData.status === "Completed"
            ? `Paid on ${subjectData.paidDate}`
            : `Due on ${subjectData.dueDate}`}
        </div>
        <button
          onClick={() =>
            navigate(
              `/faculty/payments/subjectremu/${subjectData.subjectId}/${yearPath}`
            )
          }
          className="flex items-center gap-2 px-4 py-2 border border-blue-200 rounded-xl text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all"
        >
          <FaFileInvoiceDollar size={14} />
          View Details
        </button>
      </div>
    </div>
  );

  const renderSemester = (semesterName, subjects, yearPath, semesterType) => {
    const semesterPath = `${yearPath}.${semesterType}.${semesterName}`;
    const isExpanded = expandedItems[semesterPath];
    const subjectCount = Object.keys(subjects).length;
    const totalAmount = Object.values(subjects).reduce((sum, subject) => {
      return sum + parseInt(subject.amount.replace("₹", "").replace(",", ""));
    }, 0);

    return (
      <div key={semesterName} className="mb-3">
        <div className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
          <div
            className="p-4 cursor-pointer hover:bg-blue-100 transition-colors rounded-xl"
            onClick={() => toggleExpanded(semesterPath)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <FaChevronDown size={14} className="text-blue-600" />
                ) : (
                  <FaChevronRight size={14} className="text-blue-600" />
                )}
                <div>
                  <h6 className="font-bold text-gray-900 mb-1">
                    {semesterName}
                  </h6>
                  <div className="text-gray-600 text-sm">
                    {subjectCount} Subject{subjectCount > 1 ? "s" : ""} • Total:
                    ₹{totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-sm">
                {subjectCount}
              </span>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="ml-6 mt-3">
            {Object.entries(subjects).map(([subjectName, subjectData]) =>
              renderSubjectCard(subjectName, subjectData, yearPath)
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSemesterType = (semesterType, semesters, yearPath) => {
    const semesterTypePath = `${yearPath}.${semesterType}`;
    const isExpanded = expandedItems[semesterTypePath];
    const semesterCount = Object.keys(semesters).length;
    const totalAmount = Object.values(semesters).reduce((sum, semester) => {
      return (
        sum +
        Object.values(semester).reduce((semesterSum, subject) => {
          return (
            semesterSum +
            parseInt(subject.amount.replace("₹", "").replace(",", ""))
          );
        }, 0)
      );
    }, 0);

    return (
      <div key={semesterType} className="mb-4">
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl shadow-sm">
          <div
            className="p-4 cursor-pointer hover:bg-cyan-100 transition-colors rounded-xl"
            onClick={() => toggleExpanded(semesterTypePath)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <FaChevronDown size={16} className="text-cyan-600" />
                ) : (
                  <FaChevronRight size={16} className="text-cyan-600" />
                )}
                <div>
                  <h6 className="font-bold text-gray-900 mb-1">
                    {semesterType}
                  </h6>
                  <div className="text-gray-600 text-sm">
                    {semesterCount} Semester{semesterCount > 1 ? "s" : ""} •
                    Total: ₹{totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-600 text-white font-semibold text-sm">
                  {semesterCount}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const firstSemester = Object.values(semesters)[0];
                    const firstSubject = Object.values(firstSemester)[0];
                    const paymentId = firstSubject?.paymentId;

                    if (paymentId) {
                      window.open(
                        `${API_BASE}/payment/generate-pdf/${paymentId}`,
                        "_blank"
                      );
                    } else {
                      console.error(
                        "❌ No paymentId found for",
                        semesterType,
                        yearPath
                      );
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-2 border border-cyan-200 rounded-xl text-sm font-medium text-cyan-700 bg-white hover:bg-cyan-50 hover:border-cyan-300 transition-all"
                >
                  <FaDownload size={12} />
                  Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="ml-6 mt-3">
            {Object.entries(semesters).map(([semesterName, subjects]) =>
              renderSemester(semesterName, subjects, yearPath, semesterType)
            )}
          </div>
        )}
      </div>
    );
  };

  const renderYear = (year, yearData) => {
    const yearPath = year;
    const isExpanded = expandedItems[yearPath];
    const semesterTypeCount = Object.keys(yearData).length;
    const totalAmount = Object.values(yearData).reduce((sum, semesterType) => {
      return (
        sum +
        Object.values(semesterType).reduce((semesterTypeSum, semester) => {
          return (
            semesterTypeSum +
            Object.values(semester).reduce((semesterSum, subject) => {
              return (
                semesterSum +
                parseInt(subject.amount.replace("₹", "").replace(",", ""))
              );
            }, 0)
          );
        }, 0)
      );
    }, 0);

    return (
      <div key={year} className="mb-5">
        <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm">
          <div
            className="p-5 cursor-pointer hover:bg-gray-50 transition-colors rounded-2xl"
            onClick={() => toggleExpanded(yearPath)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <FaChevronDown size={18} className="text-gray-700" />
                ) : (
                  <FaChevronRight size={18} className="text-gray-700" />
                )}
                <div>
                  <h5 className="font-bold text-gray-900 mb-1">{year}</h5>
                  <div className="text-gray-600 text-sm">
                    {semesterTypeCount} Semester Type
                    {semesterTypeCount > 1 ? "s" : ""} • Total: ₹
                    {totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-base">
                  {semesterTypeCount}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const facultyId = localStorage.getItem("facultyId");
                    if (!facultyId) {
                      console.error("❌ FacultyId missing in localStorage");
                      return;
                    }

                    window.open(
                      `${API_BASE}/payment/generate-pdf/${facultyId}/${yearPath}`,
                      "_blank"
                    );
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-blue-200 rounded-xl text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all"
                >
                  <FaDownload size={12} />
                  Yearly Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="ml-6 mt-4">
            {Object.entries(yearData).map(([semesterType, semesters]) =>
              renderSemesterType(semesterType, semesters, yearPath)
            )}
          </div>
        )}
      </div>
    );
  };

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
            page="Payments"
            desc="Track and manage your payment history"
          />

          <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Payment Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">
                      Total Earned
                    </p>
                    {isLoading ? (
                      <div className="h-9 w-32 bg-white/20 rounded animate-pulse"></div>
                    ) : (
                      <p className="text-3xl font-bold">₹82,500</p>
                    )}
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <FaMoneyBillWave className="text-3xl opacity-90" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium mb-1">
                      Completed
                    </p>
                    {isLoading ? (
                      <div className="h-9 w-32 bg-white/20 rounded animate-pulse"></div>
                    ) : (
                      <p className="text-3xl font-bold">₹42,250</p>
                    )}
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <FaHistory className="text-3xl opacity-90" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-500 to-gray-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 text-sm font-medium mb-1">
                      Pending
                    </p>
                    {isLoading ? (
                      <div className="h-9 w-32 bg-white/20 rounded animate-pulse"></div>
                    ) : (
                      <p className="text-3xl font-bold">₹37,750</p>
                    )}
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <FaHistory className="text-3xl opacity-90" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment History Section */}
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                  Payment History
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Click on arrows to expand and view detailed payment
                  information by year, semester, and subject
                </p>
              </div>

              {/* Tabs */}
              <div className="px-6 pt-4 border-b border-gray-200">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors cursor-pointer ${
                      activeTab === "all"
                        ? "bg-white text-blue-600 border-t-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab("paid")}
                    className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors cursor-pointer ${
                      activeTab === "paid"
                        ? "bg-white text-blue-600 border-t-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Paid
                  </button>
                  <button
                    onClick={() => setActiveTab("unpaid")}
                    className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors cursor-pointer ${
                      activeTab === "unpaid"
                        ? "bg-white text-blue-600 border-t-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Unpaid
                  </button>
                </div>
              </div>

              {/* Hierarchical Payment Data */}
              <div className="p-6">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, idx) => (
                      <div
                        key={idx}
                        className="h-20 bg-gray-100 rounded-xl animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : Object.keys(paymentData).length > 0 ? (
                  Object.entries(paymentData).map(([year, yearData]) =>
                    renderYear(year, yearData)
                  )
                ) : (
                  <div className="text-center py-12">
                    <FaMoneyBillWave className="mx-auto h-12 w-12 text-gray-400 mb-4 opacity-50" />
                    <p className="text-sm text-gray-500">
                      No payment data available
                    </p>
                  </div>
                )}
              </div>
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

export default FacultyPayments;
