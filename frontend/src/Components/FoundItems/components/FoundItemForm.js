import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const FoundItemForm = ({ onSubmit }) => {
  const [showF, setShowF] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    location: '',
    foundDateTime: new Date().toISOString(),
    imageUrl: '',
    status: 'Received',
    additionalDetails: ''
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    'Electronics',
    'Clothing',
    'Documents',
    'Accessories',
    'Books',
    'Bags',
    'Jewelry',
    'Sports Equipment',
    'Musical Instruments',
    'Other'
  ];

  const handleShowF = () => setShowF(true);
  
  const handleCloseF = () => {
    setShowF(false);
    setFormData({ 
      description: '', 
      category: '',
      location: '',
      foundDateTime: new Date().toISOString(),
      imageUrl: '',
      status: 'Received',
      additionalDetails: ''
    });
    setErrors({});
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      handleCloseF();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, we'll just store the file name
      // In a real app, you'd upload this to a storage service
      setFormData({ ...formData, imageUrl: file.name });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Button 
        variant="primary" 
        onClick={handleShowF} 
        size="lg"
        className="px-4"
      >
        Report Found Item
      </Button>

      <Modal
        show={showF}
        onHide={handleCloseF}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Report Found Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter item description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                isInvalid={!!errors.category}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.category}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location Found</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter where you found the item"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                isInvalid={!!errors.location}
              />
              <Form.Control.Feedback type="invalid">
                {errors.location}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Additional Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter any additional details"
                value={formData.additionalDetails}
                onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Item Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                    className="img-thumbnail"
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseF}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit Report
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FoundItemForm;