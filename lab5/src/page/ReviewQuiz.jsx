import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function ReviewQuiz() {
  const questions = useSelector((state) => state.quiz.items);
  const score = useSelector((state) =>
    state.quiz.items.reduce(
      (acc, q) => acc + (q.selectedIndex === q.correctIndex ? 1 : 0),
      0
    )
  );
  const { startedAt, finishedAt } = useSelector((state) => ({
    startedAt: state.quiz.startedAt,
    finishedAt: state.quiz.finishedAt,
  }));

  if (!questions.length) return <p className="text-muted">No results.</p>;

  const duration =
    startedAt && finishedAt
      ? Math.round((finishedAt - startedAt) / 1000)
      : null;

  return (
    <>
      <Card className="mb-3">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div>
            <Card.Title as="h6" className="mb-1">
              Review
            </Card.Title>
            <small className="text-muted">
              Score: <strong>{score}</strong> / {questions.length}
              {duration != null ? ` · Time: ${duration}s` : ""}
            </small>
          </div>
          <Button as={Link} to="/create" variant="outline-secondary">
            Create new
          </Button>
        </Card.Body>
      </Card>

      {questions.map((q, i) => (
        <Card className="mb-3" key={q.id}>
          <Card.Body>
            <Card.Title as="h6" className="mb-3">
              {i + 1}. {q.text}
            </Card.Title>
            <ListGroup>
              {q.options.map((op, idx) => {
                const correct = q.correctIndex === idx;
                const chosen = q.selectedIndex === idx;
                const variant = correct
                  ? "success"
                  : chosen
                  ? "danger"
                  : undefined;
                return (
                  <ListGroup.Item key={idx} variant={variant}>
                    {op}
                    {correct && (
                      <small className="ms-2 text-success">(Correct)</small>
                    )}
                    {!correct && chosen && (
                      <small className="ms-2 text-danger">(Your choice)</small>
                    )}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Card.Body>
        </Card>
      ))}
    </>
  );
}
