import React, { useState, useEffect, useContext } from "react";
import FriendRequestButton from "./friendRequestButton";
import { AllUser } from "../context/usersContext";
import { socket } from "../context/socketContext";
import auth from "../services/authService";
import { getFriends, addFriend, cancelRequest } from "../services/userService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState();
  const [friendRequests, setFriendRequests] = useState([]);
  const [sentFriendRequests, setSentFriendRequests] = useState([]);
  const [users, setUsers] = useContext(AllUser);

  const handleCancelRequest = async (user) => {};
  const handleAddFriend = async (friend) => {};
  useEffect(() => {
    const getAllFriends = async () => {
      try {
        const { data } = await getFriends(auth.getCurrentUser()._id);
        setFriendRequests(data.filter((f) => f.status === "pending"));
        setSentFriendRequests(data.filter((f) => f.status === "sent"));
      } catch (ex) {
        if (ex.response && ex.response.status === 400)
          console.error(ex.message);
      }
    };
    getAllFriends();
  }, [users]);
  useEffect(() => {
    socket.on("postLiked", (data) => {
      setNotifications([...notifications, data]);
    });
    socket.on("postComment", (data) => {
      setNotifications([...notifications, data]);
    });
    socket.on("friendRequest", (data) => {
      const index = users.findIndex((u) => u._id === data._id);
      users[index] = data;
      setUsers(users);
      //  setUser(data);
    });
    socket.on("cancelRequest", (data) => {
      const index = users.findIndex((u) => u._id === data._id);
      users[index] = data;
      setUsers(users);
      //  setUser(data);
    });
  }, [socket]);
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-6">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Notification</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((n) => (
                  <tr key={n.post._id}>
                    <td>
                      {n.likedBy && (
                        <>
                          <div className="d-inline-block">
                            <img
                              src={
                                process.env.REACT_APP_USER_IMAGE_URL +
                                n.likedBy.file
                              }
                              className="rounded-circle d-inline-block mt-2 mx-3"
                              height="50"
                              width="50"
                            />
                          </div>
                          <div className="d-inline-block">
                            <strong>
                              {n.likedBy.name +
                                " liked your post " +
                                n.post.message.slice(0, 5) +
                                "..."}
                            </strong>
                          </div>
                        </>
                      )}
                      {n.commentedBy && (
                        <>
                          <div className="d-inline-block">
                            <img
                              src={
                                process.env.REACT_APP_USER_IMAGE_URL +
                                n.commentedBy.file
                              }
                              className="rounded-circle d-inline-block mt-2 mx-3"
                              height="50"
                              width="50"
                            />
                          </div>
                          <div className="d-inline-block">
                            <strong>
                              {n.commentedBy.name +
                                " commented on your post " +
                                n.post.message.slice(0, 5) +
                                "..."}
                            </strong>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Friend Requests</th>
                </tr>
              </thead>
              <tbody>
                {friendRequests.map((fr) => (
                  <tr key={fr._id}>
                    <td>
                      <>
                        <div className="d-inline-block">
                          <Link to={"/profile/" + fr.user._id}>
                            <img
                              src={
                                process.env.REACT_APP_USER_IMAGE_URL +
                                fr.user.file
                              }
                              className="rounded-circle d-inline-block mt-2 mx-3"
                              height="50"
                              width="50"
                            />
                          </Link>
                        </div>
                        <div className="d-inline-block">
                          <strong>{fr.user.name}</strong>
                        </div>
                      </>
                    </td>
                    {/* <td>
                      <FriendRequestButton
                        user={fr.user}
                        onAddFriend={() => handleAddFriend(fr.user)}
                        onCancelRequest={() => handleCancelRequest(fr.user)}
                      />
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Sent Friend Requests</th>
                </tr>
              </thead>
              <tbody>
                {sentFriendRequests.map((sfr) => (
                  <tr key={sfr._id}>
                    <td>
                      <>
                        <div className="d-inline-block">
                          <Link to={"/profile/" + sfr.user._id}>
                            <img
                              src={
                                process.env.REACT_APP_USER_IMAGE_URL +
                                sfr.user.file
                              }
                              className="rounded-circle d-inline-block mt-2 mx-3"
                              height="50"
                              width="50"
                            />
                          </Link>
                        </div>
                        <div className="d-inline-block">
                          <strong>{sfr.user.name}</strong>
                        </div>
                      </>
                      <div className="d-flex ms-auto">
                        {/* <FriendRequestButton
                          user={sfr.user}
                          onAddFriend={handleAddFriend}
                          onCancelRequest={handleCancelRequest}
                        /> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
