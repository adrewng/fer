import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import lessonApi from "../api/lesson.api";
import lessonSchema from "../schema/lesson.schema";

export default function UpdateLesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      lessonTitle: "",
      lessonImage: "",
      estimatedTime: 0,
      isCompleted: false,
      level: "",
    },
    validationSchema: lessonSchema,
    validateOnChange: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setError("");
        await lessonApi.updateItem(id, {
          ...values,
          isCompleted: Boolean(values.isCompleted),
          estimatedTime: Number(values.estimatedTime),
        });
        navigate("/se193452/all-lessons");
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        setError("");
        const res = await lessonApi.getItemDetail(id);
        setItem(res.data);
        formik.setValues({
          lessonTitle: res.data.lessonTitle || "",
          lessonImage: res.data.lessonImage || "",
          estimatedTime: Number(res.data.estimatedTime),
          isCompleted: Boolean(res.data.isCompleted),
          level: res.data.level || "N5",
        });
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading) return <div className="container py-4">Loading...</div>;
  if (error && !item)
    return <div className="container py-4 alert alert-danger">{error}</div>;
  if (!item) return <div className="container py-4">Not Found</div>;

  return (
    <div className="container py-4">
      <h4 className="mb-4">Update Lesson</h4>
      {error && <div className="alert alert-danger">{error}</div>}

      <form className="row g-3" onSubmit={formik.handleSubmit}>
        <div className="col-12 col-md-6">
          <label className="form-label">Lesson Title</label>
          <input
            type="text"
            name="lessonTitle"
            className={`form-control ${
              formik.touched.lessonTitle && formik.errors.lessonTitle
                ? "is-invalid"
                : ""
            }`}
            placeholder="Nhập tên"
            value={formik.values.lessonTitle}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.lessonTitle && formik.errors.lessonTitle && (
            <div className="invalid-feedback">{formik.errors.lessonTitle}</div>
          )}
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Lesson Image</label>
          <input
            type="url"
            name="lessonImage"
            className={`form-control ${
              formik.touched.lessonImage && formik.errors.lessonImage
                ? "is-invalid"
                : ""
            }`}
            placeholder="https://..."
            value={formik.values.lessonImage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.lessonImage && formik.errors.lessonImage && (
            <div className="invalid-feedback">{formik.errors.lessonImage}</div>
          )}
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Level</label>
          <select
            name="level"
            className={`form-select ${
              formik.touched.level && formik.errors.level ? "is-invalid" : ""
            }`}
            value={formik.values.level}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          >
            <option value="N1">N1</option>
            <option value="N2">N2</option>
            <option value="N3">N3</option>
            <option value="N4">N4</option>
            <option value="N5">N5</option>
          </select>
          {formik.touched.level && formik.errors.level && (
            <div className="invalid-feedback d-block">
              {formik.errors.level}
            </div>
          )}
        </div>

        <div className="col-12 col-md-6 form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            name="isCompleted"
            id="switchCheckisCompleted"
            checked={!!formik.values.isCompleted}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <label className="form-check-label" htmlFor="switchCheckisCompleted">
            Is Completed
          </label>
          {formik.touched.isCompleted && formik.errors.isCompleted && (
            <div className="invalid-feedback d-block">
              {formik.errors.isCompleted}
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Estimated Time</label>
          <input
            type="number"
            name="estimatedTime"
            className={`form-control ${
              formik.touched.estimatedTime && formik.errors.estimatedTime
                ? "is-invalid"
                : ""
            }`}
            placeholder="Nhập tên"
            value={formik.values.estimatedTime}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.estimatedTime && formik.errors.estimatedTime && (
            <div className="invalid-feedback">
              {formik.errors.estimatedTime}
            </div>
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
            {formik.isSubmitting ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
