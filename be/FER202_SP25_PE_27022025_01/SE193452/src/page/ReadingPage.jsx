import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bookApi from "../api/book.api";

export default function ReadingPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await bookApi.getAll();
      setItems(res.data.filter((item) => Number(item.bookReadingStatus) === 2));
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
          <h5 className="mb-0">Reading Books</h5>
          <div className="d-flex gap-2"></div>
        </div>

        {isLoading && <p>Đang tải dữ liệu...</p>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!isLoading && items && (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
            {items.map((item) => (
              <div className="col" key={item.id}>
                <div className="card h-100 shadow-sm">
                  <Link to={`book/${item.id}`}>
                    <img
                      src={item.bookImage}
                      className="card-img-top"
                      alt={item.bookName}
                      style={{ height: "200px" }}
                    />
                  </Link>
                  <div className="card-body">
                    <h5 className="card-title">{item.bookName}</h5>
                    <p className="card-text text-muted mb-2">{item.bookType}</p>

                    <div className="d-flex gap-2 mb-2">
                      <span className="badge text-bg-info">
                        Book Reading Status:{" "}
                        {Number(item.bookReadingStatus) === 1
                          ? "UnRead"
                          : Number(item.bookReadingStatus) === 2
                          ? "Reading"
                          : Number(item.bookReadingStatus) === 3
                          ? "Read"
                          : "Unknow"}
                      </span>
                    </div>
                    <div>
                      <span className="badge text-bg-info">
                        Book Type: {item.bookType}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
