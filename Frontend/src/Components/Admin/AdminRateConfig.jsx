import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaSave, FaEdit, FaUndo } from "react-icons/fa";
import api from "../../utils/api";
import toast from "react-hot-toast";

import AdminNavbar from "./AdminNavbar";
import AdminMobileSidebar from "./AdminMobileSidebar";
import AdminDesktopSidebar from "./AdminDesktopSidebar";

export default function AdminRateConfig() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [rates, setRates] = useState({});
  const [originalRates, setOriginalRates] = useState({}); // ⭐ backup
  const [hasChanges, setHasChanges] = useState(false);

  /* ---------------- FETCH ---------------- */

  const convertToArray = (obj, type = "simple") =>
    Object.entries(obj || {}).map(([marks, value]) => ({
      id: crypto.randomUUID(),
      marks,
      ...(type === "simple"
        ? { rate: value }
        : { internal: value.internal, external: value.external }),
    }));

  const fetchRates = async () => {
    try {
      const res = await api.get("/admin/rates");
      const data = {
        termWork: convertToArray(res.data.termWork),
        termTest: convertToArray(res.data.termTest),
        oral: convertToArray(res.data.oral, "dual"),
        oralWithPractical: convertToArray(
          res.data.oralWithPractical,
          "dual"
        ),
        semester: {
          moderation: convertToArray(res.data.semester?.moderation),
          assessment: convertToArray(res.data.semester?.assessment),
        },
      };

      setRates(data);
      setOriginalRates(data); // ⭐ store original
    } catch {
      toast.error("Failed to load rates");
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  /* ---------------- CHANGE TRACK ---------------- */

  useEffect(() => {
    setHasChanges(
      JSON.stringify(rates) !== JSON.stringify(originalRates)
    );
  }, [rates, originalRates]);

  /* ---------------- WARN BEFORE EXIT ---------------- */

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  /* ---------------- HANDLERS ---------------- */

  const handleAddRow = (section, type, subSection = null) => {
    if (!isEditMode) return;

    const newRow =
      type === "simple"
        ? { id: crypto.randomUUID(), marks: "", rate: "" }
        : { id: crypto.randomUUID(), marks: "", internal: "", external: "" };

    setRates((prev) => {
      if (subSection) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [subSection]: [...prev[section][subSection], newRow],
          },
        };
      }
      return { ...prev, [section]: [...prev[section], newRow] };
    });
  };

  const handleDelete = (section, id, subSection = null) => {
    if (!isEditMode) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this rate?"
    );
    if (!confirmDelete) return;

    setRates((prev) => {
      if (subSection) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [subSection]: prev[section][subSection].filter(
              (r) => r.id !== id
            ),
          },
        };
      }

      return {
        ...prev,
        [section]: prev[section].filter((r) => r.id !== id),
      };
    });
  };

  const handleChange = (section, id, field, value, subSection = null) => {
    if (!isEditMode) return;

    const update = (row) =>
      row.id === id ? { ...row, [field]: value } : row;

    setRates((prev) => {
      if (subSection) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [subSection]: prev[section][subSection].map(update),
          },
        };
      }

      return {
        ...prev,
        [section]: prev[section].map(update),
      };
    });
  };

  /* ---------------- UNDO ---------------- */

  const handleUndo = () => {
    setRates(originalRates);
    toast("Changes reverted");
  };

  /* ---------------- SAVE ---------------- */

  const convertToObject = (arr, type = "simple") => {
    const obj = {};
    arr.forEach((r) => {
      if (!r.marks) return;

      obj[r.marks] =
        type === "simple"
          ? r.rate
          : { internal: r.internal, external: r.external };
    });
    return obj;
  };

  const handleSave = async () => {
    try {
      const payload = {
        termWork: convertToObject(rates.termWork),
        termTest: convertToObject(rates.termTest),
        oral: convertToObject(rates.oral, "dual"),
        oralWithPractical: convertToObject(
          rates.oralWithPractical,
          "dual"
        ),
        semester: {
          moderation: convertToObject(rates.semester.moderation),
          assessment: convertToObject(rates.semester.assessment),
        },
      };

      await api.put("/admin/rates", payload);

      toast.success("Rates updated successfully");
      setOriginalRates(rates); // ⭐ reset baseline
      setIsEditMode(false);
    } catch {
      toast.error("Failed to save rates");
    }
  };

  /* ---------------- TABLE UI ---------------- */

  const renderTable = (
    title,
    section,
    type = "simple",
    subSection = null
  ) => {
    const data = subSection
      ? rates[section]?.[subSection]
      : rates[section];

    return (
      <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="border-l-4 border-blue-500 pl-3">
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
              {title}
            </h3>
          </div>

          {isEditMode && (
            <button
              onClick={() => handleAddRow(section, type, subSection)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-600 bg-blue-600 text-white text-sm font-medium hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <FaPlus size={12} />
              Add
            </button>
          )}
        </div>

        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Marks
                  </th>
                  {type === "simple" ? (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Rate
                    </th>
                  ) : (
                    <>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Internal
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        External
                      </th>
                    </>
                  )}
                  {isEditMode && (
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="bg-white/60 divide-y divide-gray-100">
                {data?.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        value={row.marks}
                        disabled={!isEditMode}
                        onChange={(e) =>
                          handleChange(
                            section,
                            row.id,
                            "marks",
                            e.target.value,
                            subSection
                          )
                        }
                        className={`w-full px-4 py-2 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isEditMode
                            ? "border border-gray-200 bg-white"
                            : "border border-gray-100 bg-white cursor-default"
                        }`}
                      />
                    </td>

                    {type === "simple" ? (
                      <td className="px-6 py-4">
                        <input
                          value={row.rate}
                          disabled={!isEditMode}
                          onChange={(e) =>
                            handleChange(
                              section,
                              row.id,
                              "rate",
                              e.target.value,
                              subSection
                            )
                          }
                          className={`w-full px-4 py-2 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            isEditMode
                              ? "border border-gray-200 bg-white"
                              : "border border-gray-100 bg-white cursor-default"
                          }`}
                        />
                      </td>
                    ) : (
                      <>
                        <td className="px-6 py-4">
                          <input
                            value={row.internal}
                            disabled={!isEditMode}
                            onChange={(e) =>
                              handleChange(
                                section,
                                row.id,
                                "internal",
                                e.target.value,
                                subSection
                              )
                            }
                            className={`w-full px-4 py-2 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              isEditMode
                                ? "border border-gray-200 bg-white"
                                : "border border-gray-100 bg-white cursor-default"
                            }`}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            value={row.external}
                            disabled={!isEditMode}
                            onChange={(e) =>
                              handleChange(
                                section,
                                row.id,
                                "external",
                                e.target.value,
                                subSection
                              )
                            }
                            className={`w-full px-4 py-2 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              isEditMode
                                ? "border border-gray-200 bg-white"
                                : "border border-gray-100 bg-white cursor-default"
                            }`}
                          />
                        </td>
                      </>
                    )}

                    {isEditMode && (
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            handleDelete(section, row.id, subSection)
                          }
                          className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-red-100 text-red-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
                        >
                          <FaTrash size={13} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-slate-50 to-gray-100">
      <div className="flex h-screen overflow-hidden">
        <AdminMobileSidebar
          showSidebar={showSidebar}
          handleSidebarClose={() => setShowSidebar(false)}
        />

        <AdminDesktopSidebar />

        <div className="flex-1 overflow-auto">
          <AdminNavbar
            handleSidebarOpen={() => setShowSidebar(true)}
            page="Rate Configuration"
            desc="Manage dynamic rate settings"
          />

          <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                    Rate Configuration
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Configure assessment rates used for payment calculations.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      if (isEditMode && hasChanges) {
                        const confirmCancel = window.confirm(
                          "Discard unsaved changes?"
                        );
                        if (!confirmCancel) return;
                        setRates(originalRates);
                      }
                      setIsEditMode((prev) => !prev);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <FaEdit size={13} /> {isEditMode ? "Cancel" : "Edit"}
                  </button>

                  {isEditMode && (
                    <>
                      <button
                        onClick={handleUndo}
                        disabled={!hasChanges}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaUndo size={13} /> Undo
                      </button>

                      <button
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaSave size={13} /> Save
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderTable("Term Work", "termWork")}
              {renderTable("Term Test", "termTest")}
              {renderTable("Oral", "oral", "dual")}
              {renderTable("Oral With Practical", "oralWithPractical", "dual")}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderTable("Semester Moderation", "semester", "simple", "moderation")}
              {renderTable("Semester Assessment", "semester", "simple", "assessment")}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
