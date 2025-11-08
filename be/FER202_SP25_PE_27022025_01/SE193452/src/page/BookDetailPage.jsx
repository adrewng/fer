import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  if (isLoading) return <div className="container py-4">Đang tải...</div>;
  if (error)
    return <div className="container py-4 alert alert-danger">{error}</div>;
  if (!item) return <div className="container py-4">Không tìm thấy</div>;
  return (
    <>
      <div className="container py-4">
        <div className="row">
          <div className="col-12 col-md-4 mb-3 text-center position-relative">
            <img
              src={item.bookImage}
              alt={item.bookName}
              className="img-fluid rounded-3 shadow-sm object-fit-cover"
              style={{ height: "18rem" }}
            />
          </div>
          <div className="col-12 col-md-8">
            <h2>{item.bookName}</h2>
            <div className="mb-3">
              <strong>Book Reading Status:</strong>{" "}
              {Number(item.bookReadingStatus) === 1
                ? "UnRead"
                : Number(item.bookReadingStatus) === 2
                ? "Reading"
                : Number(item.bookReadingStatus) === 3
                ? "Read"
                : "Unknow"}
            </div>
            <div className="mb-3">
              <strong>Is Unread:</strong> {item.isUnread ? "True" : "False"}
            </div>

            <div className="mb-3">
              <strong>Book Type:</strong> {item.bookType}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
