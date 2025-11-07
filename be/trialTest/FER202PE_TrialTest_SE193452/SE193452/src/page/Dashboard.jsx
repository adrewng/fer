import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import studentApi from "../api/student.api";
// import { useNavigate } from "react-router-dom";
import AddStrudentModal from "../components/AddStrudentModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import EditStudentModal from "../components/EditStudentModal";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [showModalAddStudent, setShowModalAddStudent] = useState(false);
  const [showModalDeleteStudent, setShowModalDeleteStudent] = useState(false);
  const [studentTarget, setStudentTarget] = useState(-1);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  // const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const res = await studentApi.getStudents();
      setStudents(res.data);
    } catch (e) {
      setErrors(e?.response?.data?.message || e.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteStudent = async (id) => {
    try {
      await studentApi.deleteStudent(id);
      fetchStudents();
      setShowModalDeleteStudent(false);
      setStudentTarget(-1);
    } catch (e) {
      setErrors(e?.response?.data?.message || e.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);
  return (
    <>
      <AddStrudentModal
        show={showModalAddStudent}
        onHide={() => setShowModalAddStudent(false)}
        onSuccess={() => fetchStudents()}
      />
      <ConfirmDeleteModal
        show={showModalDeleteStudent}
        onHide={() => setShowModalDeleteStudent(false)}
        handleDeleteStudent={() => handleDeleteStudent(studentTarget)}
      />
      <EditStudentModal
        show={showModalEdit}
        onHide={() => setShowModalEdit(false)}
        onSuccess={() => fetchStudents()}
        student={selectedStudent}
      />
      <div className="container py-4">
        <div className="mb-3 text-end">
          <button
            className="btn btn-outline-secondary btn-sm text-black"
            onClick={() => setShowModalAddStudent(true)}
          >
            Add Student
          </button>
        </div>
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
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-danger btn-sm text-decoration-none text-black"
                        onClick={() => {
                          setShowModalDeleteStudent(true);
                          setStudentTarget(student.id);
                        }}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-warning btn-sm text-decoration-none text-black"
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowModalEdit(true);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
