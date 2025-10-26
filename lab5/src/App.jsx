import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import CreateQuiz from "./page/CreateQuiz";
import QuizPage from "./page/QuizPage";
import ReviewQuiz from "./page/ReviewQuiz";

export default function App() {
  const { pathname } = useLocation();

  return (
    <>
      <Navbar bg="light" expand="md" className="border-bottom sticky-top">
        <Container>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Nav.Link as={NavLink} to="/create">
                Create
              </Nav.Link>
              <Nav.Link as={NavLink} to="/quiz">
                Take
              </Nav.Link>
              <Nav.Link as={NavLink} to="/review">
                Review
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-4">
        <Routes>
          <Route path="/" element={pathname === "/" ? <CreateQuiz /> : null} />
          <Route path="/create" element={<CreateQuiz />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/review" element={<ReviewQuiz />} />
        </Routes>
      </Container>
    </>
  );
}
