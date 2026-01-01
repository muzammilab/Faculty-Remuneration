
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Table, Button, Nav, Card, Offcanvas, Badge } from "react-bootstrap";
import { FaBars, FaPrint, FaDownload, FaFileInvoiceDollar, FaArrowLeft, FaMoneyBillWave } from "react-icons/fa";
import FacultySidebar from './FacultySidebar';

const paymentDetails = {
  facultyName: "Prof. Mohd Ashfaque",
  paymentDate: "July 15, 2024",
  totalAmount: 97500,
  status: "Completed",
  referenceNumber: "TXN-20240715-MA-001",
  paymentMethod: "Direct Deposit",
  department: "Computer Engineering",
  subjects: [
    {
      name: "Machine Learning",
      termWork: { quantity: 200, rate: 50 },
      oral: { quantity: 100, rate: 75 },
      semester: { quantity: 50, rate: 100 },
      semesterLabel: "Odd Sem 2024",
      total: 22500,
    },
    {
      name: "SKL OOPS JAVA",
      termWork: { quantity: 150, rate: 50 },
      oral: { quantity: 75, rate: 75 },
      semester: { quantity: 40, rate: 100 },
      semesterLabel: "Odd Sem 2024",
      total: 15250,
    },
    {
      name: "Big Data Analytics",
      termWork: { quantity: 180, rate: 50 },
      oral: { quantity: 90, rate: 75 },
      semester: { quantity: 45, rate: 100 },
      semesterLabel: "Even Sem 2024",
      total: 19750,
    },
  ],
  summary: {
    travel: 1000,
    base: 30000,
    calculated: 57500,
    total: 97500,
  },
};

