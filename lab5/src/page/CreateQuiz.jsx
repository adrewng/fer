import { useState } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addOption,
  addQuestion,
  removeOption,
  removeQuestion,
  setCorrectIndex,
  startQuiz,
  updateOption,
  updateQuestionText,
} from "../slice/quizSlice";

export default function CreateQuiz() {
  const questions = useSelector((state) => state.quiz.items);

  const [newQ, setNewQ] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const canStart =
    questions.length > 0 &&
    questions.every((q) => q.text.trim() && q.options.every((o) => o.trim()));

  return (
    <Row className="g-4">
      {/* Left */}
      <Col lg={8}>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h5 className="mb-0">Create Quiz</h5>
          <small className="text-muted">Total: {questions.length}</small>
        </div>
        {/* Add question */}
        <Card className="mb-3">
          <Card.Body className="d-flex gap-2">
            <Form.Control
              placeholder="Type your question…"
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
            />
            <Button
              variant="dark"
              disabled={!newQ.trim()}
              onClick={() => {
                dispatch(addQuestion(newQ.trim()));
                setNewQ("");
              }}
            >
              Add
            </Button>
          </Card.Body>
        </Card>

        {/* Question detail */}
        {questions.map((q, qi) => (
          <Card className="mb-3" key={q.id}>
            <Card.Body>
              {/* Header Question */}
              <div className="d-flex align-items-center gap-2 mb-2">
                <Badge bg="dark">{qi + 1}</Badge>
                <Form.Control
                  value={q.text}
                  placeholder="Question content"
                  onChange={(e) =>
                    dispatch(
                      updateQuestionText({ id: q.id, text: e.target.value })
                    )
                  }
                />
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => dispatch(removeQuestion(q.id))}
                >
                  Delete
                </Button>
              </div>
              {/* List Option of question*/}
              <ListGroup variant="flush">
                {q.options.map((op, idx) => (
                  <ListGroup.Item
                    key={idx}
                    className="d-flex align-items-center gap-2"
                  >
                    {/* Tick */}
                    <Form.Check
                      type="radio"
                      name={`correct-${q.id}`}
                      checked={q.correctIndex === idx}
                      onChange={() =>
                        dispatch(setCorrectIndex({ id: q.id, index: idx }))
                      }
                    />
                    {/* Input option */}
                    <Form.Control
                      value={op}
                      placeholder={`Option #${idx + 1}`}
                      onChange={(e) =>
                        dispatch(
                          updateOption({
                            id: q.id,
                            index: idx,
                            value: e.target.value,
                          })
                        )
                      }
                    />
                    {/* Remove Option */}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() =>
                        dispatch(removeOption({ id: q.id, index: idx }))
                      }
                    >
                      Remove
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <div className="mt-2">
                <Button
                  variant="link"
                  onClick={() => dispatch(addOption({ id: q.id }))}
                >
                  + Add option
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </Col>

      {/* Right */}
      <Col lg={4}>
        <Card className="sticky-top" style={{ top: 88 }}>
          <Card.Body>
            <Card.Title as="h6">Summary</Card.Title>
            <Card.Text className="text-muted mb-2">
              Mark the correct answer for each question.
            </Card.Text>
            <div style={{ maxHeight: 320, overflowY: "auto" }} className="pe-1">
              <ListGroup>
                {questions.map((q, i) => (
                  <ListGroup.Item key={q.id} className="py-2">
                    <strong>{i + 1}.</strong>{" "}
                    {q.text || <em className="text-muted">Untitled</em>}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
            <Button
              className="w-100 mt-3"
              variant="success"
              disabled={!canStart}
              onClick={() => {
                dispatch(startQuiz());
                navigate("/quiz");
              }}
            >
              Start Quiz
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
