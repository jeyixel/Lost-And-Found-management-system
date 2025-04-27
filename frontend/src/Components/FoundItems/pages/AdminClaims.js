import { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, Alert, Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAllClaims, updateClaimStatus, deleteClaim } from '../services/claimService';
import Spinner from '../components/Spinner';
import Nav from '../../Navbar/Nav';
import '../styles/FoundItems.css';

const AdminClaims = () => {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [statusForm, setStatusForm] = useState({
    status: '',
    adminNotes: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [claimToDelete, setClaimToDelete] = useState(null);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllClaims();
      setClaims(data);
    } catch (error) {
      console.error('Error fetching claims:', error);
      setError(error.response?.data?.error || error.message || 'An error occurred while fetching claims. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || !user || !user.isAdmin) {
      navigate('/login');
      return;
    }
    fetchClaims();
  }, [navigate]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await updateClaimStatus(
        selectedClaim._id,
        statusForm
      );
      setShowStatusModal(false);
      setStatusForm({
        status: '',
        adminNotes: ''
      });
      fetchClaims();
    } catch (error) {
      console.error('Error updating claim status:', error);
      setError(error.response?.data?.error || error.message || 'Failed to update claim status. Please try again.');
    }
  };

  const handleStatusClick = (claim) => {
    setSelectedClaim(claim);
    setStatusForm({
      status: claim.status,
      adminNotes: claim.adminNotes || ''
    });
    setShowStatusModal(true);
  };

  const handleDelete = async (claimId) => {
    try {
      setError(null);
      await deleteClaim(claimId);
      setShowDeleteModal(false);
      fetchClaims();
    } catch (error) {
      console.error('Error deleting claim:', error);
      setError(error.response?.data?.error || error.message || 'Failed to delete claim. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { variant: 'warning', text: 'Pending' },
      'Approved': { variant: 'success', text: 'Approved' },
      'Rejected': { variant: 'danger', text: 'Rejected' }
    };

    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  if (loading) return <Spinner />;

  return (
    <>
      <Nav />
      <div className="found-items-container container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Claims</h2>
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/admin/found-items')}
          >
            Back to Found Items
          </Button>
        </div>

        {error && (
          <Alert variant="danger" className="error-alert">
            <Alert.Heading>Error</Alert.Heading>
            <p>{error}</p>
            <hr />
            <div className="d-flex justify-content-end">
              <Button onClick={fetchClaims} variant="outline-danger">
                Try Again
              </Button>
            </div>
          </Alert>
        )}

        {claims.length === 0 ? (
          <div className="empty-state">
            <h4>No Claims Found</h4>
            <p>There are no pending claims at the moment.</p>
          </div>
        ) : (
          <Row>
            {claims.map(claim => (
              <Col key={claim._id} md={6} className="mb-4">
                <Card className="claim-card">
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between align-items-start">
                      <span>Claim #{claim._id.slice(-6)}</span>
                      {getStatusBadge(claim.status)}
                    </Card.Title>
                    <Card.Text>
                      <div className="mb-2">
                        <strong>Item Details:</strong>
                        <div className="ms-3">
                          <div><strong>Description:</strong> {claim.itemId?.description || 'N/A'}</div>
                          <div><strong>Category:</strong> {claim.itemId?.category || 'N/A'}</div>
                          <div><strong>Status:</strong> {claim.itemId?.status || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <strong>Reported By:</strong> {claim.reportedBy?.name || 'Unknown'}
                      </div>
                      <div className="mb-2">
                        <strong>Claimed By:</strong> {claim.claimedBy.name}
                      </div>
                      <div className="mb-2">
                        <strong>Student ID:</strong> {claim.claimedBy.studentId}
                      </div>
                      <div className="mb-2">
                        <strong>Phone Number:</strong> {claim.claimedBy.phoneNumber}
                      </div>
                      <div className="mb-2">
                        <strong>Claim Date:</strong> {new Date(claim.claimDate).toLocaleDateString()}
                      </div>
                      {claim.adminNotes && (
                        <div className="mb-2">
                          <strong>Admin Notes:</strong> {claim.adminNotes}
                        </div>
                      )}
                    </Card.Text>
                    <div className="d-flex justify-content-end gap-2">
                      <Button 
                        variant="outline-primary" 
                        onClick={() => handleStatusClick(claim)}
                      >
                        Update Status
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => {
                          setClaimToDelete(claim);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Status Update Modal */}
        <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Claim Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleStatusUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Admin Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={statusForm.adminNotes}
                  onChange={(e) => setStatusForm({ ...statusForm, adminNotes: e.target.value })}
                  placeholder="Add any notes about this claim..."
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Update Status
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Claim</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this claim? This action cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={() => handleDelete(claimToDelete?._id)}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default AdminClaims; 