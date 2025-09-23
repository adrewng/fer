import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import Star from "./Start";

export default function OrchidItem({ orchid, handleOnClick, isDarkMode }) {
  const { id, name, image, rating, isSpecial, color, origin, category } =
    orchid;

  const themeColors = {
    cardBg: isDarkMode ? "#2d2d2d" : "#ffffff",
    cardBorder: isDarkMode ? "#495057" : "#dee2e6",
    text: isDarkMode ? "#ffffff" : "#212529",
    textSecondary: isDarkMode ? "#adb5bd" : "#6c757d",
    overlayBg: isDarkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.6)",
  };

  return (
    <Card
      className="h-100 shadow-sm orchid-card"
      style={{
        backgroundColor: themeColors.cardBg,
        borderColor: themeColors.cardBorder,
      }}
    >
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={image}
          alt={name}
          style={{ height: "200px", objectFit: "cover" }}
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
          onClick={() => handleOnClick(orchid)}
        >
          <Button variant="light" size="lg">
            Detail
          </Button>
        </div>
      </div>

      <Card.Body
        className="d-flex flex-column"
        style={{ color: themeColors.text }}
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

        <div className="mt-auto">
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
      </Card.Body>
    </Card>
  );
}
