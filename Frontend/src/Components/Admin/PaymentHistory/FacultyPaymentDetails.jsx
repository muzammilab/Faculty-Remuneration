import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Offcanvas,
} from "react-bootstrap";
import { FaPrint, FaFileExport, FaBars, FaArrowLeft } from "react-icons/fa";
import AdminSidebar from "../../AdminSidebar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function FacultyPaymentDetails() {
  const [showSidebar, setShowSidebar] = useState(false);
  const handleSidebarOpen = () => setShowSidebar(true);
  const handleSidebarClose = () => setShowSidebar(false);
  const navigate = useNavigate();
  const { id, academicYear, semesterType } = useParams();

  const [remuneration, setRemuneration] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacultyPaymentDetails = async () => {
      try {
        setLoading(true);
        const paymentRes = await axios.get(
          `http://localhost:3002/admin/payment/getSinglePayment/${id}/${academicYear}`
        );
        console.log("Getting Payments for Faculty Payment Details Page ");
        console.log(paymentRes.data);

        // 👉 Filter payments by semesterType
        const selectedPayment = paymentRes.data.payments.find(
          (p) => p.semesterType.toLowerCase() === semesterType.toLowerCase()
        );

        if (selectedPayment) {
          setRemuneration({
            ...paymentRes.data,
            payment: selectedPayment,
            breakdown: selectedPayment.subjectBreakdown,
          });
        }
        /* setRemuneration(paymentRes.data); */
      } catch (err) {
        console.error("❌ Error fetching remuneration:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyPaymentDetails();
  }, [id]);

  const remunerationSummary = [
    /* {
      component: "Base Salary",
      amount: `₹ ${remuneration?.payment?.baseSalary || 0}`,
    }, */
    {
      component: "Travel Allowance",
      amount: `₹ ${remuneration?.payment?.travelAllowance || 0}`,
    },
    {
      component: "Calculated Remuneration",
      amount: `₹ ${remuneration?.payment?.totalRemuneration || 0}`,
    },
    {
      component: "Total Amount",
      amount: `₹ ${remuneration?.payment?.totalAmount || 0}`,
    },
  ];

  const getStatusBadge = (status) => {
    const statusClass = {
      paid: "bg-success text-white",
      // In Progress: "bg-info text-white",
      unpaid: "bg-warning text-dark",
      Failed: "bg-danger text-white",
    };
    return (
      <span
        className={`badge rounded-pill px-3 py-2 ${
          statusClass[status] || "bg-secondary"
        }`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}{" "}
        {/* To Show data in Camel Case */}
      </span>
    );
  };

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
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
          {/* Mobile Header: Back Button, Title, Print Button, Export Button*/}
          <div className="d-md-none mb-3 d-flex align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-secondary"
                className="d-flex align-items-center gap-2"
                onClick={() => navigate("/admin/paymenthistory")}
              >
                <FaArrowLeft /> Back
              </Button>
              <h4 className="fw-bold">Payment Details</h4>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                className="d-flex align-items-center gap-2"
              >
                <FaFileExport /> Export
              </Button>
              <Button
                variant="primary"
                className="d-flex align-items-center gap-2"
                onClick={() => {
                  const paymentId = remuneration?.payment?._id; // pick the paymentId for this semType
                  if (paymentId) {
                    window.open(
                      `http://localhost:3002/payment/generate-pdf/${paymentId}`,
                      "_blank"
                    );
                  } else {
                    console.error("❌ No paymentId found for", semType, year);
                  }
                }}
              >
                <FaPrint /> Print
              </Button>
            </div>
          </div>

          {/* Desktop Header: Back Button, Title/Desc, Print Button, Export Button */}
          <div className="d-none d-md-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center gap-3">
              <Button
                variant="outline-secondary"
                className="d-flex align-items-center gap-2"
                onClick={() => navigate("/admin/paymenthistory")}
              >
                <FaArrowLeft /> Back
              </Button>
              <div>
                <h2 className="fw-bold mb-1">Payment Details</h2>
                <p className="text-primary mb-0">
                  View detailed information about a specific payment entry.
                </p>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                className="d-flex align-items-center gap-2"
              >
                <FaFileExport /> Export
              </Button>
              <Button
                variant="primary"
                className="d-flex align-items-center gap-2"
                onClick={() => {
                  const paymentId = remuneration?.payment?._id; // pick the paymentId for this semType
                  if (paymentId) {
                    window.open(
                      `http://localhost:3002/payment/generate-pdf/${paymentId}`,
                      "_blank"
                    );
                  } else {
                    console.error("❌ No paymentId found for", semType, year);
                  }
                }}
              >
                <FaPrint /> Print
              </Button>
            </div>
          </div>

          {/* Payment Overview */}
          <Card className="mb-4 p-4 shadow rounded-4 border-0 bg-white">
            <h5 className="fw-semibold mb-3">Payment Overview</h5>
            <Row>
              <Col md={6}>
                <p>
                  <strong>Faculty Name:</strong>{" "}
                  {remuneration?.facultyName || "—"}
                </p>
                <p>
                  <strong>Academic Year:</strong>{" "}
                  {remuneration?.payment?.academicYear || "—"}
                </p>
                <p>
                  <strong>Semester Type:</strong>{" "}
                  {remuneration?.payment?.semesterType || "—"}
                </p>
                <p>
                  <strong>Total Amount:</strong> ₹{" "}
                  {remuneration?.payment?.totalAmount || "—"}
                </p>
                <p>
                  <strong>Reference Number:</strong> x-x-x-x
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <strong>Payment Date:</strong>{" "}
                  {remuneration?.payment?.createdAt
                    ? new Date(
                        remuneration.payment.createdAt
                      ).toLocaleDateString("en-GB")
                    : "—"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {getStatusBadge(remuneration?.payment?.status)}
                </p>
                <p>
                  <strong>Payment Method:</strong> Direct Deposit
                </p>
              </Col>
            </Row>
          </Card>

          {/* Payment Components Table */}
          <Card className="mb-4 p-4 shadow rounded-4 border-0 bg-white">
            <h5 className="fw-semibold mb-3">Payment Components</h5>
            <Table bordered hover responsive striped className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Subject</th>
                  <th>Term Work Papers</th>
                  <th>Oral/Practical Papers</th>
                  <th>Semester Papers</th>
                  <th>Semester</th>
                  <th>Total Payment</th>
                </tr>
              </thead>
              <tbody>
                {remuneration?.breakdown?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.subjectName}</td>
                    <td>
                      {" "}
                      ₹ {item.paperChecking.rate} x {item.paperChecking.count} =
                      ₹ {item.paperChecking.amount}
                    </td>
                    <td>
                      {" "}
                      ₹ {item.oralPracticalAssessment.rate} x{" "}
                      {item.oralPracticalAssessment.count} = ₹{" "}
                      {item.oralPracticalAssessment.amount}
                    </td>
                    <td>
                      {" "}
                      ₹ {item.termTestAssessment.rate} x{" "}
                      {item.termTestAssessment.count} = ₹{" "}
                      {item.termTestAssessment.amount}
                    </td>
                    <td>Semester {item.semester}</td>
                    <td>₹ {item.subjectTotal}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>

          {/* Remuneration Summary Table */}
          <Card className="mb-4 p-4 shadow rounded-4 border-0 bg-white">
            <h5 className="fw-semibold mb-3">Remuneration Summary</h5>
            <Table bordered hover responsive striped className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Component</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {remunerationSummary.map((item, index) => (
                  <tr key={index}>
                    <td>{item.component}</td>
                    <td>{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default FacultyPaymentDetails;
