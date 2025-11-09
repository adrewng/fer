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
