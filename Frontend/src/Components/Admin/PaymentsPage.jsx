import { useState, useEffect } from "react";
import {
  FaEdit,
  FaFileInvoiceDollar,
  FaDollarSign,
  FaChevronDown,
  FaChevronRight,
  FaFileExport,
} from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

import AdminNavbar from "./AdminNavbar";
import AdminDesktopSidebar from "./AdminDesktopSidebar";
import AdminMobileSidebar from "./AdminMobileSidebar";

import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments, makePaymentPaid } from "../../store/paymentSlice";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function PaymentPage() {
  const dispatch = useDispatch();

  const [showSidebar, setShowSidebar] = useState(false);
  const [openYears, setOpenYears] = useState({});
  const [openTypes, setOpenTypes] = useState({});

  const { payments, loading } = useSelector((state) => state.paymentSlice);

  useEffect(() => {
    dispatch(fetchPayments());
  }, []);

  /* ---------------- GROUP DATA ---------------- */

  const groupedData = payments.reduce((acc, p) => {
    const year = p.academicYear;
    const type = p.semesterType;

    if (!acc[year]) acc[year] = {};
    if (!acc[year][type]) acc[year][type] = [];

    acc[year][type].push(p);
    return acc;
  }, {});

  /* ---------------- TOGGLE ---------------- */

  const toggleYear = (year) => {
    setOpenYears((prev) => ({ ...prev, [year]: !prev[year] }));
  };

  const toggleType = (year, type) => {
    const key = `${year}-${type}`;
    setOpenTypes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /* ---------------- ACTIONS ---------------- */

  const handlePay = async (id) => {
    const res = await dispatch(makePaymentPaid(id));
    if (makePaymentPaid.fulfilled.match(res)) {
      toast.success("Payment marked as paid!");
    } else {
      toast.error("Failed to update payment");
    }
  };

  const handleSlip = async (payment) => {
    if (payment.status !== "paid") {
      toast.error("Slip can only be generated when payment is successful");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/payment/generate-pdf/${payment._id}`
      );

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Slip_${payment.facultyName}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download slip");
    }
  };

  /* ---------------- PROFESSIONAL EXCEL EXPORT ---------------- */

const exportExcel = async (list, title, typeLabel = "") => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Payments");

  worksheet.columns = [
    { header: "Faculty", width: 25 },
    { header: "Subject", width: 35 },
    { header: "Branch", width: 12 },
    { header: "Semester", width: 10 },
    { header: "TermWork(₹)", width: 14 },
    { header: "OralWithPractical(₹)", width: 18 },
    { header: "Oral(₹)", width: 12 },
    { header: "TermTest(₹)", width: 14 },
    { header: "SemesterExam(₹)", width: 16 },
    { header: "SubjectTotal(₹)", width: 16 },
    { header: "TravelAllowance(₹)", width: 18 },
    { header: "TotalPayment(₹)", width: 16 },
    { header: "Status", width: 12 },
  ];

  const grouped = list.reduce((acc, p) => {
    if (!acc[p.semesterType]) acc[p.semesterType] = [];
    acc[p.semesterType].push(p);
    return acc;
  }, {});

  let rowIndex = 1;

  for (const type of Object.keys(grouped)) {
    /* ---------- TITLE ---------- */
    worksheet.mergeCells(`A${rowIndex}:M${rowIndex}`);
    const titleCell = worksheet.getCell(`A${rowIndex}`);
    titleCell.value = `${type.toUpperCase()} / ${title}`;
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    rowIndex++;

    /* ---------- HEADER ---------- */
    const headerRow = worksheet.getRow(rowIndex);
    worksheet.columns.forEach((col, i) => {
      const cell = headerRow.getCell(i + 1);
      cell.value = col.header;
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    rowIndex++;

    /* ---------- DATA ---------- */
    grouped[type].forEach((p) => {
      const startRow = rowIndex;
      const subjects = p.subjectBreakdown || [];

      subjects.forEach((sub) => {
        const row = worksheet.getRow(rowIndex);

        row.values = [
          "",
          sub.subjectName,
          sub.department?.slice(0, 4).toUpperCase() || "COMP",
          sub.semester,
          sub.termWorkAssessment.amount,
          sub.practicalAssessment.amount,
          sub.oralAssessment.amount,
          sub.termTestAssessment.amount,
          sub.paperChecking.amount,
          sub.subjectTotal,
          "",
          "",
          "",
        ];

        row.eachCell((cell, colNumber) => {
          cell.alignment = { horizontal: "center", vertical: "middle" };

          // Apply ₹ format only to amount columns
          if (colNumber >= 5 && colNumber <= 12) {
            cell.numFmt = '"₹"#,##0';
          }

          cell.border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          };
        });

        rowIndex++;
      });

      const endRow = rowIndex - 1;

      /* ---------- MERGES ---------- */

      // Faculty
      worksheet.mergeCells(`A${startRow}:A${endRow}`);
      const facultyCell = worksheet.getCell(`A${startRow}`);
      facultyCell.value = p.facultyName;
      facultyCell.alignment = { horizontal: "center", vertical: "middle" };

      // Travel Allowance
      worksheet.mergeCells(`K${startRow}:K${endRow}`);
      const taCell = worksheet.getCell(`K${startRow}`);
      taCell.value = p.travelAllowance || 0;
      taCell.numFmt = '"₹"#,##0';
      taCell.alignment = { horizontal: "center", vertical: "middle" };

      // Total Payment
      worksheet.mergeCells(`L${startRow}:L${endRow}`);
      const totalCell = worksheet.getCell(`L${startRow}`);
      totalCell.value = p.totalAmount;
      totalCell.numFmt = '"₹"#,##0';
      totalCell.alignment = { horizontal: "center", vertical: "middle" };

      // Status
      worksheet.mergeCells(`M${startRow}:M${endRow}`);
      const statusCell = worksheet.getCell(`M${startRow}`);
      statusCell.value = p.status;
      statusCell.alignment = { horizontal: "center", vertical: "middle" };
    });

    rowIndex += 2;
  }

  /* ---------- FILE NAME ---------- */
  let fileName = "";

  if (typeLabel) {
    fileName = `Payments_Report_${title}_${typeLabel.toUpperCase()}.xlsx`;
  } else {
    fileName = `Payments_Report_${title}.xlsx`;
  }

  /* ---------- DOWNLOAD ---------- */
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), fileName);
};

  /* ---------------- HELPERS ---------------- */

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN") : "---";

  const getStatusBadge = (status) => {
    const map = {
      paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
      unpaid: "bg-amber-100 text-amber-800 border-amber-200",
      failed: "bg-red-100 text-red-800 border-red-200",
    };
    const config =
      map[status?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";

    return (
      <span
        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${config}`}
      >
        {status?.toUpperCase() || "UNDEFINED"}
      </span>
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <div className="flex h-screen overflow-hidden">
        <AdminMobileSidebar
          showSidebar={showSidebar}
          handleSidebarClose={() => setShowSidebar(false)}
        />
        <AdminDesktopSidebar />

        <div className="flex-1 overflow-auto">
          <AdminNavbar
            handleSidebarOpen={() => setShowSidebar(true)}
            page="Payments Tree View"
          />

          <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                    <FaDollarSign className="text-emerald-600" />
                    Payment Records
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {loading?.list
                      ? "Loading..."
                      : `${payments.length} payment record(s)`}
                  </p>
                </div>
              </div>

              {loading?.list ? (
                <div className="px-6 py-20 text-center">
                  <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-sm text-gray-500">
                    Loading payment records...
                  </p>
                </div>
              ) : payments.length === 0 ? (
                <div className="px-6 py-20 text-center">
                  <FaDollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-500">
                    No payment records found.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 px-6 py-4">
                  {Object.keys(groupedData).map((year) => (
                    <div
                      key={year}
                      className="bg-white/60 border border-gray-200 rounded-2xl overflow-hidden"
                    >
                      <div
                        onClick={() => toggleYear(year)}
                        className="px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-blue-50/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {openYears[year] ? <FaChevronDown /> : <FaChevronRight />}
                          <h2 className="text-lg font-bold text-gray-900">{year}</h2>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            exportExcel(
                              Object.values(groupedData[year]).flat(),
                              year,
                              "ALL"
                            );
                          }}
                          className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-700 flex items-center gap-1"
                        >
                          <FaFileExport size={12} />
                          Export
                        </button>
                      </div>

                      {openYears[year] &&
                        Object.keys(groupedData[year]).map((type) => {
                          const key = `${year}-${type}`;
                          const list = groupedData[year][type];

                          return (
                            <div key={type} className="ml-6 border-t border-gray-100">
                              <div
                                onClick={() => toggleType(year, type)}
                                className="px-6 py-3 flex justify-between items-center cursor-pointer hover:bg-blue-50/60 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {openTypes[key] ? <FaChevronDown /> : <FaChevronRight />}
                                  <h3 className="text-sm font-semibold text-gray-800">
                                    {type} Semester
                                  </h3>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    exportExcel(list, year, type);
                                  }}
                                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 flex items-center gap-1"
                                >
                                  <FaFileExport size={12} />
                                  Export
                                </button>
                              </div>

                              {openTypes[key] && (
                                <div className="px-6 py-4">
                                  <div className="overflow-x-auto border border-gray-200 rounded-xl">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                      <thead className="bg-gray-50/70">
                                        <tr>
                                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Faculty
                                          </th>
                                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Created
                                          </th>
                                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Paid
                                          </th>
                                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Amount
                                          </th>
                                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Status
                                          </th>
                                          <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Actions
                                          </th>
                                        </tr>
                                      </thead>

                                      <tbody className="bg-white/60 divide-y divide-gray-100">
                                        {list.map((p) => (
                                          <tr
                                            key={p._id}
                                            className="hover:bg-blue-50/60 transition-colors"
                                          >
                                            <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                                              {p.facultyName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-gray-600">
                                              {formatDate(p.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-gray-600">
                                              {p.status === "paid"
                                                ? formatDate(p.paidAt)
                                                : "---"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                              <span className="font-bold text-emerald-600">
                                                ₹ {p.totalAmount}
                                              </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                              {getStatusBadge(p.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                              <div className="flex items-center justify-end gap-2">
                                                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center gap-1">
                                                  <FaEdit size={12} />
                                                  Edit
                                                </button>

                                                <button
                                                  onClick={() => handlePay(p._id)}
                                                  disabled={p.status === "paid"}
                                                  className="bg-emerald-600 text-white rounded-lg px-3 py-1.5 text-xs hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                                >
                                                  <FaDollarSign size={12} />
                                                  Pay
                                                </button>

                                                <button
                                                  onClick={() => handleSlip(p)}
                                                  className="bg-blue-600 text-white rounded-lg px-3 py-1.5 text-xs hover:bg-blue-700 transition-colors flex items-center gap-1"
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
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;