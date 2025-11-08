# Hướng dẫn Setup Project React với Vite

## 📑 Mục lục (Table of Contents)

- [1. Cài đặt Dependencies](#1-cài-đặt-dependencies)
- [2. Cấu trúc File](#2-cấu-trúc-file)
  - [2.1. http.js - Axios Instance](#21-srcutilhttpjs---axios-instance)
  - [2.2. mockData.js - Mockup Data](#22-srcapimockdatajs---mockup-data)
  - [2.3. item.schema.js - Yup Validation](#23-srcschemaitemschemajs---yup-validation-schema)
- [3. App.jsx - Router Configuration](#3-appjsx---router-configuration)
- [4. Components](#4-components)
  - [4.1. ConfirmDeleteModal](#41-srccomponentsconfirmdeletemodaljsx---modal-xác-nhận-xóa)
  - [4.2. NavBar](#42-navbar)
  - [4.3. CreateItemModal](#43-srccomponentscreateitemmodaljsx---modal-tạo-mới)
  - [4.3. EditItemModal](#43-srccomponentsedititemmodaljsx---modal-chỉnh-sửa)
- [5. Pages](#5-pages)
  - [5.1. HomePage (Grid & Table)](#51-srcpageshomepagejsx---trang-chủ-grid--table)
  - [5.2. ItemDetailPage](#52-srcpagesitemdetailpagejsx---trang-chi-tiết)
  - [5.3. CreateItemPage - RHF](#53-srcpagescreateitempagejsx---trang-tạo-mới-page-version---rhf)
  - [5.4. CreateItemPage - FORMILK](#54-srcpagescreateitempagejsx---trang-tạo-mới-page-version---formilk)
  - [5.5. EditItemPage - RHF](#55-srcpagesedititempagejsx---trang-chỉnh-sửa-page-version---rhf)
  - [5.6. EditItemPage - FORMILK](#56-srcpagesedititempagejsx---trang-chỉnh-sửa-page-version---formilk)
- [6. Bootstrap Templates](#6-bootstrap-templates---bộ-template-dán-là-dùng-jsx)
  - [6.1. Grid cơ bản](#61-grid-cơ-bản)
  - [6.2. Card grid](#62-card-grid-danh-sách-thẻ)
  - [6.3. Bảng + thanh công cụ + phân trang](#63-bảng--thanh-công-cụ--phân-trang)
  - [6.4. Form dọc (vertical)](#64-form-dọc-vertical)
  - [6.5. Form ngang (horizontal)](#65-form-ngang-horizontal)
  - [6.6. Modal chung (thêm/sửa)](#66-modal-chung-thêmsửa)
  - [6.7. Modal xác nhận xóa](#67-modal-xác-nhận-xóa)
- [7. Lưu Ý](#7-lưu-ý)

---

## 1. Cài đặt Dependencies

```bash
npm create vite@latest
npm i bootstrap axios react-router-dom react-hook-form yup @hookform/resolvers
npm i formik
npm i dayjs
```

## 2. Cấu trúc File

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
  date:: yup
    .date()
    .typeError("Date is invalid")
    .max(dayjs().endOf("day").toDate(), "Date must be past or now")
    .required("Date is required"),
  image: yup
    .string()
    .required("Image is required")
    .url("Image must be a valid URL"),
  status: yup
    .number()
    .typeError("status must be a number")
    .required("status is required")
    .min(1, "Min is 1")
    .max(3, "Max is 3"),
  isUnread: yup
    .boolean()
    .required()
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

### 4.1. `src/components/ConfirmDeleteModal.jsx` - Modal Xác nhận Xóa

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

### 4.3. `src/components/CreateItemModal.jsx` - Modal Tạo Mới

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
      await itemApi.createItem(data);
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
            <h5 className="modal-title">Thêm mới</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Đóng"
              onClick={onHide}
            ></button>
          </div>
          <form onSubmit={onSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Tên</label>
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
                  <label className="form-label">Ảnh</label>
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
                  <label className="form-label">Trạng thái</label>
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
                  <label className="form-label">Loại</label>
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

### 4.3. `src/components/EditItemModal.jsx` - Modal Chỉnh Sửa

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
              aria-label="Đóng"
              onClick={onHide}
            ></button>
          </div>
          <form onSubmit={onSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Tên</label>
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
                  <label className="form-label">Ảnh</label>
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
                  <label className="form-label">Trạng thái</label>
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
                  <label className="form-label">Loại</label>
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

### 5.1. `src/pages/HomePage.jsx` - Trang Chủ (Grid & Table)

```jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import itemApi from "../api/item.api";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import CreateItemModal from "../components/CreateItemModal";
import EditItemModal from "../components/EditItemModal";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await itemApi.getAllItems();
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

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Danh sách</h5>
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
              Thêm
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

        {/* Grid View */}
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
                      Xem
                    </Link>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setShowModalEdit(true);
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setShowModalDelete(true);
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {!isLoading && viewMode === "table" && (
          <>
            <div className="table-responsive shadow-sm rounded-3">
              <table className="table table-hover table-striped align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "80px" }}>ID</th>
                    <th>Tên</th>
                    <th style={{ width: "160px" }}>Loại</th>
                    <th style={{ width: "160px" }}>Trạng thái</th>
                    <th style={{ width: "160px" }}>Hình</th>
                    <th className="text-end" style={{ width: "160px" }}>
                      Thao tác
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
                          src={student.image}
                          alt={student.name}
                          className="rounded-circle object-fit-cover"
                          style={{ width: 40, height: 40 }}
                        />
                      </td>
                      <td className="text-end">
                        <Link
                          to={`/item/${item.id}`}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          Xem
                        </Link>
                        <button
                          className="btn btn-warning btn-sm ms-1"
                          onClick={() => {
                            setSelectedItem(item);
                            setShowModalEdit(true);
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-danger btn-sm ms-1"
                          onClick={() => {
                            setSelectedItem(item);
                            setShowModalDelete(true);
                          }}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <small className="text-muted">
                Trang 1/1 — {items.length} bản ghi
              </small>
            </div>
          </>
        )}
      </div>
    </>
  );
}
```

### 5.2. `src/pages/ItemDetailPage.jsx` - Trang Chi Tiết

```jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import bookApi from "../api/book.api";

export default function BookDetailPage() {
  const { id } = useParams();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading)
    return (
      <div className="container py-5 d-flex justify-content-center">
        <div className="d-flex align-items-center gap-3">
          <div className="spinner-border" role="status" />
          <span className="text-muted">Đang tải…</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container py-4">
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <div>{error}</div>
          <button onClick={fetchItem} className="btn btn-light btn-sm">
            Thử lại
          </button>
        </div>
      </div>
    );

  if (!item) return <div className="container py-4">Không tìm thấy</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-end gap-2 mt-3">
        <Link to={-1} className="btn btn-outline-secondary">
          ← Quay lại
        </Link>
      </div>
      <div className="row g-4">
        {/* Ảnh */}
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

        {/* Thông tin */}
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

### 5.3. `src/pages/CreateItemPage.jsx` - Trang Tạo Mới (Page Version - RHF)

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
```

### 5.4. `src/pages/CreateItemPage.jsx` - Trang Tạo Mới (Page Version - Formilk)

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
        await bookApi.createItem(payload);
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
        {/* Book Name */}
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
            placeholder="Nhập tên"
            value={formik.values.bookName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.bookName && formik.errors.bookName && (
            <div className="invalid-feedback">{formik.errors.bookName}</div>
          )}
        </div>

        {/* Book Image */}
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

        {/* Book Reading Status */}
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

        {/* Switch Is Unread (disabled) */}
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

        {/* Book Type */}
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

### 5.5. `src/pages/EditItemPage.jsx` - Trang Chỉnh Sửa (Page Version - RHF)

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

  if (isLoading) return <div className="container py-4">Đang tải...</div>;
  if (error && !item)
    return <div className="container py-4 alert alert-danger">{error}</div>;
  if (!item) return <div className="container py-4">Không tìm thấy</div>;

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
```

### 5.6. `src/pages/EditItemPage.jsx` - Trang Chỉnh Sửa (Page Version - FORMILK)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading) return <div className="container py-4">Đang tải...</div>;
  if (error && !item)
    return <div className="container py-4 alert alert-danger">{error}</div>;
  if (!item) return <div className="container py-4">Không tìm thấy</div>;

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
            placeholder="Nhập tên"
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

        {/* Book Type */}
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

## 6. Bootstrap Templates - Bộ template dán-là-dùng (JSX)

> **Lưu ý**: Các template này đã được chuyển đổi sang JSX format, có thể copy-paste trực tiếp vào project.

### 6.1. Grid cơ bản

```jsx
<div className="container py-4">
  <div className="row g-3">
    <div className="col-12 col-md-6 col-lg-4">
      <div className="p-3 border rounded-3 bg-light">Khối A</div>
    </div>
    <div className="col-12 col-md-6 col-lg-4">
      <div className="p-3 border rounded-3 bg-light">Khối B</div>
    </div>
    <div className="col-12 col-lg-4">
      <div className="p-3 border rounded-3 bg-light">Khối C</div>
    </div>
  </div>

  {/* Ví dụ grid 2 cột cố định */}
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

### 6.2. Card grid (danh sách thẻ)

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
          <h5 className="card-title">Tiêu đề</h5>
          <p className="card-text text-muted mb-2">Mô tả ngắn</p>
          <div className="d-flex gap-2">
            <span className="badge text-bg-secondary">Nhãn A</span>
            <span className="badge text-bg-info">Nhãn B</span>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end gap-2">
          <button className="btn btn-outline-secondary btn-sm">Xem</button>
          <button className="btn btn-primary btn-sm">Sửa</button>
        </div>
      </div>
    </div>
    {/* Lặp thêm .col cho nhiều thẻ */}
  </div>
</div>
```

### 6.3. Bảng + thanh công cụ + phân trang

```jsx
<div className="container py-4">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h5 className="mb-0">Danh sách</h5>
    <div className="d-flex gap-2">
      <input
        className="form-control form-control-sm"
        placeholder="Tìm kiếm..."
      />
      <button className="btn btn-primary btn-sm">Thêm</button>
    </div>
  </div>

  <div className="table-responsive shadow-sm rounded-3">
    <table className="table table-hover table-striped align-middle mb-0">
      <thead className="table-light">
        <tr>
          <th style={{ width: "80px" }}>ID</th>
          <th>Tên</th>
          <th style={{ width: "160px" }}>Loại</th>
          <th style={{ width: "160px" }}>Trạng thái</th>
          <th className="text-end" style={{ width: "160px" }}>
            Thao tác
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1001</td>
          <td>Mục A</td>
          <td>Nhóm 1</td>
          <td>
            <span className="badge text-bg-success">Hoạt động</span>
          </td>
          <td className="text-end">
            <button className="btn btn-outline-secondary btn-sm">Xem</button>
            <button className="btn btn-warning btn-sm">Sửa</button>
            <button className="btn btn-danger btn-sm">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div className="d-flex justify-content-between align-items-center mt-3">
    <small className="text-muted">Trang 1/10 — 100 bản ghi</small>
    <ul className="pagination pagination-sm mb-0">
      <li className="page-item disabled">
        <a className="page-link">Trước</a>
      </li>
      <li className="page-item active">
        <a className="page-link">1</a>
      </li>
      <li className="page-item">
        <a className="page-link">2</a>
      </li>
      <li className="page-item">
        <a className="page-link">Sau</a>
      </li>
    </ul>
  </div>
</div>
```

### 6.4. Form dọc (vertical)

```jsx
<div className="container py-4">
  <form className="row g-3">
    <div className="col-12 col-md-6">
      <label className="form-label">Tên</label>
      <input type="text" className="form-control" placeholder="Nhập tên" />
      <div className="form-text text-danger">Thông báo lỗi</div>
    </div>
    <div className="col-12 col-md-6">
      <label className="form-label">Ảnh</label>
      <input type="url" className="form-control" placeholder="https://..." />
    </div>
    <div className="col-12 col-md-6">
      <label className="form-label">Trạng thái</label>
      <select className="form-select">
        <option value="1">1 – Unread</option>
        <option value="2">2 – Reading</option>
        <option value="3">3 – Read</option>
      </select>
    </div>
    <div className="col-12 col-md-6">
      <label className="form-label">Loại</label>
      <select className="form-select">
        <option>Data Science</option>
        <option>Security</option>
        <option>Design</option>
      </select>
    </div>
    <div className="col-12">
      <label className="form-label">Mô tả</label>
      <textarea
        className="form-control"
        rows="3"
        placeholder="Mô tả..."
      ></textarea>
    </div>
    <div className="col-12 d-flex justify-content-end gap-2">
      <button type="button" className="btn btn-outline-secondary">
        Hủy
      </button>
      <button type="submit" className="btn btn-primary">
        Lưu
      </button>
    </div>
  </form>
</div>
```

### 6.5. Form ngang (horizontal)

```jsx
<div className="container py-4">
  <form>
    <div className="row mb-3">
      <label className="col-sm-2 col-form-label">Tên</label>
      <div className="col-sm-10">
        <input className="form-control" />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-sm-2 col-form-label">Trạng thái</label>
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
        Hủy
      </button>
      <button className="btn btn-primary" type="submit">
        Lưu
      </button>
    </div>
  </form>
</div>
```

### 6.6. Modal chung (thêm/sửa)

```jsx
<button
  className="btn btn-primary"
  data-bs-toggle="modal"
  data-bs-target="#exampleModal"
>
  Mở modal
</button>

<div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Tiêu đề</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Đóng"
        ></button>
      </div>
      <div className="modal-body">
        {/* Nội dung/biểu mẫu */}
        <div className="mb-3">
          <label className="form-label">Trường</label>
          <input className="form-control" />
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-outline-secondary" data-bs-dismiss="modal">
          Hủy
        </button>
        <button className="btn btn-primary">Xác nhận</button>
      </div>
    </div>
  </div>
</div>
```

### 6.7. Modal xác nhận xóa

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
        <h6 className="modal-title">Xác nhận xóa</h6>
        <button
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Đóng"
        ></button>
      </div>
      <div className="modal-body">Bạn chắc chắn muốn xóa mục này?</div>
      <div className="modal-footer">
        <button className="btn btn-secondary" data-bs-dismiss="modal">
          Hủy
        </button>
        <button className="btn btn-danger">Xóa</button>
      </div>
    </div>
  </div>
</div>
```

## 7. Lưu Ý

- Đảm bảo file `src/main.jsx` import Bootstrap CSS: `import "bootstrap/dist/css/bootstrap.min.css";`

## 8. Util

```js
function formatLimitedTimeDeal(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return null;
  const pct = n <= 1 ? Math.round(n * 100) : Math.round(n);
  return `${pct}%`;
}
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

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export const formatToDate = (s) => {
  if (!s) return "";
  const d = dayjs(s, "DD/MM/YYYY", true);
  return d.isValid() ? d.format("YYYY-MM-DD") : "";
};

export const formatToDMY = (s) => {
  if (!s) return "";
  const d = dayjs(s, "YYYY-MM-DD", true);
  return d.isValid() ? d.format("DD/MM/YYYY") : "";
};
```
