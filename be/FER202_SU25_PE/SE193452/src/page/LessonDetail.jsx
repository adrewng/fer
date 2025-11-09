import { useEffect, useState } from "react";
import {
  Alert,
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
export default function LessonDetail() {
  const [item, setItem] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const { id } = useParams();
  const fetchData = async () => {
    try {
      setLoading(true);
      setErrors("");
      const res = await lessonApi.getDetail(id);
      setItem(res.data);
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
      <div className="d-flex align-item-center justify-content-center mb-3">
        <h5>Lesson Detail</h5>
      </div>
      {isLoading && (
        <div className="d-flex align-item-center justify-content-center gap-3">
          <Spinner animation="border" role="status" />
          <span>Loading...</span>
        </div>
      )}
      {!isLoading && errors && (
        <Alert variant="danger">
          <span>{errors}</span>
        </Alert>
      )}
      {!isLoading && item && (
        <>
          <div className="f-flex justify-content-end text-end">
            <Button as={Link} size="sm" variant="secondary" to={-1}>
              Back
            </Button>
          </div>
          <Row className="g-4 mt-3">
            <Col sx={12} sm={5} lg={4}>
              <Card className="w-50 m-auto">
                <Card.Img
                  src={item.lessonImage}
                  alt={item.lessonTitle}
                  className="w-100 h-100 object-fit-cover"
                />
              </Card>
            </Col>
            <Col sx={12} sm={7} lg={8}>
              <Card>
                <Card.Body>
                  <h2>{item.lessonTitle}</h2>
                  <ListGroup>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Level:</span>
                      <span>{item.level}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Completed: </span>
                      <span>{item.isCompleted ? "True" : "False"}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Lesson Estimated Time: </span>
                      <span>{item.estimatedTime}</span>
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
