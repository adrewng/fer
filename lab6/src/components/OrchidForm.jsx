import { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrchild } from "../slices/orchildSlice"; // <--- Import action tạo mới

export default function OrchidForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.orchild);

  const [formData, setFormData] = useState({
    name: "",
    rating: 1,
    isSpecial: false,
    image: "",
    color: "",
    origin: "",
    category: "",
    isNatural: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createOrchild(formData));
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={8} lg={6}>
          <h2 className="text-center mb-4">Tạo Lan Mới</h2>

          {/* Thông báo nếu đang tải */}
          {isLoading && <Alert variant="info">Đang tạo...</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Tên Lan */}
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Tên Lan</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Rating (1-5) */}
            <Form.Group className="mb-3" controlId="formRating">
              <Form.Label>Rating (1-5)</Form.Label>
              <Form.Control
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="1"
                max="5"
                required
              />
            </Form.Group>

            {/* URL Hình ảnh */}
            <Form.Group className="mb-3" controlId="formImage">
              <Form.Label>URL Hình Ảnh</Form.Label>
              <Form.Control
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
              />
            </Form.Group>

            {/* Màu Sắc */}
            <Form.Group className="mb-3" controlId="formColor">
              <Form.Label>Màu Sắc</Form.Label>
              <Form.Control
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Category */}
            <Form.Group className="mb-3" controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Origin */}
            <Form.Group className="mb-3" controlId="formOrigin">
              <Form.Label>Nguồn gốc (Origin)</Form.Label>
              <Form.Control
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Checkbox: Is Special */}
            <Form.Group className="mb-3" controlId="formIsSpecial">
              <Form.Check
                type="checkbox"
                label="Lan Đặc Biệt (Is Special)"
                name="isSpecial"
                checked={formData.isSpecial}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Checkbox: Is Natural */}
            <Form.Group className="mb-3" controlId="formIsNatural">
              <Form.Check
                type="checkbox"
                label="Lan Tự Nhiên (Is Natural)"
                name="isNatural"
                checked={formData.isNatural}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Đang Tạo..." : "Tạo Lan Mới"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              className="ms-2"
              disabled={isLoading}
            >
              Hủy
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
