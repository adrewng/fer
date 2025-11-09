import { useEffect, useState } from "react";
import { Alert, Container, Spinner, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import lessonApi from "../api/lesson.api";
import { formatMinute } from "../utils/util";

export default function CompletedLesson() {
  const [items, setItems] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      setLoading(true);
      setErrors("");
      const res = await lessonApi.getAll();
      setItems(res.data.filter((item) => Boolean(item.isCompleted)));
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
    <>
      <Container>
        <div className="d-flex align-items-center justify-content-between mb-3">
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
          <Table striped hover>
            <thead className="table-light">
              <tr>
                <th colSpan={7}>Lesson Title</th>
                <th colSpan={3}>Level</th>
                <th colSpan={3}>Lesson Estimated Time</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  role="button"
                  onClick={() => {
                    navigate(`/se193452/lesson/${item.id}`);
                  }}
                >
                  <td colSpan={7}>{item.lessonTitle}</td>
                  <td colSpan={3}>{item.level}</td>
                  <td colSpan={3}>{formatMinute(item.estimatedTime) ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  );
}
