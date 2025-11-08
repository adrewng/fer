import { useEffect, useState } from "react";

export default function Toast({ show, message, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose && onClose();
      }, 30000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, onClose]);

  if (!show && !isVisible) return null;

  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      style={{ zIndex: 11 }}
    >
      <div
        className={`toast ${
          isVisible ? "show" : ""
        } bg-success text-white border-0 shadow-lg`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="toast-body d-flex align-items-center justify-content-between">
          <span>{message || ""}</span>
          <button
            type="button"
            className="btn-close btn-close-white ms-2"
            aria-label="Close"
            onClick={() => {
              setIsVisible(false);
              onClose && onClose();
            }}
          ></button>
        </div>
      </div>
    </div>
  );
}
