import React, { useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import auth from "../services/authService";
import { SocketContext } from "../context/socketContext";

const Chat = ({
  conversations,
  receiver,
  onSendMessage,
  onMessage,
  onClearChat,
  onWallPaperChange,
  message,

  wallPaper,
}) => {
  const { callUser } = useContext(SocketContext);
  const scrollRef = useRef(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

  const getTime = (date) => {
    const d = new Date();
    if (d.getHours() === date.getHours()) {
      if (d.getMinutes() - date.getMinutes() <= 1) {
        return "just now";
      }
    }
    return date.toLocaleTimeString();
  };

  return (
    <div className="chat border border-1">
      <div className="chat-header bg-secondary text-white d-flex">
        <li className="list-group-item-active list-inline m-1">
          <Link to={"/profile/" + receiver._id}>
            <img
              src={process.env.REACT_APP_USER_IMAGE_URL + receiver.file}
              className="img-fluid rounded-circle m-2"
              alt="friend"
              style={{ height: "40px", width: "40px", cursor: "pointer" }}
            />
          </Link>
          <strong> {receiver.name}</strong>{" "}
        </li>
        <div className="mt-3 ms-auto dropstart">
          <i
            className="me-5 fa-2x fa fa-video-camera"
            aria-hidden="true"
            onClick={() => callUser(receiver._id)}
            data-bs-toggle="modal"
            data-bs-target="#videoModal"
            style={{ cursor: "pointer" }}
          ></i>
          <i
            className=" fa-2x fa fa-ellipsis-v me-3 "
            data-bs-toggle="dropdown"
          ></i>
          <ul className="dropdown-menu">
            <li>
              <span className="dropdown-item">View</span>
            </li>
            <li>
              <label className="">
                <span className="dropdown-item">Wallpaper</span>
                <input
                  type="file"
                  style={{ display: "none" }}
                  className="form-control"
                  id="wallPaper"
                  name="wallPaper"
                  onChange={(e) => onWallPaperChange(e.currentTarget)}
                />
              </label>
            </li>
            <li>
              <span
                className="dropdown-item"
                onClick={() =>
                  onClearChat(
                    conversations.length > 0
                      ? conversations[0].conversation
                      : receiver._id
                  )
                }
              >
                Clear chat
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div
        className="chat-body w-100"
        style={{
          height: "400px",
          overflow: "scroll",
          background: ` url(${wallPaper}) top right / cover scroll no-repeat`,
        }}
      >
        {conversations.length > 0 &&
          conversations.map((conversation) => (
            <div
              ref={scrollRef}
              className="message-box rounded-3 mw-25"
              id={
                auth.getCurrentUser()._id === conversation.sender._id
                  ? "my-message"
                  : "other-message"
              }
              key={conversation._id}
            >
              <div className="message">{conversation.message}</div>
              <div className="message-info">
                {conversation.sender.name}
                {"  "}
                {getTime(new Date(conversation.updatedAt))}
                <i className="fa fa-check" aria-hidden="true"></i>
              </div>
            </div>
          ))}
      </div>
      <div className="chat-footer p-2">
        <form className="d-flex" onSubmit={onSendMessage}>
          <img
            src={
              process.env.REACT_APP_USER_IMAGE_URL + auth.getCurrentUser().file
            }
            className="img-fluid rounded-start img-thumbnail m-2"
            alt="friend"
            height="25"
            width="25"
            style={{ cursor: "pointer" }}
          />
          <div className="col">
            <input
              type="text"
              className="form-control"
              id="message"
              value={message}
              placeholder="Type a message..."
              onChange={(e) => {
                onMessage(e.currentTarget.value);
              }}
            />
          </div>
          <div className="col-2 ms-auto">
            {message.length > 0 && (
              <button
                type="submit"
                className="btn btn-sm btn-success mx-2 rounded-circle"
              >
                <i className="fa fa-paper-plane" aria-hidden="true"></i>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
