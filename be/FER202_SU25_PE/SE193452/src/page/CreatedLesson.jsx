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
