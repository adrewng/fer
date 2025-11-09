import { useEffect, useState } from "react";
import { Alert, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import lessonApi from "../api/lesson.api";
export default function Home() {
  const [items, setItems] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const fetchData = async () => {
    try {
      setLoading(true);
      setErrors("");
      const res = await lessonApi.getAll();
      setItems(res.data.filter((item) => Boolean(item.isCompleted) === false));
    } catch (e) {
      setErrors(e?.response?.data?.message || e?.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Container>
      <div className="d-flex align-items-center justify-content-center mb-3">
        <h5>Lesson List</h5>
      </div>
      {isLoading && (
        <div className="d-flex align-items-center justify-content-center gap-3">
          <Spinner animation="border" role="status" />
          <span>Loading...</span>
        </div>
      )}
      {!isLoading && errors && (
        <Alert variant="danger">
          <span>{errors}</span>
        </Alert>
      )}
      {!isLoading && items && (
        <Row xs={2} sm={3} md={4} className="g-3">
          {items.map((item) => (
            <Col key={item.id}>
              <Card className="h-100 shadow-sm">
                <Link to={`/se193452/lesson/${item.id}`}>
                  <Card.Img
                    src={item.lessonImage}
                    variant="top"
                    alt={item.lessonTitle}
                    style={{ height: "200px", objectFix: "cover" }}
                  />
                </Link>
                <Card.Body>
                  <Card.Title>{item.lessonTitle}</Card.Title>
                  <Card.Text>Level: {item.level}</Card.Text>
                  <Card.Text>Estimated Time: {item.estimatedTime}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
