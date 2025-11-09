import { useEffect, useState } from "react";
import { Alert, Button, Container, Spinner, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import lessonApi from "../api/lesson.api";
import AppToast from "../components/AppToast";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { formatMinute } from "../util/util";
export default function AllLesson() {
  const [items, setItems] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: "", bg: "success" });
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await lessonApi.deleteItem(lesson.id);
      fetchApi();
      setShowModalDelete(false);
      setLesson(null);
      setToast({ show: true, msg: "Deleted successfully!", bg: "success" });
    } catch (err) {
      setErrors(err?.response?.data?.message || err.message);
    }
  };
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
      <ConfirmDeleteModal
        show={showModalDelete}
        onHide={() => {
          setShowModalDelete(false);
          setLesson(null);
        }}
        handleDelete={handleDelete}
        itemName={lesson?.lessonTitle}
      />
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center">
          <h5>Lessons List</h5>
          <Button
            as={Link}
            size="sm"
            variant="primary"
            to={"/se193452/create-lesson"}
          >
            Create New Lesson
          </Button>
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
          <Table striped hover>
            <thead>
              <tr>
                <th colSpan={5}>Lesson Title</th>
                <th colSpan={2}>Level</th>
                <th colSpan={2}>Estimated Time</th>
                <th colSpan={4}>Actions</th>
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
                  <td colSpan={5}>{item.lessonTitle}</td>
                  <td colSpan={2}>{item.level}</td>
                  <td colSpan={2}>{formatMinute(item.estimatedTime)}</td>
                  <td colSpan={4}>
                    <Button
                      variant="warning"
                      size="sm"
                      as={Link}
                      className="ms-1"
                      to={`/se193452/update-lesson/${item.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowModalDelete(true);
                        setLesson(item);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <AppToast
        show={toast.show}
        msg={toast.msg}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </>
  );
}
