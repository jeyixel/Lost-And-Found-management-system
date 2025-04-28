import { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUserClaims } from '../services/claimService';
import Spinner from '../components/Spinner';
import Nav from '../../Navbar/Nav';
import '../styles/FoundItems.css';

const UserClaims = () => {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserClaims();
      console.log('Fetched claims:', data); // Debug log
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
    if (!token || !user) {
      navigate('/login');
      return;
    }
    fetchClaims();
  }, [navigate]);

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
          <h2>Your Claims</h2>
          <Button 
            variant="outline-secondary" 
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
              <Button onClick={fetchClaims} variant="outline-danger">
                Try Again
              </Button>
            </div>
          </Alert>
        )}

        {claims.length === 0 ? (
          <div className="empty-state">
            <h4>No Claims Found</h4>
            <p>You haven't made any claims yet.</p>
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
                          <div><strong>Found On:</strong> {claim.itemId?.foundDateTime ? new Date(claim.itemId.foundDateTime).toLocaleDateString() : 'N/A'}</div>
                          <div><strong>Location:</strong> {claim.itemId?.location || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <strong>Claim Date:</strong> {new Date(claim.createdAt).toLocaleDateString()}
                      </div>
                      {claim.adminNotes && (
                        <div className="mb-2">
                          <strong>Admin Notes:</strong> 
                          <div className="ms-3 p-2 bg-light rounded">
                            {claim.adminNotes}
                          </div>
                        </div>
                      )}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </>
  );
};

export default UserClaims; 