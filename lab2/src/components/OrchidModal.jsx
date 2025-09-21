import { Badge, Button, Col, Modal, Row } from "react-bootstrap";
import Star from "./Start";

function OrchidModal({ orchid, show, onClose, isDarkMode }) {
  if (!orchid) return null;

  const themeColors = {
    modalBg: isDarkMode ? "#2d2d2d" : "#ffffff",
    modalBorder: isDarkMode ? "#495057" : "#dee2e6",
    text: isDarkMode ? "#ffffff" : "#212529",
    textSecondary: isDarkMode ? "#adb5bd" : "#6c757d",
  };

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header
        closeButton
        style={{
          backgroundColor: themeColors.modalBg,
          borderBottomColor: themeColors.modalBorder,
        }}
      >
        <Modal.Title style={{ color: themeColors.text }}>
          {orchid.name}
          {orchid.isSpecial && (
            <Badge bg="success" className="ms-2">
              Special
            </Badge>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: themeColors.modalBg }}>
        <Row>
          <Col md={6}>
            <img
              src={orchid.image}
              alt={orchid.name}
              className="img-fluid rounded mb-3"
            />
          </Col>
          <Col md={6}>
            <div className="mb-3">
              <h5 style={{ color: themeColors.text }}>Rating</h5>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} filled={star <= orchid.rating} />
                ))}
                <span
                  className="ms-2"
                  style={{ color: themeColors.textSecondary }}
                >
                  ({orchid.rating}/5)
                </span>
              </div>
            </div>

            <Row className="mb-3">
              <Col xs={6} style={{ color: themeColors.textSecondary }}>
                <strong>ID:</strong>
              </Col>
              <Col xs={6} style={{ color: themeColors.text }}>
                {orchid.id}
              </Col>
              <Col xs={6} style={{ color: themeColors.textSecondary }}>
                <strong>Origin:</strong>
              </Col>
              <Col xs={6} style={{ color: themeColors.text }}>
                {orchid.origin}
              </Col>
              <Col xs={6} style={{ color: themeColors.textSecondary }}>
                <strong>Color:</strong>
              </Col>
              <Col xs={6} style={{ color: themeColors.text }}>
                {orchid.color}
              </Col>
              <Col xs={6} style={{ color: themeColors.textSecondary }}>
                <strong>Category:</strong>
              </Col>
              <Col xs={6} style={{ color: themeColors.text }}>
                {orchid.category}
              </Col>
            </Row>

            <div className="mt-3">
              <Badge
                bg="primary"
                className="me-2"
                style={{
                  backgroundColor: isDarkMode ? "#0d6efd" : "#0d6efd",
                  color: "#ffffff",
                }}
              >
                #{orchid.category}
              </Badge>
              <Badge
                bg="info"
                style={{
                  backgroundColor: isDarkMode ? "#0dcaf0" : "#0dcaf0",
                  color: "#000000",
                }}
              >
                {orchid.color}
              </Badge>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer
        style={{
          backgroundColor: themeColors.modalBg,
          borderTopColor: themeColors.modalBorder,
        }}
      >
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OrchidModal;
