import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import lessonApi from "../api/lesson.api";
import { formatMinute } from "../util/util";

export default function LessonDetail() {
  const { id } = useParams();
  const [item, setItem] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const fetchApi = async () => {
    try {
      setLoading(true);
      setErrors("");
      const res = await lessonApi.getItemDetail(id);
      setItem(res.data);
    } catch (err) {
      setErrors(
        err?.response?.data?.message || err.message || "Failed to fetch lessons"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApi();
  }, [id]);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center">
        <h5>Lesson Detail</h5>
      </div>
      {isLoading && (
        <div className="d-flex align-align-items-center gap-3">
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
      {!isLoading && item && (
        <>
          <div className="d-flex justify-content-end align-items-center">
            <Button as={Link} size="sm" to={-1} variant="outline-secondary">
              Back
            </Button>
          </div>
          <Row className="g-4 mt-3">
            <Col xs={12} md={5} lg={4}>
              <Card className="h-25 w-75 m-auto">
                <Card.Img
                  src={item.lessonImage}
                  alt={item.lessonTitle}
                  className="object-fit-cover"
                />
              </Card>
            </Col>

            <Col xs={12} md={7} lg={8}>
              <Card>
                <Card.Body>
                  <h2 className="text-muted">{item.lessonTitle}</h2>
                  <ListGroup>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Level:</span>
                      <span>{item.level}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Is Completed:</span>
                      <Badge
                        bg={item.isCompleted ? "secondary" : "light"}
                        text={item.isCompleted ? undefined : "dark"}
                        className={!item.isCompleted ? "border" : ""}
                      >
                        {item.isCompleted ? "True" : "False"}
                      </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Estimated Time:</span>
                      <span>{formatMinute(item.estimatedTime)}</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
