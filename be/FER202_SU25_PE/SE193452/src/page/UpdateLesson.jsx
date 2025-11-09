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
