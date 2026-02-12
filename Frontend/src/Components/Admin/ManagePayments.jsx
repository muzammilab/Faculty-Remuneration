import { useState, useEffect } from "react";
import {
  FaEdit,
  FaFileInvoiceDollar,
  FaSearch,
  FaTimes,
  FaDollarSign,
} from "react-icons/fa";
import AdminNavbar from "./AdminNavbar";
import AdminDesktopSidebar from "./AdminDesktopSidebar";
import AdminMobileSidebar from "./AdminMobileSidebar";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments, makePaymentPaid } from "../../store/paymentSlice";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

function ManagePayments() {
  const dispatch = useDispatch();

  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSidebarOpen = () => setShowSidebar(true);
  const handleSidebarClose = () => setShowSidebar(false);

  const { payments, loading } = useSelector((state) => state.paymentSlice);

  useEffect(() => {
    dispatch(fetchPayments());
  }, []);

  const handlePay = async (paymentId) => {
    const result = await dispatch(makePaymentPaid(paymentId));
    if (makePaymentPaid.fulfilled.match(result)) {
      toast.success("Payment marked as paid!");
      // dispatch(fetchPayments());
    } else {
      toast.error(result.payload || "Failed to mark payment as paid.");
    }
  };

  const handleSlip = async (
    paymentId,
    facultyName,
    academicYear,
    semesterType
  ) => {
    console.log("Payment ID : ", paymentId);

    try {
      const url = `${API_BASE}/payment/generate-pdf/${paymentId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/pdf" },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || "Failed to generate slip. Try again later.";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      const fileURL = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `PaymentSlip_${facultyName}_${academicYear}_${semesterType}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(fileURL);
    } catch (err) {
      console.error("Error downloading slip:", err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN");
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.facultyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.academicYear
        ?.toString()
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.semesterType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.totalAmount?.toString().includes(searchTerm) ||
      formatDate(payment.createdAt)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
      unpaid: "bg-amber-100 text-amber-800 border-amber-200",
      failed: "bg-red-100 text-red-800 border-red-200",
    };
    const config =
      statusConfig[status?.toLowerCase()] ||
      "bg-gray-100 text-gray-800 border-gray-200";

    return (
      <span
        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${config}`}
      >
        {status?.toUpperCase() || "UNDEFINED"}
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
          <AdminNavbar
            handleSidebarOpen={handleSidebarOpen}
            page="Manage Payments"
            desc="Manage faculty payment records and transactions"
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
                        placeholder="Search by faculty name, academic year, semester type, status, amount, or date..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Records Table */}
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                    <FaDollarSign className="text-emerald-600" />
                    Payment Records
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {loading.list
                      ? "Loading..."
                      : `${filteredPayments.length} payment record(s) found`}
                  </p>
                </div>
              </div>

              {loading.list ? (
                <div className="px-6 py-20 text-center">
                  <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-sm text-gray-500">
                    Loading payment records...
                  </p>
                </div>
              ) : filteredPayments.length === 0 ? (
                <div className="px-6 py-20 text-center">
                  <FaDollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-500">
                    {payments.length === 0
                      ? "No payment records found. Create payments using the Payments page."
                      : "No payments match your search criteria."}
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
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Academic Year
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Semester Type
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Created On
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Paid On
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Total Amount
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/60 divide-y divide-gray-100">
                      {filteredPayments.map((payment, index) => (
                        <tr
                          key={payment._id || index}
                          className="hover:bg-blue-50/60 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-semibold text-gray-900">
                              {payment.facultyName}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                              {payment.academicYear}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                            {payment.semesterType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                            {formatDate(payment.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                            {payment.status === "paid"
                              ? formatDate(payment.paidAt)
                              : "---"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="font-bold text-emerald-600">
                              ₹ {payment.totalAmount?.toLocaleString() || "0"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {getStatusBadge(payment.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {}}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center gap-1"
                                title="Edit Payment"
                              >
                                <FaEdit size={12} />
                                Edit
                              </button>
                              <button
                                onClick={() => handlePay(payment._id)}
                                disabled={payment.status === "paid"}
                                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                title="Mark as Paid"
                              >
                                <FaDollarSign size={12} />
                                Pay
                              </button>
                              <button
                                onClick={() =>
                                  handleSlip(
                                    payment._id,
                                    payment.facultyId?.name ||
                                      payment.facultyName,
                                    payment.academicYear,
                                    payment.semesterType
                                  )
                                }
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                                title="Download Slip"
                              >
                                <FaFileInvoiceDollar size={12} />
                                Slip
                              </button>
                            </div>
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

export default ManagePayments;
