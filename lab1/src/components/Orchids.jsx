import { Col, Container, Row } from "react-bootstrap";
import ListOfOrchids from "../shared/ListOfOrchids";
import OrchidItem from "./OrchidItem";

export default function Orchids() {
  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Orchid List</h1>
      <Row className="g-4">
        {ListOfOrchids.map((item) => (
          <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
            <OrchidItem orchid={item} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
