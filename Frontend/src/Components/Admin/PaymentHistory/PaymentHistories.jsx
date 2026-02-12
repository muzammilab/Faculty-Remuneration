import { useEffect, useState } from "react";
import { FaSearch, FaDollarSign, FaCalendar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AdminDesktopSidebar from "../AdminDesktopSidebar";
import AdminMobileSidebar from "../AdminMobileSidebar";
import AdminNavbar from "../AdminNavbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaidPayments } from "../../../store/paymentSlice";

function PaymentHistories() {
  const dispatch = useDispatch();

  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFaculty, setFilterFaculty] = useState("");

  const handleSidebarOpen = () => setShowSidebar(true);
  const handleSidebarClose = () => setShowSidebar(false);

  const { paidPayments, loading } = useSelector((state) => state.paymentSlice);

  // Fetch all payments on component mount
  useEffect(() => {
    dispatch(fetchPaidPayments());
  }, [dispatch]);

  // Filter payments based on search and filters
  const filteredPayments = paidPayments.filter((payment) => {
    const facultyName = payment.facultyId?.name?.toLowerCase() || "";
    const designation = payment.facultyId?.designation?.toLowerCase() || "";
    const academicYear = payment.academicYear?.toString().toLowerCase() || "";

    const matchesSearch =
      searchTerm === "" ||
      facultyName.includes(searchTerm.toLowerCase()) ||
      designation.includes(searchTerm.toLowerCase()) ||
      academicYear.includes(searchTerm.toLowerCase());

    const matchesFaculty =
      filterFaculty === "" || payment.facultyId?._id === filterFaculty;

    return matchesSearch && matchesFaculty;
  });

  // Status badge component - EXACT FacultyManagement style
  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
      unpaid: "bg-amber-50 text-amber-700 border-amber-200",
      Failed: "bg-red-50 text-red-700 border-red-200",
    };
    const config =
      statusConfig[status] || "bg-gray-50 text-gray-700 border-gray-200";

    return (
      <span
        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${config}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Mobile Sidebar */}
        <AdminMobileSidebar
          handleSidebarClose={handleSidebarClose}
          showSidebar={showSidebar}
        />

        {/* Desktop Sidebar */}
        <AdminDesktopSidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Admin Navbar */}
          <AdminNavbar
            handleSidebarOpen={handleSidebarOpen}
            page="Payment History"
            desc="Complete payment records overview"
          />

          <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
                        placeholder="Search by faculty name, academic year or designation"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Faculty Table */}
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm overflow-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                  Faculty Payment History
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {filteredPayments.length}{" "}
                  {filteredPayments.length === 1 ? "record" : "records"}
                </span>
              </div>

              {loading.paidList ? (
                <div className="px-6 py-20 text-center">
                  <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-sm text-gray-500">
                    Loading payment data...
                  </p>
                </div>
              ) : filteredPayments.length === 0 ? (
                <div className="px-6 py-20 text-center">
                  <FaDollarSign className="mx-auto h-16 w-16 text-gray-400 mb-4 opacity-50" />
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    No payments found
                  </p>
                  <p className="text-sm text-gray-500">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "No payment records available"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50/70">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Faculty Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Designation
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Academic Year
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Semester
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Payment Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/60 divide-y divide-gray-100">
                      {filteredPayments.map((payment) => (
                        <tr
                          key={payment._id}
                          className="hover:bg-blue-50/60 transition-colors cursor-default"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/paymenthistory/details/${payment.facultyId._id}/${payment.academicYear}/${payment.semesterType}`
                                )
                              }
                              className="text-blue-600 hover:text-blue-800 font-medium"
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                textAlign: "left",
                              }}
                            >
                              {payment.facultyId?.name || payment.facultyName}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                              {payment.facultyId?.designation || "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-semibold text-gray-900">
                              {payment.academicYear}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {payment.semesterType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <FaCalendar size={14} />
                              {new Date(payment.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="font-bold text-emerald-600 text-lg">
                              ₹
                              {parseFloat(
                                payment.totalAmount || 0
                              ).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(payment.status)}
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
    </div>
  );
}

export default PaymentHistories;
