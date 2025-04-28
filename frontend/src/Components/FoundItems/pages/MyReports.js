import { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, Alert, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { foundService } from '../services/foundService';
import Spinner from '../components/Spinner';
import Nav from '../../Navbar/Nav';
import '../styles/FoundItems.css';

const MyReports = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [notificationData, setNotificationData] = useState({
    email: '',
    message: ''
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    description: '',
    category: '',
    location: '',
    foundDateTime: '',
    additionalDetails: ''
  });

  const fetchMyReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Please log in to view your reports');
        setLoading(false);
        return;
      }
      const response = await foundService.getMyReports();
      setItems(response.data.data);
    } catch (error) {
      console.error('Error fetching my reports:', error);
      setError('An error occurred while fetching your reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setEditFormData({
      description: item.description,
      category: item.category,
      location: item.location,
      foundDateTime: new Date(item.foundDateTime).toISOString().slice(0, 16),
      additionalDetails: item.additionalDetails || ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await foundService.updateItem(selectedItem._id, editFormData);
      setShowEditModal(false);
      fetchMyReports(); // Refresh the list
    } catch (error) {
      console.error('Error updating item:', error);
      setError(error.response?.data?.error || 'Failed to update item. Please try again.');
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        setError(null);
        await foundService.deleteItem(itemId);
        fetchMyReports(); // Refresh the list
      } catch (error) {
        console.error('Error deleting item:', error);
        setError('Failed to delete item. Please try again.');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Received': { variant: 'info', text: 'Received' },
      'In Storage': { variant: 'warning', text: 'In Storage' },
      'Claimed': { variant: 'success', text: 'Claimed' }
    };

    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const handleStatusUpdateClick = (item, status) => {
    setSelectedItem(item);
    setNewStatus(status);
    setNotificationData({
      email: '',
      message: getDefaultMessage(status, item.itemname)
    });
    setShowNotificationModal(true);
  };

  const getDefaultMessage = (status, itemName) => {
    if (status === 'claimed') {
      return `The item "${itemName}" has been claimed by its owner. Please collect it from the security office.`;
    } else if (status === 'in_storage') {
      return `The item "${itemName}" has been received and moved to secure storage.`;
    }
    return '';
  };

  const handleNotificationSubmit = async () => {
    try {
      setError(null);
      await foundService.updateStatus(selectedItem._id, newStatus, {
        ...notificationData,
        itemName: selectedItem.itemname
      });
      setShowNotificationModal(false);
      fetchMyReports();
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update item status. Please try again.');
    }
  };

  const handleShowDetails = (item) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  if (loading) return <Spinner />;

  return (
    <>
      <Nav />
      <div className="found-items-container container mt-4">
        <div className="mb-4 d-flex align-items-center gap-3">
          <Button 
            variant="outline-primary"
            onClick={() => navigate('/foundItems')}
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
              <Button onClick={fetchMyReports} variant="outline-danger">
                Try Again
              </Button>
            </div>
          </Alert>
        )}

        {items.length === 0 ? (
          <div className="empty-state">
            <h4>No Reports Found</h4>
            <p>You haven't reported any items yet.</p>
            <Button 
              variant="primary"
              onClick={() => navigate('/foundItems')}
            >
              Report an Item
            </Button>
          </div>
        ) : (
          <Row>
            {items.map(item => (
              <Col key={item._id} md={4} className="mb-4">
                <Card className="item-card">
                  {item.imageUrl && (
                    <Card.Img
                      variant="top"
                      src={`http://localhost:5000${item.imageUrl}`}
                      alt={item.description}
                    />
                  )}
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between align-items-start">
                      <span>{item.description}</span>
                      {getStatusBadge(item.status)}
                    </Card.Title>
                    <Card.Text>
                      <div className="mb-2">
                        <strong>Item ID:</strong> {item.itemId}
                      </div>
                      <div className="mb-2">
                        <strong>Category:</strong> {item.category}
                      </div>
                      <div className="mb-2">
                        <strong>Found On:</strong> {new Date(item.foundDateTime).toLocaleDateString()}
                      </div>
                      <div className="mb-2">
                        <strong>Location:</strong> {item.location || 'Not specified'}
                      </div>
                      {item.additionalDetails && (
                        <div className="mb-2">
                          <strong>Additional Details:</strong> {item.additionalDetails}
                        </div>
                      )}
                    </Card.Text>
                    <div className="d-flex justify-content-end gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleEditClick(item)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(item._id)}
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

        <Modal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Item Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedItem && (
              <div>
                {selectedItem.imageUrl && (
                  <img
                    src={`http://localhost:5000${selectedItem.imageUrl}`}
                    alt={selectedItem.description}
                    className="w-100 mb-4"
                    style={{ maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                )}
                <h4>{selectedItem.description}</h4>
                <Badge className={`status-badge ${selectedItem.status.toLowerCase()} mb-3`}>
                  {selectedItem.status}
                </Badge>
                <dl className="row">
                  <dt className="col-sm-3">Category</dt>
                  <dd className="col-sm-9">{selectedItem.category}</dd>

                  <dt className="col-sm-3">Found On</dt>
                  <dd className="col-sm-9">
                    {new Date(selectedItem.foundDateTime).toLocaleString()}
                  </dd>

                  <dt className="col-sm-3">Location</dt>
                  <dd className="col-sm-9">{selectedItem.location || 'Not specified'}</dd>

                  <dt className="col-sm-3">Tracking ID</dt>
                  <dd className="col-sm-9">{selectedItem.trackingId}</dd>

                  {selectedItem.notes && (
                    <>
                      <dt className="col-sm-3">Notes</dt>
                      <dd className="col-sm-9">{selectedItem.notes}</dd>
                    </>
                  )}
                </dl>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showNotificationModal} onHide={() => setShowNotificationModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {newStatus === 'claimed' ? 'Mark as Claimed' : 'Move to Storage'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Notification Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email address"
                  value={notificationData.email}
                  onChange={(e) => setNotificationData({
                    ...notificationData,
                    email: e.target.value
                  })}
                  required
                />
                <Form.Text className="text-muted">
                  Email notification will be sent to this address
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Notification Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={notificationData.message}
                  onChange={(e) => setNotificationData({
                    ...notificationData,
                    message: e.target.value
                  })}
                  required
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowNotificationModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleNotificationSubmit}
              disabled={!notificationData.email || !notificationData.message}
            >
              Send & Update Status
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                  required
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Documents">Documents</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Books">Books</option>
                  <option value="Bags">Bags</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Sports Equipment">Sports Equipment</option>
                  <option value="Musical Instruments">Musical Instruments</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Location Found</Form.Label>
                <Form.Control
                  type="text"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date Found</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={editFormData.foundDateTime}
                  onChange={(e) => setEditFormData({ ...editFormData, foundDateTime: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Additional Details</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editFormData.additionalDetails}
                  onChange={(e) => setEditFormData({ ...editFormData, additionalDetails: e.target.value })}
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default MyReports; 