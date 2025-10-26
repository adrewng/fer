import { useMemo } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { finishQuiz, selectAnswer } from "../slice/quizSlice";

export default function QuizPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const questions = useSelector((state) => state.quiz.items);

  const answered = useMemo(
    () => questions.filter((q) => q.selectedIndex != null).length,
    [questions]
  );

  const progress = questions.length
    ? Math.round((answered * 100) / questions.length)
    : 0;

  if (!questions.length) {
    return <p className="text-muted">No questions. Go to Create page.</p>;
  }

  return (
    <>
      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between mb-2">
            <small className="text-muted">Progress</small>
            <small>
              {answered}/{questions.length}
            </small>
          </div>
          <ProgressBar now={progress} />
        </Card.Body>
      </Card>

      {questions.map((q, i) => (
        <Card className="mb-3" key={q.id}>
          <Card.Body>
            {/* Header Question */}
            <Card.Title as="h6" className="mb-3">
              {i + 1}. {q.text}
            </Card.Title>
            {/* List Options */}
            <ListGroup>
              {q.options.map((op, idx) => (
                <ListGroup.Item
                  key={idx}
                  action
                  onClick={() =>
                    dispatch(selectAnswer({ id: q.id, selectedIndex: idx }))
                  }
                >
                  <Form.Check
                    type="radio"
                    name={`q-${q.id}`}
                    checked={q.selectedIndex === idx}
                    onChange={() =>
                      dispatch(selectAnswer({ id: q.id, selectedIndex: idx }))
                    }
                    label={op}
                  />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      ))}

      <div className="d-flex justify-content-end">
        <Button
          variant="dark"
          onClick={() => {
            dispatch(finishQuiz());
            navigate("/review");
          }}
        >
          Submit
        </Button>
      </div>
    </>
  );
}
