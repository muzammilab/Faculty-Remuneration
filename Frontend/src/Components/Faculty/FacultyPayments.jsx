import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Nav, Card, Button, Offcanvas, Badge } from "react-bootstrap";
import { FaBars, FaUser, FaMoneyBillWave, FaHistory, FaFileInvoiceDollar, FaSignOutAlt, FaDownload, FaChevronDown, FaChevronRight } from "react-icons/fa";
import FacultySidebar from "../FacultySidebar";
import axios from "axios";

function FacultyPayments() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [expandedItems, setExpandedItems] = useState({});
  const navigate = useNavigate();
  const handleSidebarOpen = () => setShowSidebar(true);
  const handleSidebarClose = () => setShowSidebar(false);
  const [paymentData, setPaymentData] = useState({}); // initially empty

  useEffect(() => {
    const facultyId = localStorage.getItem("facultyId");
    const fetchPayments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3002/admin/payment/getSinglePayment/${facultyId}`
        );

        const payments = res.data.payments ;
        console.log("Getting Payment Details for Faculty Payments Page ");
        console.log(res.data);
        const grouped = {};

        payments.forEach((p) => {
          const year = p.academicYear;
          const semType =
            p.semesterType === "Odd" ? "Odd Semester" : "Even Semester";

          if (!grouped[year]) grouped[year] = {};
          if (!grouped[year][semType]) grouped[year][semType] = {};

          p.subjectBreakdown.forEach((sb) => {
            const semName = `Semester ${sb.semester}`;
            if (!grouped[year][semType][semName])
              grouped[year][semType][semName] = {};

            grouped[year][semType][semName][sb.subjectName] = {
              paymentId: p._id,
              subjectId: sb.subjectId?._id?.toString?.() || sb.subjectId,
              termWork: sb.termTestAssessment?.amount || 0,
              oralPractical: sb.oralPracticalAssessment?.amount || 0,
              semesterPapers: sb.paperChecking?.amount || 0,
              amount: `₹${sb.subjectTotal.toLocaleString()}`,
              status: p.status === "unpaid" ? "Pending" : "Completed",
              dueDate: new Date(p.createdAt).toLocaleDateString("en-GB"),
            };
          });
        });
        setPaymentData(grouped);
      } catch (err) {
        console.error("Error fetching payments:", err);
      }
    };

    fetchPayments();
  }, []);

  const toggleExpanded = (path) => {
    setExpandedItems((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <Badge bg="success">Completed</Badge>;
      case "Processing":
        return (
          <Badge bg="warning" text="dark">
            Processing
          </Badge>
        );
      case "Pending":
        return <Badge bg="secondary">Pending</Badge>;
      default:
        return <Badge bg="info">Unknown</Badge>;
    }
  };

  const renderSubjectCard = (subjectName, subjectData, yearPath) => (
    <Card
      key={subjectName}
      className="mb-2 shadow-sm border-0 rounded-3 bg-light"
    >
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="fw-bold mb-1">{subjectName}</h6>
            {/* <div className="text-muted small">
              Term Work: {subjectData.termWork} papers | 
              Oral/Practical: {subjectData.oralPractical} papers | 
              Semester Papers: {subjectData.semesterPapers} papers
            </div> */}
          </div>
          <div className="text-end">
            <div className="fw-bold text-success">{subjectData.amount}</div>
            {getStatusBadge(subjectData.status)}
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className="text-muted small">
            {subjectData.status === "Completed"
              ? `Paid on ${subjectData.paidDate}`
              : `Due on ${subjectData.dueDate}`}
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              className="d-flex align-items-center gap-1"
              onClick={() =>
                navigate(
                  `/faculty/payments/subjectremu/${subjectData.subjectId}/${yearPath}`
                )
              }
            >
              <FaFileInvoiceDollar /> View Details
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  const renderSemester = (semesterName, subjects, yearPath, semesterType) => {
    const semesterPath = `${yearPath}.${semesterType}.${semesterName}`;
    const isExpanded = expandedItems[semesterPath];
    const subjectCount = Object.keys(subjects).length;
    const totalAmount = Object.values(subjects).reduce((sum, subject) => {
      return sum + parseInt(subject.amount.replace("₹", "").replace(",", ""));
    }, 0);

    return (
      <div key={semesterName} className="mb-2">
        <Card className="shadow-sm border-0 rounded-3 bg-primary bg-opacity-10">
          <Card.Body className="p-3">
            <div
              className="d-flex justify-content-between align-items-center cursor-pointer"
              onClick={() => toggleExpanded(semesterPath)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-center gap-2">
                {isExpanded ? (
                  <FaChevronDown size={14} />
                ) : (
                  <FaChevronRight size={14} />
                )}
                <div>
                  <h6 className="fw-bold mb-0">{semesterName}</h6>
                  <div className="text-muted small">
                    {subjectCount} Subject{subjectCount > 1 ? "s" : ""} • Total:
                    ₹{totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-primary">{subjectCount}</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {isExpanded && (
          <div className="ms-4 mt-2">
            {Object.entries(subjects).map(([subjectName, subjectData]) =>
              renderSubjectCard(subjectName, subjectData, yearPath)
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSemesterType = (semesterType, semesters, yearPath) => {
    const semesterTypePath = `${yearPath}.${semesterType}`;
    const isExpanded = expandedItems[semesterTypePath];
    const semesterCount = Object.keys(semesters).length;
    const totalAmount = Object.values(semesters).reduce((sum, semester) => {
      return (
        sum +
        Object.values(semester).reduce((semesterSum, subject) => {
          return (
            semesterSum +
            parseInt(subject.amount.replace("₹", "").replace(",", ""))
          );
        }, 0)
      );
    }, 0);

    return (
      <div key={semesterType} className="mb-3">
        <Card className="shadow-sm border-0 rounded-4 bg-info bg-opacity-10">
          <Card.Body className="p-3">
            <div
              className="d-flex justify-content-between align-items-center cursor-pointer"
              onClick={() => toggleExpanded(semesterTypePath)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-center gap-2">
                {isExpanded ? (
                  <FaChevronDown size={16} />
                ) : (
                  <FaChevronRight size={16} />
                )}
                <div>
                  <h6 className="fw-bold mb-0">{semesterType}</h6>
                  <div className="text-muted small">
                    {semesterCount} Semester{semesterCount > 1 ? "s" : ""} •
                    Total: ₹{totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-info">{semesterCount}</span>
                <Button
                  variant="outline-info"
                  size="sm"
                  className="d-flex align-items-center gap-1"
                  onClick={() => {
                    const firstSemester = Object.values(semesters)[0];
                    const firstSubject = Object.values(firstSemester)[0];
                    const paymentId = firstSubject?.paymentId;

                    if (paymentId) {
                      window.open(
                        `http://localhost:3002/payment/generate-pdf/${paymentId}`,
                        "_blank"
                      );
                    } else {
                      console.error(
                        "❌ No paymentId found for",
                        semType,
                        yearPath
                      );
                    }
                  }}
                >
                  <FaDownload /> Report
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        {isExpanded && (
          <div className="ms-3 mt-2">
            {Object.entries(semesters).map(([semesterName, subjects]) =>
              renderSemester(semesterName, subjects, yearPath, semesterType)
            )}
          </div>
        )}
      </div>
    );
  };

  const renderYear = (year, yearData) => {
    const yearPath = year;
    const isExpanded = expandedItems[yearPath];
    const semesterTypeCount = Object.keys(yearData).length;
    const totalAmount = Object.values(yearData).reduce((sum, semesterType) => {
      return (
        sum +
        Object.values(semesterType).reduce((semesterTypeSum, semester) => {
          return (
            semesterTypeSum +
            Object.values(semester).reduce((semesterSum, subject) => {
              return (
                semesterSum +
                parseInt(subject.amount.replace("₹", "").replace(",", ""))
              );
            }, 0)
          );
        }, 0)
      );
    }, 0);

    return (
      <div key={year} className="mb-4">
        <Card className="shadow-sm border-0 rounded-4 bg-white">
          <Card.Body className="p-4">
            <div
              className="d-flex justify-content-between align-items-center cursor-pointer"
              onClick={() => toggleExpanded(yearPath)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-center gap-3">
                {isExpanded ? (
                  <FaChevronDown size={18} />
                ) : (
                  <FaChevronRight size={18} />
                )}
                <div>
                  <h5 className="fw-bold mb-0">{year}</h5>
                  <div className="text-muted small">
                    {semesterTypeCount} Semester Type
                    {semesterTypeCount > 1 ? "s" : ""} • Total: ₹
                    {totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <span className="badge bg-primary fs-6">
                  {semesterTypeCount}
                </span>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="d-flex align-items-center gap-1"
                  onClick={() => {
                    const facultyId = localStorage.getItem("facultyId");
                    if (!facultyId) {
                      console.error("❌ FacultyId missing in localStorage");
                      return;
                    }

                    window.open(
                      `http://localhost:3002/payment/generate-pdf/${facultyId}/${yearPath}`,
                      "_blank"
                    );
                  }}
                >
                  <FaDownload /> Yearly Report
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        {isExpanded && (
          <div className="ms-3 mt-3">
            {Object.entries(yearData).map(([semesterType, semesters]) =>
              renderSemesterType(semesterType, semesters, yearPath)
            )}
          </div>
        )}
      </div>
    );
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
            <h2 className="mb-2 fw-bold">Faculty Payments</h2>
            <hr className="mb-4" />
          </div>
          <div className="d-md-none mb-3" />

          {/* Payment Summary Cards */}
          <Row className="mb-4">
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 rounded-4 bg-white">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                      <FaMoneyBillWave size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Total Earned</h6>
                      <h4 className="fw-bold mb-0">₹82,500</h4>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 rounded-4 bg-white">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 p-3 rounded-3 me-3">
                      <FaHistory size={24} className="text-success" />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Completed</h6>
                      <h4 className="fw-bold mb-0">₹42,250</h4>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 rounded-4 bg-white">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-secondary bg-opacity-10 p-3 rounded-3 me-3">
                      <FaHistory size={24} className="text-secondary" />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Pending</h6>
                      <h4 className="fw-bold mb-0">₹37,750</h4>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Hierarchical Payment Structure */}
          <Card className="mb-4 p-4 shadow rounded-4 border-0 bg-white">
            <h5 className="fw-bold mb-1">Payment History</h5>
            <small className="text-muted mb-3 d-block">
              Click on arrows to expand and view detailed payment information by
              year, semester, and subject.
            </small>

            <Nav
              variant="tabs"
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4"
            >
              <Nav.Item>
                <Nav.Link eventKey="paid" className="fw-bold">
                  Paid
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="unpaid" className="fw-bold">
                  Unpaid
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="all" className="fw-bold">
                  All
                </Nav.Link>
              </Nav.Item>
            </Nav>

            {/* Hierarchical Structure */}
            {Object.entries(paymentData).map(([year, yearData]) =>
              renderYear(year, yearData)
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

export default FacultyPayments;
