import { useFormik } from "formik";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import lessonApi from "../api/lesson.api";
import lessonSchema from "../schema/lesson.schema";
export default function AddLesson() {
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
        await lessonApi.createLesson(payload);
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
    </Container>
  );
}
