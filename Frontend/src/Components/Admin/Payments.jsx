import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Table,
  Row,
  Col,
  Container,
  Card,
  InputGroup,
  Offcanvas,
} from "react-bootstrap";
import { FaSave, FaSyncAlt, FaFileInvoiceDollar, FaBars } from "react-icons/fa";
import AdminSidebar from "../AdminSidebar";
import axios from "axios";
import api from "../../utils/api";

function Payments() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [facultyData, setFacultyData] = useState(null);
  const [loading, setLoading] = useState(false);

  // State variables for remuneration form
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSubjectDetails, setSelectedSubjectDetails] = useState(null);
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
    fetchFacultyList();
  }, []);

  // Fetch faculty list
  const fetchFacultyList = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        "http://localhost:3002/admin/faculty/getAll"
      );
      setFacultyList(response.data);
    } catch (error) {
      console.error("Error fetching faculty list:", error);
      alert("Failed to fetch faculty list");
    } finally {
      setLoading(false);
    }
  };

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
          `http://localhost:3002/admin/payment/faculty/${facultyId}`
        );
        setFacultyData(facultyResponse.data);
        const semestersResponse = await api.get(
          `http://localhost:3002/admin/payment/faculty/${facultyId}/semesters`
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
    const semesterObj = JSON.parse(semesterJson); // ✅ now you have full object
    console.log(semesterObj);

    const sem = semesterObj.semester;
    const academicYear = semesterObj.academicYear;
    const semesterType = semesterObj.semesterType;
    console.log("sem ", sem, "Year ", academicYear, "Type ", semesterType);

    setSubjects([]);

    if (sem && selectedFaculty) {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3002/admin/payment/faculty/${selectedFaculty}/semester/${sem}/year/${academicYear}/semType/${semesterType}/subjects`
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
  const handleSubjectChange = async (subjectName) => {
    setSelectedSubject(subjectName);
    setSelectedSubjectDetails(null);

    // Reset form fields
    setTermWorkPapers("");
    setTermWorkRate("");
    setOralPapers("");
    setOralRate("");
    setSemesterPapers("");
    setSemesterRate("");

    if (subjectName) {
      try {
        setLoading(true);
        // Find the selected subject object to get its ID
        const selectedSubjectObj = subjects.find(
          (subject) => subject.name === subjectName
        );
        if (!selectedSubjectObj) {
          alert("Selected subject not found");
          return;
        }

        // Fetch subject details from MongoDB
        const response = await axios.get(
          `http://localhost:3002/faculty/subject/getList/${selectedSubjectObj.subjectId}`
        );
        console.log("Subject details:", response.data);
        setSelectedSubjectDetails(response.data);
      } catch (error) {
        console.error("Error fetching subject details:", error);
        alert("Failed to fetch subject details");
      } finally {
        setLoading(false);
      }
    }
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
        (subject) => subject.name === selectedSubject
      );
      if (!selectedSubjectObj) {
        alert("Selected subject not found");
        return;
      }

      console.log("Selected subject object:", selectedSubjectObj);
      console.log("Available subjects:", subjects);

      // Calculate the total payment locally (no backend call for individual subjects)
      const termWorkTotal = selectedSubjectDetails?.hasTermTest
        ? (parseInt(termWorkPapers) || 0) * (parseInt(termWorkRate) || 0)
        : 0;
      const oralTotal = selectedSubjectDetails?.hasPractical
        ? (parseInt(oralPapers) || 0) * (parseInt(oralRate) || 0)
        : 0;
      const semesterTotal = selectedSubjectDetails?.hasSemesterExam
        ? (parseInt(semesterPapers) || 0) * (parseInt(semesterRate) || 0)
        : 0;
      const totalPayment = termWorkTotal + oralTotal + semesterTotal;

      setTotalPayment(totalPayment);

      // Add the calculated remuneration to the list (no database save yet)
      const calculatedRemuneration = {
        subjectName: selectedSubject,
        subjectId: selectedSubjectObj.subjectId,
        semester: selectedSubjectObj.semester,
        semesterLabel: JSON.parse(selectedSemester).label,
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
      setTermWorkPapers("");
      setTermWorkRate("");
      setOralPapers("");
      setOralRate("");
      setSemesterPapers("");
      setSemesterRate("");

      alert(
        'Subject added to calculation. Click "Update Final Calculation" to save to database.'
      );
    } catch (error) {
      console.error("Error adding subject to calculation:", error);
      alert("Failed to add subject to calculation. Please try again.");
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
              `Using stored subjectId: ${remuneration.subjectId} for subject: ${remuneration.subjectName}`
            );
            return {
              subjectId: remuneration.subjectId,
              subjectName: remuneration.subjectName, // ADDed
              semester: remuneration.semester, // ADDed
              termTestAssessment: {
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
            (subject) => subject.name === remuneration.subjectName
          );

          // If not found, try case-insensitive match
          if (!subjectObj) {
            subjectObj = subjects.find(
              (subject) =>
                subject.name.toLowerCase() ===
                remuneration.subjectName.toLowerCase()
            );
          }

          // If still not found, try partial match
          if (!subjectObj) {
            subjectObj = subjects.find(
              (subject) =>
                subject.name
                  .toLowerCase()
                  .includes(remuneration.subjectName.toLowerCase()) ||
                remuneration.subjectName
                  .toLowerCase()
                  .includes(subject.name.toLowerCase())
            );
          }

          if (!subjectObj) {
            console.error("Subject not found for:", remuneration.subjectName);
            console.log(
              "Available subjects:",
              subjects.map((s) => s.name)
            );
            return null;
          }

          console.log(
            `Matched "${remuneration.subjectName}" with "${subjectObj.name} SubjectObj: ${subjectObj}"`
          );

          return {
            subjectId: subjectObj.subjectId,
            termTestAssessment: {
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
        academicYear: semesterObj.academicYear, // ✅ send Year
        semesterType: semesterObj.semesterType, // ✅ send Odd/Even
        /* baseSalary,
        travelAllowance, */
        subjectBreakdown: uniqueSubjectBreakdown,
        /* totalRemuneration,
        totalAmount, */
      };

      /* const paymentData = {
        facultyId: selectedFaculty,
        semester: parseInt(selectedSemester),
        academicYear: academicYear,
        subjectBreakdown: uniqueSubjectBreakdown,
      }; */

      console.log("Sending final payment data:", paymentData);
      const response = await axios.post(
        "http://localhost:3002/admin/payment/create",
        paymentData
      );
      console.log("Final calculation response:", response.data);

      if (response.data) {
        alert("Payment calculation saved successfully!");
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
      }
    } catch (error) {
      console.error("Error saving final calculation:", error);
      alert("Failed to save final calculation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      {/* Mobile Hamburger Header */}
      <div className="d-flex d-md-none align-items-center mb-3">
        <Button
          variant="outline-primary"
          className="me-2"
          onClick={handleSidebarOpen}
        >
          <FaBars size={20} />
        </Button>
        <h5 className="mb-0 fw-bold">Faculty Payments</h5>
      </div>

      <Row>
        {/* Sidebar: Offcanvas for mobile */}
        <Offcanvas
          show={showSidebar}
          onHide={handleSidebarClose}
          className="d-md-none"
          backdrop
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {<AdminSidebar />}
            <div className="text-muted small mt-4">Role: Payment Officer</div>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Sidebar: static for desktop */}
        <Col md={3} className="d-none d-md-block">
          <Card
            className="shadow-sm border-0 rounded-4 p-3 sticky-top"
            style={{ minHeight: "90vh" }}
          >
            {<AdminSidebar />}
            <div className="text-muted small mt-4">Role: Payment Officer</div>
          </Card>
        </Col>

        {/* Main Content */}
        <Col md={9}>
          <div className="d-none d-md-block">
            <h2 className="mb-2 fw-bold">Faculty Payments</h2>
            <hr className="mb-4" />
          </div>
          <div className="d-md-none mb-3" />

          {/* Initiate Payments */}
          <Card className="mb-4 p-4 shadow rounded-4 border-0 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-1">Initiate Payments</h5>
                <small className="text-muted d-block">
                  Start a new payment process for faculty members.
                </small>
              </div>
              {loading && (
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </div>

            <Row className="mb-3">
              <Col md={4} className="mb-3 mb-md-0">
                <Form.Group>
                  <Form.Label>Select Faculty</Form.Label>
                  <Form.Select
                    value={selectedFaculty}
                    onChange={(e) => handleFacultyChange(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Choose...</option>
                    {facultyList.map((faculty) => (
                      <option key={faculty._id} value={faculty._id}>
                        {faculty.name} - {faculty.designation}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Select Semester</Form.Label>
                  <Form.Select
                    value={selectedSemester}
                    onChange={(e) => handleSemesterChange(e.target.value)}
                    disabled={!selectedFaculty || loading}
                  >
                    <option value="">Choose...</option>
                    {semesters.map((semester) => (
                      <option
                        key={semester.label}
                        value={JSON.stringify(semester)}
                      >
                        {semester.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Academic Year</Form.Label>
                  <Form.Control
                    type="string"
                    value={
                      selectedSemester && selectedSemester !== ""
                        ? JSON.parse(selectedSemester).academicYear
                        : ""
                    }
                    onChange={(e) => setAcademicYear(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Subjects Assigned</Form.Label>
                  <div className="d-flex flex-wrap gap-2 p-2 border rounded">
                    {getSubjectsDisplay()
                      .split(", ")
                      .map((subject, index) => (
                        <div
                          key={index}
                          className="card p-2 shadow-sm"
                          style={{ minWidth: "120px" }}
                        >
                          {subject}
                        </div>
                      ))}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            {/* <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Subjects Assigned</Form.Label>
                  <Form.Control
                    type="text"
                    value={getSubjectsDisplay()}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row> */}

            <Row className="mb-3">
              {/* <Col md={4}>
                <Form.Group>
                  <Form.Label>Base Salary</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      type="text"
                      value={
                        facultyData
                          ? facultyData.baseSalary?.toLocaleString()
                          : "0"
                      }
                      disabled
                    />
                  </InputGroup>
                </Form.Group>
              </Col> */}
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Travel Allowance</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      type="text"
                      value={
                        facultyData
                          ? facultyData.travelAllowance?.toLocaleString()
                          : "0"
                      }
                      disabled
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    value={facultyData ? facultyData.department : ""}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Remuneration Calculation */}
            <div className="border-top pt-3 mt-4 mb-2">
              <h5 className="fw-bold mb-1">Remuneration Calculation</h5>
              <small className="text-muted mb-3 d-block">
                Calculate remuneration for each subject.
                {selectedSubjectDetails && (
                  <div className="mt-2">
                    <span className="badge bg-info me-2">
                      {selectedSubjectDetails.hasTermTest
                        ? "✓ Term Work"
                        : "✗ Term Work"}
                    </span>
                    <span className="badge bg-info me-2">
                      {selectedSubjectDetails.hasPractical
                        ? "✓ Practical"
                        : "✗ Practical"}
                    </span>
                    <span className="badge bg-info">
                      {selectedSubjectDetails.hasSemesterExam
                        ? "✓ Semester Exam"
                        : "✗ Semester Exam"}
                    </span>
                  </div>
                )}
              </small>
            </div>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Select Subject</Form.Label>
                  <Form.Select
                    value={selectedSubject}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    disabled={!selectedSemester || subjects.length === 0}
                  >
                    <option value="">Choose...</option>
                    {subjects.map((subject, index) => (
                      <option key={index} value={subject.name}>
                        {subject.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Term Work Assessment - Only show if subject has term test */}
            {selectedSubjectDetails?.hasTermTest &&
              facultyData.designation !== "External Examiner" && (
                <Row className="mb-3">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>No. of Term Work Papers</Form.Label>
                      <Form.Control
                        type="number"
                        value={termWorkPapers}
                        onChange={(e) => setTermWorkPapers(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Rate per Paper</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>₹</InputGroup.Text>
                        <Form.Control
                          type="number"
                          value={termWorkRate}
                          onChange={(e) => setTermWorkRate(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
              )}

            {/* Oral/Practical Assessment - Only show if subject has practical */}
            {selectedSubjectDetails?.hasPractical && (
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Oral/Practical Papers</Form.Label>
                    <Form.Control
                      type="number"
                      value={oralPapers}
                      onChange={(e) => setOralPapers(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Rate per Paper</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>₹</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={oralRate}
                        onChange={(e) => setOralRate(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
            )}

            {/* Semester Papers - Only show if subject has semester exam */}
            {selectedSubjectDetails?.hasSemesterExam &&
              facultyData.designation !== "External Examiner" && (
                <Row className="mb-3">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Semester Papers</Form.Label>
                      <Form.Control
                        type="number"
                        value={semesterPapers}
                        onChange={(e) => setSemesterPapers(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Rate per Paper</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>₹</InputGroup.Text>
                        <Form.Control
                          type="number"
                          value={semesterRate}
                          onChange={(e) => setSemesterRate(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
              )}

            {/* Calculated Total - Always show */}
            <Row className="mb-3">
              <Col md={6} className="d-flex align-items-end">
                <Form.Group className="w-100">
                  <Form.Label>Calculated Total</Form.Label>
                  <Form.Control type="text" value={totalPayment} disabled />
                </Form.Group>
              </Col>
            </Row>

            {/* Add Subject Button */}
            <div className="d-flex justify-content-end">
              <Button
                variant="success"
                className="px-4 py-2 fw-bold d-flex align-items-center gap-2"
                onClick={handleSavePayment}
                disabled={!selectedSubject || loading}
              >
                <FaSave /> Add Subject to Calculation
              </Button>
            </div>
          </Card>

          {/* Calculated Remunerations */}
          <Card className="mb-4 p-4 shadow rounded-4 border-0 bg-white">
            <h5 className="fw-bold mb-1">Calculated Remunerations</h5>
            <small className="text-muted mb-3 d-block">
              Review calculated remunerations for each subject.
            </small>
            <Table
              bordered
              hover
              responsive
              striped
              className="mt-3 align-middle"
            >
              <thead className="table-light">
                <tr>
                  <th>Subject</th>
                  <th>Semester</th>
                  {calculatedRemunerations.some(
                    (r) => r.termWorkPapers > 0
                  ) && <th>Term Work Papers</th>}
                  {calculatedRemunerations.some((r) => r.oralPapers > 0) && (
                    <th>Oral/Practical Papers</th>
                  )}
                  {calculatedRemunerations.some(
                    (r) => r.semesterPapers > 0
                  ) && <th>Semester Papers</th>}
                  <th>Total Payment</th>
                </tr>
              </thead>
              <tbody>
                {calculatedRemunerations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No remunerations calculated yet. Click "Add Subject to
                      Calculation" to add subjects.
                    </td>
                  </tr>
                ) : (
                  calculatedRemunerations.map((remuneration, index) => (
                    <tr key={index}>
                      <td>{remuneration.subjectName}</td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {remuneration.semesterLabel}
                        </span>
                      </td>
                      {calculatedRemunerations.some(
                        (r) => r.termWorkPapers > 0
                      ) && (
                        <td>
                          {remuneration.termWorkPapers > 0 ? (
                            <>
                              {remuneration.termWorkPapers}{" "}
                              <span className="badge bg-secondary ms-1">
                                ₹{remuneration.termWorkRate}
                              </span>
                            </>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                      )}
                      {calculatedRemunerations.some(
                        (r) => r.oralPapers > 0
                      ) && (
                        <td>
                          {remuneration.oralPapers > 0 ? (
                            <>
                              {remuneration.oralPapers}{" "}
                              <span className="badge bg-secondary ms-1">
                                ₹{remuneration.oralRate}
                              </span>
                            </>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                      )}
                      {calculatedRemunerations.some(
                        (r) => r.semesterPapers > 0
                      ) && (
                        <td>
                          {remuneration.semesterPapers > 0 ? (
                            <>
                              {remuneration.semesterPapers}{" "}
                              <span className="badge bg-secondary ms-1">
                                ₹{remuneration.semesterRate}
                              </span>
                            </>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                      )}

                      <td className="fw-bold text-success">
                        ₹{remuneration.totalPayment.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card>

          {/* Final Remuneration */}
          <Card className="mb-4 p-4 shadow rounded-4 border-0 bg-white">
            <h5 className="fw-bold mb-1">Final Calculated Remuneration</h5>
            <small className="text-muted mb-3 d-block">
              Summary of all remuneration components.
            </small>
            <Table bordered responsive striped className="mt-3 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Component</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Travel Allowance</td>
                  <td>
                    <span className="fw-bold text-primary">
                      ₹
                      {facultyData
                        ? facultyData.travelAllowance?.toLocaleString()
                        : "0"}
                    </span>
                  </td>
                </tr>
                {/* <tr>
                  <td>Base Salary</td>
                  <td>
                    <span className="fw-bold text-primary">
                      ₹
                      {facultyData
                        ? facultyData.baseSalary?.toLocaleString()
                        : "0"}
                    </span>
                  </td>
                </tr> */}
                <tr>
                  <td>Calculated Remuneration</td>
                  <td>
                    <span className="fw-bold text-success">
                      ₹
                      {calculatedRemunerations
                        .reduce((sum, item) => sum + item.totalPayment, 0)
                        .toLocaleString()}
                    </span>
                  </td>
                </tr>
                <tr className="fw-bold table-success">
                  <td>Total Remuneration</td>
                  <td>
                    ₹
                    {(
                      calculatedRemunerations.reduce(
                        (sum, item) => sum + item.totalPayment,
                        0
                      ) +
                      /* (facultyData ? facultyData.baseSalary || 0 : 0) + */
                      (facultyData ? facultyData.travelAllowance || 0 : 0)
                    ).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </Table>

            <div className="d-flex justify-content-end gap-3 mt-3">
              <Button
                variant="primary"
                className="d-flex align-items-center gap-2"
                onClick={handleUpdateFinalCalculation}
                disabled={calculatedRemunerations.length === 0 || loading}
              >
                <FaSyncAlt /> Update Final Calculation
              </Button>
              {/* <Button
                variant="outline-secondary"
                className="d-flex align-items-center gap-2"
              >
                <FaFileInvoiceDollar /> Generate Payment Slip
              </Button>  */}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Footer */}
      <footer className="text-center text-muted mt-4 small">
        <hr />
        <div>
          Role: <span className="fw-bold">Admin</span> &nbsp;|&nbsp; &copy;{" "}
          {new Date().getFullYear()} Rizvi College of Engineering
        </div>
      </footer>
    </Container>
  );
}

export default Payments;
