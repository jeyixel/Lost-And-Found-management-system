import { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, Alert, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import Spinner from '../components/Spinner';
import Nav from '../../Navbar/Nav';
import '../styles/FoundItems.css';

const AdminFoundItems = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    location: '',
    foundDateTime: new Date().toISOString().slice(0, 16),
    imageUrl: '',
    additionalDetails: ''
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllItems();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError(error.response?.data?.error || error.message || 'An error occurred while fetching items. Please try again later.');
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
    fetchItems();
  }, [navigate]);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const data = await adminService.reportItem(formData);
      setShowReportModal(false);
      setFormData({
        description: '',
        category: '',
        location: '',
        foundDateTime: new Date().toISOString().slice(0, 16),
        imageUrl: '',
        additionalDetails: ''
      });
      fetchItems();
    } catch (error) {
      console.error('Error reporting item:', error);
      setError(error.response?.data?.error || error.message || 'Failed to report item. Please try again.');
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setError(null);
      const data = await adminService.updateItemStatus(selectedItem._id, newStatus);
      setShowStatusModal(false);
      fetchItems();
    } catch (error) {
      console.error('Error updating status:', error);
      setError(error.response?.data?.error || error.message || 'Failed to update status. Please try again.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const data = await adminService.updateItem(selectedItem._id, formData);
      setShowEditModal(false);
      setFormData({
        description: '',
        category: '',
        location: '',
        foundDateTime: new Date().toISOString().slice(0, 16),
        imageUrl: '',
        additionalDetails: ''
      });
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
      setError(error.response?.data?.error || error.message || 'Failed to update item. Please try again.');
    }
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setFormData({
      description: item.description,
      category: item.category,
      location: item.location,
      foundDateTime: new Date(item.foundDateTime).toISOString().slice(0, 16),
      imageUrl: item.imageUrl || '',
      additionalDetails: item.additionalDetails || ''
    });
    setShowEditModal(true);
  };

  const isItemEditable = (item) => {
    const user = JSON.parse(localStorage.getItem('user'));
    // Allow editing if user is admin or item is in Received status
    return user?.isAdmin || item.status === 'Received';
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        setError(null);
        const data = await adminService.deleteItem(itemId);
        fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
        setError(error.response?.data?.error || error.message || 'Failed to delete item. Please try again.');
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

  const filterItems = () => {
    return items.filter(item => {
      const matchesSearch = 
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  };

  const categories = ['all', ...new Set(items.map(item => item.category))];
  const statuses = ['all', 'Received', 'In Storage', 'Claimed'];
  const filteredItems = filterItems();

  if (loading) return <Spinner />;

  return (
    <>
      <Nav />
      <div className="found-items-container container mt-4">
        <div className="mb-4 d-flex align-items-center gap-3">
          <Button 
            className="report-item-btn"
            onClick={() => setShowReportModal(true)}
          >
            Report Found Item
          </Button>
        </div>

        {error && (
          <Alert variant="danger" className="error-alert">
            <Alert.Heading>Error</Alert.Heading>
            <p>{error}</p>
            <hr />
            <div className="d-flex justify-content-end">
              <Button onClick={fetchItems} variant="outline-danger">
                Try Again
              </Button>
            </div>
          </Alert>
        )}

        <div className="filter-section">
          <Row>
            <Col md={4}>
              <InputGroup>
                <Form.Control
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setSearchTerm('')}
                  disabled={!searchTerm}
                >
                  Clear
                </Button>
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </div>

        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <h4>No Items Found</h4>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <Row>
            {filteredItems.map(item => (
              <Col key={item._id} md={4} className="mb-4">
                <Card className="item-card">
                  {item.imageUrl && (
                    <Card.Img
                      variant="top"
                      src={item.imageUrl}
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
                      {item.finder && (
                        <div className="mb-2">
                          <strong>Reported By:</strong> {item.finder.name || 'Unknown'}
                        </div>
                      )}
                    </Card.Text>
                    <div className="d-flex justify-content-end gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setShowStatusModal(true);
                        }}
                      >
                        Update Status
                      </Button>
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

        {/* Report Item Modal */}
        <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Report Found Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleReportSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select a category</option>
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
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date Found</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={formData.foundDateTime}
                  onChange={(e) => setFormData({ ...formData, foundDateTime: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Additional Details</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.additionalDetails}
                  onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setShowReportModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Submit Report
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Status Update Modal */}
        <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Item Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Current Status</Form.Label>
                <div>{selectedItem?.status || 'Not set'}</div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Status</Form.Label>
                <Form.Select
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                >
                  <option value="">Select new status</option>
                  <option value="Received">Received</option>
                  <option value="In Storage">In Storage</option>
                  <option value="Claimed">Claimed</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Found Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select a category</option>
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
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date Found</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={formData.foundDateTime}
                  onChange={(e) => setFormData({ ...formData, foundDateTime: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Additional Details</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.additionalDetails}
                  onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
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

export default AdminFoundItems; 