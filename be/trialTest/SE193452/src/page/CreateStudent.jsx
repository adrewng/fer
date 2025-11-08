import dayjs from "dayjs";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import studentApi from "../api/student.api";
import studentSchema from "../schema/student.schema";

export default function CreateStudent() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      image: "",
      gender: true,
      dateofbirth: "",
      feedback: "",
      class: "",
    },
    validationSchema: studentSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setError("");
        const payload = {
          ...values,
          dateofbirth: dayjs(values.dateofbirth).format("DD/MM/YYYY"),
        };
        await studentApi.addItem(payload);
        navigate("/management");
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container py-4">
      <h4 className="mb-4">Create New Student</h4>
      {error && <div className="alert alert-danger">{error}</div>}

      <form className="row g-3" onSubmit={formik.handleSubmit}>
        {/* Book Name */}
        <div className="col-12 col-md-6">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className={`form-control ${
              formik.touched.name && formik.errors.name ? "is-invalid" : ""
            }`}
            placeholder="Nhập tên"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="invalid-feedback">{formik.errors.name}</div>
          )}
        </div>

        {/* Book Image */}
        <div className="col-12 col-md-6">
          <label className="form-label">Image</label>
          <input
            type="url"
            name="image"
            className={`form-control ${
              formik.touched.image && formik.errors.image ? "is-invalid" : ""
            }`}
            placeholder="https://..."
            value={formik.values.image}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.image && formik.errors.image && (
            <div className="invalid-feedback">{formik.errors.image}</div>
          )}
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Gender</label>
          <select
            name="gender"
            className={`form-select ${
              formik.touched.gender && formik.errors.gender ? "is-invalid" : ""
            }`}
            value={formik.values.gender}
            onBlur={formik.handleBlur}
            onChange={formik.onChange}
          >
            <option value={true}>Male</option>
            <option value={false}>Female</option>
          </select>
          {formik.touched.gender && formik.errors.gender && (
            <div className="invalid-feedback d-block">
              {formik.errors.gender}
            </div>
          )}
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            name="dateofbirth"
            className={`form-control ${
              formik.touched.dateofbirth && formik.errors.dateofbirth
                ? "is-invalid"
                : ""
            }`}
            value={formik.values.dateofbirth}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.dateofbirth && formik.errors.dateofbirth && (
            <div className="invalid-feedback">{formik.errors.dateofbirth}</div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Class</label>
          <input
            type="text"
            name="class"
            className={`form-control ${
              formik.touched.class && formik.errors.class ? "is-invalid" : ""
            }`}
            value={formik.values.class}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.class && formik.errors.class && (
            <div className="invalid-feedback">{formik.errors.class}</div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="floatingTextarea">
            FeedBack
          </label>
          <textarea
            id="floatingTextarea"
            name="feedback"
            className={`form-control ${
              formik.touched.feedback && formik.errors.feedback
                ? "is-invalid"
                : ""
            }`}
            value={formik.values.feedback}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.feedback && formik.errors.feedback && (
            <div className="invalid-feedback">{formik.errors.feedback}</div>
          )}
        </div>

        <div className="col-12 d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
            disabled={formik.isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
