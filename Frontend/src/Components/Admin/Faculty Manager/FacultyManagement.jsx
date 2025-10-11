import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  InputGroup,
  Form,
  Offcanvas,
  Alert,
} from "react-bootstrap";
import { FaSearch, FaEdit, FaTrash, FaUserPlus, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../AdminSidebar";
import api from "../../../utils/api";

function FacultyManagement() {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSidebarOpen = () => setShowSidebar(true);
  const handleSidebarClose = () => setShowSidebar(false);

  // Fetch faculties from MongoDB
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/faculty/getAll");
        console.log("Fetched faculties:", response.data);
        setFacultyList(response.data);
        setError("");
      } catch (err) {
        console.error("Failed to fetch faculties:", err);
        setError("Failed to load faculty data. Please try again.");
        if (err.response?.status === 401) {
          alert("Authentication failed. Please login again.");
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, [navigate]);

  const handleFacultyClick = (facultyId) => {
    navigate(`/admin/facultymanager/details/${facultyId}`);
  };

  const handleAddFaculty = () => {
    navigate("/admin/facultymanager/add");
  };

  const handleEditFaculty = (facultyId) => {
    navigate(`/admin/facultymanager/edit/${facultyId}`);
  };

  const handleDeleteFaculty = async (facultyId, facultyName) => {
    if (window.confirm(`Are you sure you want to delete ${facultyName}?`)) {
      try {
        await api.delete(`/admin/faculty/delete/${facultyId}`);
        // Refresh the faculty list
        const response = await api.get("/admin/faculty/getAll");
        setFacultyList(response.data);
        alert("Faculty deleted successfully");
      } catch (err) {
        console.error("Failed to delete faculty:", err);
        alert("Failed to delete faculty. Please try again.");
      }
    }
  };

  // Filter faculties based on search term
  const filteredFaculties = facultyList.filter(
    (faculty) =>
      faculty.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format assigned subjects for display
  const formatAssignedSubjects = (assignedSubjects) => {
    if (!assignedSubjects || assignedSubjects.length === 0) {
      return "No subjects assigned";
    }
    return assignedSubjects
      .map((subject) => `${subject.name} (Sem ${subject.semester})`)
      .join(", ");
  };

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      {/* Mobile Hamburger Header Button */}
      <div className="d-flex d-md-none align-items-center mb-3">
        <Button
          variant="outline-primary"
          className="me-2"
          onClick={handleSidebarOpen}
        >
          <FaBars size={20} />
        </Button>
        <h5 className="mb-0 fw-bold">Faculty Management</h5>
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
            <h2 className="fw-bold mb-1">Faculty Management</h2>
            <p className="text-primary mb-4">
              Manage faculty member information
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {/* Search Bar */}
          <Card className="mb-4 p-3 shadow rounded-4 border-0 bg-white">
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                className="border-start-0"
                placeholder="Search by name, department, or role"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Card>

          {/* Add Faculty Button */}
          <div className="d-flex justify-content-end mb-3">
            <Button
              variant="primary"
              className="rounded-pill d-flex align-items-center gap-2"
              onClick={handleAddFaculty}
            >
              <FaUserPlus /> Add Faculty
            </Button>
          </div>

          {/* Table */}
          <Card className="mb-4 p-4 shadow rounded-4 border-0 bg-white">
            <h5 className="fw-bold mb-3">Faculty List</h5>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading faculty data...</p>
              </div>
            ) : filteredFaculties.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted">No faculty members found.</p>
              </div>
            ) : (
              <Table bordered hover responsive striped className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Mobile Number</th>
                    {/* <th>Assigned Subjects</th> */}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaculties.map((faculty) => (
                    <tr key={faculty._id}>
                      <td>
                        <button
                          className="btn btn-link p-0 text-decoration-none fw-medium text-primary"
                          onClick={() => handleFacultyClick(faculty._id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          {faculty.name}
                        </button>
                      </td>
                      <td>
                        <span className="badge bg-primary">
                          {faculty.department}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {faculty.designation}
                        </span>
                      </td>
                      <td>{faculty.email}</td>
                      <td>{faculty.phone}</td>
                      {/* <td>
                        {faculty.assignedSubjects &&
                        faculty.assignedSubjects.length > 0 ? (
                          faculty.assignedSubjects.map((assigned, i) =>
                            assigned.semesters.map((sem, j) =>
                              sem.subjects.map((sub, k) => (
                                <span
                                  key={`${i}-${j}-${k}`}
                                  className="badge bg-secondary me-1 mb-1"
                                >
                                  {sub.name} (Sem {sub.semester}) [
                                  {sem.semesterType} - {assigned.academicYear}]
                                </span>
                              ))
                            )
                          )
                        ) : (
                          <span className="text-muted">
                            No subjects assigned
                          </span>
                        )}
                      </td> */}
                      <td>
                        <Button
                          variant="link"
                          className="p-0 me-2 text-decoration-none"
                          onClick={() => handleEditFaculty(faculty._id)}
                        >
                          <FaEdit className="me-1" /> Edit
                        </Button>
                        <Button
                          variant="link"
                          className="p-0 text-danger text-decoration-none"
                          onClick={() =>
                            handleDeleteFaculty(faculty._id, faculty.name)
                          }
                        >
                          <FaTrash className="me-1" /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default FacultyManagement;
