import React from "react";

export default function UserModel() {
  return (
    <div>
      <div
        className="modal fade"
        id="videoModal"
        tabIndex="-1"
        aria-labelledby="videoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog  modal-fullscreen">
          <div className="modal-content">
            <div className="modal-body position-relative   h-100 w-100">
              <iframe
                src=""
                title="YouTube video"
                allowFullScreen
                className="position-absolute h-100 w-100"
              ></iframe>
              <iframe
                src=""
                title="YouTube video"
                allowFullScreen
                className="position-absolute h-25 w-25 bottom-0 end-0"
              ></iframe>
            </div>
            <div className="me-auto offset-5">
              <button
                type="button"
                className="btn btn-danger rounded-circle"
                data-bs-dismiss="modal"
              >
                <i className="fa-2x fa fa-phone" aria-hidden="true"></i>
              </button>
              <button
                type="button"
                className="btn btn-secondary rounded-circle mx-4"
              >
                <i className="fa-2x fa fa-microphone " aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
