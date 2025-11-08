import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import bookApi from "../api/book.api";
import bookSchema from "../schema/book.schema";

export default function CreateBookPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(bookSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError("");
      const payload = {
        ...data,
        bookReadingStatus: Number(data.bookReadingStatus),
      };
      await bookApi.createItem(payload);
      navigate("/TruongNNSE193452/AllBooks");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  });

  return (
    <div className="container py-4">
      <h4 className="mb-4">Create New Book</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="row g-3" onSubmit={onSubmit}>
        <div className="col-12 col-md-6">
          <label className="form-label">Book Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tên"
            {...register("bookName")}
          />
          {errors.bookName && (
            <div className="form-text text-danger">
              {errors.bookName.message}
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Book Image</label>
          <input
            type="url"
            className="form-control"
            placeholder="https://..."
            {...register("bookImage")}
          />
          {errors.bookImage && (
            <div className="form-text text-danger">
              {errors.bookImage.message}
            </div>
          )}
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Book Reading Status</label>
          <select
            className="form-select"
            {...register("bookReadingStatus", {
              valueAsNumber: true,
              onChange: (e) =>
                setValue("isUnread", Number(e.target.value) === 1),
            })}
          >
            <option value="1">1 – Unread</option>
            <option value="2">2 – Reading</option>
            <option value="3">3 – Read</option>
          </select>
          {errors.bookReadingStatus && (
            <div className="form-text text-danger">
              {errors.bookReadingStatus.message}
            </div>
          )}
        </div>
        <div className="col-12 col-md-6 form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="switchCheckChecked"
            {...register("isUnread")}
            disabled
          />
          <label className="form-check-label" htmlFor="switchCheckChecked">
            Is Unread
          </label>
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Book Type</label>
          <select className="form-select" {...register("bookType")}>
            <option value="Data Science">Data Science</option>
            <option value="Security">Security</option>
            <option value="Design">Design</option>
          </select>
          {errors.bookType && (
            <div className="form-text text-danger">
              {errors.bookType.message}
            </div>
          )}
        </div>
        <div className="col-12 d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            Cancle
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
