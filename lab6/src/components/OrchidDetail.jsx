import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchOrchildById, updateOrchild } from "../slices/orchildSlice"; // Cần import updateOrchild
import Star from "./Start";

export default function OrchidDetail() {
  const { isDarkMode } = useOutletContext();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { current: orchid, isLoading } = useSelector((state) => state.orchild);

  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchOrchildById(id));
  }, [dispatch, id]);

  // 2. Cập nhật formData khi dữ liệu orchid từ Redux thay đổi
  useEffect(() => {
    if (orchid) {
      // Đảm bảo rating là number khi đưa vào form
      setFormData({
        ...orchid,
        rating: Number(orchid.rating),
      });
    }
  }, [orchid]);

  if (isLoading && !orchid) {
    return (
      <Container className="text-center py-5" style={{ minHeight: "100vh" }}>
        <Alert variant="info">Đang tải dữ liệu hoa lan...</Alert>
      </Container>
    );
  }

  if (!orchid || !formData) {
    return (
      <Container className="text-center py-5">
        <h2>Orchid not found</h2>
        <Button variant="primary" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Container>
    );
  }
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateOrchild(formData))
      .unwrap()
      .then(() => {
        toast.success("Cập nhật lan thành công! ✅");
        setIsEditing(false);
        navigate(-1);
      });
  };

  const themeColors = {
    bg: isDarkMode ? "#1a1a1a" : "#ffffff",
    text: isDarkMode ? "#ffffff" : "#212529",
    textSecondary: isDarkMode ? "#adb5bd" : "#6c757d",
    border: isDarkMode ? "#495057" : "#dee2e6",
    inputBg: isDarkMode ? "#2d2d2d" : "#ffffff",
  };

  return (
    <Container
      className="py-4"
      style={{
        backgroundColor: themeColors.bg,
        color: themeColors.text,
        minHeight: "100vh",
      }}
    >
      <Row className="mb-4 d-flex justify-content-between align-items-center">
        <Col xs={12} md={6}>
          <Button
            variant="outline-secondary"
            onClick={() => navigate(-1)}
            className="mb-3"
          >
            ← Back
          </Button>
          <h1 className="mb-0">
            {orchid.name}
            {orchid.isSpecial && (
              <Badge bg="success" className="ms-2">
                Special
              </Badge>
            )}
          </h1>
        </Col>
        <Col xs={12} md={6} className="text-md-end mt-3 mt-md-0">
          {isEditing ? (
            <>
              <Button
                variant="success"
                onClick={handleUpdate}
                disabled={isLoading}
                className="me-2"
              >
                {isLoading ? "Đang Lưu..." : "💾 Lưu Thay Đổi"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
            </>
          ) : (
            <Button variant="warning" onClick={() => setIsEditing(true)}>
              ✏️ Chỉnh Sửa
            </Button>
          )}
        </Col>
      </Row>

      <Form onSubmit={handleUpdate}>
        <Row>
          <Col lg={6} className="mb-4">
            <img
              src={formData.image}
              alt={formData.name}
              className="img-fluid rounded shadow"
              style={{ width: "100%", height: "400px", objectFit: "cover" }}
            />
          </Col>

          <Col lg={6}>
            <div className="mb-4">
              <h4>Rating</h4>
              <div className="d-flex align-items-center">
                <Form.Group className="mb-0">
                  <Form.Control
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="1"
                    max="5"
                    disabled={!isEditing}
                    style={{
                      width: "80px",
                      backgroundColor: themeColors.inputBg,
                      color: themeColors.text,
                      marginRight: "10px",
                    }}
                  />
                </Form.Group>

                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} filled={star <= formData.rating} />
                ))}
                <span
                  className="ms-2"
                  style={{ color: themeColors.textSecondary }}
                >
                  ({formData.rating}/5)
                </span>
              </div>
            </div>

            <div
              className="p-4 rounded"
              style={{
                backgroundColor: isDarkMode ? "#2d2d2d" : "#f8f9fa",
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <h5 className="mb-3">Orchid Information</h5>

              {/* Trường ID (Chỉ hiển thị) */}
              <Row className="mb-3">
                <Col xs={4} style={{ color: themeColors.textSecondary }}>
                  <strong>ID:</strong>
                </Col>
                <Col xs={8} style={{ color: themeColors.text }}>
                  {formData.id}
                </Col>
              </Row>

              {/* Trường Name */}
              <Row className="mb-3 align-items-center">
                <Col xs={4} style={{ color: themeColors.textSecondary }}>
                  <strong>Name:</strong>
                </Col>
                <Col xs={8}>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      backgroundColor: themeColors.inputBg,
                      color: themeColors.text,
                    }}
                  />
                </Col>
              </Row>

              {/* Trường Origin */}
              <Row className="mb-3 align-items-center">
                <Col xs={4} style={{ color: themeColors.textSecondary }}>
                  <strong>Origin:</strong>
                </Col>
                <Col xs={8}>
                  <Form.Control
                    type="text"
                    name="origin"
                    value={formData.origin || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      backgroundColor: themeColors.inputBg,
                      color: themeColors.text,
                    }}
                  />
                </Col>
              </Row>

              {/* Trường Color */}
              <Row className="mb-3 align-items-center">
                <Col xs={4} style={{ color: themeColors.textSecondary }}>
                  <strong>Color:</strong>
                </Col>
                <Col xs={8}>
                  <Form.Control
                    type="text"
                    name="color"
                    value={formData.color || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      backgroundColor: themeColors.inputBg,
                      color: themeColors.text,
                    }}
                  />
                </Col>
              </Row>

              {/* Trường Category */}
              <Row className="mb-3 align-items-center">
                <Col xs={4} style={{ color: themeColors.textSecondary }}>
                  <strong>Category:</strong>
                </Col>
                <Col xs={8}>
                  <Form.Control
                    type="text"
                    name="category"
                    value={formData.category || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      backgroundColor: themeColors.inputBg,
                      color: themeColors.text,
                    }}
                  />
                </Col>
              </Row>

              {/* Checkbox Is Natural */}
              <Row className="mb-3 align-items-center">
                <Col xs={4} style={{ color: themeColors.textSecondary }}>
                  <strong>Is Natural:</strong>
                </Col>
                <Col xs={8}>
                  <Form.Check
                    type="checkbox"
                    name="isNatural"
                    checked={formData.isNatural}
                    onChange={handleChange}
                    disabled={!isEditing}
                    label={formData.isNatural ? "Yes" : "No"}
                  />
                </Col>
              </Row>

              {/* Checkbox Is Special */}
              <Row className="mb-3 align-items-center">
                <Col xs={4} style={{ color: themeColors.textSecondary }}>
                  <strong>Is Special:</strong>
                </Col>
                <Col xs={8}>
                  <Form.Check
                    type="checkbox"
                    name="isSpecial"
                    checked={formData.isSpecial}
                    onChange={handleChange}
                    disabled={!isEditing}
                    label={formData.isSpecial ? "Yes" : "No"}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
