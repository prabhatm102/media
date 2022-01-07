import React from "react";

const FriendList = ({ friends, onShowConversation }) => {
  return (
    <div>
      <div className="friends">
        <div className="friends-header bg-success text-white text-center fs-3">
          <strong>Friends</strong>
        </div>
        <div className="friends-body">
          <ul className="list-group">
            {friends.map((friend) => (
              <li
                className="list-group-item"
                key={friend._id}
                onClick={() => onShowConversation(friend)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={
                    friend && process.env.REACT_APP_USER_IMAGE_URL + friend.file
                  }
                  className="img-fluid rounded-circle m-2"
                  alt="friend"
                  style={{ height: "50px", width: "50px" }}
                />
                <strong> {friend.name}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FriendList;
