import { useEffect, useState } from "react";
import { Alert, Button, Card, Container, Row, Spinner } from "react-bootstrap";
import lessonApi from "../api/lesson.api";

export default function Home() {
  const [items, setItems] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const fetchApi = async () => {
    try {
      setLoading(true);
      setErrors("");
      const res = await lessonApi.getAll();
      setItems(res.data.filter((item) => Boolean(item.isCompleted) === false));
    } catch (err) {
      setErrors(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchApi();
  }, []);
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center">
        <h5>Lessons List</h5>
      </div>
      {isLoading && (
        <div className="d-flex align-items-center gap-3">
          <Spinner animation="border" role="status" />
          <span className="text-muted">Loading...</span>
        </div>
      )}
      {!isLoading && errors && (
        <Alert
          variant="danger"
          className="d-flex justify-content-between align-items-center"
        >
          <div>{errors}</div>
          <Button variant="light" size="sm" onClick={fetchApi}>
            Try Again!
          </Button>
        </Alert>
      )}
      {!isLoading && items && (
        <Row xs={1} sm={2} lg={3} className="g-3">
          {items.map((item) => (
            <Col key={item.id}>
              <Card className="h-100 shadow-sm">
                <Link to={`/se193452/lesson/${item.id}`}>
                  <Card.Img
                    src={item.lessonImage}
                    alt={item.lessonTitle}
                    variant="top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                </Link>
                <Card.Body>
                  <Card.Title>{item.lessonTitle}</Card.Title>
                  <Card.Text className="text-muted mb-2">
                    Lesson Estimated Time: {item.estimatedTime}
                  </Card.Text>
                  <Card.Text className="text-muted mb-2">
                    Lesson Level: {item.level}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
