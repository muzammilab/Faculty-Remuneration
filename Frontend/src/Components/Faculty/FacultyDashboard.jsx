import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Button, ListGroup, Offcanvas } from "react-bootstrap";
import { FaBars, FaUser, FaMoneyBillWave, FaHistory, FaEdit, FaSignOutAlt, FaBus, FaChalkboardTeacher } from "react-icons/fa";
import FacultySidebar from "../FacultySidebar";
import axios from "axios";

function FacultyDashboard() {
  const [showSidebar, setShowSidebar] = useState(false);
  const handleSidebarOpen = () => setShowSidebar(true);
  const handleSidebarClose = () => setShowSidebar(false);

  const [facultyData, setFacultyData] = useState(null);
  const [facultyPayData, setFacultyPayData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const facultyId = localStorage.getItem("facultyId");
    const token = localStorage.getItem("token");

    if (!facultyId || !token) {
      console.error("No facultyId or token found in localStorage");
      return;
    }

    const fetchFacultyData = async () => {
      try {
        const facultyRes = await axios.get(
          `http://localhost:3002/admin/faculty/getSingle/${facultyId}`
        );
        console.log("Getting Faculty Details");
        console.log(facultyRes.data);
        setFacultyData(facultyRes.data);
      } catch (err) {
        console.error("Error fetching faculty data:", err);
      }

      try {
        const facultyPaymentRes = await axios.get(
          `http://localhost:3002/admin/payment/getSinglePayment/${facultyId}`
        );
        console.log("Getting Payment Details");
        console.log(facultyPaymentRes.data);
        setFacultyPayData(facultyPaymentRes.data);
      } catch (err) {
        console.error("Error fetching faculty data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, []);

  if (loading)
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4" style={{ height: "100%" }}>
      <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted fw-semibold">Fetching your dashboard...</p>
    </div>
  );

  if (!facultyData) return <div className="p-4">No faculty data found</div>;

  // Destructuring response from faculty details
  const { name, email, phone, department, designation, employeeId, baseSalary, travelAllowance, assignedSubjects } = facultyData;

  const { createdAt, totalAmount } = facultyPayData.payments;

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
        <h5 className="mb-0 fw-bold">Faculty Dashboard</h5>
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
            <FacultySidebar />
            <div className="text-muted small mt-4">Role: Faculty Member</div>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Sidebar: static for desktop */}
        <Col md={3} className="d-none d-md-block">
          <Card
            className="shadow-sm border-0 rounded-4 p-3 sticky-top"
            style={{ minHeight: "90vh" }}
          >
            <FacultySidebar />
            <div className="text-muted small mt-4">Role: Faculty Member</div>
          </Card>
        </Col>

        {/* Main Content */}
        <Col md={9}>
          <div className="d-none d-md-block">
            <h2 className="mb-2 fw-bold">Dashboard</h2>
            <hr className="mb-4" />
          </div>
          <div className="d-md-none mb-3" />

          {/* Payment Overview Cards */}
          <Row className="mb-4">
            {/* <Col md={4} className="mb-3">
              <Card className="shadow-sm border-0 rounded-4 bg-white">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                      <FaMoneyBillWave size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Base Salary</h6>
                      <h4 className="fw-bold mb-0">₹ {baseSalary}</h4>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col> */}
            <Col md={4} className="mb-3">
              <Card className="shadow-sm border-0 rounded-4 bg-white">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 p-3 rounded-3 me-3">
                      {/* <FaHistory size={24} className="text-success" /> */}
                      <FaBus size={24} className="text-success" />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Travel Allowance</h6>
                      <h4 className="fw-bold mb-0">₹ {travelAllowance}</h4>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="shadow-sm border-0 rounded-4 bg-white">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-info bg-opacity-10 p-3 rounded-3 me-3">
                      {/* <FaUser size={24} className="text-info" /> */}
                      <FaChalkboardTeacher size={24} className="text-info" />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Subjects</h6>
                      <h4 className="fw-bold mb-0">3 Active</h4>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Profile Information */}
          <Card className="mb-4 p-4 shadow rounded-4 border-0 bg-white">
            <h5 className="fw-bold mb-1">Profile Information</h5>
            <small className="text-muted mb-3 d-block">
              Your personal and professional details.
            </small>
            <Row className="mt-3">
              <Col md={4} className="mb-3">
                <div className="text-muted small mb-1">Full Name</div>
                <div className="fw-bold">{name}</div>
              </Col>
              <Col md={4} className="mb-3">
                <div className="text-muted small mb-1">Email</div>
                <div className="fw-bold">{email}</div>
              </Col>
              <Col md={4} className="mb-3">
                <div className="text-muted small mb-1">Phone Number</div>
                <div className="fw-bold">{phone}</div>
              </Col>
              <Col md={4} className="mb-3">
                <div className="text-muted small mb-1">Department</div>
                <div className="fw-bold">{department}</div>
              </Col>
              <Col md={4} className="mb-3">
                <div className="text-muted small mb-1">Designation</div>
                <div className="fw-bold">{designation}</div>
              </Col>
              <Col md={4} className="mb-3">
                <div className="text-muted small mb-1">Employee ID</div>
                <div className="fw-bold">x-x-x-x</div>
              </Col>
            </Row>
            <div className="mt-3">
              <Button
                variant="outline-primary"
                className="d-flex align-items-center gap-2"
              >
                <FaEdit /> Edit Profile
              </Button>
            </div>
          </Card>

          {/* Current Semester Subjects */}
          <Card className="mb-4 p-4 shadow rounded-4 border-0 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-semibold mb-0">Assigned Subjects</h5>
            </div>

            {assignedSubjects && assignedSubjects.length > 0 ? (
              assignedSubjects.map((yearGroup, yIdx) => (
                <div key={yIdx} className="mb-4">
                  <h6 className="fw-bold text-primary mb-2">
                    Academic Year: {yearGroup.academicYear}
                  </h6>

                  {yearGroup.semesters.map((semGroup, sIdx) => (
                    <div key={sIdx} className="mb-3 ps-3">
                      <p className="fw-semibold text-secondary mb-1">
                        {semGroup.semesterType} Semester
                      </p>
                      <Table
                        bordered
                        hover
                        responsive
                        striped
                        className="align-middle mb-0"
                      >
                        <thead className="table-light">
                          <tr>
                            <th>Subject Name</th>
                            <th>Semester</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {semGroup.subjects.map((subj, subjIdx) => (
                            <tr key={subjIdx}>
                              <td>{subj.name}</td>
                              <td className="text-primary">
                                Semester {subj.semester}
                              </td>
                              <td>
                                <span className="badge bg-primary">Active</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p className="text-muted mb-0">No assigned subjects</p>
            )}
          </Card>
        </Col>
      </Row>

      {/* Footer */}
      <footer className="text-center text-muted mt-4 small">
        <hr />
        <div>
          Role: <span className="fw-bold">Faculty</span> &nbsp;|&nbsp; &copy;{" "}
          {new Date().getFullYear()} Rizvi College of Engineering
        </div>
      </footer>
    </Container>
  );
}

export default FacultyDashboard;