function OverallSlip() {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  const handleSidebarOpen = () => setShowSidebar(true);
  const handleSidebarClose = () => setShowSidebar(false);

  const handlePrint = () => window.print();
  const handleBack = () => navigate('/faculty/payments');

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      
      {/* Mobile Hamburger Header */}
      <div className="d-flex d-md-none align-items-center mb-3">
        <Button variant="outline-primary" className="me-2" onClick={handleSidebarOpen}>
          <FaBars size={20} />
        </Button>
        <h5 className="mb-0 fw-bold">Payment Slip</h5>
      </div>

      <Row>
        {/* Sidebar: Offcanvas for mobile */}
        <Offcanvas show={showSidebar} onHide={handleSidebarClose} className="d-md-none" backdrop>
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
            <div className="d-flex align-items-center mb-3">
              <Button 
                variant="outline-primary" 
                className="me-3 d-flex align-items-center gap-2"
                onClick={handleBack}
              >
                <FaArrowLeft /> Back
              </Button>
              <h2 className="mb-0 fw-bold">Payment Slip</h2>
            </div>
            <hr className="mb-4" />
          </div>
          <div className="d-md-none mb-3" />

          {/* Payment Overview Cards */}
          <Row className="mb-4">
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 rounded-4 bg-white">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                      <FaMoneyBillWave size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Total Amount</h6>
                      <h4 className="fw-bold mb-0">₹{paymentDetails.totalAmount.toLocaleString()}</h4>
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
                      <FaFileInvoiceDollar size={24} className="text-success" />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Status</h6>
                      <h4 className="fw-bold mb-0">
                        <Badge bg="success">{paymentDetails.status}</Badge>
                      </h4>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 rounded-4 bg-white">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-info bg-opacity-10 p-3 rounded-3 me-3">
                      <FaFileInvoiceDollar size={24} className="text-info" />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Subjects</h6>
                      <h4 className="fw-bold mb-0">{paymentDetails.subjects.length}</h4>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0 rounded-4 bg-white">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-warning bg-opacity-10 p-3 rounded-3 me-3">
                      <FaFileInvoiceDollar size={24} className="text-warning" />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Payment Date</h6>
                      <h6 className="fw-bold mb-0">{paymentDetails.paymentDate}</h6>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Payment Information Card */}
          <Card className="mb-4 p-4 shadow rounded-4 border-0 bg-white">
            <h5 className="fw-bold mb-1">Payment Information</h5>
            <small className="text-muted mb-3 d-block">
              Complete details of the payment transaction and faculty information.
            </small>
            
            <Row className="mt-3">
              <Col md={6} className="mb-3">
                <div className="text-muted small mb-1">Faculty Name</div>
                <div className="fw-bold fs-5">{paymentDetails.facultyName}</div>
              </Col>
              <Col md={6} className="mb-3">
                <div className="text-muted small mb-1">Department</div>
                <div className="fw-bold fs-5">{paymentDetails.department}</div>
              </Col>
              <Col md={6} className="mb-3">
                <div className="text-muted small mb-1">Payment Date</div>
                <div className="fw-bold">{paymentDetails.paymentDate}</div>
              </Col>
              <Col md={6} className="mb-3">
                <div className="text-muted small mb-1">Payment Method</div>
                <div className="fw-bold">{paymentDetails.paymentMethod}</div>
              </Col>
              <Col md={12} className="mb-3">
                <div className="text-muted small mb-1">Reference Number</div>
                <div className="fw-bold">
                  <Badge bg="secondary" className="fs-6">{paymentDetails.referenceNumber}</Badge>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Payment Components Table */}
          <Card className="mb-4 p-4 shadow rounded-4 border-0 bg-white">
            <h5 className="fw-bold mb-1">Payment Components</h5>
            <small className="text-muted mb-3 d-block">
              Detailed breakdown of all subjects and their remuneration components.
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
                  <th>Term Work Papers</th>
                  <th>Oral/Practical Papers</th>
                  <th>Semester Papers</th>
                  <th>Semester</th>
                  <th>Total Payment</th>
                </tr>
              </thead>
              <tbody>
                {paymentDetails.subjects.map((subject, idx) => (
                  <tr key={idx}>
                    <td className="fw-bold">{subject.name}</td>
                    <td>
                      {subject.termWork.quantity} <span className="badge bg-secondary ms-1">₹{subject.termWork.rate}</span>
                    </td>
                    <td>
                      {subject.oral.quantity} <span className="badge bg-secondary ms-1">₹{subject.oral.rate}</span>
                    </td>
                    <td>
                      {subject.semester.quantity} <span className="badge bg-secondary ms-1">₹{subject.semester.rate}</span>
                    </td>
                    <td>
                      <Badge bg="info" text="dark">{subject.semesterLabel}</Badge>
                    </td>
                    <td className="fw-bold text-success">₹{subject.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>

          {/* Remuneration Summary */}
          <Card className="mb-4 p-4 shadow rounded-4 border-0 bg-white">
            <h5 className="fw-bold mb-1">Remuneration Summary</h5>
            <small className="text-muted mb-3 d-block">
              Complete breakdown of all remuneration components and final total.
            </small>
            
            <Table
              bordered
              responsive
              striped
              className="mt-3 align-middle"
              style={{ maxWidth: "600px" }}
            >
              <thead className="table-light">
                <tr>
                  <th>Component</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Travel Allowance</td>
                  <td className="fw-bold text-primary">₹{paymentDetails.summary.travel.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Base Salary</td>
                  <td className="fw-bold text-primary">₹{paymentDetails.summary.base.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Calculated Remuneration</td>
                  <td className="fw-bold text-success">₹{paymentDetails.summary.calculated.toLocaleString()}</td>
                </tr>
                <tr className="fw-bold table-success">
                  <td>Total Remuneration</td>
                  <td>₹{paymentDetails.summary.total.toLocaleString()}</td>
                </tr>
              </tbody>
            </Table>
          </Card>

          {/* Action Buttons */}
          <Card className="mb-4 p-4 shadow rounded-4 border-0 bg-white">
            <h5 className="fw-bold mb-1">Actions</h5>
            <small className="text-muted mb-3 d-block">
              Download or print your payment slip.
            </small>
            
            <div className="d-flex gap-3">
              <Button 
                variant="primary" 
                className="d-flex align-items-center gap-2"
                onClick={handlePrint}
              >
                <FaPrint /> Print Slip
              </Button>
              <Button 
                variant="outline-success" 
                className="d-flex align-items-center gap-2"
              >
                <FaDownload /> Download PDF
              </Button>
              <Button 
                variant="outline-secondary" 
                className="d-flex align-items-center gap-2"
              >
                <FaFileInvoiceDollar /> Export Details
              </Button>
            </div>
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

export default OverallSlip;
