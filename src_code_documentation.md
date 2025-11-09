# 源代码文档

本文档包含 `src` 目录下的所有代码文件。

## 目录结构

```
src/
├── api/
│   └── lesson.api.js
├── components/
│   ├── AppToast.jsx
│   ├── ConfirmDeleteModal.jsx
│   └── NavBar.jsx
├── layout/
│   └── MainLayout.jsx
├── page/
│   ├── AllLesson.jsx
│   ├── CompletedLesson.jsx
│   ├── CreatedLesson.jsx
│   ├── Home.jsx
│   ├── LessonDetail.jsx
│   └── UpdateLesson.jsx
├── schema/
│   └── lesson.schema.js
├── util/
│   ├── http.js
│   └── util.js
├── App.css
├── App.jsx
├── index.css
└── main.jsx
```

---

## API

### `api/lesson.api.js`

```javascript
import http from "../util/http.js";

export const lessonApi = {
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

export default lessonApi;
```

---

## Components

### `components/AppToast.jsx`

```jsx
import { Toast, ToastContainer } from "react-bootstrap";

export default function AppToast({
  show,
  msg,
  bg = "success",
  title = "Notice",
  position = "top-end",
  delay = 2500,
  onClose,
}) {
  return (
    <ToastContainer position={position} className="p-3">
      <Toast
        bg={bg}
        show={show}
        autohide={!!delay}
        delay={delay}
        onClose={onClose}
      >
        <Toast.Header closeButton>
          <strong className="me-auto">{title}</strong>
          <small>now</small>
        </Toast.Header>
        <Toast.Body className={bg !== "light" ? "text-white" : ""}>
          {msg}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
```

### `components/ConfirmDeleteModal.jsx`

```jsx
import { Button, Modal } from "react-bootstrap";

export default function ConfirmDeleteModal({
  show,
  onHide,
  handleDelete,
  itemName,
}) {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" keyboard>
      <Modal.Header closeButton>
        <Modal.Title as="h6">Confirm Delete</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Are you sure you want to delete{itemName ? `: ${itemName}` : ""}?
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
```

### `components/NavBar.jsx`

```jsx
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="light">
      <Container>
        <Navbar.Toggle aria-controls="navMain" />
        <Navbar.Collapse id="navMain">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/se193452/all-lessons">
              All Lessons
            </Nav.Link>
            <Nav.Link as={NavLink} to="/se193452/completed-lessons">
              Completed Lessons
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
```

---

## Layout

### `layout/MainLayout.jsx`

```jsx
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function MainLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
```

---

## Pages

### `page/AllLesson.jsx`

