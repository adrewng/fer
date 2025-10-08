import React from "react";
import { Badge, Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import ListOfOrchids from "../shared/ListOfOrchids";
import Star from "./Start";

export default function OrchidDetail() {
  const { isDarkMode } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const orchid = ListOfOrchids.find((orchid) => orchid.id === parseInt(id));
  if (!orchid) {
    return (
      <Container className="text-center py-5">
        <h2>Orchid not found</h2>
        <Button variant="primary" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const themeColors = {
    bg: isDarkMode ? "#1a1a1a" : "#ffffff",
    text: isDarkMode ? "#ffffff" : "#212529",
    textSecondary: isDarkMode ? "#adb5bd" : "#6c757d",
    border: isDarkMode ? "#495057" : "#dee2e6",
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
      <Row className="mb-4">
        <Col>
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
      </Row>

      <Row>
        <Col lg={6} className="mb-4">
          <img
            src={orchid.image}
            alt={orchid.name}
            className="img-fluid rounded shadow"
            style={{ width: "100%", height: "400px", objectFit: "cover" }}
          />
        </Col>

        <Col lg={6}>
          <div className="mb-4">
            <h4>Rating</h4>
            <div className="d-flex align-items-center">
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

          <div
            className="p-4 rounded"
            style={{
              backgroundColor: isDarkMode ? "#2d2d2d" : "#f8f9fa",
              border: `1px solid ${themeColors.border}`,
            }}
          >
            <h5 className="mb-3">Orchid Information</h5>

            <Row className="mb-3">
              <Col xs={4} style={{ color: themeColors.textSecondary }}>
                <strong>ID:</strong>
              </Col>
              <Col xs={8} style={{ color: themeColors.text }}>
                {orchid.id}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col xs={4} style={{ color: themeColors.textSecondary }}>
                <strong>Origin:</strong>
              </Col>
              <Col xs={8} style={{ color: themeColors.text }}>
                {orchid.origin}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col xs={4} style={{ color: themeColors.textSecondary }}>
                <strong>Color:</strong>
              </Col>
              <Col xs={8} style={{ color: themeColors.text }}>
                {orchid.color}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col xs={4} style={{ color: themeColors.textSecondary }}>
                <strong>Category:</strong>
              </Col>
              <Col xs={8} style={{ color: themeColors.text }}>
                {orchid.category}
              </Col>
            </Row>

            <div className="mt-4">
              <h6>Tags:</h6>
              <div className="d-flex gap-2 flex-wrap">
                <Badge
                  bg="primary"
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
                  #{orchid.color}
                </Badge>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
