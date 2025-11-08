import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import lessonApi from "../api/lesson.api";
import ConfirmDeleteModal from "../components/ComfirmDeleteModal";
import Toast from "../components/Toast";
import { formatMinute } from "../util/util";
export default function AllLesson() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await lessonApi.getAll();
      setItems(res.data.sort((a, b) => Number(b.id) - Number(a.id)));
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async () => {
    try {
      await lessonApi.deleteItem(selectedItem.id);
      fetchItems();
      setShowModalDelete(false);
      setSelectedItem(null);
      setShowToast(true);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  return (
    <>
      <ConfirmDeleteModal
        show={showModalDelete}
        onHide={() => {
          setShowModalDelete(false);
          setSelectedItem(null);
        }}
        handleDelete={handleDelete}
        itemName={selectedItem?.lessonTitle}
      />
      <Toast
        show={showToast}
        message="Item deleted successfully!"
        onClose={() => setShowToast(false)}
      />

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Danh sách</h5>
          <div className="d-flex gap-2">
            <Link to="/addLesson" className="btn btn-primary btn-sm">
              Add New Lesson
            </Link>
          </div>
        </div>

        {isLoading && (
          <div className="d-flex align-items-center gap-3">
            <div className="spinner-border" role="status" />
            <span className="text-muted">Loading…</span>
          </div>
        )}

        {error && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <div>{error}</div>
            <button onClick={fetchItems} className="btn btn-light btn-sm">
              Fetch Again
            </button>
          </div>
        )}

        {!isLoading && items && (
          <div className="table-responsive shadow-sm rounded-3">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "450px" }}>Lesson Title</th>
                  <th>Level</th>
                  <th>Estimated Time</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    role="button"
                    className="align-middle"
                    onClick={() => navigate(`/se193452/lessons/${item.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{item.lessonTitle}</td>
                    <td>{item.level}</td>
                    <td>{formatMinute(item.estimatedTime) ?? 0}</td>

                    <td className="text-end">
                      <Link
                        to={`/updateLesson/${item.id}`}
                        className="btn btn-warning btn-sm ms-1"
                        onClick={(e) => e.stopPropagation()} // ← chặn click lan lên <tr>
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm ms-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                          setShowModalDelete(true);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
