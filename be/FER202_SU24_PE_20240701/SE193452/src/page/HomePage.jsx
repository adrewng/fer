import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import artToolsApi from "../api/artTools.api";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  //   const [showModalAdd, setShowModalAdd] = useState(false);
  //   const [showModalEdit, setShowModalEdit] = useState(false);
  //   const [showModalDelete, setShowModalDelete] = useState(false);
  //   const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await artToolsApi.getAll();
      setItems(res.data.filter((item) => Number(item.limitedTimeDeal) === 0));
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  //   const handleDelete = async () => {
  //     try {
  //       await itemApi.deleteItem(selectedItem.id);
  //       fetchItems();
  //       setShowModalDelete(false);
  //       setSelectedItem(null);
  //     } catch (err) {
  //       setError(err?.response?.data?.message || err.message);
  //     }
  //   };

  return (
    <>
      {/* <CreateItemModal
        show={showModalAdd}
        onHide={() => setShowModalAdd(false)}
        onSuccess={fetchItems}
      />
      <EditItemModal
        show={showModalEdit}
        onHide={() => {
          setShowModalEdit(false);
          setSelectedItem(null);
        }}
        onSuccess={fetchItems}
        item={selectedItem}
      />
      <ConfirmDeleteModal
        show={showModalDelete}
        onHide={() => {
          setShowModalDelete(false);
          setSelectedItem(null);
        }}
        handleDelete={handleDelete}
        itemName={selectedItem?.bookName}
      /> */}

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Art Tools</h5>
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
                      <td>{item.glassSurface}</td>
                      <td>
                        <img
                          src={item.image}
                          alt={item.artName}
                          className="rounded-circle object-fit-cover"
                          style={{ width: 40, height: 40 }}
                        />
                      </td>
                      <td>{item.brand}</td>
                      <td>{item.limitedTimeDeal}</td>
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
