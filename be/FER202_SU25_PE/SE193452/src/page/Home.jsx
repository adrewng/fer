import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import lessonApi from "../api/lesson.api";
import { formatMinute } from "../util/util";

export default function Home() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // const [showModalAdd, setShowModalAdd] = useState(false);
  // const [showModalEdit, setShowModalEdit] = useState(false);
  // const [showModalDelete, setShowModalDelete] = useState(false);
  // const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await lessonApi.getAll();
      setItems(res.data.filter((item) => Boolean(item.isCompleted) === false));
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // const handleDelete = async () => {
  //   try {
  //     await itemApi.deleteItem(selectedItem.id);
  //     fetchItems();
  //     setShowModalDelete(false);
  //     setSelectedItem(null);
  //   } catch (err) {
  //     setError(err?.response?.data?.message || err.message);
  //   }
  // };

  return (
    <>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Danh sách</h5>
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              // onClick={() => setShowModalAdd(true)}
            >
              Thêm
            </button>
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
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
            {items.map((item) => (
              <div className="col" key={item.id}>
                <div className="card h-100 shadow-sm">
                  <Link to={`/lesson/${item.id}`}>
                    <img
                      src={item.lessonImage}
                      className="card-img-top"
                      alt={item.lessonTitle}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  </Link>

                  <div className="card-body">
                    <h5 className="card-title">{item.lessonTitle}</h5>
                    <p className="card-text text-muted mb-2">
                      Title: {item.level}
                    </p>
                    <p className="card-text text-muted mb-2">
                      Estimated Time: {formatMinute(item.estimatedTime) ?? 0}
                    </p>
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
