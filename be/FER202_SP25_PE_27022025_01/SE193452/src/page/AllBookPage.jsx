import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bookApi from "../api/book.api";
import ConfirmDeleteModal from "../components/ComfirmDeleteModal";

export default function AllBookPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  //   const [showModalAdd, setShowModalAdd] = useState(false);
  //   const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await bookApi.getAll();
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
      await bookApi.deleteItem(selectedItem.id);
      fetchItems();
      setShowModalDelete(false);
      setSelectedItem(null);
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
        itemName={selectedItem?.bookName}
      />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Danh sách</h5>
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate("/createBook")}
            >
              Add Book
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="d-flex align-items-center justify-content-center gap-3">
            <div className="spinner-border" role="status" />
            <span className="text-muted">Đang tải…</span>
          </div>
        )}
        {error && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <div>{error}</div>
            <button onClick={fetchItems} className="btn btn-light btn-sm">
              Thử lại
            </button>
          </div>
        )}
        {!isLoading && items && (
          <>
            <div className="table-responsive shadow-sm rounded-3">
              <table className="table table-hover table-striped align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "80px" }}>Book Name</th>
                    <th style={{ width: "160px" }}>Book Type</th>
                    <th style={{ width: "160px" }}>Book Reading Status</th>
                    <th style={{ width: "160px" }}>Book Image</th>
                    <th className="text-end" style={{ width: "160px" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.bookName}</td>
                      <td>{item.bookType}</td>
                      <td>
                        {Number(item.bookReadingStatus) === 1
                          ? "UnRead"
                          : Number(item.bookReadingStatus) === 2
                          ? "Reading"
                          : Number(item.bookReadingStatus) === 3
                          ? "Read"
                          : "Unknow"}
                      </td>
                      <td>
                        <Link to={`/book/${item.id}`} className="ms-1">
                          <img
                            src={item.bookImage}
                            alt={item.bookName}
                            className="rounded-circle object-fit-cover"
                            style={{ width: 40, height: 40 }}
                          />
                        </Link>
                      </td>
                      <td className="text-end">
                        <Link
                          to={`/updateBook/${item.id}`}
                          className="btn btn-warning btn-sm ms-1"
                        >
                          Update
                        </Link>
                        <button
                          className="btn btn-danger btn-sm ms-1"
                          onClick={() => {
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
          </>
        )}
      </div>
    </>
  );
}
