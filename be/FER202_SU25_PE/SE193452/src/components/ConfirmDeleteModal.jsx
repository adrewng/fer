import { Button, Modal } from "react-bootstrap";

export default function ConfirmDeleteModal({
  show,
  onHide,
  handleDelete,
  itemName,
}) {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" keyboard>
      <Modal.Header closeButton>
        <Modal.Title as="h6">Confirm Delete</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Are you sure you want to delete{itemName ? `: ${itemName}` : ""}?
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
