import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button, Alert, Card, Badge, InputGroup } from "react-bootstrap";
import { FaArrowLeft, FaUserPlus, FaUserTie, FaBookOpen, FaEnvelope, FaPhone, FaCalendarAlt, FaLayerGroup } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import Select from "react-select";
import toast from "react-hot-toast";

function AddFacultyForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    designation: "",
    email: "",
    password: "",
    phone: "",
    /* baseSalary: "", */
    travelAllowance: "",
    academicYear: "",
    semesterType: "",
    semester: "",
    subject: "",
  });

  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [subjectOptions, setSubjectOptions] = useState([]);

  const departments = [
    "Computer",
    "Mechanical",
    "Electrical",
    "Civil",
    "AIDS",
    "ECS",
  ];
  const designations = [
    "Professor",
    "Associate Professor",
    "Assistant Professor",
    "HoD",
    "External Examiner",
  ];

  // ✅ Get semester options dynamically based on type
  const getSemesterOptions = () => {
    if (formData.semesterType === "Odd") return [1, 3, 5, 7];
    if (formData.semesterType === "Even") return [2, 4, 6, 8];
    return [];
  };

  // ✅ Fetch subjects dynamically based on semester
  useEffect(() => {
    const fetchSubjects = async () => {
      if (formData.semester) {
        try {
          const res = await api.get(
            `/faculty/subject/getList?semester=${formData.semester}`
          );
          const subjectNames = res.data.map((subj) => subj.name);
          setSubjectOptions(subjectNames);
        } catch (err) {
          console.error("Failed to fetch subjects:", err);
          if (err.response?.status === 401) {
            alert("Authentication failed. Please login again.");
            navigate("/login");
          }
        }
      } else {
        setSubjectOptions([]);
      }
    };
    fetchSubjects();
  }, [formData.semester, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAssignment = (e) => {
    e.preventDefault();
    if (formData.semester && formData.subject) {
      const exists = assignedSubjects.some(
        (a) =>
          a.academicYear === formData.academicYear &&
          a.semesterType === formData.semesterType &&
          a.semester === formData.semester &&
          a.subject === formData.subject
      );

      if (!exists) {
        setAssignedSubjects((prev) => [
          ...prev,
          {
            academicYear: formData.academicYear,
            semesterType: formData.semesterType,
            semester: formData.semester,
            subject: formData.subject,
          },
        ]);
      }

      setFormData((prev) => ({ ...prev, subject: "", semester: "" }));
    }
  };

  const handleRemoveAssignment = (index) => {
    setAssignedSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Group by academicYear and semesterType
      const academicAssignments = [];

      assignedSubjects.forEach((a) => {
        let yearGroup = academicAssignments.find(
          (grp) => grp.academicYear === a.academicYear
        );
        if (!yearGroup) {
          yearGroup = { academicYear: a.academicYear, semesters: [] };
          academicAssignments.push(yearGroup);
        }

        let semGroup = yearGroup.semesters.find(
          (s) => s.semesterType === a.semesterType
        );
        if (!semGroup) {
          semGroup = { semesterType: a.semesterType, subjects: [] };
          yearGroup.semesters.push(semGroup);
        }

        semGroup.subjects.push({
          name: a.subject,
          semester: Number(a.semester),
        });
      });

      const facultyData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        department: formData.department,
        designation: formData.designation,
        /* baseSalary: Number(formData.baseSalary), */
        travelAllowance: Number(formData.travelAllowance),
        academicAssignments, // ✅ final nested structure
      };

      const response = await api.post("/admin/faculty/add", facultyData);
      console.log("Faculty created successfully:", response.data);
      setSuccess(true);

      // reset
      setFormData({
        name: "",
        department: "",
        designation: "",
        email: "",
        password: "",
        phone: "",
        /* baseSalary: "", */
        travelAllowance: "",
        academicYear: "",
        semesterType: "",
        semester: "",
        subject: "",
      });
      setAssignedSubjects([]);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Error creating faculty:", err);
      if (err.response?.status === 403) {
        // alert("A faculty with this email already exists.");
        toast.error("A faculty with this email already exists.");
      } else if (err.response?.status === 401) {
        // alert("Authentication failed. Please login again.");
        toast.error("Authentication failed. Please login again.");
        navigate("/login");
      } else {
        setError(
          err.response?.data?.error ||
            "Failed to create faculty. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/admin/facultymanager");
  };

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button
          variant="outline-secondary"
          className="d-flex align-items-center gap-2"
          onClick={handleGoBack}
        >
          <FaArrowLeft /> Back
        </Button>
        <h2 className="fw-bold mb-0">Add Faculty Member</h2>
      </div>

      <Card
        className="shadow rounded-4 border-0 p-4 bg-white mx-auto"
        style={{ maxWidth: 900 }}
      >
        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Faculty Details */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FaUserTie className="text-primary" />
                <h5 className="fw-bold mb-0">Faculty Details</h5>
              </div>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter faculty name"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Select
                  options={departments.map((dep) => ({
                    value: dep,
                    label: dep,
                  }))}
                  value={
                    formData.department
                      ? {
                          value: formData.department,
                          label: formData.department,
                        }
                      : null
                  }
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      department: selected ? selected.value : "",
                    }))
                  }
                  placeholder="Select Department"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Designation</Form.Label>
                <Select
                  options={designations.map((des) => ({
                    value: des,
                    label: des,
                  }))}
                  value={
                    formData.designation
                      ? {
                          value: formData.designation,
                          label: formData.designation,
                        }
                      : null
                  }
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      designation: selected ? selected.value : "",
                    }))
                  }
                  placeholder="Select Designation"
                  required
                />
              </Form.Group>

              {/* Remuneration */}
              <div className="d-flex align-items-center gap-2 mb-3 mt-4">
                <FaUserPlus className="text-success" />
                <h5 className="fw-bold mb-0">Remuneration Details</h5>
              </div>
              {/* <Form.Group className="mb-3">
                <Form.Label>Base Salary</Form.Label>
                <Form.Control
                  name="baseSalary"
                  value={formData.baseSalary}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  placeholder="Enter Base Salary"
                  required
                />
              </Form.Group> */}
              <Form.Group className="mb-3">
                <Form.Label>Travel Allowance</Form.Label>
                <InputGroup>
                  <InputGroup.Text>₹</InputGroup.Text>
                  <Form.Control
                    name="travelAllowance"
                    value={formData.travelAllowance}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    placeholder="Enter Travel Allowance"
                    required
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            {/* Contact + Assignments */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2 mb-3 mt-4 mt-md-0">
                <FaEnvelope className="text-primary" />
                <h5 className="fw-bold mb-0">Contact Details</h5>
              </div>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <InputGroup>
                <InputGroup.Text>+91</InputGroup.Text>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 10) {
                      setFormData({ ...formData, phone: value.replace(/\D/g, "") });
                    }
                  }}
                  placeholder="Enter 10 digit contact number"
                  maxLength="10"
                  required
                />
                </InputGroup>
              </Form.Group>


              {/* ✅ Academic Year + Semester Type */}
              <Card className="shadow-sm rounded-3 border-0 p-3 mt-4 bg-light">
                <Row>
                  <div className="d-flex align-items-center gap-2 mb-3 mt-4 mt-md-0">
                    <FaBookOpen className="text-primary" />
                    <h5 className="fw-bold mb-0">Subject Assignments</h5>
                  </div>

                  <Col xs={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaCalendarAlt className="me-1 text-secondary" />{" "}
                        Academic Year
                      </Form.Label>
                      <Form.Select
                        value={formData.academicYear}
                        onChange={(e) => {
                          const start = e.target.value;
                          const end = (parseInt(start) + 1)
                            .toString()
                            .slice(-2);
                          setFormData({
                            ...formData,
                            academicYear: `${start}-${end}`,
                          });
                        }}
                      >
                        <option value="">Select Year</option>
                        {Array.from({ length: 6 }, (_, i) => 2023 + i).map(
                          (year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          )
                        )}
                      </Form.Select>

                      {/* ✅ Academic Year Preview Badge */}
                      {formData.academicYear && (
                        <div className="mt-2">
                          <Badge bg="info">
                            Academic Year: {formData.academicYear}
                          </Badge>
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  <Col xs={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaLayerGroup className="me-1 text-secondary" />{" "}
                        Semester Type
                      </Form.Label>
                      <Form.Select
                        value={formData.semesterType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            semesterType: e.target.value,
                            semester: "",
                          })
                        }
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Odd">Odd</option>
                        <option value="Even">Even</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Subject Assignment */}
                <Row>
                  <Col xs={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Semester</Form.Label>
                      <Select
                        options={getSemesterOptions().map((sem) => ({
                          value: sem,
                          label: `Semester ${sem}`,
                        }))}
                        value={
                          formData.semester
                            ? {
                                value: formData.semester,
                                label: `Semester ${formData.semester}`,
                              }
                            : null
                        }
                        onChange={(selected) =>
                          setFormData((prev) => ({
                            ...prev,
                            semester: selected ? selected.value : "",
                          }))
                        }
                        placeholder="Select Semester"
                        isDisabled={!formData.semesterType}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Subjects</Form.Label>
                      <Select
                        options={subjectOptions.map((sub) => ({
                          value: sub,
                          label: sub,
                        }))}
                        value={
                          formData.subject
                            ? {
                                value: formData.subject,
                                label: formData.subject,
                              }
                            : null
                        }
                        onChange={(selected) =>
                          setFormData((prev) => ({
                            ...prev,
                            subject: selected ? selected.value : "",
                          }))
                        }
                        placeholder="Select Subject"
                        isDisabled={!formData.semester}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button
                  variant="outline-primary"
                  className="fw-bold px-3 py-1 rounded-pill"
                  onClick={handleAddAssignment}
                  disabled={!(formData.semester && formData.subject)}
                >
                  Add Assignment
                </Button>

                {assignedSubjects.length > 0 && (
                  <div className="mt-3">
                    <h6 className="fw-bold">Assigned Subjects:</h6>
                    <ul className="list-group">
                      {assignedSubjects.map((a, idx) => (
                        <li
                          key={idx}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <span>
                            Semester {a.semester} - {a.subject}
                          </span>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveAssignment(idx)}
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          {/* Submit */}
          <div className="text-end mt-3">
            <Button
              type="submit"
              variant="primary"
              className="fw-bold px-4 py-2 d-flex align-items-center gap-2 rounded-pill"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></div>
                  Creating...
                </>
              ) : (
                <>
                  <FaUserPlus /> Add Faculty
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="danger" className="mt-4 rounded-3 shadow-sm">
              <strong>Error:</strong> {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mt-4 rounded-3 shadow-sm">
              Faculty member added successfully!
            </Alert>
          )}
        </Form>
      </Card>
    </Container>
  );
}

export default AddFacultyForm;
