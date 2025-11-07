import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import studentApi from "../api/student.api";
import studentSchema from "../schema/student.schema";

const toDMY = (input) => {
  const d = typeof input === "string" ? new Date(input) : input;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const toInputDate = (s) => {
  // Accepts "DD/MM/YYYY" or ISO/date string, returns "YYYY-MM-DD" for <input type="date">
  if (!s) return "";
  if (s.includes("/")) {
    const [dd, mm, yyyy] = s.split("/");
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  const d = new Date(s);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

export default function EditStudentModal({ show, onHide, onSuccess, student }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(studentSchema),
    defaultValues: {
      name: "",
      dateofbirth: "",
      gender: false,
      class: "",
      image: "",
      feedback: "",
    },
  });

  useEffect(() => {
    if (!student) return;
    reset({
      name: student.name || "",
      dateofbirth: toInputDate(student.dateofbirth),
      gender: Boolean(student.gender),
      class: student.class || "",
      image: student.image || "",
      feedback: student.feedback || "",
    });
  }, [student, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      gender: data.gender === true || data.gender === "true",
      dateofbirth: toDMY(data.dateofbirth),
    };
    await studentApi.updateStudent(student.id, payload);
    onSuccess && onSuccess();
    onHide();
  });

  return (
    <div
      className="modal"
      tabIndex="-1"
      style={{ display: show ? "block" : "none" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Student</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onHide}
            />
          </div>
          <form onSubmit={onSubmit}>
            <div className="modal-body p-4 row row-cols-1 row-cols-md-2 g-3">
              <div className="col">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-danger">{errors.name.message}</p>
                )}
              </div>
              <div className="col">
                <label htmlFor="dateofbirth" className="form-label">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="dateofbirth"
                  {...register("dateofbirth")}
                />
                {errors.dateofbirth && (
                  <p className="text-danger">{errors.dateofbirth.message}</p>
                )}
              </div>
              <div className="col">
                <label htmlFor="gender" className="form-label">
                  Gender
                </label>
                <select
                  className="form-control"
                  id="gender"
                  {...register("gender")}
                >
                  <option value="true">Male</option>
                  <option value="false">Female</option>
                </select>
                {errors.gender && (
                  <p className="text-danger">{errors.gender.message}</p>
                )}
              </div>
              <div className="col">
                <label htmlFor="class" className="form-label">
                  Class
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="class"
                  {...register("class")}
                />
                {errors.class && (
                  <p className="text-danger">{errors.class.message}</p>
                )}
              </div>
              <div className="col">
                <label htmlFor="image" className="form-label">
                  Image
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="image"
                  {...register("image")}
                />
                {errors.image && (
                  <p className="text-danger">{errors.image.message}</p>
                )}
              </div>
              <div className="col">
                <label htmlFor="feedback" className="form-label">
                  Feedback
                </label>
                <textarea
                  className="form-control"
                  id="feedback"
                  {...register("feedback")}
                />
                {errors.feedback && (
                  <p className="text-danger">{errors.feedback.message}</p>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
