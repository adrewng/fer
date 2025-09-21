import { Badge, Card, Col, Row } from "react-bootstrap";

function Star({ filled }) {
  return (
    <span
      className={filled ? "text-warning" : "text-muted"}
      style={{ opacity: filled ? 1 : 0.3 }}
    >
      ★
    </span>
  );
}

export default function OrchidItem({
  orchid: { id, name, image, rating, isSpecial, color, origin, category },
}) {
  return (
    <Card className="h-100 shadow-sm">
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
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title className="h6 mb-0">{name}</Card.Title>
          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} filled={star <= rating} />
            ))}
          </div>
        </div>

        <Row className="mb-3">
          <Col xs={6} className="text-muted small">
            ID
          </Col>
          <Col xs={6} className="small">
            {id}
          </Col>
          <Col xs={6} className="text-muted small">
            Origin
          </Col>
          <Col xs={6} className="small">
            {origin}
          </Col>
          <Col xs={6} className="text-muted small">
            Color
          </Col>
          <Col xs={6} className="small">
            {color}
          </Col>
          <Col xs={6} className="text-muted small">
            Category
          </Col>
          <Col xs={6} className="small">
            {category}
          </Col>
        </Row>

        <div className="mt-auto">
          <Badge bg="secondary" className="me-1">
            #{category}
          </Badge>
          <Badge bg="secondary">#{color}</Badge>
        </div>
      </Card.Body>
    </Card>
  );
}
