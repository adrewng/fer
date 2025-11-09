import { Toast, ToastContainer } from "react-bootstrap";

export default function AppToast({ msg, show, delay = 2500, onClose }) {
  return (
    <ToastContainer position={"top-end"} className="p-3">
      <Toast
        show={show}
        autohide={!!delay}
        onClose={onClose}
        delay={delay}
        bg={"secondary"}
      >
        <Toast.Header>
          <strong className="me-auto">Notification</strong>
          <small>now</small>
        </Toast.Header>
        <Toast.Body>{msg}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
