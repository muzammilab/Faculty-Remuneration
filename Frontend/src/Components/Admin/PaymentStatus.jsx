import { useState } from "react";
import { Container, Row, Col, Card, Table, Form, Offcanvas, Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";

function PaymentStatus() {
  const [showSidebar, setShowSidebar] = useState(false);
  const handleSidebarOpen = () => setShowSidebar(true);
  const handleSidebarClose = () => setShowSidebar(false);

  const paymentData = [
    { name: "Prof. Mohd Ashfaque", date: "2024-07-26", amount: "₹2,500", status: 'Completed' },
    { name: "Prof. Reshma Lohar", date: "2024-07-20", amount: "₹3,000", status: 'Completed' },
    { name: "Prof. Anupam Choudhary", date: "2024-07-15", amount: "₹2,200", status: 'Pending' },
    { name: "Prof. Manila Gupta", date: "2024-07-10", amount: "₹2,800", status: 'Completed' },
    { name: "Prof. Dinesh Deore", date: "2024-07-05", amount: "₹2,600", status: 'Failed' },
  ];

  // For dynamicallly giving colors to status 
  const getStatusBadge = (status) => {
    const statusClass = {
      Completed: 'bg-success text-white',
      Pending: 'bg-warning text-dark',
      Failed: 'bg-danger text-white',
    };
    return (
      <span className={`badge rounded-pill px-3 py-2 ${statusClass[status] || 'bg-secondary'}`}>{status}</span>
    );
  };

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      {/* Mobile Hamburger Header */}
      <div className="d-flex d-md-none align-items-center mb-3">
        <Button variant="outline-primary" className="me-2" onClick={handleSidebarOpen}>
          <FaBars size={20} />
        </Button>
        <h5 className="mb-0 fw-bold">Payment Status</h5>
      </div>

      <Row>
        {/* Sidebar: Offcanvas for mobile, static for desktop */}
        <Offcanvas show={showSidebar} onHide={handleSidebarClose} className="d-md-none" backdrop>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {<AdminSidebar />}
            <div className="text-muted small mt-4">Role: Payment Officer</div>
          </Offcanvas.Body>
        </Offcanvas>
        <Col md={3} className="d-none d-md-block">
          <Card className="shadow-sm border-0 rounded-4 p-3 sticky-top" style={{ minHeight: "90vh" }}>
            {<AdminSidebar />}
            <div className="text-muted small mt-4">Role: Payment Officer</div>
          </Card>
        </Col>

        {/* Main Content */}
        <Col md={9}>
          <div className="d-none d-md-block">
            <h2 className="mb-2 fw-bold">Payment Status</h2>
            <hr className="mb-4" />
          </div>
          <div className="d-md-none mb-3" />

          {/* Filters */}
          <Card className="mb-4 p-4 shadow rounded-4 border-0 bg-white">
            <h5 className="fw-semibold mb-3">Filters</h5>
            <Row className="g-3 mb-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Faculty Name</Form.Label>
                  <Form.Select>
                    <option>Select</option>
                    <option>Prof. Mohd Ashfaque</option>
                    <option>Prof. Reshma Lohar</option>
                    <option>Prof. Anupam Choudhary</option>
                    <option>Prof. Manila Gupta</option>
                    <option>Prof. Dinesh Chouhan</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select>
                    <option>Select</option>
                    <option>Completed</option>
                    <option>Pending</option>
                    <option>Failed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card>

          {/* Table */}
          <Card className="mb-4 p-4 shadow rounded-4 border-0 bg-white">
            <h5 className="fw-bold mb-3">Faculty Payment Status</h5>
            <Table bordered hover responsive striped className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Faculty Name</th>
                  <th>Payment Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td className="text-primary">{item.date}</td>
                    <td>{item.amount}</td>
                    <td>{getStatusBadge(item.status)}</td>
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

export default PaymentStatus;
