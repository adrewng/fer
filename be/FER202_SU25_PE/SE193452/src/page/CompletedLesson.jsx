import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import lessonApi from "../api/lesson.api";
import { formatMinute } from "../util/util";

export default function CompletedLesson() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await lessonApi.getAll();
      setItems(res.data.filter((item) => Boolean(item.isCompleted) === true));
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Lesson List</h5>
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
          <>
            <div className="table-responsive shadow-sm rounded-3">
              <table className="table table-hover table-striped align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "500px" }}>Lesson Title</th>
                    <th>Level</th>
                    <th>Estimated Time</th>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
