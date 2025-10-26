import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteOrchild } from "../slices/orchildSlice";
import Star from "./Start";

// Thêm handleDelete vào props
export default function OrchidItem({ orchid, isDarkMode }) {
  const dispath = useDispatch();
  const { id, name, image, rating, isSpecial, color, origin, category } =
    orchid;
  const themeColors = {
    cardBg: isDarkMode ? "#2d2d2d" : "#ffffff",
    cardBorder: isDarkMode ? "#495057" : "#dee2e6",
    text: isDarkMode ? "#ffffff" : "#212529",
    textSecondary: isDarkMode ? "#adb5bd" : "#6c757d",
    overlayBg: isDarkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.6)",
    deleteBtn: isDarkMode ? "danger" : "outline-danger",
  };
  const handleDelete = (id) => {
    dispath(deleteOrchild(id));
  };
  return (
    <Card
      className="h-100 shadow-sm orchid-card"
      style={{
        backgroundColor: themeColors.cardBg,
        borderColor: themeColors.cardBorder,
        // Đảm bảo Card là flex container để Card.Body chiếm hết chiều cao còn lại
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={
            image || "https://placehold.co/600x400/343a40/ffffff?text=No+Image"
          } // Thêm fallback image
          alt={name}
          style={{ height: "200px", objectFit: "cover" }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/600x400/343a40/ffffff?text=Image+Not+Found";
          }}
        />
        {isSpecial && (
          <Badge bg="success" className="position-absolute top-0 start-0 m-2">
            Special
          </Badge>
        )}
        <div
          className="orchid-overlay"
          style={{
            backgroundColor: themeColors.overlayBg,
          }}
        >
          <Button variant="light" size="lg" as={Link} to={`/detail/${id}`}>
            Detail
          </Button>
        </div>
      </div>

      <Card.Body
        className="d-flex flex-column"
        style={{ color: themeColors.text, flexGrow: 1 }} // Đặt flexGrow: 1 để Body chiếm hết không gian
      >
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title className="h6 mb-0" style={{ color: themeColors.text }}>
            {name}
          </Card.Title>
          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} filled={star <= rating} />
            ))}
          </div>
        </div>

        <Row className="mb-3">
          <Col
            xs={6}
            className="small"
            style={{ color: themeColors.textSecondary }}
          >
            ID
          </Col>
          <Col xs={6} className="small" style={{ color: themeColors.text }}>
            {id}
          </Col>
          <Col
            xs={6}
            className="small"
            style={{ color: themeColors.textSecondary }}
          >
            Origin
          </Col>
          <Col xs={6} className="small" style={{ color: themeColors.text }}>
            {origin}
          </Col>
          <Col
            xs={6}
            className="small"
            style={{ color: themeColors.textSecondary }}
          >
            Color
          </Col>
          <Col xs={6} className="small" style={{ color: themeColors.text }}>
            {color}
          </Col>
          <Col
            xs={6}
            className="small"
            style={{ color: themeColors.textSecondary }}
          >
            Category
          </Col>
          <Col xs={6} className="small" style={{ color: themeColors.text }}>
            {category}
          </Col>
        </Row>

        {/* --- Phần Nút và Badge (Được đẩy xuống dưới cùng) --- */}
        <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
          <div>
            <Badge
              bg="secondary"
              className="me-1"
              style={{
                backgroundColor: isDarkMode ? "#6c757d" : "#6c757d",
                color: "#ffffff",
              }}
            >
              #{category}
            </Badge>
            <Badge
              bg="secondary"
              style={{
                backgroundColor: isDarkMode ? "#6c757d" : "#6c757d",
                color: "#ffffff",
              }}
            >
              #{color}
            </Badge>
          </div>
          <Button
            variant={themeColors.deleteBtn}
            size="sm"
            onClick={() => handleDelete(id)}
          >
            🗑️ Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
