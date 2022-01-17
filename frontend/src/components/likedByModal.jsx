import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import auth from "../services/authService";
import { AllUser } from "../context/usersContext";

const LikedByModal = ({ post, onProfileView }) => {
  const [users, setUsers] = useContext(AllUser);
  const [likedBy, setLikedBy] = useState([]);

  useEffect(() => {
    if (post) {
      const likes = users.filter((user) => {
        if (post.likes.indexOf(user._id) !== -1) return user;
      });
      setLikedBy(likes);
    }
  }, [post]);
  return (
    <div>
      <div
        className="modal fade"
        id="likedByModal"
        tabIndex="-1"
        aria-labelledby="likedByModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="likedByModalLabel">
                Liked By
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div
              className="modal-body"
              style={{
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
            >
              {likedBy.map((userInfo) => (
                <div
                  className="userInfo-list d-inline-block"
                  key={userInfo._id}
                >
                  <span>
                    <Link
                      to={
                        "/profile/" +
                        (userInfo._id !==
                        (auth.getCurrentUser() && auth.getCurrentUser()._id)
                          ? userInfo._id
                          : "")
                      }
                    >
                      <img
                        src={
                          userInfo &&
                          process.env.REACT_APP_USER_IMAGE_URL + userInfo.file
                        }
                        className="img-fluid img-thumbnail m-2"
                        alt="userInfo"
                        //    onClick={() => onProfileView()}
                        style={{ height: "50px", width: "50px" }}
                        data-bs-dismiss="modal"
                      />
                    </Link>
                    <div className="">
                      <p className="text-wrap text-center">{userInfo.name}</p>
                    </div>
                  </span>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikedByModal;
