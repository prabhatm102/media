import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import {
  getConversations,
  saveConversation,
  deleteConversation,
} from "../services/conversationService";
import { getFriends } from "../services/userService";
import auth from "../services/authService";
import FriendList from "./friendList";
import Chat from "./chats.jsx";
import VideoModal from "./videoModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { SocketContext } from "../context/socketContext";
import { socket } from "../context/socketContext";

const MySwal = withReactContent(Swal);

const Conversation = ({ user }) => {
  const [friends, setFriends] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [receiver, setReceiver] = useState({});
  const [message, setMessage] = useState("");
  const [wallPaper, setWallPaper] = useState(
    "https://source.unsplash.com/user/c_v_r/1900x800"
  );

  const { answerCall, call, callAccepted, setCall, declineCall, callUser } =
    useContext(SocketContext);

  const showConversation = (friend) => {
    const getChats = async () => {
      try {
        const { data } = await getConversations(friend._id);
        setConversations(data);
        const receiver = friends.find((f) => f._id === friend._id);
        setReceiver(receiver);
        setCall({ from: receiver._id });
      } catch (ex) {
        if (ex.response && ex.response.status === 400) toast.error(ex.message);
      }
    };
    getChats();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      try {
        let conversation = {};
        conversation.receiver = receiver._id;
        conversation.message = message;
        const { data } = await saveConversation(conversation);
        setConversations([...conversations, data]);
        setMessage("");
      } catch (ex) {
        if (ex.response && ex.response.status === 400) toast.error(ex.message);
      }
    }
  };
  const handleMessage = (msg) => {
    setMessage(msg);
  };
  const handleClearChat = async (conversationId) => {
    const allConversations = [...conversations];
    try {
      const result = await MySwal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        setConversations([]);
        Swal.fire("Deleted!", "Chat has been Cleared.", "success");
        await deleteConversation(conversationId);
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400)
        toast.warn("There is no chat availabel!");
      setConversations(allConversations);
    }
  };
  const handleWallPaperChange = (e) => {
    setWallPaper(URL.createObjectURL(e.files[0]));
  };
  useEffect(() => {
    const getAllFriends = async () => {
      try {
        const { data } = await getFriends();
        setFriends(data);
      } catch (ex) {
        if (ex.response && ex.response.status === 400) toast.error(ex.message);
      }
    };

    getAllFriends();
  }, []);

  useEffect(() => {
    socket.emit("joinRoom", auth.getCurrentUser()._id);

    socket.on("receiveMessage", (data) => {
      setConversations([...conversations, data]);
    });

    socket.on("userStatus", (data) => {
      if (friends.length > 0) {
        const index = friends.findIndex((f) => {
          return f._id === data.id;
        });
        if (index > -1) {
          friends[index].status = "true";
          setFriends((friends) => friends);
        }
      }
    });
  }, [conversations, friends]);
  return (
    <div className="container-fluid">
      {call.isReceivingCall && !callAccepted && (
        <div className="row mb-2">
          <div className="col-12">
            <h1 className="text-center">
              {call.name} is calling
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
          <div className="col-6 d-flex">
            <button
              className="btn btn-sm btn-success ms-auto rounded-circle"
              data-bs-toggle="modal"
              data-bs-target="#videoModal"
              onClick={answerCall}
            >
              <i className="fa-3x fa fa-phone" aria-hidden="true"></i>
            </button>
          </div>
          <div className="col-6">
            <button
              className="btn btn-sm btn-danger rounded-circle"
              onClick={declineCall}
            >
              <i className="fa-3x fa fa-phone" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      )}

      <div className="row mb-5">
        <div className="col-md-4 mb-3 p-0">
          {friends.length === 0 && (
            <p>Add new friends from users tab to start chat...</p>
          )}
          {friends.length > 0 && (
            <FriendList
              friends={friends}
              onShowConversation={showConversation}
            />
          )}
        </div>
        <div className="col rounded-4 p-0">
          {receiver._id && (
            <Chat
              conversations={conversations}
              receiver={receiver}
              onSendMessage={handleSendMessage}
              onMessage={handleMessage}
              onClearChat={handleClearChat}
              onWallPaperChange={handleWallPaperChange}
              message={message}
              callUser={callUser}
              wallPaper={wallPaper}
            />
          )}
        </div>

        <VideoModal />
      </div>
    </div>
  );
};

export default Conversation;
