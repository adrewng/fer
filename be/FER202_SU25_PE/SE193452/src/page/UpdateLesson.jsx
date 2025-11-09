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
  const [item, setItem] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const formilk = useFormik({
    initialValues: {
      lessonImage: "",
      lessonTitle: "",
      estimatedTime: 1,
      level: "N5",
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
        await lessonApi.updateLesson(item.id, payload);
        navigate("/se193452/all-lessons");
      } finally {
        setSubmitting(false);
      }
    },
  });
  const fetchData = async () => {
    try {
      setLoading(true);
      setErrors("");
      const res = await lessonApi.getDetail(id);
      formilk.setValues({
        lessonImage: res.data.lessonImage,
        lessonTitle: res.data.lessonTitle,
        estimatedTime: Number(res.data.estimatedTime),
        level: res.data.level,
        isCompleted: Boolean(res.data.isCompleted),
      });
      setItem(res.data);
    } catch (e) {
      setErrors(e?.response?.data?.message || e?.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      {isLoading && (
        <div className="d-flex align-item-center justify-content-center gap-3">
          <Spinner animation="border" role="status" />
          <span>Loading...</span>
        </div>
      )}
      {!isLoading && errors && (
        <Alert variant="danger">
          <span>{errors}</span>
        </Alert>
      )}
      {!isLoading && item && (
        <Row>
          <Col>
            <Form onSubmit={formilk.handleSubmit}>
              <Form.Group controlId="lessonTitle">
                <Form.Label>Lesson Title</Form.Label>
                <Form.Control
                  type="text"
                  name="lessonTitle"
                  value={formilk.values.lessonTitle}
                  onChange={formilk.handleChange}
                  onBlur={formilk.handleBlur}
                  isInvalid={
                    formilk.touched.lessonTitle && !!formilk.errors.lessonTitle
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formilk.errors.lessonTitle}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="lessonImage">
                <Form.Label>Lesson Image</Form.Label>
                <Form.Control
                  type="url"
                  name="lessonImage"
                  value={formilk.values.lessonImage}
                  onChange={formilk.handleChange}
                  onBlur={formilk.handleBlur}
                  isInvalid={
                    formilk.touched.lessonImage && !!formilk.errors.lessonImage
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formilk.errors.lessonImage}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="estimatedTime">
                <Form.Label>Lesson Estimated Time</Form.Label>
                <Form.Control
                  type="number"
                  name="estimatedTime"
                  value={formilk.values.estimatedTime}
                  onChange={formilk.handleChange}
                  onBlur={formilk.handleBlur}
                  isInvalid={
                    formilk.touched.estimatedTime &&
                    !!formilk.errors.estimatedTime
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formilk.errors.estimatedTime}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="level">
                <Form.Label>Lesson level</Form.Label>
                <Form.Select
                  name="level"
                  value={formilk.values.level}
                  onChange={formilk.handleChange}
                  onBlur={formilk.handleBlur}
                  isInvalid={formilk.touched.level && !!formilk.errors.level}
                >
                  <option value={"N1"}>N1</option>
                  <option value={"N2"}>N2</option>
                  <option value={"N3"}>N3</option>
                  <option value={"N4"}>N4</option>
                  <option value="N5">N5</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formilk.errors.level}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="isCompleted">
                <Form.Label>Lesson Is Complted</Form.Label>
                <Form.Check
                  type="switch"
                  name="isCompleted"
                  checked={!!formilk.values.isCompleted}
                  onChange={formilk.handleChange}
                  onBlur={formilk.handleBlur}
                  isInvalid={
                    formilk.touched.isCompleted && !!formilk.errors.isCompleted
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formilk.errors.isCompleted}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="isCompleted">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={formilk.isSubmitting}
                >
                  {formilk.isSubmitting ? "Creating..." : "Create"}
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      )}
    </Container>
  );
}
