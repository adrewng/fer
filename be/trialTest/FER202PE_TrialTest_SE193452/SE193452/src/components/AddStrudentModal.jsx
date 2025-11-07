/* eslint-disable no-unused-vars */
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import studentApi from "../api/student.api";
import studentSchema from "../schema/student.schema";
const toDMY = (input) => {
  const d = typeof input === "string" ? new Date(input) : input; // chấp nhận cả 'yyyy-mm-dd' hoặc Date
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export default function AddStrudentModal({ show, onHide, onSuccess }) {
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
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
  const onSubmit = handleSubmit(async (data) => {
    try {
      setError("");
      const payload = {
        ...data,
        gender: data.gender === "true",
        dateofbirth: toDMY(data.dateofbirth),
      };
      await studentApi.createStudent(payload);
      onSuccess && onSuccess();
      onHide();
      reset();
    } catch (error) {
      setError(error?.response?.data?.message || error.message);
    }
  });
  return (
    <div
      className="modal"
      tabIndex="-1"
      style={{ display: show ? "block" : "none" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header flex-column">
            <div className="d-flex justify-content-between align-items-center w-100">
              <h5 className="modal-title">Add Student</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onHide}
              />
            </div>
            {error && <div className="text-danger mt-3 w-100">{error}</div>}
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
                {isSubmitting ? "Adding..." : "Add Student"}
                Add Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
