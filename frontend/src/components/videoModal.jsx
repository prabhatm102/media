import React from "react";

export default function UserModel({
  name,
  callAccepted,
  myVideo,
  userVideo,
  callEnded,
  stream,
  call,
  leaveCall,
}) {
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
              {callAccepted && !callEnded ? (
                <>
                  <video
                    ref={userVideo}
                    autoPlay={true}
                    title="User video"
                    className="position-absolute h-100 w-100"
                  ></video>
                </>
              ) : (
                <div className="text-center">
                  <h1>
                    Calling
                    <div
                      className="spinner-grow spinner-grow-sm mx-2"
                      role="status"
                    ></div>
                    <div
                      className="spinner-grow spinner-grow-sm mx-2"
                      role="status"
                    ></div>
                    <div
                      className="spinner-grow spinner-grow-sm mx-2"
                      role="status"
                    ></div>
                  </h1>
                </div>
              )}
              {stream && (
                <>
                  {/* {name} */}
                  <video
                    ref={myVideo}
                    title="My video"
                    autoPlay={true}
                    muted
                    // allowFullScreen
                    className="position-absolute h-25 w-25 bottom-0 end-0"
                  ></video>
                </>
              )}
            </div>
            <div
              className="modal-footer"
              style={{ background: "rgba(0,0,0,0.2)" }}
            >
              <div className="mx-auto">
                <button
                  type="button"
                  className="btn btn-danger rounded-circle"
                  onClick={() => leaveCall()}
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
    </div>
  );
}
