export default function ConfirmDeleteModal({
  show,
  onHide,
  handleDelete,
  itemName,
}) {
  return (
    <div
      className="modal"
      tabIndex="-1"
      style={{ display: show ? "block" : "none" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h6 className="modal-title">Confirm Delete</h6>
            <button
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="close"
              onClick={onHide}
            ></button>
          </div>
          <div className="modal-body">
            Are you sure delete{itemName ? `: ${itemName}` : ""}?
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={onHide}
            >
              Close
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
