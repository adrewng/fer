import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import studentApi from "../api/student.api";

export default function StudentDetail() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchItem = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await studentApi.getItemDetail(id);
      setItem(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading)
    return (
      <div className="container py-5 d-flex justify-content-center">
        <div className="d-flex align-items-center gap-3">
          <div className="spinner-border" role="status" />
          <span className="text-muted">Đang tải…</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container py-4">
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <div>{error}</div>
          <button onClick={fetchItem} className="btn btn-light btn-sm">
            Try Again!
          </button>
        </div>
      </div>
    );

  if (!item) return <div className="container py-4">Not Found!</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-end gap-2 mt-3">
        <Link to={-1} className="btn btn-outline-secondary">
          ← Back
        </Link>
      </div>
      <div className="row g-4">
        {/* Ảnh */}
        <div className="col-12 col-md-5 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="h-75 w-100 overflow-hidden d-flex m-auto">
              <img
                src={item.image}
                alt={item.name}
                className="w-100 h-100 card-img object-fit-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Thông tin */}
        <div className="col-12 col-md-7 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h2 className="h4 mb-3">{item.name}</h2>

              <ul className="list-group list-group-flush rounded-4 overflow-hidden">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-secondary">ID:</span>
                  <span className="fw-medium">{item.id}</span>
                </li>

                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-secondary">Date Of Birth</span>
                  <span className="fw-medium">{item.dateofbirth}</span>
                </li>

                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-secondary">Gender:</span>
                  <span className="fw-medium">
                    {item.gender ? "Male" : "Female"}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-secondary">Class:</span>
                  <span className="fw-medium">{item.class}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-secondary">Feedback:</span>
                  <span className="fw-medium">{item.feedback}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
