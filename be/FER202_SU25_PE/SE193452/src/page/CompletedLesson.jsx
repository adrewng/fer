import { useEffect, useState } from "react";
import { Alert, Button, Container, Spinner, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import lessonApi from "../api/lesson.api";
import { formatMinute } from "../util/util";
export default function CompleteLesson() {
  const [items, setItems] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  const fetchApi = async () => {
    try {
      setLoading(true);
      setErrors("");
      const res = await lessonApi.getAll();
      const dataArray = Array.isArray(res.data) ? res.data : [];
      setItems(dataArray.sort((a, b) => Number(b.id) - Number(a.id)));
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
  }, []);
  return (
    <>
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center">
          <h5>Lessons List</h5>
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
        {!isLoading && items && (
          <Table striped hover>
            <thead>
              <tr>
                <th colSpan={7}>Lesson Title</th>
                <th colSpan={3}>Level</th>
                <th colSpan={3}>Estimated Time</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  role="button"
                  onClick={() => navigate(`/se193452/lesson/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td colSpan={7}>{item.lessonTitle}</td>
                  <td colSpan={3}>{item.level}</td>
                  <td colSpan={3}>{formatMinute(item.estimatedTime)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  );
}
