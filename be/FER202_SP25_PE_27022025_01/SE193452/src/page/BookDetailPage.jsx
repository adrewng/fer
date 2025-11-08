import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import bookApi from "../api/book.api";

export default function BookDetailPage() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchItem = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await bookApi.getItemDetail(id);
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

  // Loading
  if (isLoading)
    return (
      <div className="container py-5 d-flex justify-content-center">
        <div className="d-flex align-items-center gap-3">
          <div className="spinner-border" role="status" />
          <span className="text-muted">Đang tải…</span>
        </div>
      </div>
    );

  // Error
  if (error)
    return (
      <div className="container py-4">
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <div>{error}</div>
          <button onClick={fetchItem} className="btn btn-light btn-sm">
            Thử lại
          </button>
        </div>
      </div>
    );

  if (!item) return <div className="container py-4">Không tìm thấy</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-end gap-2 mt-3">
        <Link to={-1} className="btn btn-outline-secondary">
          ← Quay lại
        </Link>
      </div>
      <div className="row g-4">
        {/* Ảnh */}
        <div className="col-12 col-md-5 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="h-25 w-75 overflow-hidden d-flex m-auto">
              <img
                src={item.bookImage}
                alt={item.bookName}
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
              <h2 className="h4 mb-3">{item.bookName}</h2>

              <ul className="list-group list-group-flush rounded-4 overflow-hidden">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-secondary">Reading Status</span>
                  <span
                    className={
                      "badge " +
                      (Number(item.bookReadingStatus) === 1
                        ? "text-bg-secondary"
                        : Number(item.bookReadingStatus) === 2
                        ? "text-bg-info"
                        : Number(item.bookReadingStatus) === 3
                        ? "text-bg-success"
                        : "text-bg-dark")
                    }
                  >
                    {Number(item.bookReadingStatus) === 1
                      ? "Unread"
                      : Number(item.bookReadingStatus) === 2
                      ? "Reading"
                      : Number(item.bookReadingStatus) === 3
                      ? "Read"
                      : "Unknown"}
                  </span>
                </li>

                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-secondary">Is Unread</span>
                  <span
                    className={
                      "badge " +
                      (item.isUnread
                        ? "text-bg-secondary"
                        : "text-bg-light border")
                    }
                  >
                    {item.isUnread ? "True" : "False"}
                  </span>
                </li>

                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-secondary">Book Type</span>
                  <span className="fw-medium">{item.bookType || "—"}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
