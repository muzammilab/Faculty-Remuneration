import { useState, useEffect, useRef } from "react";
import { FaUsers, FaPlus, FaChevronRight, FaTimes, FaHistory } from "react-icons/fa";
import Select from "react-select";

const DRAFT_KEY = "add_class_draft";
import AdminNavbar from "./AdminNavbar";
import AdminDesktopSidebar from "./AdminDesktopSidebar";
import AdminMobileSidebar from "./AdminMobileSidebar";

// ─── Subject data per year + semester ───────────────────────────────────────
const SUBJECTS = {
  FE: {
    Odd: [
      "Engineering Mathematics I",
      "Engineering Physics",
      "Engineering Chemistry",
      "Basic Electrical Engineering",
      "Engineering Graphics",
      "Communication Skills",
    ],
    Even: [
      "Engineering Mathematics II",
      "Engineering Mechanics",
      "Basic Electronics",
      "Programming & Problem Solving",
      "Environmental Studies",
      "Workshop Practice",
    ],
  },
  SE: {
    Odd: [
      "Engineering Mathematics III",
      "Data Structures",
      "Digital Electronics",
      "Object Oriented Programming",
      "Discrete Mathematics",
      "Electrical Networks",
    ],
    Even: [
      "Engineering Mathematics IV",
      "Database Management Systems",
      "Computer Organization",
      "Design & Analysis of Algorithms",
      "Theory of Computation",
      "Microprocessors",
    ],
  },
  TE: {
    Odd: [
      "Computer Networks",
      "Operating Systems",
      "Software Engineering",
      "Machine Learning",
      "Data Warehousing",
      "Web Technology",
    ],
    Even: [
      "Compiler Design",
      "Artificial Intelligence",
      "Cloud Computing",
      "Information Security",
      "Human Computer Interaction",
      "Project Management",
    ],
  },
  BE: {
    Odd: [
      "Distributed Systems",
      "Big Data Analytics",
      "Deep Learning",
      "Blockchain Technology",
      "Internet of Things",
      "Major Project Phase I",
    ],
    Even: [
      "Natural Language Processing",
      "Cyber Security",
      "Entrepreneurship",
      "Open Elective",
      "Major Project Phase II",
      "Industrial Training",
    ],
  },
};

const SEM_NUMBER = {
  FE: { Odd: 1, Even: 2 },
  SE: { Odd: 3, Even: 4 },
  TE: { Odd: 5, Even: 6 },
  BE: { Odd: 7, Even: 8 },
};

const YEAR_LABELS = {
  FE: "First Year",
  SE: "Second Year",
  TE: "Third Year",
  BE: "Fourth Year",
};
const YEAR_ORDER = ["FE", "SE", "TE", "BE"];

/********** For the dropdown in add class modal **********/
// Generate AY options dynamically from 2024-25 to 2029-30
const academicYearOptions = Array.from({ length: 6 }, (_, i) => {
  const start = 2024 + i;
  const end = (start + 1).toString().slice(-2);

  return {
    value: `${start}-${end}`,
    label: `${start}-${end}`,
  };
});

// Static options for Year of Engineering
const yearOptions = [
  { value: "FE", label: "FE - First Year" },
  { value: "SE", label: "SE - Second Year" },
  { value: "TE", label: "TE - Third Year" },
  { value: "BE", label: "BE - Fourth Year" },
];

// Static options for Semester Type
const semOptions = [
  { value: "Odd", label: "Odd Semester" },
  { value: "Even", label: "Even Semester" },
];

