import { useEffect, useState } from "react";
import { Form, Card, Row, Col, Modal, Alert, Button, InputGroup, Badge } from "react-bootstrap";
import { foundService } from '../services/foundService';
import Spinner from '../components/Spinner';
import '../styles/FoundItems.css';

const ReportItem = () => {
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
    notes: ''
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

  const handleSubmit = async (e) => {
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
        notes: ''
      });
      fetchItems(); // Refresh the list after adding new item
    } catch (error) {
      console.error('Error reporting item:', error);
      setError('Failed to report item. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'received': { variant: 'info', text: 'Received' },
      'in_storage': { variant: 'warning', text: 'In Storage' },
      'claimed': { variant: 'success', text: 'Claimed' }
    };

    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const filterItems = () => {
    return items.filter(item => {
      // Search term filter
      const matchesSearch = 
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

      // Date filter
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
    <div className="found-items-container">
      <div className="text-center mb-5">
        <h2 className="mb-4">Found Items Management</h2>
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

      <div className="bg-light p-4 rounded mb-4">
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
        <div className="text-center py-5">
          <h4>No Items Found</h4>
          <p className="text-muted">Try adjusting your search or filters</p>
        </div>
      ) : (
        <Row>
          {filteredItems.map(item => (
            <Col key={item._id} md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                {item.imageUrl && (
                  <Card.Img
                    variant="top"
                    src={`http://localhost:5000${item.imageUrl}`}
                    alt={item.description}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-start">
                    <span>{item.description}</span>
                    {getStatusBadge(item.status)}
                  </Card.Title>
                  <Card.Text>
                    <div className="mb-2">
                      <strong>Item Name:</strong> {item.itemname}
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
                    {item.notes && (
                      <div className="mt-3">
                        <strong>Notes:</strong>
                        <p className="text-muted">{item.notes}</p>
                      </div>
                    )}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-transparent">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Last updated: {new Date(item.updatedAt).toLocaleDateString()}
                    </small>
                    <Button variant="outline-primary" size="sm">
                      View Details
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Report Found Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe the item you found"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
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
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Where did you find this item?"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Found Date and Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="foundDateTime"
                value={formData.foundDateTime}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Enter image URL (optional)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Any additional information about the item"
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowReportModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Submit Report
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ReportItem;