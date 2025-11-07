import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import studentApi from "../api/student.api";

export default function Detail() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await studentApi.getStudent(id);
        setStudent(res.data);
      } catch (e) {
        setError(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (isLoading)
    return <div className="container py-4">Đang tải dữ liệu...</div>;
  if (error) return <div className="container py-4 text-danger">{error}</div>;
  if (!student) return null;

  return (
    <div className="container py-4">
      <div className="mb-3 text-end">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline-secondary btn-sm"
        >
          ← Quay lại
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="row g-3">
          <div
            className="col-md-4 p-3 d-flex align-items-center justify-content-center"
            style={{ height: 260 }}
          >
            <img
              src={student.image}
              alt={student.name}
              className="img-fluid rounded object-fit-cover"
              style={{ maxHeight: 260 }}
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title mb-3">{student.name}</h5>
              <div className="row row-cols-1 row-cols-md-2 g-3">
                <div className="col">
                  <div className="list-group">
                    <div className="list-group-item d-flex justify-content-between">
                      <span className="text-muted">Id</span>
                      <span>{student.id}</span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between">
                      <span className="text-muted">Name</span>
                      <span>{student.name}</span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between">
                      <span className="text-muted">DateOfBirth</span>
                      <span>{student.dateofbirth}</span>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="list-group">
                    <div className="list-group-item d-flex justify-content-between">
                      <span className="text-muted">Gender</span>
                      <span>{student.gender ? "Male" : "Female"}</span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between">
                      <span className="text-muted">Class</span>
                      <span>{student.class}</span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between">
                      <div className="text-muted">Feedback</div>
                      <div>{student.feedback || "(Không có)"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
