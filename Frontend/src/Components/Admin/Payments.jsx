import { useState, useEffect } from "react";
import {
  FaSave,
  FaSyncAlt,
  FaUser,
  FaDollarSign,
  FaBook,
  FaCheckCircle,
} from "react-icons/fa";
import Select from "react-select";
import AdminNavbar from "./AdminNavbar";
import AdminMobileSidebar from "./AdminMobileSidebar";
import AdminDesktopSidebar from "./AdminDesktopSidebar";
import api from "../../utils/api";

import { useDispatch, useSelector } from "react-redux";
import { fetchSubjecDetails } from "../../store/subjectSlice";
import toast from "react-hot-toast";
import { createPayment } from "../../store/paymentSlice";
import { fetchFaculties } from "../../store/facultySlice";

function Payments() {
  const dispatch = useDispatch();
  // Fetch Selected Subject Details from Redux store
  const {
    selectedSubjectDetails,
    loading: selectedSubjectDetailsLoading,
    error,
  } = useSelector((state) => state.subjectSlice);

  const { facultyList, loading: fetchFacultiesLoading } = useSelector(
    (state) => state.facultySlice
  );

  const [showSidebar, setShowSidebar] = useState(false);
  // const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [facultyData, setFacultyData] = useState(null);
  const [loading, setLoading] = useState(false);

  // State variables for remuneration form
  const [selectedSubject, setSelectedSubject] = useState("");
  // const [selectedSubjectDetails, setSelectedSubjectDetails] = useState(null);
  const [termTestPapers, setTermTestPapers] = useState("");
  const [termTestRate, setTermTestRate] = useState("");
  const [termWorkPapers, setTermWorkPapers] = useState("");
  const [termWorkRate, setTermWorkRate] = useState("");
  const [oralPapers, setOralPapers] = useState("");
  const [oralRate, setOralRate] = useState("");
  const [semesterPapers, setSemesterPapers] = useState("");
  const [semesterRate, setSemesterRate] = useState("");
  const [calculatedRemunerations, setCalculatedRemunerations] = useState([]);
  const [academicYear, setAcademicYear] = useState(new Date().getFullYear());
  const [totalPayment, setTotalPayment] = useState(0);

  const handleSidebarOpen = () => setShowSidebar(true);
  const handleSidebarClose = () => setShowSidebar(false);

  // Fetch all faculty on component mount
  useEffect(() => {
    dispatch(fetchFaculties());
  }, []);

  // Handle faculty selection
  const handleFacultyChange = async (facultyId) => {
    setSelectedFaculty(facultyId);
    setSelectedSemester("");
    setSubjects([]);
    // setFacultyData(null);

    if (facultyId) {
      try {
        setLoading(true);
        // Fetch faculty data
        const facultyResponse = await api.get(
          `/admin/payment/faculty/${facultyId}`
        );
        setFacultyData(facultyResponse.data);
        const semestersResponse = await api.get(
          `/admin/payment/faculty/${facultyId}/semesters`
        );
        console.log(semestersResponse.data);
        setSemesters(semestersResponse.data);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        alert("Failed to fetch faculty data");
      } finally {
        setLoading(false);
      }
    }
  };
  // Handle semester selection
  const handleSemesterChange = async (semesterJson) => {
    setSelectedSemester(semesterJson);
    const semesterObj = JSON.parse(semesterJson); // now we have full object
    console.log(semesterObj);

    const sem = semesterObj.semester;
    const academicYear = semesterObj.academicYear;
    const semesterType = semesterObj.semesterType;
    console.log("sem ", sem, "Year ", academicYear, "Type ", semesterType);

    setSubjects([]);

    if (sem && selectedFaculty) {
      try {
        setLoading(true);
        const response = await api.get(
          `/admin/payment/faculty/${selectedFaculty}/semester/${sem}/year/${academicYear}/semType/${semesterType}/subjects`
        );
        console.log(response.data);
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        alert("Failed to fetch subjects");
      } finally {
        setLoading(false);
      }
    }
  };

  // Get subjects display string
  const getSubjectsDisplay = () => {
    if (subjects.length === 0) return "No subjects assigned";
    return subjects.map((subject) => subject.name).join(", ");
  };

  // Handle subject selection and fetch details
  const handleSubjectChange = async (subjectObj) => {
    console.log("From handleSubjectChange ==> ", subjectObj);
    // console.log(subjectName);
    setSelectedSubject(subjectObj);
    // setSelectedSubject(subjectName);

    // Reset form fields
    setTermTestPapers("");
    setTermTestRate("");
    setTermWorkPapers("");
    setTermWorkRate("");
    setOralPapers("");
    setOralRate("");
    setSemesterPapers("");
    setSemesterRate("");

    if (!subjectObj) return;

    // Find selected subject to get its id
    // const selectedSubjectObj = subjects.find(
    //   (subject) => subject.name === subjectName
    // );

    // if (!selectedSubjectObj) {
    //   toast.error("Selected subject not found");
    //   return;
    // }

    // Fetch subject details using Redux action
    console.log(
      "The selected subject from faculty assigned subjects is ==>",
      subjectObj
    );
    dispatch(fetchSubjecDetails(subjectObj.subjectId));
  };

  // Handle save payment button click - Add subject to calculation (no database save)
  const handleSavePayment = async () => {
    if (!selectedSubject) {
      alert("Please select a subject");
      return;
    }

    if (!selectedFaculty || !selectedSemester) {
      alert("Please select faculty and semester");
      return;
    }

    try {
      setLoading(true);
      // Find the selected subject object to get its ID
      const selectedSubjectObj = subjects.find(
        (subject) => subject.subjectId === selectedSubject.subjectId
      );

      if (!selectedSubjectObj) {
        alert("Selected subject not found");
        return;
      }

      console.log("Selected subject object:", selectedSubjectObj);
      console.log("Available subjects:", subjects);

      // Calculate the total payment locally (no backend call for individual subjects)
      const termTestTotal = selectedSubjectDetails?.hasTermTest
        ? (parseInt(termTestPapers) || 0) * (parseInt(termTestRate) || 0)
        : 0;
      const termWorkTotal = selectedSubjectDetails?.hasTermWork
        ? (parseInt(termWorkPapers) || 0) * (parseInt(termWorkRate) || 0)
        : 0;
      const oralTotal = selectedSubjectDetails?.hasPractical
        ? (parseInt(oralPapers) || 0) * (parseInt(oralRate) || 0)
        : 0;
      const semesterTotal = selectedSubjectDetails?.hasSemesterExam
        ? (parseInt(semesterPapers) || 0) * (parseInt(semesterRate) || 0)
        : 0;
      const totalPayment =
        termTestTotal + termWorkTotal + oralTotal + semesterTotal;

      setTotalPayment(totalPayment);

      // Add the calculated remuneration to the list (no database save yet)
      const calculatedRemuneration = {
        subjectName: selectedSubject.name,
        subjectId: selectedSubjectObj.subjectId,
        department: selectedSubject.department,
        semester: selectedSubjectObj.semester,
        semesterLabel: JSON.parse(selectedSemester).label,
        termTestPapers: parseInt(termTestPapers) || 0,
        termTestRate: parseInt(termTestRate) || 0,
        termWorkPapers: parseInt(termWorkPapers) || 0,
        termWorkRate: parseInt(termWorkRate) || 0,
        oralPapers: parseInt(oralPapers) || 0,
        oralRate: parseInt(oralRate) || 0,
        semesterPapers: parseInt(semesterPapers) || 0,
        semesterRate: parseInt(semesterRate) || 0,
        totalPayment: totalPayment,
      };

      console.log(
        "Adding remuneration for subject:",
        selectedSubject,
        "with ID:",
        selectedSubjectObj.subjectId
      );

      setCalculatedRemunerations((prev) => [...prev, calculatedRemuneration]);

      // Reset form
      setSelectedSubject("");
      setTermTestPapers("");
      setTermTestRate("");
      setTermWorkPapers("");
      setTermWorkRate("");
      setOralPapers("");
      setOralRate("");
      setSemesterPapers("");
      setSemesterRate("");

      toast.success(
        'Subject added to calculation. Click "Update Final Calculation" to save to database.',
        { duration: 4000 }
      );
    } catch (error) {
      console.error("Error adding subject to calculation:", error);
      toast.error("Failed to add subject to calculation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle final calculation and save to database
  const handleUpdateFinalCalculation = async () => {
    if (calculatedRemunerations.length === 0) {
      alert(
        "Please add at least one subject remuneration before final calculation"
      );
      return;
    }

    if (!selectedFaculty || !selectedSemester) {
      alert("Please select faculty and semester");
      return;
    }

    try {
      setLoading(true);

      // Prepare all subject breakdowns for backend
      const subjectBreakdown = calculatedRemunerations
        .map((remuneration) => {
          // Use the stored subjectId directly if available
          if (remuneration.subjectId) {
            console.log(
              `Using stored subjectId: ${remuneration.subjectId} for subject: ${remuneration.subjectName} of ${remuneration.department}`
            );
            return {
              subjectId: remuneration.subjectId,
              subjectName: remuneration.subjectName, // ADDed
              department: remuneration.department, // <-- NEW
              semester: remuneration.semester, // ADDed
              termTestAssessment: {
                // Added
                count: remuneration.termTestPapers,
                rate: remuneration.termTestRate,
              },
              termWorkAssessment: {
                count: remuneration.termWorkPapers,
                rate: remuneration.termWorkRate,
              },
              oralPracticalAssessment: {
                count: remuneration.oralPapers,
                rate: remuneration.oralRate,
              },
              paperChecking: {
                count: remuneration.semesterPapers,
                rate: remuneration.semesterRate,
              },
            };
          }

          // Fallback: Try to find by name if subjectId is not available
          let subjectObj = subjects.find(
            (subject) =>
              subject.name.trim().toLowerCase() ===
                remuneration.subjectName.trim().toLowerCase() &&
              subject.department === remuneration.department &&
              subject.semester === remuneration.semester
          );

          if (!subjectObj) {
            console.error("Subject not found", {
              name: remuneration.subjectName,
              department: remuneration.department,
              semester: remuneration.semester,
            });
            return null; // STOP
          }

          console.log(
            `Matched "${remuneration.subjectName}" with "${subjectObj.name}" SubjectObj: "${subjectObj}"`
          );

          return {
            subjectId: subjectObj.subjectId,
            subjectName: remuneration.subjectName, // ADDed
            department: remuneration.department, // <-- NEW
            semester: remuneration.semester,
            termTestAssessment: {
              // Added
              count: remuneration.termTestPapers,
              rate: remuneration.termTestRate,
            },
            termWorkAssessment: {
              count: remuneration.termWorkPapers,
              rate: remuneration.termWorkRate,
            },
            oralPracticalAssessment: {
              count: remuneration.oralPapers,
              rate: remuneration.oralRate,
            },
            paperChecking: {
              count: remuneration.semesterPapers,
              rate: remuneration.semesterRate,
            },
          };
        })
        .filter((item) => item !== null); // Remove any null items

      // Remove duplicates based on subjectId
      const uniqueSubjectBreakdown = subjectBreakdown.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.subjectId === item.subjectId)
      );

      console.log("All calculated remunerations:", calculatedRemunerations);
      console.log(
        "Available subjects:",
        subjects.map((s) => ({ name: s.name, subjectId: s.subjectId }))
      );
      console.log("Subject breakdown being sent:", uniqueSubjectBreakdown);

      // Validate that we have subjects to send
      if (uniqueSubjectBreakdown.length === 0) {
        alert("No valid subjects found to save. Please check your selections.");
        return;
      }

      const semesterObj = JSON.parse(selectedSemester);
      const paymentData = {
        facultyId: selectedFaculty,
        academicYear: semesterObj.academicYear, // send Year
        semesterType: semesterObj.semesterType, // send Odd/Even
        subjectBreakdown: uniqueSubjectBreakdown,
      };

      const result = await dispatch(createPayment(paymentData));

      if (createPayment.fulfilled.match(result)) {
        toast.success("Payment calculation saved successfully!");
        // Clear the calculated remunerations after successful save
        setCalculatedRemunerations([]);
        // Reset form
        setSelectedSubject("");
        setTermWorkPapers("");
        setTermWorkRate("");
        setOralPapers("");
        setOralRate("");
        setSemesterPapers("");
        setSemesterRate("");
        // dispatch(fetchPayments());
      } else {
        toast.error(result.payload || "Failed to save Payment");
      }
    } finally {
      setLoading(false);
    }
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
            page="Faculty Payments"
            desc="Calculate and process faculty remuneration"
          />

          <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Initiate Payments Card */}
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                      <FaUser className="text-blue-600" />
                      Initiate Payments
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Start a new payment process for faculty members
                    </p>
                  </div>
                  {loading && (
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Faculty, Semester, Academic Year */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Faculty
                    </label>

                    <Select
                      options={facultyList.map((faculty) => ({
                        value: faculty._id, // SAME as old <option value>
                        label: `${faculty.name} - ${faculty.designation}`,
                      }))}
                      value={
                        selectedFaculty
                          ? {
                              value: selectedFaculty,
                              label: facultyList.find(
                                (f) => f._id === selectedFaculty
                              )
                                ? `${
                                    facultyList.find(
                                      (f) => f._id === selectedFaculty
                                    ).name
                                  } - ${
                                    facultyList.find(
                                      (f) => f._id === selectedFaculty
                                    ).designation
                                  }`
                                : "",
                            }
                          : null
                      }
                      onChange={(selected) =>
                        handleFacultyChange(selected ? selected.value : "")
                      }
                      isDisabled={loading}
                      placeholder="Choose..."
                      className="basic-select"
                      classNamePrefix="select"
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          padding: "4px",
                          minHeight: "48px",
                          backgroundColor: "#f9fafb",
                          boxShadow: "none",
                          "&:hover": {
                            borderColor: "#e5e7eb",
                          },
                        }),
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Semester
                    </label>

                    <Select
                      options={semesters.map((semester) => ({
                        value: JSON.stringify(semester), // SAME as old value
                        label: semester.label,
                      }))}
                      value={
                        selectedSemester
                          ? {
                              value: selectedSemester,
                              label: JSON.parse(selectedSemester).label,
                            }
                          : null
                      }
                      onChange={(selected) =>
                        handleSemesterChange(selected ? selected.value : "")
                      }
                      isDisabled={!selectedFaculty || loading}
                      placeholder="Choose..."
                      className="basic-select"
                      classNamePrefix="select"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          padding: "4px",
                          minHeight: "48px",
                          backgroundColor: "#f9fafb",
                          boxShadow: "none",
                          "&:hover": {
                            borderColor: "#e5e7eb",
                          },
                        }),
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      value={
                        selectedSemester && selectedSemester !== ""
                          ? JSON.parse(selectedSemester).academicYear
                          : ""
                      }
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                    />
                  </div>
                </div>

                {/* Subjects Assigned */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjects Assigned
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-xl bg-gray-50 min-h-[60px]">
                    {subjects.length === 0 ? (
                      <span className="text-sm text-gray-500">
                        No subjects assigned
                      </span>
                    ) : (
                      subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="inline-flex flex-col gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                        >
                          <span className="leading-tight">{subject.name}</span>

                          <span className="w-fit px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-200 text-blue-900">
                            {subject.department}
                          </span>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Travel Allowance & Department */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Travel Allowance
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        ₹
                      </span>
                      <input
                        type="text"
                        value={
                          facultyData
                            ? facultyData.travelAllowance?.toLocaleString()
                            : "0"
                        }
                        disabled
                        className="block w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Faculty Department
                    </label>
                    <input
                      type="text"
                      value={facultyData ? facultyData.department : ""}
                      disabled
                      className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Remuneration Calculation Card */}
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                  <FaDollarSign className="text-emerald-600" />
                  Remuneration Calculation
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Calculate remuneration for each subject
                  {selectedSubjectDetails && (
                    <span className="flex gap-2 mt-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          selectedSubjectDetails.hasTermTest
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {selectedSubjectDetails.hasTermTest ? "✓" : "✗"} Term
                        Test
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          selectedSubjectDetails.hasTermWork
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {selectedSubjectDetails.hasTermWork ? "✓" : "✗"} Term
                        Work
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          selectedSubjectDetails.hasPractical
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {selectedSubjectDetails.hasPractical ? "✓" : "✗"}{" "}
                        Practical
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          selectedSubjectDetails.hasSemesterExam
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {selectedSubjectDetails.hasSemesterExam ? "✓" : "✗"}{" "}
                        Semester Exam
                      </span>
                    </span>
                  )}
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Select Subject */}
                <div className="md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Subject
                  </label>

                  <Select
                    options={subjects.map((subject) => ({
                      value: subject,
                      label: `${subject.name} - ${subject.department}`,
                    }))}
                    value={
                      selectedSubject
                        ? {
                            value: selectedSubject,
                            label: `${selectedSubject.name} - ${selectedSubject.department}`,
                          }
                        : null
                    }
                    onChange={(selected) =>
                      handleSubjectChange(selected ? selected.value : "")
                    }
                    isDisabled={!selectedSemester || subjects.length === 0}
                    placeholder="Choose..."
                    className="basic-select"
                    classNamePrefix="select"
                    isSearchable={false}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "4px",
                        minHeight: "48px",
                        backgroundColor: "#f9fafb",
                        boxShadow: "none",
                        "&:hover": {
                          borderColor: "#e5e7eb",
                        },
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                  />
                </div>

                {/* Term Test Assessment */}
                {selectedSubjectDetails?.hasTermTest &&
                  facultyData?.designation !== "External Examiner" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          No. of Term Test Papers
                        </label>
                        <input
                          type="number"
                          value={termTestPapers}
                          onChange={(e) => setTermTestPapers(e.target.value)}
                          className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rate per Paper
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={termTestRate}
                            onChange={(e) => setTermTestRate(e.target.value)}
                            className="block w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                {/* Term Work Assessment */}
                {selectedSubjectDetails?.hasTermTest &&
                  facultyData?.designation !== "External Examiner" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          No. of Term Work Papers
                        </label>
                        <input
                          type="number"
                          value={termWorkPapers}
                          onChange={(e) => setTermWorkPapers(e.target.value)}
                          className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rate per Paper
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={termWorkRate}
                            onChange={(e) => setTermWorkRate(e.target.value)}
                            className="block w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                {/* Oral/Practical Assessment */}
                {selectedSubjectDetails?.hasPractical && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Oral/Practical Papers
                      </label>
                      <input
                        type="number"
                        value={oralPapers}
                        onChange={(e) => setOralPapers(e.target.value)}
                        className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate per Paper
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={oralRate}
                          onChange={(e) => setOralRate(e.target.value)}
                          className="block w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Semester Papers */}
                {selectedSubjectDetails?.hasSemesterExam &&
                  facultyData?.designation !== "External Examiner" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Semester Papers
                        </label>
                        <input
                          type="number"
                          value={semesterPapers}
                          onChange={(e) => setSemesterPapers(e.target.value)}
                          className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rate per Paper
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={semesterRate}
                            onChange={(e) => setSemesterRate(e.target.value)}
                            className="block w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                {/* Add Subject Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSavePayment}
                    disabled={!selectedSubject || loading}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-sm cursor-pointer"
                  >
                    <FaSave />
                    Add Subject to Calculation
                  </button>
                </div>
              </div>
            </div>

            {/* Calculated Remunerations Table */}
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                  <FaBook className="text-blue-600" />
                  Calculated Remunerations
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Review calculated remunerations for each subject
                </p>
              </div>

              {calculatedRemunerations.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <FaDollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4 opacity-50" />
                  <p className="text-sm text-gray-500">
                    No remunerations calculated yet. Click "Add Subject to
                    Calculation" to add subjects.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50/70">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Branch
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Semester
                        </th>
                        {calculatedRemunerations.some(
                          (r) => r.termTestPapers > 0
                        ) && (
                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Term Test
                          </th>
                        )}
                        {calculatedRemunerations.some(
                          (r) => r.termWorkPapers > 0
                        ) && (
                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Term Work
                          </th>
                        )}
                        {calculatedRemunerations.some(
                          (r) => r.oralPapers > 0
                        ) && (
                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Oral/Practical
                          </th>
                        )}
                        {calculatedRemunerations.some(
                          (r) => r.semesterPapers > 0
                        ) && (
                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Semester Papers
                          </th>
                        )}
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Total Payment
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/60 divide-y divide-gray-100">
                      {calculatedRemunerations.map((remuneration, index) => (
                        <tr
                          key={index}
                          className="hover:bg-blue-50/60 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {remuneration.subjectName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 text-center">
                            {remuneration.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {remuneration.semesterLabel}
                            </span>
                          </td>
                          {calculatedRemunerations.some(
                            (r) => r.termTestPapers > 0
                          ) && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              {remuneration.termTestPapers > 0 ? (
                                <span className="text-gray-900">
                                  {remuneration.termTestPapers} ×{" "}
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                    ₹ {remuneration.termTestRate}
                                  </span>
                                </span>
                              ) : (
                                <span className="text-gray-400">---</span>
                              )}
                            </td>
                          )}
                          {calculatedRemunerations.some(
                            (r) => r.termWorkPapers > 0
                          ) && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              {remuneration.termWorkPapers > 0 ? (
                                <span className="text-gray-900">
                                  {remuneration.termWorkPapers} ×{" "}
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                    ₹ {remuneration.termWorkRate}
                                  </span>
                                </span>
                              ) : (
                                <span className="text-gray-400">---</span>
                              )}
                            </td>
                          )}
                          {calculatedRemunerations.some(
                            (r) => r.oralPapers > 0
                          ) && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              {remuneration.oralPapers > 0 ? (
                                <span className="text-gray-900">
                                  {remuneration.oralPapers} ×{" "}
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                    ₹ {remuneration.oralRate}
                                  </span>
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          )}
                          {calculatedRemunerations.some(
                            (r) => r.semesterPapers > 0
                          ) && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              {remuneration.semesterPapers > 0 ? (
                                <span className="text-gray-900">
                                  {remuneration.semesterPapers} ×{" "}
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                    ₹ {remuneration.semesterRate}
                                  </span>
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="font-bold text-emerald-600 text-lg">
                              ₹ {remuneration.totalPayment.toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Final Remuneration Summary */}
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-600" />
                  Final Calculated Remuneration
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Summary of all remuneration components
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">
                      Travel Allowance
                    </span>
                    <span className="font-bold text-blue-600 text-lg">
                      ₹
                      {facultyData
                        ? facultyData.travelAllowance?.toLocaleString()
                        : "0"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">
                      Calculated Remuneration
                    </span>
                    <span className="font-bold text-emerald-600 text-lg">
                      ₹
                      {calculatedRemunerations
                        .reduce((sum, item) => sum + item.totalPayment, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200">
                    <span className="text-base font-bold text-gray-900">
                      Total Remuneration
                    </span>
                    <span className="font-bold text-emerald-700 text-2xl">
                      ₹
                      {(
                        calculatedRemunerations.reduce(
                          (sum, item) => sum + item.totalPayment,
                          0
                        ) + (facultyData ? facultyData.travelAllowance || 0 : 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
                  <button
                    onClick={handleUpdateFinalCalculation}
                    disabled={calculatedRemunerations.length === 0 || loading}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                  >
                    <FaSyncAlt />
                    Update Final Calculation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payments;