```jsx
import { useEffect, useState } from "react";
import { Alert, Button, Container, Spinner, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import lessonApi from "../api/lesson.api";
import AppToast from "../components/AppToast";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { formatMinute } from "../util/util";
export default function AllLesson() {
  const [items, setItems] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: "", bg: "success" });
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await lessonApi.deleteItem(lesson.id);
      fetchApi();
      setShowModalDelete(false);
      setLesson(null);
      setToast({ show: true, msg: "Deleted successfully!", bg: "success" });
    } catch (err) {
      setErrors(err?.response?.data?.message || err.message);
    }
  };
  const fetchApi = async () => {
    try {
      setLoading(true);
      setErrors("");
      const res = await lessonApi.getAll();
      const dataArray = Array.isArray(res.data) ? res.data : [];
      setItems(dataArray.sort((a, b) => Number(b.id) - Number(a.id)));
    } catch (err) {
      setErrors(
        err?.response?.data?.message || err.message || "Failed to fetch lessons"
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchApi();
  }, []);
  return (
    <>
      <ConfirmDeleteModal
        show={showModalDelete}
        onHide={() => {
          setShowModalDelete(false);
          setLesson(null);
        }}
        handleDelete={handleDelete}
        itemName={lesson?.lessonTitle}
      />
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center">
          <h5>Lessons List</h5>
          <Button
            as={Link}
            size="sm"
            variant="primary"
            to={"/se193452/create-lesson"}
          >
            Create New Lesson
          </Button>
        </div>
        {isLoading && (
          <div className="d-flex align-items-center gap-3">
            <Spinner animation="border" role="status" />
            <span className="text-muted">Loading...</span>
          </div>
        )}
        {!isLoading && errors && (
          <Alert
            variant="danger"
            className="d-flex justify-content-between align-items-center"
          >
            <div>{errors}</div>
            <Button variant="light" size="sm" onClick={fetchApi}>
              Try Again!
            </Button>
          </Alert>
        )}
        {!isLoading && items && (
          <Table striped hover>
            <thead>
              <tr>
                <th colSpan={5}>Lesson Title</th>
                <th colSpan={2}>Level</th>
                <th colSpan={2}>Estimated Time</th>
                <th colSpan={4}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  role="button"
                  onClick={() => navigate(`/se193452/lesson/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td colSpan={5}>{item.lessonTitle}</td>
                  <td colSpan={2}>{item.level}</td>
                  <td colSpan={2}>{formatMinute(item.estimatedTime)}</td>
                  <td colSpan={4}>
                    <Button
                      variant="warning"
                      size="sm"
                      as={Link}
                      className="ms-1"
                      to={`/se193452/update-lesson/${item.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowModalDelete(true);
                        setLesson(item);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <AppToast
        show={toast.show}
        msg={toast.msg}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </>
  );
}
```

### `page/CompletedLesson.jsx`

```jsx
import { useEffect, useState } from "react";
import { Alert, Button, Container, Spinner, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import lessonApi from "../api/lesson.api";
import { formatMinute } from "../util/util";
export default function CompleteLesson() {
  const [items, setItems] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  const fetchApi = async () => {
    try {
      setLoading(true);
      setErrors("");
      const res = await lessonApi.getAll();
      const dataArray = Array.isArray(res.data) ? res.data : [];
      setItems(dataArray.sort((a, b) => Number(b.id) - Number(a.id)));
    } catch (err) {
      setErrors(
        err?.response?.data?.message || err.message || "Failed to fetch lessons"
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchApi();
  }, []);
  return (
    <>
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center">
          <h5>Lessons List</h5>
        </div>
        {isLoading && (
          <div className="d-flex align-align-items-center gap-3">
            <Spinner animation="border" role="status" />
            <span className="text-muted">Loading...</span>
          </div>
        )}
        {!isLoading && errors && (
          <Alert
            variant="danger"
            className="d-flex justify-content-between align-items-center"
          >
            <div>{errors}</div>
            <Button variant="light" size="sm" onClick={fetchApi}>
              Try Again!
            </Button>
          </Alert>
        )}
        {!isLoading && items && (
          <Table striped hover>
            <thead>
              <tr>
                <th colSpan={7}>Lesson Title</th>
                <th colSpan={3}>Level</th>
                <th colSpan={3}>Estimated Time</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  role="button"
                  onClick={() => navigate(`/se193452/lesson/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td colSpan={7}>{item.lessonTitle}</td>
                  <td colSpan={3}>{item.level}</td>
                  <td colSpan={3}>{formatMinute(item.estimatedTime)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  );
}
```

### `page/CreatedLesson.jsx`

```jsx
import { useFormik } from "formik";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import lessonApi from "../api/lesson.api";
import lessonSchema from "../schema/lesson.schema";
export default function CreatedLesson() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      lessonTitle: "",
      lessonImage: "",
      level: "N5",
      estimatedTime: 0,
      isCompleted: false,
    },
    validationSchema: lessonSchema,
    onSubmit: async (value, { setSubmitting }) => {
      try {
        const payload = {
          ...value,
          isCompleted: Boolean(value.isCompleted),
          estimatedTime: Number(value.estimatedTime),
        };
        await lessonApi.addItem(payload);
        navigate("/se193452/all-lessons");
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <Container>
      <Row>
        <Col>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group controlId="lessontitle">
              <Form.Label>Lesson Title</Form.Label>
              <Form.Control
                type="text"
                name="lessonTitle"
                value={formik.values.lessonTitle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.lessonTitle && !!formik.errors.lessonTitle
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.lessonImage}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="lessonImage">
              <Form.Label>Lesson Image</Form.Label>
              <Form.Control
                type="text"
                name="lessonImage"
                value={formik.values.lessonImage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.lessonImage && formik.errors.lessonImage
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.lessonImage}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="estimatedTime">
              <Form.Label>Lesson Estimated Time</Form.Label>
              <Form.Control
                type="number"
                name="estimatedTime"
                value={formik.values.estimatedTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.estimatedTime && formik.errors.estimatedTime
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.estimatedTime}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="level">
              <Form.Label>Lesson Level</Form.Label>
              <Form.Select
                name="level"
                value={formik.values.level}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.level && !!formik.errors.level}
              >
                <option value={"N1"}>N1</option>
                <option value={"N2"}>N2</option>
                <option value={"N3"}>N3</option>
                <option value={"N4"}>N4</option>
                <option value={"N5"}>N5</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formik.errors.level}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="isConpleted">
              <Form.Label>Conpleted</Form.Label>
              <Form.Check
                type="switch"
                name="isConpleted"
                checked={!!formik.values.isConpleted}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.isConpleted && !!formik.errors.isConpleted
                }
              />

              <Form.Control.Feedback type="invalid">
                {formik.errors.isConpleted}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Button
                type="submit"
                variant="primary"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Creating..." : "Create"}
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
```

### `page/Home.jsx`

```jsx
import { useEffect, useState } from "react";
import { Alert, Button, Card, Container, Row, Spinner } from "react-bootstrap";
import lessonApi from "../api/lesson.api";

