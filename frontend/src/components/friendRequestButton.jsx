import React, { useState, useEffect, useContext } from "react";
import { AllUser } from "../context/usersContext";
import auth from "../services/authService";

const FriendRequestButton = ({ user, onAddFriend, onCancelRequest }) => {
  const [users, setUsers] = useContext(AllUser);
  const [renderButton, setRenderButton] = useState(0);
  useEffect(() => {
    if (auth.getCurrentUser() && users.length > 0) {
      user = users.find((u) => u._id === user._id);

      const friend = user.friends.find(
        (u) => u.user === auth.getCurrentUser()._id
      );
      if (!friend) {
        return setRenderButton(0);
      }
      if (friend.status === "sent") {
        return setRenderButton(1);
      }
      if (friend.status === "pending") {
        return setRenderButton(2);
      }
      if (friend.status === "success") {
        return setRenderButton(3);
      }
    }
  }, [user]);
  return (
    <div className="col-12 text-center">
      {renderButton === 0 && (
        <button
          className="btn btn-outline-primary"
          onClick={onAddFriend}
          style={{ width: "155px" }}
        >
          <i className="fa fa-user-plus" style={{ cursor: "pointer" }}></i>
          <span className="text-center"> Send Request</span>
        </button>
      )}
      {renderButton === 1 && (
        <>
          <button
            className="btn btn-outline-success mb-2"
            onClick={onAddFriend}
            style={{ width: "100px" }}
          >
            <i className="fa fa-check-circle" style={{ cursor: "pointer" }}></i>
            <span className="text-center"> Accept</span>
          </button>
          <button
            className="btn btn-outline-secondary mx-2 mb-2"
            onClick={onCancelRequest}
            style={{ width: "100px" }}
          >
            <i className="fa fa-times" style={{ cursor: "pointer" }}></i>
            <span className="text-center"> Cancel </span>
          </button>
        </>
      )}
      {renderButton === 2 && (
        <button
          className="btn btn-outline-secondary"
          onClick={onCancelRequest}
          style={{ width: "160px" }}
        >
          <i className="fa fa-times" style={{ cursor: "pointer" }}></i>
          <span className="text-center"> Cancel Request</span>
        </button>
      )}
      {renderButton === 3 && (
        <button
          className="btn btn-outline-danger text-start"
          onClick={onCancelRequest}
          style={{ width: "160px" }}
        >
          <i className="fa fa-minus-circle" style={{ cursor: "pointer" }}></i>
          <span> Remove Friend</span>
        </button>
      )}
    </div>
  );
};

export default FriendRequestButton;
