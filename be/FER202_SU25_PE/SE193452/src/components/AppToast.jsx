import { Toast, ToastContainer } from "react-bootstrap";

export default function AppToast({
  show,
  msg,
  bg = "success",
  title = "Notice",
  position = "top-end",
  delay = 2500,
  onClose,
}) {
  return (
    <ToastContainer position={position} className="p-3">
      <Toast
        bg={bg}
        show={show}
        autohide={!!delay}
        delay={delay}
        onClose={onClose}
      >
        <Toast.Header closeButton>
          <strong className="me-auto">{title}</strong>
          <small>now</small>
        </Toast.Header>
        <Toast.Body className={bg !== "light" ? "text-white" : ""}>
          {msg}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
