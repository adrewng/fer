# React Project Setup Guide with Vite

## Table of Contents

- [1. Install Dependencies](#1-install-dependencies)
- [2. File Structure](#2-file-structure)
  - [2.1. http.js - Axios Instance](#21-srcutilhttpjs---axios-instance)
  - [2.2. mockData.js - Mockup Data](#22-srcapimockdatajs---mockup-data)
  - [2.3. item.schema.js - Yup Validation](#23-srcschemaitemschemajs---yup-validation-schema)
- [3. App.jsx - Router Configuration](#3-appjsx---router-configuration)
- [4. Components](#4-components)
  - [4.1. ConfirmDeleteModal](#41-srccomponentsconfirmdeletemodaljsx---delete-confirmation-modal)
  - [4.2. NavBar](#42-navbar)
  - [4.3. Toast](#43-srccomponentstoastjsx---toast-notification)
  - [4.4. CreateItemModal](#44-srccomponentscreateitemmodaljsx---create-modal)
  - [4.5. EditItemModal](#45-srccomponentsedititemmodaljsx---edit-modal)
- [5. Pages](#5-pages)
  - [5.1. HomePage (Grid & Table)](#51-srcpageshomepagejsx---home-page-grid--table)
  - [5.2. ItemDetailPage](#52-srcpagesitemdetailpagejsx---detail-page)
  - [5.3. CreateItemPage - RHF](#53-srcpagescreateitempagejsx---create-page---rhf)
  - [5.4. CreateItemPage - Formik](#54-srcpagescreateitempagejsx---create-page---formik)
  - [5.5. EditItemPage - RHF](#55-srcpagesedititempagejsx---edit-page---rhf)
  - [5.6. EditItemPage - Formik](#56-srcpagesedititempagejsx---edit-page---formik)
- [6. Bootstrap Templates](#6-bootstrap-templates)
  - [6.1. Basic Grid](#61-basic-grid)
  - [6.2. Card Grid](#62-card-grid)
  - [6.3. Table with Toolbar and Pagination](#63-table-with-toolbar-and-pagination)
  - [6.4. Vertical Form](#64-vertical-form)
  - [6.5. Horizontal Form](#65-horizontal-form)
  - [6.6. Common Modal (Add/Edit)](#66-common-modal-addedit)
  - [6.7. Delete Confirmation Modal](#67-delete-confirmation-modal)
- [7. Notes](#7-notes)
- [8. Utils](#8-utils)

---

## 1. Install Dependencies

```bash
npm create vite@latest
npm i bootstrap axios react-router-dom yup
npm i formik --save

npm i react-hook-form
npm i dayjs
```

## 2. File Structure

### 2.1. `src/util/http.js` - Axios Instance

```jsx
import axios from "axios";

const URL = import.meta.env.VITE_APP_URL;

class Http {
  instance;
  constructor() {
    this.instance = axios.create({
      baseURL: URL,
      timeout: 15 * 1000,
      headers: { "Content-Type": "application/json" },
    });
  }
}

const http = new Http().instance;
export default http;
```

### 2.2. `src/api/mockData.js` - Mockup Data

```js
import http from "../util/http.js";

export const mockApi = {
  getAll() {
    return http.get("/");
  },
  getItemDetail(id) {
    return http.get(`/${id}`);
  },
  addItem(data) {
    return http.post("/", data);
  },
  updateItem(id, data) {
    return http.put(`/${id}`, data);
  },
  deleteItem(id) {
    return http.delete(`/${id}`);
  },
};

export default mockApi;
```

### 2.3. `src/schema/item.schema.js` - Yup Validation Schema

```jsx
import * as yup from "yup";

const endOfToday = () => {
  const t = new Date();
  t.setHours(23, 59, 59, 999);
  return t;
};

export const itemSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .test("min-words", "Name must have more than 1 word", (v) =>
      v ? v.trim().split(/\s+/).length > 1 : false
    )
    .test("uppercase", "Name must be uppercase", (v) =>
      v ? v === v.toUpperCase() : false
    ),
  date: yup
    .date()
    .typeError("Invalid date")
    .required("Please select a date")
    .max(endOfToday(), "Date cannot be in the future"),
  image: yup
    .string()
    .required("Image is required")
    .url("Image must be a valid URL"),
  status: yup
    .number()
    .typeError("Status must be a number")
    .required("Status is required")
    .min(1, "Min is 1")
    .max(3, "Max is 3")
    .integer("Status must be an integer"),
  isUnread: yup
    .boolean()
    .required("isUnread is required")
    .when("status", {
      is: (s) => Number(s) === 2 || Number(s) === 3,
      then: (schema) =>
        schema.oneOf([false], "isUnread must be FALSE when status is 2 or 3"),
      otherwise: (schema) =>
        schema.oneOf([true], "isUnread must be TRUE when status is 1"),
    }),
  type: yup
    .string()
    .oneOf(["Data Science", "Security", "Design"], "Invalid type")
    .required("Type is required"),
});

export default itemSchema;
```

## 3. App.jsx - Router Configuration

```jsx
import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layout/MainLayout";
import ArtToolDetailPage from "./page/ArtToolDetailPage";
import ArtToolsPage from "./page/ArtToolsPage";
import Contact from "./page/Contact";
import CreateItemPage from "./page/CreatePage";
import EditArtToolPage from "./page/EditArtToolPage";
import HomePage from "./page/HomePage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/TruongNNSE193452" element={<ArtToolsPage />} />
        <Route path="/artTool/:id" element={<ArtToolDetailPage />} />
        <Route path="/createArtTool" element={<CreateItemPage />} />
        <Route path="/updateArtTool/:id" element={<EditArtToolPage />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default App;
```

## 4. Components

### 4.1. `src/components/ConfirmDeleteModal.jsx` - Delete Confirmation Modal

```jsx
export default function ConfirmDeleteModal({
  show,
  onHide,
  handleDelete,
  itemName,
}) {
  return (
    <div
      className="modal"
      tabIndex="-1"
      style={{ display: show ? "block" : "none" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h6 className="modal-title">Confirm Delete</h6>
            <button
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="close"
              onClick={onHide}
            ></button>
          </div>
          <div className="modal-body">
            Are you sure delete{itemName ? `: ${itemName}` : ""}?
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={onHide}
            >
              Close
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 4.2 NavBar

```jsx
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
        <div className="collapse navbar-collapse" id="navMain">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Reading Books
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/TruongNNSE193452/AllBooks"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                All Books
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/TruongNNSE193452/UnReadBook"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                UnRead Books
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
```

### 4.3. `src/components/Toast.jsx` - Toast Notification

```jsx
import { useEffect, useState } from "react";

export default function Toast({ show, message, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose && onClose();
      }, 30000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, onClose]);

  if (!show && !isVisible) return null;

  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      style={{ zIndex: 11 }}
    >
      <div
        className={`toast ${
          isVisible ? "show" : ""
        } bg-success text-white border-0 shadow-lg`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="toast-body d-flex align-items-center justify-content-between">
          <span>{message || ""}</span>
          <button
            type="button"
            className="btn-close btn-close-white ms-2"
            aria-label="Close"
            onClick={() => {
              setIsVisible(false);
              onClose && onClose();
            }}
          ></button>
        </div>
      </div>
    </div>
  );
}
```

### 4.4. `src/components/CreateItemModal.jsx` - Create Modal

```jsx
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import itemApi from "../api/item.api";
import itemSchema from "../schema/item.schema";

export default function CreateItemModal({ show, onHide, onSuccess }) {
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(itemSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError("");
      await itemApi.addItem(data);
      onSuccess && onSuccess();
      onHide();
      reset();
    } catch (error) {
      setError(error?.response?.data?.message || error.message);
    }
  });

  return (
    <div
      className="modal fade"
      style={{ display: show ? "block" : "none" }}
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onHide}
            ></button>
          </div>
          <form onSubmit={onSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    {...register("bookName")}
                  />
                  {errors.bookName && (
                    <div className="form-text text-danger">
                      {errors.bookName.message}
                    </div>
                  )}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Image</label>
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
                  <label className="form-label">Status</label>
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
                <div className="col-12 col-md-6">
                  <label className="form-label">Type</label>
                  <select className="form-select" {...register("bookType")}>
                    <option>Data Science</option>
                    <option>Security</option>
                    <option>Design</option>
                  </select>
                  {errors.bookType && (
                    <div className="form-text text-danger">
                      {errors.bookType.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
                type="button"
                onClick={onHide}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
```

### 4.4. `src/components/EditItemModal.jsx` - Edit Modal

```jsx
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import itemApi from "../api/item.api";
import itemSchema from "../schema/item.schema";

export default function EditItemModal({ show, onHide, onSuccess, item }) {
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(itemSchema),
  });

  useEffect(() => {
    if (item) {
      reset({
        bookName: item.bookName || "",
        bookImage: item.bookImage || "",
        bookReadingStatus: item.bookReadingStatus || 1,
        isUnread: item.isUnread ?? true,
        bookType: item.bookType || "Data Science",
      });
    }
  }, [item, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError("");
      await itemApi.updateItem(item.id, data);
      onSuccess && onSuccess();
      onHide();
    } catch (error) {
      setError(error?.response?.data?.message || error.message);
    }
  });

  if (!item) return null;

  return (
    <div
      className="modal fade"
      style={{ display: show ? "block" : "none" }}
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onHide}
            ></button>
          </div>
          <form onSubmit={onSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    {...register("bookName")}
                  />
                  {errors.bookName && (
                    <div className="form-text text-danger">
                      {errors.bookName.message}
                    </div>
                  )}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Image</label>
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
                  <label className="form-label">Status</label>
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
                <div className="col-12 col-md-6">
                  <label className="form-label">Type</label>
                  <select className="form-select" {...register("bookType")}>
                    <option>Data Science</option>
                    <option>Security</option>
                    <option>Design</option>
                  </select>
                  {errors.bookType && (
                    <div className="form-text text-danger">
                      {errors.bookType.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
                type="button"
                onClick={onHide}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
```

## 5. Pages

### 5.1. `src/pages/HomePage.jsx` - Home Page (Grid & Table)

```jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import itemApi from "../api/item.api";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import CreateItemModal from "../components/CreateItemModal";
import EditItemModal from "../components/EditItemModal";
import Toast from "../components/Toast";

function getStatusBadge(status) {
  const statusMap = {
    1: { text: "Unread", className: "text-bg-secondary" },
    2: { text: "Reading", className: "text-bg-info" },
    3: { text: "Read", className: "text-bg-success" },
  };
  const statusInfo = statusMap[Number(status)] || {
    text: "Unknown",
    className: "text-bg-dark",
  };
  return (
    <span className={`badge ${statusInfo.className}`}>{statusInfo.text}</span>
  );
}

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [showToast, setShowToast] = useState(false);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await itemApi.getAll();
      setItems(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async () => {
    try {
      await itemApi.deleteItem(selectedItem.id);
      fetchItems();
      setShowModalDelete(false);
      setSelectedItem(null);
      setShowToast(true);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  return (
    <>
      <CreateItemModal
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
      />

      <Toast
        show={showToast}
        message="Item deleted successfully!"
        onClose={() => setShowToast(false)}
      />

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">List</h5>
          <div className="d-flex gap-2">
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn btn-sm ${
                  viewMode === "grid" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setViewMode("grid")}
              >
                Grid
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  viewMode === "table" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setViewMode("table")}
              >
                Table
              </button>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowModalAdd(true)}
            >
              Add
            </button>
          </div>
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

        {!isLoading && viewMode === "grid" && (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
            {items.map((item) => (
              <div className="col" key={item.id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={item.bookImage}
                    className="card-img-top"
                    alt={item.bookName}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.bookName}</h5>
                    <p className="card-text text-muted mb-2">{item.bookType}</p>
                    <div className="d-flex gap-2 mb-2">
                      {getStatusBadge(item.bookReadingStatus)}
                      <span className="badge text-bg-info">
                        {item.bookType}
                      </span>
                    </div>
                  </div>
                  <div className="card-footer d-flex justify-content-end gap-2">
                    <Link
                      to={`/item/${item.id}`}
                      className="btn btn-outline-secondary btn-sm"
                    >
                      View
                    </Link>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setShowModalEdit(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setShowModalDelete(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && viewMode === "table" && (
          <>
            <div className="table-responsive shadow-sm rounded-3">
              <table className="table table-hover table-striped align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "80px" }}>ID</th>
                    <th>Name</th>
                    <th style={{ width: "160px" }}>Type</th>
                    <th style={{ width: "160px" }}>Status</th>
                    <th style={{ width: "160px" }}>Image</th>
                    <th className="text-end" style={{ width: "160px" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.bookName}</td>
                      <td>{item.bookType}</td>
                      <td>{getStatusBadge(item.bookReadingStatus)}</td>
                      <td>
                        <img
                          src={item.bookImage}
                          alt={item.bookName}
                          className="rounded-circle object-fit-cover"
                          style={{ width: 40, height: 40 }}
                        />
                      </td>
                      <td className="text-end">
                        <Link
                          to={`/item/${item.id}`}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          View
                        </Link>
                        <button
                          className="btn btn-warning btn-sm ms-1"
                          onClick={() => {
                            setSelectedItem(item);
                            setShowModalEdit(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm ms-1"
                          onClick={() => {
                            setSelectedItem(item);
                            setShowModalDelete(true);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <small className="text-muted">
                Page 1/1 — {items.length} records
              </small>
            </div>
          </>
        )}
      </div>
    </>
  );
}
```

### 5.2. `src/pages/ItemDetailPage.jsx` - Detail Page

```jsx
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import bookApi from "../api/book.api";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchItem = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await bookApi.getItemDetail(id);
      setItem(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  if (isLoading)
    return (
      <div className="container py-5 d-flex justify-content-center">
        <div className="d-flex align-items-center gap-3">
          <div className="spinner-border" role="status" />
          <span className="text-muted">Loading…</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container py-4">
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <div>{error}</div>
          <button onClick={fetchItem} className="btn btn-light btn-sm">
            Try Again
          </button>
        </div>
      </div>
    );

  if (!item) return <div className="container py-4">Not Found</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-end gap-2 mt-3">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline-secondary"
        >
          ← Back
        </button>
      </div>
      <div className="row g-4">
        <div className="col-12 col-md-5 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="h-25 w-75 overflow-hidden d-flex m-auto">
              <img
                src={item.bookImage}
                alt={item.bookName}
                className="w-100 h-100 card-img object-fit-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-7 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h2 className="h4 mb-3">{item.bookName}</h2>

              <ul className="list-group list-group-flush rounded-4 overflow-hidden">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-secondary">Reading Status</span>
                  <span
                    className={
                      "badge " +
                      (Number(item.bookReadingStatus) === 1
                        ? "text-bg-secondary"
                        : Number(item.bookReadingStatus) === 2
                        ? "text-bg-info"
                        : Number(item.bookReadingStatus) === 3
                        ? "text-bg-success"
                        : "text-bg-dark")
                    }
                  >
                    {Number(item.bookReadingStatus) === 1
                      ? "Unread"
                      : Number(item.bookReadingStatus) === 2
                      ? "Reading"
                      : Number(item.bookReadingStatus) === 3
                      ? "Read"
                      : "Unknown"}
                  </span>
                </li>

                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-secondary">Is Unread</span>
                  <span
                    className={
                      "badge " +
                      (item.isUnread
                        ? "text-bg-secondary"
                        : "text-bg-light border")
                    }
                  >
                    {item.isUnread ? "True" : "False"}
                  </span>
                </li>

                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-secondary">Book Type</span>
                  <span className="fw-medium">{item.bookType || "—"}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 5.3. `src/pages/CreateItemPage.jsx` - Create Page (RHF)

```jsx
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
      await bookApi.addItem(payload);
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
            placeholder="Enter name"
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
            Cancel
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
```

### 5.4. `src/pages/CreateItemPage.jsx` - Create Page (Formik)

```jsx
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bookApi from "../api/book.api";
import bookSchema from "../schema/book.schema";

export default function CreateBookPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      bookName: "",
      bookImage: "",
      bookReadingStatus: 1,
      isUnread: true,
      bookType: "Data Science",
    },
    validationSchema: bookSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setError("");
        const payload = {
          ...values,
          bookReadingStatus: Number(values.bookReadingStatus),
        };
        await bookApi.addItem(payload);
        navigate("/TruongNNSE193452/AllBooks");
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container py-4">
      <h4 className="mb-4">Create New Book</h4>
      {error && <div className="alert alert-danger">{error}</div>}

      <form className="row g-3" onSubmit={formik.handleSubmit}>
        <div className="col-12 col-md-6">
          <label className="form-label">Book Name</label>
          <input
            type="text"
            name="bookName"
            className={`form-control ${
              formik.touched.bookName && formik.errors.bookName
                ? "is-invalid"
                : ""
            }`}
            placeholder="Enter name"
            value={formik.values.bookName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.bookName && formik.errors.bookName && (
            <div className="invalid-feedback">{formik.errors.bookName}</div>
          )}
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Book Image</label>
          <input
            type="url"
            name="bookImage"
            className={`form-control ${
              formik.touched.bookImage && formik.errors.bookImage
                ? "is-invalid"
                : ""
            }`}
            placeholder="https://..."
            value={formik.values.bookImage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.bookImage && formik.errors.bookImage && (
            <div className="invalid-feedback">{formik.errors.bookImage}</div>
          )}
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Book Reading Status</label>
          <select
            name="bookReadingStatus"
            className={`form-select ${
              formik.touched.bookReadingStatus &&
              formik.errors.bookReadingStatus
                ? "is-invalid"
                : ""
            }`}
            value={formik.values.bookReadingStatus}
            onBlur={formik.handleBlur}
            onChange={(e) => {
              const v = Number(e.target.value);
              formik.setFieldValue("bookReadingStatus", v);
              formik.setFieldValue("isUnread", v === 1);
            }}
          >
            <option value={1}>1 – Unread</option>
            <option value={2}>2 – Reading</option>
            <option value={3}>3 – Read</option>
          </select>
          {formik.touched.bookReadingStatus &&
            formik.errors.bookReadingStatus && (
              <div className="invalid-feedback d-block">
                {formik.errors.bookReadingStatus}
              </div>
            )}
        </div>

        <div className="col-12 col-md-6 form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="switchCheckIsUnread"
            checked={!!formik.values.isUnread}
            onChange={() => {}}
            disabled
          />
          <label className="form-check-label" htmlFor="switchCheckIsUnread">
            Is Unread
          </label>
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Book Type</label>
          <select
            name="bookType"
            className={`form-select ${
              formik.touched.bookType && formik.errors.bookType
                ? "is-invalid"
                : ""
            }`}
            value={formik.values.bookType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="Data Science">Data Science</option>
            <option value="Security">Security</option>
            <option value="Design">Design</option>
          </select>
          {formik.touched.bookType && formik.errors.bookType && (
            <div className="invalid-feedback d-block">
              {formik.errors.bookType}
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
            {formik.isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
```

### 5.5. `src/pages/EditItemPage.jsx` - Edit Page (RHF)

```jsx
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import bookApi from "../api/book.api";
import bookSchema from "../schema/book.schema";

export default function UpdateBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(bookSchema),
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoading(true);
        const res = await bookApi.getItemDetail(id);
        setItem(res.data);
        reset({
          bookName: res.data.bookName || "",
          bookImage: res.data.bookImage || "",
          bookReadingStatus: Number(res.data.bookReadingStatus),
          isUnread: Boolean(res.data.isUnread),
          bookType: res.data.bookType || "",
        });
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, [id, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError("");
      await bookApi.updateItem(id, data);
      navigate("/TruongNNSE193452/AllBooks");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  });

  if (isLoading) return <div className="container py-4">Loading...</div>;
  if (error && !item)
    return <div className="container py-4 alert alert-danger">{error}</div>;
  if (!item) return <div className="container py-4">Not Found</div>;

  return (
    <div className="container py-4">
      <h4 className="mb-4">Update Book</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="row g-3" onSubmit={onSubmit}>
        <div className="col-12 col-md-6">
          <label className="form-label">Book Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter name"
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
            Cancel
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
```

### 5.6. `src/pages/EditItemPage.jsx` - Edit Page (Formik)

```jsx
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import bookApi from "../api/book.api";
import bookSchema from "../schema/book.schema";

export default function UpdateBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      bookName: "",
      bookImage: "",
      bookReadingStatus: 1,
      isUnread: true,
      bookType: "Data Science",
    },
    validationSchema: bookSchema,
    validateOnChange: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setError("");
        await bookApi.updateItem(id, {
          ...values,
          bookReadingStatus: Number(values.bookReadingStatus),
        });
        navigate("/TruongNNSE193452/AllBooks");
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
        const res = await bookApi.getItemDetail(id);
        setItem(res.data);
        formik.setValues({
          bookName: res.data.bookName || "",
          bookImage: res.data.bookImage || "",
          bookReadingStatus: Number(res.data.bookReadingStatus),
          isUnread: Boolean(res.data.isUnread),
          bookType: res.data.bookType || "Data Science",
        });
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  if (isLoading) return <div className="container py-4">Loading...</div>;
  if (error && !item)
    return <div className="container py-4 alert alert-danger">{error}</div>;
  if (!item) return <div className="container py-4">Not Found</div>;

  return (
    <div className="container py-4">
      <h4 className="mb-4">Update Book</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="row g-3" onSubmit={formik.handleSubmit}>
        <div className="col-12 col-md-6">
          <label className="form-label">Book Name</label>
          <input
            type="text"
            name="bookName"
            className={`form-control ${
              formik.touched.bookName && formik.errors.bookName
                ? "is-invalid"
                : ""
            }`}
            placeholder="Enter name"
            value={formik.values.bookName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.bookName && formik.errors.bookName && (
            <div className="invalid-feedback">{formik.errors.bookName}</div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Book Image</label>
          <input
            type="url"
            name="bookImage"
            className={`form-control ${
              formik.touched.bookImage && formik.errors.bookImage
                ? "is-invalid"
                : ""
            }`}
            placeholder="https://..."
            value={formik.values.bookImage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.bookImage && formik.errors.bookImage && (
            <div className="invalid-feedback">{formik.errors.bookImage}</div>
          )}
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Book Reading Status</label>
          <select
            name="bookReadingStatus"
            className={`form-select ${
              formik.touched.bookReadingStatus &&
              formik.errors.bookReadingStatus
                ? "is-invalid"
                : ""
            }`}
            value={formik.values.bookReadingStatus}
            onBlur={formik.handleBlur}
            onChange={(e) => {
              const v = Number(e.target.value);
              formik.setFieldValue("bookReadingStatus", v);
              formik.setFieldValue("isUnread", v === 1);
            }}
          >
            <option value="1">1 – Unread</option>
            <option value="2">2 – Reading</option>
            <option value="3">3 – Read</option>
          </select>
          {formik.touched.bookReadingStatus &&
            formik.errors.bookReadingStatus && (
              <div className="invalid-feedback d-block">
                {formik.errors.bookReadingStatus}
              </div>
            )}
        </div>

        <div className="col-12 col-md-6 form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="switchCheckIsUnread"
            checked={!!formik.values.isUnread}
            onChange={() => {}}
            disabled
          />
          <label className="form-check-label" htmlFor="switchCheckIsUnread">
            Is Unread
          </label>
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Book Type</label>
          <select
            name="bookType"
            className={`form-select ${
              formik.touched.bookType && formik.errors.bookType
                ? "is-invalid"
                : ""
            }`}
            value={formik.values.bookType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="Data Science">Data Science</option>
            <option value="Security">Security</option>
            <option value="Design">Design</option>
          </select>
          {formik.touched.bookType && formik.errors.bookType && (
            <div className="invalid-feedback d-block">
              {formik.errors.bookType}
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
            {formik.isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
```

## 6. Bootstrap Templates

### 6.1. Basic Grid

```jsx
<div className="container py-4">
  <div className="row g-3">
    <div className="col-12 col-md-6 col-lg-4">
      <div className="p-3 border rounded-3 bg-light">Block A</div>
    </div>
    <div className="col-12 col-md-6 col-lg-4">
      <div className="p-3 border rounded-3 bg-light">Block B</div>
    </div>
    <div className="col-12 col-lg-4">
      <div className="p-3 border rounded-3 bg-light">Block C</div>
    </div>
  </div>

  <div className="row g-3 mt-3">
    <div className="col-md-8">
      <div className="p-3 border rounded-3">Main</div>
    </div>
    <div className="col-md-4">
      <div className="p-3 border rounded-3">Sidebar</div>
    </div>
  </div>
</div>
```

### 6.2. Card Grid

```jsx
<div className="container py-4">
  <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
    <div className="col">
      <div className="card h-100 shadow-sm">
        <img
          src="https://picsum.photos/600/400"
          className="card-img-top"
          alt="..."
        />
        <div className="card-body">
          <h5 className="card-title">Title</h5>
          <p className="card-text text-muted mb-2">Short description</p>
          <div className="d-flex gap-2">
            <span className="badge text-bg-secondary">Label A</span>
            <span className="badge text-bg-info">Label B</span>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end gap-2">
          <button className="btn btn-outline-secondary btn-sm">View</button>
          <button className="btn btn-primary btn-sm">Edit</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 6.3. Table with Toolbar and Pagination

```jsx
<div className="container py-4">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h5 className="mb-0">List</h5>
    <div className="d-flex gap-2">
      <input className="form-control form-control-sm" placeholder="Search..." />
      <button className="btn btn-primary btn-sm">Add</button>
    </div>
  </div>

  <div className="table-responsive shadow-sm rounded-3">
    <table className="table table-hover table-striped align-middle mb-0">
      <thead className="table-light">
        <tr>
          <th style={{ width: "80px" }}>ID</th>
          <th>Name</th>
          <th style={{ width: "160px" }}>Type</th>
          <th style={{ width: "160px" }}>Status</th>
          <th className="text-end" style={{ width: "160px" }}>
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1001</td>
          <td>Item A</td>
          <td>Group 1</td>
          <td>
            <span className="badge text-bg-success">Active</span>
          </td>
          <td className="text-end">
            <button className="btn btn-outline-secondary btn-sm">View</button>
            <button className="btn btn-warning btn-sm">Edit</button>
            <button className="btn btn-danger btn-sm">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div className="d-flex justify-content-between align-items-center mt-3">
    <small className="text-muted">Page 1/10 — 100 records</small>
    <ul className="pagination pagination-sm mb-0">
      <li className="page-item disabled">
        <a className="page-link">Previous</a>
      </li>
      <li className="page-item active">
        <a className="page-link">1</a>
      </li>
      <li className="page-item">
        <a className="page-link">2</a>
      </li>
      <li className="page-item">
        <a className="page-link">Next</a>
      </li>
    </ul>
  </div>
</div>
```

### 6.4. Vertical Form

```jsx
<div className="container py-4">
  <form className="row g-3">
    <div className="col-12 col-md-6">
      <label className="form-label">Name</label>
      <input type="text" className="form-control" placeholder="Enter name" />
      <div className="form-text text-danger">Error message</div>
    </div>
    <div className="col-12 col-md-6">
      <label className="form-label">Image</label>
      <input type="url" className="form-control" placeholder="https://..." />
    </div>
    <div className="col-12 col-md-6">
      <label className="form-label">Status</label>
      <select className="form-select">
        <option value="1">1 – Unread</option>
        <option value="2">2 – Reading</option>
        <option value="3">3 – Read</option>
      </select>
    </div>
    <div className="col-12 col-md-6">
      <label className="form-label">Type</label>
      <select className="form-select">
        <option>Data Science</option>
        <option>Security</option>
        <option>Design</option>
      </select>
    </div>
    <div className="col-12">
      <label className="form-label">Description</label>
      <textarea
        className="form-control"
        rows="3"
        placeholder="Description..."
      ></textarea>
    </div>
    <div className="col-12 d-flex justify-content-end gap-2">
      <button type="button" className="btn btn-outline-secondary">
        Cancel
      </button>
      <button type="submit" className="btn btn-primary">
        Save
      </button>
    </div>
  </form>
</div>
```

### 6.5. Horizontal Form

```jsx
<div className="container py-4">
  <form>
    <div className="row mb-3">
      <label className="col-sm-2 col-form-label">Name</label>
      <div className="col-sm-10">
        <input className="form-control" />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-sm-2 col-form-label">Status</label>
      <div className="col-sm-10">
        <select className="form-select">
          <option value="1">1 – Unread</option>
          <option value="2">2 – Reading</option>
          <option value="3">3 – Read</option>
        </select>
      </div>
    </div>
    <div className="d-flex justify-content-end gap-2">
      <button className="btn btn-outline-secondary" type="button">
        Cancel
      </button>
      <button className="btn btn-primary" type="submit">
        Save
      </button>
    </div>
  </form>
</div>
```

### 6.6. Common Modal (Add/Edit)

```jsx
<button
  className="btn btn-primary"
  data-bs-toggle="modal"
  data-bs-target="#exampleModal"
>
  Open Modal
</button>

<div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Title</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div className="modal-body">
        <div className="mb-3">
          <label className="form-label">Field</label>
          <input className="form-control" />
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-outline-secondary" data-bs-dismiss="modal">
          Cancel
        </button>
        <button className="btn btn-primary">Confirm</button>
      </div>
    </div>
  </div>
</div>
```

### 6.7. Delete Confirmation Modal

```jsx
<div
  className="modal fade"
  id="confirmDeleteModal"
  tabIndex="-1"
  aria-hidden="true"
>
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h6 className="modal-title">Confirm Delete</h6>
        <button
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div className="modal-body">
        Are you sure you want to delete this item?
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" data-bs-dismiss="modal">
          Cancel
        </button>
        <button className="btn btn-danger">Delete</button>
      </div>
    </div>
  </div>
</div>
```

## 7. Notes

- Make sure `src/main.jsx` imports Bootstrap CSS: `import "bootstrap/dist/css/bootstrap.min.css";`

## 8. Utils

```js
export function formatLimitedTimeDeal(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return null;
  let pct = n <= 1 ? Math.round(n * 100) : Math.round(n);
  pct = Math.min(100, Math.max(1, pct));
  if (Object.is(pct, -0)) pct = 0;
  return `${pct}%`;
}

export function formatMinute(seconds, opts = { lessThanOne: "< 1 minute" }) {
  const n = Number(seconds);
  if (!Number.isFinite(n) || n < 0) return "";
  const min = Math.floor(n / 60);
  if (min === 0 && n > 0) return opts.lessThanOne ?? "0 minutes";
  const unit = min === 1 ? "minute" : "minutes";
  return `${min.toLocaleString("en-US")} ${unit}`;
}

function isValidDate(d) {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

function parseToYMD(input) {
  if (!input) return null;

  if (input instanceof Date) {
    if (!isValidDate(input)) return null;
    return {
      y: input.getFullYear(),
      m: String(input.getMonth() + 1).padStart(2, "0"),
      d: String(input.getDate()).padStart(2, "0"),
    };
  }

  if (
    typeof input === "number" ||
    (/^\d+$/.test(String(input)) && String(input).length >= 10)
  ) {
    const n = Number(input);
    const d = new Date(n);
    if (!isValidDate(d)) return null;
    return {
      y: d.getFullYear(),
      m: String(d.getMonth() + 1).padStart(2, "0"),
      d: String(d.getDate()).padStart(2, "0"),
    };
  }

  if (typeof input === "string") {
    const s = input.trim();
    const m1 = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
    if (m1) {
      const [_, dd, mm, yyyy] = m1;
      const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      if (!isValidDate(d)) return null;
      return {
        y: d.getFullYear(),
        m: String(d.getMonth() + 1).padStart(2, "0"),
        d: String(d.getDate()).padStart(2, "0"),
      };
    }
    const m2 = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (m2) {
      const [_, yyyy, mm, dd] = m2;
      const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      if (!isValidDate(d)) return null;
      return { y: yyyy, m: mm, d: dd };
    }

    const d = new Date(s);
    if (!isValidDate(d)) return null;
    return {
      y: d.getFullYear(),
      m: String(d.getMonth() + 1).padStart(2, "0"),
      d: String(d.getDate()).padStart(2, "0"),
    };
  }
  return null;
}

export function toDMY(input) {
  const ymd = parseToYMD(input);
  if (!ymd) return "";
  return `${ymd.d}/${ymd.m}/${ymd.y}`;
}

export function toInputDate(input) {
  const ymd = parseToYMD(input);
  if (!ymd) return "";
  return `${ymd.y}-${ymd.m}-${ymd.d}`;
}
```