// ─── Add Class Modal ─────────────────────────────────────────────────────────
function AddClassModal({ onClose, onSave }) {
  const savedDraft = (() => {
    try {
      return JSON.parse(localStorage.getItem(DRAFT_KEY)) || {};
    } catch {
      return {};
    }
  })();

  const [ay, setAy] = useState(savedDraft.ay || "");
  const [year, setYear] = useState(savedDraft.year || "");
  const [sem, setSem] = useState(savedDraft.sem || "");
  const [counts, setCounts] = useState(savedDraft.counts || {});
  const [draftRestored, setDraftRestored] = useState(
    !!(savedDraft.ay || savedDraft.year || savedDraft.sem),
  );
  const autoSaveTimer = useRef(null);

  // Auto-save draft to localStorage on every change (debounced 500ms)
  useEffect(() => {
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ ay, year, sem, counts }),
      );
    }, 500);
    return () => clearTimeout(autoSaveTimer.current);
  }, [ay, year, sem, counts]);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setDraftRestored(false);
  };

  const subjects = year && sem ? SUBJECTS[year][sem] : [];
  const semNum = year && sem ? SEM_NUMBER[year][sem] : null;

  const handleYearChange = (v) => {
    setYear(v);
    setCounts({});
  };
  const handleSemChange = (v) => {
    setSem(v);
    setCounts({});
  };

  const handleCount = (subj, val) => {
    setCounts((prev) => ({
      ...prev,
      [subj]: val === "" ? "" : Math.max(0, parseInt(val) || 0),
    }));
  };

  const handleSave = () => {
    if (!ay.trim() || !year || !sem) {
      alert(
        "Please fill Academic Year, Year of Engineering, and Semester Type.",
      );
      return;
    }
    const subjectData = subjects.map((name) => ({
      name,
      count: parseInt(counts[name]) || 0,
    }));
    localStorage.removeItem(DRAFT_KEY);
    onSave({ ay: ay.trim(), year, sem, subjects: subjectData });
    onClose();
  };

  const handleClose = () => {
    // Draft is already saved — just close, no data loss
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-3xl border border-gray-200 w-full max-w-3xl shadow-xl overflow-hidden">
        {/* Draft restored banner */}
        {draftRestored && (
          <div className="flex items-center justify-between gap-3 px-5 py-2.5 bg-amber-50 border-b border-amber-200">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-medium">
              <FaHistory size={11} />
              Draft restored — your previous progress has been recovered.
            </div>
            <button
              onClick={() => {
                setAy("");
                setYear("");
                setSem("");
                setCounts({});
                clearDraft();
              }}
              className="text-xs text-amber-700 underline underline-offset-2 hover:text-amber-900 whitespace-nowrap"
            >
              Clear draft
            </button>
          </div>
        )}

        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add Class Entry</h2>
            <p className="text-sm text-gray-500 mt-1">
              Fill class details and student count records
            </p>
          </div>

          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <FaTimes size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-6 max-h-[72vh] overflow-y-auto bg-gray-50/40">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Academic Year
              </label>

              <Select
                options={academicYearOptions}
                value={ay ? { value: ay, label: ay } : null}
                onChange={(selected) => setAy(selected ? selected.value : "")}
                placeholder="Select Academic Year"
                menuPortalTarget={document.body}
                menuPosition="fixed"
                menuPlacement="auto"
                classNamePrefix="select"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    minHeight: "48px",
                    boxShadow: "none",
                  }),

                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),

                  menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                    borderRadius: "12px",
                    overflow: "hidden",
                  }),

                  menuList: (base) => ({
                    ...base,
                    maxHeight: "220px",
                    overflowY: "auto",
                  }),
                }}
              />

              {ay && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-3">
                  Selected: {ay}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Year of Engineering
              </label>

              <Select
                options={yearOptions}
                value={yearOptions.find((item) => item.value === year) || null}
                onChange={(selected) =>
                  handleYearChange(selected ? selected.value : "")
                }
                placeholder="Select Year of Engineering"
                menuPortalTarget={document.body}
                menuPosition="fixed"
                menuPlacement="auto"
                classNamePrefix="select"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    minHeight: "48px",
                    boxShadow: "none",
                  }),

                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),

                  menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                    borderRadius: "12px",
                    overflow: "hidden",
                  }),

                  menuList: (base) => ({
                    ...base,
                    maxHeight: "220px",
                    overflowY: "auto",
                  }),
                }}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Semester Type
            </label>

            <Select
              options={semOptions}
              value={semOptions.find((item) => item.value === sem) || null}
              onChange={(selected) =>
                handleSemChange(selected ? selected.value : "")
              }
              placeholder="Select Semester Type"
              menuPortalTarget={document.body}
              menuPosition="fixed"
              menuPlacement="auto"
              classNamePrefix="select"
              styles={{
                control: (provided) => ({
                  ...provided,
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  minHeight: "48px",
                  boxShadow: "none",
                }),

                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),

                menu: (base) => ({
                  ...base,
                  zIndex: 9999,
                  borderRadius: "12px",
                  overflow: "hidden",
                }),

                menuList: (base) => ({
                  ...base,
                  maxHeight: "220px",
                  overflowY: "auto",
                }),
              }}
            />
          </div>

          {/* Subjects */}
          {subjects.length > 0 && (
            <>
              <div className="border-t border-gray-200 pt-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-gray-800">
                    Semester {semNum} Subjects
                  </p>

                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    Enter Students Count
                  </span>
                </div>

                <div className="space-y-3">
                  {subjects.map((subj) => (
                    <div
                      key={subj}
                      className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between hover:shadow-sm transition-all"
                    >
                      <div className="pr-4">
                        <p className="text-sm font-medium text-gray-800 leading-5">
                          {subj}
                        </p>
                      </div>

                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={counts[subj] ?? ""}
                        onChange={(e) => handleCount(subj, e.target.value)}
                        className="w-24 text-center px-3 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {!year || !sem ? (
            <p className="text-xs text-gray-400 text-center py-2">
              Select year and semester to see subjects
            </p>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tree Table ──────────────────────────────────────────────────────────────
function TreeTable({ entries, setEntries }) {
  const [openAY, setOpenAY] = useState({});
  const [openYear, setOpenYear] = useState({});
  const [openSem, setOpenSem] = useState({});
  const [editSem, setEditSem] = useState(null); // <-- NEW
  const [editCounts, setEditCounts] = useState({}); // <-- NEW

  const toggleAY = (ay) => setOpenAY((p) => ({ ...p, [ay]: !p[ay] }));
  const toggleYear = (k) => setOpenYear((p) => ({ ...p, [k]: !p[k] }));
  const toggleSem = (k) => setOpenSem((p) => ({ ...p, [k]: !p[k] }));

  // Group: AY -> year -> sem -> subjects[]
  const grouped = {};
  entries.forEach(({ ay, year, sem, subjects }) => {
    if (!grouped[ay]) grouped[ay] = {};
    if (!grouped[ay][year]) grouped[ay][year] = {};
    grouped[ay][year][sem] = subjects;
  });

  const handleEdit = (key, subjects) => {
    const counts = {};
    subjects.forEach((sub) => {
      counts[sub.name] = sub.count;
    });

    setEditSem(key);
    setEditCounts(counts);
  };

  const handleSave = (entries, ay, yr, sem) => {
    const updated = entries.map((entry) => {
      if (entry.ay === ay && entry.year === yr && entry.sem === sem) {
        return {
          ...entry,
          subjects: entry.subjects.map((sub) => ({
            ...sub,
            count: Number(editCounts[sub.name]) || 0,
          })),
        };
      }
      return entry;
    });

    setEntries(updated); // from parent
    setEditSem(null);
  };

  if (entries.length === 0) {
    return (
      <div className="px-6 py-20 text-center">
        <FaUsers className="mx-auto h-10 w-10 text-gray-300 mb-4" />
        <p className="text-sm text-gray-400">
          No entries till now. Click{" "}
          <span className="font-medium text-gray-500">+ Add Class</span> to get
          started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl">
      <table className="min-w-full text-sm border-separate border-spacing-y-2 px-3">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Class / Subject
            </th>

            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Semester
            </th>

            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Students
            </th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {Object.keys(grouped).map((ay) => (
            <>
              {/* AY Row */}
              <tr
                key={ay}
                onClick={() => toggleAY(ay)}
                className="bg-slate-100 hover:bg-slate-200 cursor-pointer transition-all rounded-2xl shadow-sm"
              >
                <td
                  colSpan={3}
                  className="px-6 py-4 font-bold text-gray-800 rounded-2xl"
                >
                  <span className="flex items-center gap-2">
                    <FaChevronRight
                      size={10}
                      className={`text-gray-400 transition-transform duration-150 ${openAY[ay] ? "rotate-90" : ""}`}
                    />
                    AY {ay}
                  </span>
                </td>
              </tr>

              {openAY[ay] &&
                YEAR_ORDER.filter((yr) => grouped[ay][yr]).map((yr) => {
                  const yKey = `${ay}_${yr}`;
                  return (
                    <>
                      {/* Year Row */}
                      <tr
                        key={yKey}
                        onClick={() => toggleYear(yKey)}
                        className="bg-blue-50 hover:bg-blue-100 cursor-pointer transition-all rounded-2xl"
                      >
                        <td
                          colSpan={3}
                          className="pl-12 pr-6 py-4 text-gray-800 font-semibold rounded-2xl"
                        >
                          <span className="flex items-center gap-2">
                            <FaChevronRight
                              size={9}
                              className={`text-gray-400 transition-transform duration-150 ${openYear[yKey] ? "rotate-90" : ""}`}
                            />
                            {yr} – {YEAR_LABELS[yr]}
                          </span>
                        </td>
                      </tr>

                      {openYear[yKey] &&
                        ["Odd", "Even"]
                          .filter((sem) => grouped[ay][yr][sem])
                          .map((sem) => {
                            const sKey = `${yKey}_${sem}`;
                            const semNum = SEM_NUMBER[yr][sem];
                            const subjects = grouped[ay][yr][sem];
                            const total = subjects.reduce(
                              (a, s) => a + s.count,
                              0,
                            );
                            return (
                              <>
                                {/* Sem Row */}
                                <tr
                                  key={sKey}
                                  onClick={() => toggleSem(sKey)}
                                  className="group cursor-pointer"
                                >
                                  <td colSpan={3} className="px-6 py-4">
                                    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-5 py-3 hover:border-blue-300 hover:bg-blue-50/40 transition-all">
                                      {/* Left Section */}
                                      <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                          <FaChevronRight
                                            size={10}
                                            className={`text-blue-600 transition-transform duration-200 ${
                                              openSem[sKey] ? "rotate-90" : ""
                                            }`}
                                          />
                                        </div>

                                        <span className="font-semibold text-gray-800 text-sm">
                                          Semester {semNum}
                                        </span>

                                        <span
                                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${
                                            sem === "Odd"
                                              ? "bg-amber-50 text-amber-700 border-amber-200"
                                              : "bg-blue-50 text-blue-700 border-blue-200"
                                          }`}
                                        >
                                          {sem}
                                        </span>
                                      </div>

                                      {/* Right Section */}
                                      <div className="flex items-center gap-2">
                                        <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                                          {total} Students
                                        </span>

                                        {editSem === sKey ? (
                                          <>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleSave(
                                                  entries,
                                                  ay,
                                                  yr,
                                                  sem,
                                                );
                                              }}
                                              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
                                            >
                                              Save
                                            </button>

                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditSem(null);
                                              }}
                                              className="px-3 py-1 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50"
                                            >
                                              Cancel
                                            </button>
                                          </>
                                        ) : (
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleEdit(sKey, subjects);
                                            }}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200"
                                          >
                                            Edit
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                </tr>

                                {/* Subject Rows */}
                                {openSem[sKey] &&
                                  subjects.map((sub) => (
                                    <tr
                                      key={sub.name}
                                      className="bg-gray-50 hover:bg-gray-100 transition-all"
                                    >
                                      <td className="pl-28 pr-6 py-3 text-gray-700 font-medium rounded-l-xl">
                                        {sub.name}
                                      </td>
                                      <td className="px-6 py-3 text-center text-xs text-gray-400">
                                        {sem}
                                      </td>
                                      <td className="px-6 py-3 text-center rounded-r-xl">
                                        {editSem === sKey ? (
                                          <input
                                            type="number"
                                            min="0"
                                            value={editCounts[sub.name]}
                                            onChange={(e) =>
                                              setEditCounts({
                                                ...editCounts,
                                                [sub.name]: e.target.value,
                                              })
                                            }
                                            className="w-20 px-2 py-1 border rounded-lg text-center"
                                          />
                                        ) : (
                                          <span className="inline-flex px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold text-xs">
                                            {sub.count}
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                              </>
                            );
                          })}
                    </>
                  );
                })}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
function EnrollmentRecords() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [entries, setEntries] = useState([]);

  const hasDraft = (() => {
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY));
      return !!(d && (d.ay || d.year || d.sem));
    } catch {
      return false;
    }
  })();

  const handleSave = (entry) => {
    setEntries((prev) => [...prev, entry]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <div className="flex h-screen overflow-hidden">
        <AdminMobileSidebar
          handleSidebarClose={() => setShowSidebar(false)}
          showSidebar={showSidebar}
        />
        <AdminDesktopSidebar />

        <div className="flex-1 overflow-auto">
          <AdminNavbar
            handleSidebarOpen={() => setShowSidebar(true)}
            page="Enrollment Records"
            desc="Manage student count per class, semester and subject"
          />

          <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Add button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(true)}
                className="relative inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                <FaPlus size={14} />
                Add Class
                {hasDraft && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full"
                    title="Unsaved draft found"
                  />
                )}
              </button>
            </div>

            {/* Table Card */}
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                    <FaUsers className="text-blue-600" />
                    Student Records
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {entries.length} record(s) found
                  </p>
                </div>
              </div>
              <TreeTable entries={entries} setEntries={setEntries} />
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <AddClassModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default EnrollmentRecords;
