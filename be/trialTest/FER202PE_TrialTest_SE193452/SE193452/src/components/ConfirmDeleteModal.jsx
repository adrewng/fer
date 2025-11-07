import React from "react";

export default function ConfirmDeleteModal({
  show,
  onHide,
  handleDeleteStudent,
}) {
  return (
    <div
      className="modal"
      tabIndex="-1"
      style={{ display: show ? "block" : "none" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Delete</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onHide}
            />
          </div>
          <div className="modal-body">
            <div>Are you sure you want to delete this student?</div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onHide}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDeleteStudent}>
              Yes, delete it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
