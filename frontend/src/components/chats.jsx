import React, { useEffect, useRef } from "react";

import auth from "../services/authService";

const Chat = ({
  conversations,
  receiver,
  onSendMessage,
  onMessage,
  message,
}) => {
  const scrollRef = useRef(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);
  // const months = [
  //   "jan",
  //   "feb",
  //   "march",
  //   "april",
  //   "may",
  //   "june",
  //   "july",
  //   "aug",
  //   "sept",
  //   "oct",
  //   "nov",
  //   "dec",
  // ];
  const getTime = (date) => {
    const d = new Date();
    if (d.getHours() === date.getHours()) {
      if (d.getMinutes() - date.getMinutes() <= 1) {
        return "just now";
      }
    }
    return date.toLocaleTimeString();
  };
  //   const [message, setMessage] = useState("");
  //   const [messages, setMessages] = useState([]);

  //   const handleSendMessage = async (e) => {
  //     e.preventDefault();
  //     if (message.trim() !== "") {
  //       const messageFormate = {
  //         message,
  //         room,
  //         username,
  //         time: new Date().getHours() + ":" + new Date().getMinutes(),
  //       };
  //       await socket.emit("sendMessage", messageFormate);
  //       setMessages([...messages, messageFormate]);
  //       setMessage("");
  //     }
  //   };

  //   useEffect(() => {
  //     socket.on("receiveMessage", (data) => {
  //       setMessages([...messages, data]);
  //     });
  //   }, [socket, messages]);
  return (
    <div className="chat  border">
      <div className="chat-header bg-secondary text-white">
        <li className="list-group-item-active list-inline">
          <img
            src={process.env.REACT_APP_USER_IMAGE_URL + receiver.file}
            className="img-fluid rounded-start img-thumbnail m-2"
            alt="friend"
            height="25"
            width="25"
            style={{ cursor: "pointer" }}
          />
          {receiver.name}
        </li>
      </div>
      <div
        className="chat-body w-100 "
        style={{ height: "400px", overflow: "scroll" }}
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
          <div className="col-2">
            {message.length > 0 && (
              <button
                type="submit"
                className="btn btn-sm btn-outline-primary mx-2"
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
