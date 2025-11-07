import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import studentApi from "../api/student.api";

export default function Home() {
  const [students, setStudent] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [errors, setError] = useState("");
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await studentApi.getStudents();
        setStudent(res.data);
      } catch (e) {
        setError(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <div className="container py-4">
      {isLoading && <p>Đang tải dữ liệu</p>}
      {!isLoading && errors.trim().length > 0 && <p>{errors}</p>}
      {!isLoading && students && (
        <table className="table table-secondary table-striped table-hover table-bordered">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Name</th>
              <th scope="col">DateOfBirth</th>
              <th scope="col">Gender</th>
              <th scope="col">Class</th>
              <th scope="col">Image</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {students.map((student) => (
              <tr key={student.id}>
                <th scope="row">
                  <Link
                    className="text-black text-decoration-none"
                    to={`/student/${student.id}`}
                  >
                    {student.id}
                  </Link>
                </th>
                <td>{student.name}</td>
                <td>{student.dateofbirth}</td>
                <td>{student.gender ? "Male" : "Female"}</td>
                <td>{student.class}</td>
                <td>
                  <img
                    src={student.image}
                    alt={student.name}
                    className="rounded-circle object-fit-cover"
                    style={{ width: 40, height: 40 }}
                  />
                </td>
                <td>
                  <Link
                    className="text-decoration-none text-black"
                    to={`/student/${student.id}`}
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