export default function Home() {
  const [items, setItems] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const fetchApi = async () => {
    try {
      setLoading(true);
      setErrors("");
      const res = await lessonApi.getAll();
      setItems(res.data.filter((item) => Boolean(item.isCompleted) === false));
    } catch (err) {
      setErrors(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchApi();
  }, []);
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center">
        <h5>Lessons List</h5>
      </div>
      {isLoading && (
        <div className="d-flex align-items-center gap-3">
          <Spinner animation="border" role="status" />
          <span className="text-muted">Loading...</span>
        </div>
      )}
      {!isLoading && errors && (
        <Alert
          variant="danger"
          className="d-flex justify-content-between align-items-center"
        >
          <div>{errors}</div>
          <Button variant="light" size="sm" onClick={fetchApi}>
            Try Again!
          </Button>
        </Alert>
      )}
      {!isLoading && items && (
        <Row xs={1} sm={2} lg={3} className="g-3">
          {items.map((item) => (
            <Col key={item.id}>
              <Card className="h-100 shadow-sm">
                <Link to={`/se193452/lesson/${item.id}`}>
                  <Card.Img
                    src={item.lessonImage}
                    alt={item.lessonTitle}
                    variant="top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                </Link>
                <Card.Body>
                  <Card.Title>{item.lessonTitle}</Card.Title>
                  <Card.Text className="text-muted mb-2">
                    Lesson Estimated Time: {item.estimatedTime}
                  </Card.Text>
                  <Card.Text className="text-muted mb-2">
                    Lesson Level: {item.level}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
```

### `page/LessonDetail.jsx`

```jsx
import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import lessonApi from "../api/lesson.api";
import { formatMinute } from "../util/util";

export default function LessonDetail() {
  const { id } = useParams();
  const [item, setItem] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const fetchApi = async () => {
    try {
      setLoading(true);
      setErrors("");
      const res = await lessonApi.getItemDetail(id);
      setItem(res.data);
    } catch (err) {
      setErrors(
        err?.response?.data?.message || err.message || "Failed to fetch lessons"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApi();
  }, [id]);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center">
        <h5>Lesson Detail</h5>
      </div>
      {isLoading && (
        <div className="d-flex align-align-items-center gap-3">
          <Spinner animation="border" role="status" />
          <span className="text-muted">Loading...</span>
        </div>
      )}
      {!isLoading && errors && (
        <Alert
          variant="danger"
          className="d-flex justify-content-between align-items-center"
        >
          <div>{errors}</div>
          <Button variant="light" size="sm" onClick={fetchApi}>
            Try Again!
          </Button>
        </Alert>
      )}
      {!isLoading && item && (
        <>
          <div className="d-flex justify-content-end align-items-center">
            <Button as={Link} size="sm" to={-1} variant="outline-secondary">
              Back
            </Button>
          </div>
          <Row className="g-4 mt-3">
            <Col xs={12} md={5} lg={4}>
              <Card className="h-25 w-75 m-auto">
                <Card.Img
                  src={item.lessonImage}
                  alt={item.lessonTitle}
                  className="object-fit-cover"
                />
              </Card>
            </Col>

            <Col xs={12} md={7} lg={8}>
              <Card>
                <Card.Body>
                  <h2 className="text-muted">{item.lessonTitle}</h2>
                  <ListGroup>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Level:</span>
                      <span>{item.level}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Is Completed:</span>
                      <Badge
                        bg={item.isCompleted ? "secondary" : "light"}
                        text={item.isCompleted ? undefined : "dark"}
                        className={!item.isCompleted ? "border" : ""}
                      >
                        {item.isCompleted ? "True" : "False"}
                      </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Estimated Time:</span>
                      <span>{formatMinute(item.estimatedTime)}</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
```

### `page/UpdateLesson.jsx`

```jsx
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import lessonApi from "../api/lesson.api";
import lessonSchema from "../schema/lesson.schema";
export default function UpdateLesson() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const formik = useFormik({
    initialValues: {
      lessonTitle: "",
      lessonImage: "",
      level: "N5",
      estimatedTime: 0,
      isCompleted: false,
    },
    validationSchema: lessonSchema,
    onSubmit: async (value, { setSubmitting }) => {
      try {
        const payload = {
          ...value,
          isCompleted: Boolean(value.isCompleted),
          estimatedTime: Number(value.estimatedTime),
        };
        await lessonApi.updateItem(item.id, payload);
        navigate("/se193452/all-lessons");
      } finally {
        setSubmitting(false);
      }
    },
  });
  const fetchApi = async () => {
    try {
      setLoading(true);
      setErrors("");
      const res = await lessonApi.getItemDetail(id);
      formik.setValues({
        lessonTitle: res.data.lessonTitle,
        estimatedTime: Number(res.data.estimatedTime),
        isCompleted: Boolean(res.data.isCompleted),
        level: res.data.level,
        lessonImage: res.data.lessonImage,
      });
      setItem(res.data);
    } catch (err) {
      setErrors(
        err?.response?.data?.message || err.message || "Failed to fetch lessons"
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchApi();
  }, [id]);

  return (
    <Container>
      {isLoading && (
        <div className="d-flex align-align-items-center gap-3">
          <Spinner animation="border" role="status" />
          <span className="text-muted">Loading...</span>
        </div>
      )}
      {!isLoading && errors && (
        <Alert
          variant="danger"
          className="d-flex justify-content-between align-items-center"
        >
          <div>{errors}</div>
          <Button variant="light" size="sm" onClick={fetchApi}>
            Try Again!
          </Button>
        </Alert>
      )}
      {!isLoading && item && (
        <Row>
          <Col>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group controlId="lessontitle">
                <Form.Label>Lesson Title</Form.Label>
                <Form.Control
                  type="text"
                  name="lessonTitle"
                  value={formik.values.lessonTitle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.lessonTitle && !!formik.errors.lessonTitle
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.lessonImage}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="lessonImage">
                <Form.Label>Lesson Image</Form.Label>
                <Form.Control
                  type="text"
                  name="lessonImage"
                  value={formik.values.lessonImage}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.lessonImage && formik.errors.lessonImage
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.lessonImage}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="estimatedTime">
                <Form.Label>Lesson Estimated Time</Form.Label>
                <Form.Control
                  type="number"
                  name="estimatedTime"
                  value={formik.values.estimatedTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.estimatedTime && formik.errors.estimatedTime
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.estimatedTime}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="level">
                <Form.Label>Lesson Level</Form.Label>
                <Form.Select
                  name="level"
                  value={formik.values.level}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.level && !!formik.errors.level}
                >
                  <option value={"N1"}>N1</option>
                  <option value={"N2"}>N2</option>
                  <option value={"N3"}>N3</option>
                  <option value={"N4"}>N4</option>
                  <option value={"N5"}>N5</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.level}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="isCompleted">
                <Form.Label>Completed</Form.Label>
                <Form.Check
                  type="switch"
                  name="isCompleted"
                  checked={!!formik.values.isCompleted}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.isCompleted && !!formik.errors.isCompleted
                  }
                />

                <Form.Control.Feedback type="invalid">
                  {formik.errors.isCompleted}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? "Saving..." : "Save"}
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      )}
    </Container>
  );
}
```

---

## Schema

### `schema/lesson.schema.js`

```javascript
import * as yup from "yup";

export const lessonSchema = yup.object({
  lessonTitle: yup
    .string()
    .required("Name is required")
    .test("min-words", "Name must have more than 1 word", (v) =>
      v ? v.trim().split(/\s+/).length > 1 : false
    ),

  lessonImage: yup
    .string()
    .required("Image is required")
    .url("Image must be a valid URL"),

  estimatedTime: yup
    .number()
    .typeError("Estimated Time  must be a number")
    .required("Estimated Time is required")
    .min(1, "Min is 1"),
  isCompleted: yup.boolean().required(),
  level: yup
    .string()
    .oneOf(["N1", "N2", "N3", "N4", "N5"], "Invalid level")
    .required("Level is required"),
});

export default lessonSchema;
```

---

## Utils

### `util/http.js`

```javascript
import axios from "axios";

const URL = import.meta.env.VITE_URL_APP;
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

### `util/util.js`

```javascript
export const formatMinute = (s) => {
  const tmp = Number(s);
  if (!isFinite(s)) return "";
  const miniutes = Math.floor(tmp / 60);
  return `${miniutes.toLocaleString("en-US")} minutes`;
};
```

---

## Root Files

### `App.jsx`

```jsx
import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layout/MainLayout";
import AllLesson from "./page/AllLesson";
import CompleteLesson from "./page/CompletedLesson";
import CreatedLesson from "./page/CreatedLesson";
import Home from "./page/Home";
import LessonDetail from "./page/LessonDetail";
import UpdateLesson from "./page/UpdateLesson";
function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={"/"} element={<Home />} />
          <Route path={"/se193452/all-lessons"} element={<AllLesson />} />
          <Route
            path={"/se193452/completed-lessons"}
            element={<CompleteLesson />}
          />
          <Route path={"/se193452/create-lesson"} element={<CreatedLesson />} />
          <Route
            path={"/se193452/update-lesson/:id"}
            element={<UpdateLesson />}
          />
          <Route path={"/se193452/lesson/:id"} element={<LessonDetail />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
```

### `main.jsx`

```jsx
import "bootstrap/dist/css/bootstrap.min.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

### `App.css`

（文件为空）

### `index.css`

（文件为空）

---

## 总结

本项目是一个 React 应用，用于管理课程（Lessons）。主要功能包括：

- **路由管理**: 使用 React Router 进行页面路由
- **API 调用**: 通过 axios 进行 HTTP 请求
- **表单验证**: 使用 Formik 和 Yup 进行表单验证
- **UI 组件**: 使用 React Bootstrap 构建界面
- **状态管理**: 使用 React Hooks 管理组件状态

主要页面：
- Home: 显示未完成的课程列表
- AllLesson: 显示所有课程，支持编辑和删除
- CompletedLesson: 显示已完成的课程
- CreatedLesson: 创建新课程
- UpdateLesson: 更新课程信息
- LessonDetail: 查看课程详情

