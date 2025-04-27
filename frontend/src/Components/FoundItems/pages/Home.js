import { useEffect, useState } from "react";
import { Form, Card, Row, Col, Modal, Alert, Button, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getFoundItems } from "../services/api";

const Home = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log("Attempting to fetch items..."); // Debug log
        const response = await getFoundItems();
        console.log("API Response:", response); // Debug log
        if (response && response.data && response.data.data) {
          setItems(response.data.data);
        } else {
          console.error("Invalid response format:", response);
          setError("Received invalid data format from server");
        }
      } catch (err) {
        console.error("Detailed fetch error:", {
          message: err.message,
          response: err.response,
          status: err.response?.status,
          data: err.response?.data
        });
        setError(`Error: ${err.message || "An error occurred while fetching items"}`);
      }
    };

    fetchItems();
  }, []);

  // Filter items based on search, category, and status
  const filteredItems = items.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle item click to show details in a modal
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  // Handle search button click
  const handleSearch = () => {
    console.log("Search button clicked. Query:", searchQuery);
  };

  // Handle navigation to the ReportItem page
  const handleReportItemClick = () => {
    navigate("/report-item");
  };

  return (
    <div className="home p-4">
      <h1 className="mb-4">Found Items</h1>

      {/* Search and Filters */}
      <div className="mb-4">
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search by description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="primary" onClick={handleSearch}>
            Search
          </Button>
        </InputGroup>

        <Row>
          <Col md={4}>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Documents">Documents</option>
              <option value="Accessories">Accessories</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Received">Received</option>
              <option value="In Storage">In Storage</option>
              <option value="Claimed">Claimed</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Report Found Item Button */}
      <Button variant="success" className="mb-4" onClick={handleReportItemClick}>
        Report Found Item
      </Button>

      {/* Found Items List */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <Col key={item._id}>
              <Card onClick={() => handleItemClick(item)} style={{ cursor: "pointer" }}>
                <Card.Body>
                  <Card.Title>{item.description}</Card.Title>
                  <Card.Text>
                    <strong>Category:</strong> {item.category}<br />
                    <strong>Location:</strong> {item.location}<br />
                    <strong>Found on:</strong> {new Date(item.foundDateTime).toLocaleDateString()}<br />
                    <strong>Status:</strong> {item.status}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info">
              No items found matching your search criteria.
            </Alert>
          </Col>
        )}
      </Row>

      {/* Item Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem?.description}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <>
              <p><strong>Category:</strong> {selectedItem.category}</p>
              <p><strong>Location:</strong> {selectedItem.location}</p>
              <p><strong>Found on:</strong> {new Date(selectedItem.foundDateTime).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {selectedItem.status}</p>
              {selectedItem.additionalDetails && (
                <p><strong>Additional Details:</strong> {selectedItem.additionalDetails}</p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;