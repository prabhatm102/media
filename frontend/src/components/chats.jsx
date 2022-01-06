import React, {  useEffect, useRef } from "react";
import auth from "../services/authService";
// import { SocketContext } from "../context/socketContext";

const Chat = ({
  conversations,
  receiver,
  onSendMessage,
  onMessage,
  message,
  callUser,
}) => {
  const scrollRef = useRef(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

  // const { callUser } = useContext(SocketContext);
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
      <div className="chat-header bg-secondary text-white d-flex">
        <li className="list-group-item-active list-inline m-1">
          <img
            src={process.env.REACT_APP_USER_IMAGE_URL + receiver.file}
            className="img-fluid rounded-start img-thumbnail m-2"
            alt="friend"
            height="35"
            width="35"
            style={{ cursor: "pointer" }}
          />
          <strong> {receiver.name}</strong>{" "}
        </li>
        <div className="m-2 ms-auto">
          <i
            className="fa-2x fa fa-video-camera"
            aria-hidden="true"
            onClick={() => callUser(receiver._id)}
            data-bs-toggle="modal"
            data-bs-target="#videoModal"
            style={{ cursor: "pointer" }}
          ></i>
        </div>
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
