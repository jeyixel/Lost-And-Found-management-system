import { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, Alert, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { foundService } from '../services/foundService';
import Spinner from '../components/Spinner';
import Nav from '../../Navbar/Nav';
import '../styles/FoundItems.css';

const FoundItems = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showReportModal, setShowReportModal] = useState(false);
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
      const response = await foundService.getAllItems();
      setItems(response.data.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('An error occurred while fetching items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await foundService.reportItem(formData);
      setShowReportModal(false);
      setFormData({
        description: '',
        category: '',
        location: '',
        foundDateTime: new Date().toISOString().slice(0, 16),
        imageUrl: '',
        additionalDetails: ''
      });
      fetchItems(); // Refresh the list after reporting
    } catch (error) {
      console.error('Error reporting item:', error);
      setError(error.response?.data?.error || 'Failed to report item. Please try again.');
    }
  };

  const handleReportChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, we'll just store the file name
      // In a real app, you'd upload this to a storage service
      setFormData(prev => ({
        ...prev,
        imageUrl: file.name
      }));
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
      const itemDate = new Date(item.foundDateTime);
      const today = new Date();
      const matchesDate = (() => {
        switch (dateFilter) {
          case 'today':
            return itemDate.toDateString() === today.toDateString();
          case 'week':
            const weekAgo = new Date(today.setDate(today.getDate() - 7));
            return itemDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
            return itemDate >= monthAgo;
          default:
            return true;
        }
      })();
      return matchesSearch && matchesCategory && matchesDate;
    });
  };

  const categories = ['all', ...new Set(items.map(item => item.category))];
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
          <Button 
            variant="outline-primary"
            onClick={() => navigate('/my-reports')}
          >
            My Reports
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

        <div className="filter-section mb-4">
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
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </Form.Select>
            </Col>
          </Row>
        </div>

        {filteredItems.length === 0 ? (
          <div className="empty-state text-center py-5">
            <h4>No Items Found</h4>
            <p className="text-muted">
              Try adjusting your search or filters, or check "My Reports" for items you've reported.
            </p>
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
                    <div className="card-text">
                      <div className="mb-2">
                        <strong>Category:</strong> {item.category}
                      </div>
                      <div className="mb-2">
                        <strong>Found On:</strong> {new Date(item.foundDateTime).toLocaleDateString()}
                      </div>
                      <div className="mb-2">
                        <strong>Location:</strong> {item.location || 'Not specified'}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

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
                  name="description"
                  placeholder="Enter item description"
                  value={formData.description}
                  onChange={handleReportChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleReportChange}
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
                  name="location"
                  placeholder="Enter where you found the item"
                  value={formData.location}
                  onChange={handleReportChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date Found</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="foundDateTime"
                  value={formData.foundDateTime}
                  onChange={handleReportChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Additional Details</Form.Label>
                <Form.Control
                  as="textarea"
                  name="additionalDetails"
                  rows={3}
                  placeholder="Enter any additional details"
                  value={formData.additionalDetails}
                  onChange={handleReportChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Item Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
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
      </div>
    </>
  );
};

export default FoundItems; 