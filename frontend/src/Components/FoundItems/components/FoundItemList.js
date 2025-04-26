import { useEffect, useState } from 'react';
import { Card, Row, Col, Form, InputGroup, Button, Badge, Alert } from 'react-bootstrap';
import { foundService } from '../services/foundService';
import Spinner from './Spinner';
import FoundItemForm from './FoundItemForm';

const FoundItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'my-reports'

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = viewMode === 'all' 
        ? await foundService.getAllItems()
        : await foundService.getMyReports();
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
  }, [viewMode]);

  const handleSubmit = async (formData) => {
    try {
      setError(null);
      await foundService.reportItem(formData);
      // Refresh the list after adding a new item
      await fetchItems();
    } catch (error) {
      console.error('Error creating item:', error);
      setError('An error occurred while creating the item. Please try again.');
    }
  };

  const handleRetry = () => {
    fetchItems();
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(items.map(item => item.category))];

  if (loading) return <Spinner />;

  return (
    <div className="container mt-4">
      <div className="text-center mb-5">
        <h2 className="mb-4">Lost & Found System</h2>
        <div className="d-flex justify-content-center gap-3">
          <FoundItemForm onSubmit={handleSubmit} />
          <Button
            variant={viewMode === 'my-reports' ? 'primary' : 'outline-primary'}
            size="lg"
            className="px-4"
            onClick={() => setViewMode(viewMode === 'all' ? 'my-reports' : 'all')}
          >
            {viewMode === 'all' ? 'My Reports' : 'All Items'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={handleRetry} variant="outline-danger">
              Try Again
            </Button>
          </div>
        </Alert>
      )}

      <div className="bg-light p-4 rounded mb-4">
        <h3 className="mb-4">{viewMode === 'all' ? 'Recently Found Items' : 'My Reports'}</h3>
        
        <Row className="mb-4">
          <Col md={6}>
            <InputGroup>
              <Form.Control
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                Clear
              </Button>
            </InputGroup>
          </Col>
          <Col md={6}>
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
        </Row>
      </div>

      {!error && filteredItems.length === 0 ? (
        <div className="text-center py-5">
          <h4>No items found</h4>
          <p className="text-muted">
            {viewMode === 'all' 
              ? 'Try adjusting your search or filters'
              : 'You haven\'t reported any items yet'}
          </p>
        </div>
      ) : !error && (
        <Row>
          {filteredItems.map(item => (
            <Col key={item._id} md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                {item.imageUrl && (
                  <Card.Img
                    variant="top"
                    src={item.imageUrl}
                    alt={item.description}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-start">
                    <span>{item.description}</span>
                    <Badge bg="primary">{item.category}</Badge>
                  </Card.Title>
                  <Card.Text>
                    <small className="text-muted">
                      Found on: {new Date(item.foundDateTime).toLocaleDateString()}
                    </small>
                    <br />
                    <small className="text-muted">
                      Location: {item.location || 'Not specified'}
                    </small>
                    {viewMode === 'my-reports' && (
                      <>
                        <br />
                        <small className="text-muted">
                          Status: <Badge bg={item.status === 'claimed' ? 'success' : 'warning'}>
                            {item.status}
                          </Badge>
                        </small>
                      </>
                    )}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-transparent">
                  <Button variant="outline-primary" size="sm" className="w-100">
                    View Details
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default FoundItemList;