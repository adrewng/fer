import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import useAuth from "../hook/useAuth";

export default function Header({ isDarkMode }) {
  const { user, logout, login } = useAuth();

  return (
    <Navbar
      bg={isDarkMode ? "dark" : "light"}
      variant={isDarkMode ? "dark" : "light"}
      className="mb-3"
    >
      <Container>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/naturals">
            Naturals
          </Nav.Link>
          <Nav.Link as={Link} to="/contact">
            Contact
          </Nav.Link>
        </Nav>
        <Nav>
          {user ? (
            <>
              <Navbar.Text className="me-3">
                Welcome, {user.username}!
              </Navbar.Text>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </>
          ) : (
            <>
              <Navbar.Text className="me-3">Login as Adrew</Navbar.Text>
              <Nav.Link onClick={() => login({ username: "Adrew" })}>
                Login
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
