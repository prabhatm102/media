import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFriends } from "../services/userService";
import auth from "../services/authService";
// import { toast } from "toast";

const ProfileNavigation = ({ user, onProfileView }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const getAllFriends = async () => {
      try {
        const { data } = await getFriends(user._id);
        const f = data.filter((d) => d.status === "success");
        setFriends(f);
      } catch (ex) {
        if (ex.response && ex.response.status === 400)
          console.error(ex.message);
      }
    };
    getAllFriends();
  }, [user]);

  return (
    <div className="container-fluid  mb-3  mt-5">
      <div className="row p-0 mt-2">
        <div className="m-auto offset-sm-3 col-sm-6 card shadow bg-body rounded p-0 position-relative">
          <div className="card text-center">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="true" to="#">
                    Friends
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="#">
                    Details
                  </Link>
                </li>
              </ul>
            </div>
            <div
              className="card-body"
              style={{
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
            >
              <div className="card-text d-inline-block">
                {friends.length <= 0 && <p>There is no friend. </p>}
                {friends.map((friend) => (
                  <div
                    className="friend-list d-inline-block"
                    key={friend.user._id}
                  >
                    <span>
                      <Link
                        to={
                          "/profile/" +
                          (friend.user._id !==
                          (auth.getCurrentUser() && auth.getCurrentUser()._id)
                            ? friend.user._id
                            : "")
                        }
                      >
                        <img
                          src={
                            friend &&
                            process.env.REACT_APP_USER_IMAGE_URL +
                              friend.user.file
                          }
                          className="img-fluid img-thumbnail m-2"
                          alt="friend"
                          onClick={() => onProfileView()}
                          style={{ height: "100px", width: "100px" }}
                        />
                      </Link>
                      <div>
                        <strong>{friend.user.name}</strong>
                      </div>
                    </span>
                  </div>
                ))}
              </div>
              {/* <Link to="#" className="btn btn-primary"></Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileNavigation;
