import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import artToolsApi from "../api/artTools.api";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

export default function ArtToolsPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await artToolsApi.getAll();
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
      await artToolsApi.delete(selectedItem.id);
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
        itemName={selectedItem?.artName}
      />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Art Tools</h5>
          <Link to={"/createArtTool"} className="btn btn-primary btn-sm">
            Add Art Tools
          </Link>
        </div>

        {isLoading && <p>Đang tải dữ liệu...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Table View */}
        {!isLoading && items && (
          <>
            <div className="table-responsive shadow-sm rounded-3">
              <table className="table table-hover table-striped align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "80px" }}>ID</th>
                    <th style={{ width: "160px" }}>Art Name</th>
                    <th style={{ width: "160px" }}>Price</th>
                    <th style={{ width: "160px" }}>Description</th>
                    <th style={{ width: "160px" }}>Glass Surface</th>
                    <th style={{ width: "160px" }}>Image</th>
                    <th style={{ width: "160px" }}>Brand</th>
                    <th style={{ width: "160px" }}>Limited Time Deal</th>
                    <th className="text-end" style={{ width: "160px" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Link
                          className="text-decoration-none text-dark"
                          to={`/artTool/${item.id}`}
                        >
                          {item.id}
                        </Link>
                      </td>
                      <td>{item.artName}</td>
                      <td>{item.price}</td>
                      <td>{item.description}</td>
                      <td>{item.glassSurface ? "True" : "False"}</td>
                      <td>
                        <Link to={`/updateArtTool/${item.id}`} className="ms-1">
                          <img
                            src={item.image}
                            alt={item.artName}
                            className="rounded-circle object-fit-cover"
                            style={{ width: 40, height: 40 }}
                          />
                        </Link>
                      </td>
                      <td>{item.brand}</td>
                      <td>{item.limitedTimeDeal}</td>

                      <td className="text-end">
                        <Link
                          to={`/updateArtTool/${item.id}`}
                          className="btn btn-warning btn-sm ms-1"
                        >
                          Edit
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
