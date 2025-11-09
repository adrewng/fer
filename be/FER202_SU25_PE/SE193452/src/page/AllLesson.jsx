import { useEffect, useState } from "react";
import { Alert, Button, Container, Spinner, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import lessonApi from "../api/lesson.api";
import AppToast from "../components/AppToast";
import ConfirmDelete from "../components/ConfirmDelete";
import { formatMinute } from "../utils/util";
export default function AllLesson() {
  const [items, setItems] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [lesson, setLesson] = useState(null);
  const [modalDelete, setModalDelete] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      setLoading(true);
      setErrors("");
      const res = await lessonApi.getAll();
      setItems(res.data.sort((a, b) => Number(b.id) - Number(a.id)));
    } catch (e) {
      setErrors(e?.response?.data?.message || e?.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleDelete = async () => {
    try {
      await lessonApi.deleteLesson(lesson.id);
      fetchData();
      setModalDelete(false);
      setLesson(null);
      setToast({ show: true, msg: "Deleted successfully!" });
      // eslint-disable-next-line no-unused-vars
    } catch (_) {
      setToast({ show: true, msg: "Deleted not successfully!" });
    }
  };
  return (
    <>
      <ConfirmDelete
        show={modalDelete}
        onHide={() => setModalDelete(false)}
        itemName={lesson?.lessonTitle}
        handleDelete={handleDelete}
      />
      <Container>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5>Lesson List</h5>
          <Button
            variant="primary"
            size="md"
            as={Link}
            to={"/se193452/add-lesson"}
          >
            Add new Lesson
          </Button>
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
                <th colSpan={5}>Lesson Title</th>
                <th colSpan={2}>Level</th>
                <th colSpan={2}>Lesson Estimated Time</th>
                <th colSpan={4}>Actions</th>
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
                  <td colSpan={5}>{item.lessonTitle}</td>
                  <td colSpan={2}>{item.level}</td>
                  <td colSpan={2}>{formatMinute(item.estimatedTime) ?? 0}</td>
                  <td colSpan={4}>
                    <Button
                      as={Link}
                      to={`/se19342/update-lesson/${item.id}`}
                      onClick={(e) => e.stopPropagation()}
                      variant="warning"
                    >
                      Edit
                    </Button>
                    <Button
                      className="ms-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalDelete(true);
                        setLesson(item);
                      }}
                      variant="danger"
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
