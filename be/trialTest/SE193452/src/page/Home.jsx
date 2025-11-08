import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import studentApi from "../api/student.api";

export default function Home() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await studentApi.getAll();
      setItems(res.data.sort((a, b) => a.name.localeCompare(b.name)));
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
          <h5 className="mb-0">Student List</h5>
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

        {/* Table View */}
        {!isLoading && items && (
          <>
            <div className="table-responsive shadow-sm rounded-3">
              <table className="table table-hover table-striped align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Date Of Birth</th>
                    <th>Gender</th>
                    <th>Class</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Link
                          to={`/student/${item.id}`}
                          className="text-decoration-none text-dark"
                        >
                          {" "}
                          {item.id}
                        </Link>
                      </td>
                      <td>{item.name}</td>
                      <td>{item.dateofbirth}</td>
                      <td>{item.gender ? "Male" : "Female"}</td>
                      <td>{item.class}</td>
                      <td>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded-circle object-fit-cover"
                          style={{ width: 40, height: 40 }}
                        />
                      </td>
                      <td>
                        <Link
                          to={`/student/${item.id}`}
                          className="text-decoration-none btn btn-info"
                        >
                          Detail
                        </Link>
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
