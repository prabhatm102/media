import React, { useState, useEffect, useRef } from "react";
import Peer from "simple-peer";
import { toast } from "react-toastify";
import io from "socket.io-client";
// import { socket } from "../context/socketContext";
import {
  getConversations,
  saveConversation,
} from "../services/conversationService";
import { getFriends } from "../services/userService";
import FriendList from "./friendList";
import Chat from "./chats.jsx";
import VideoModal from "./videoModal";
import auth from "../services/authService";
// import { SocketContext } from "../context/socketContext";
const socket = io.connect(process.env.REACT_APP_SOCKET_URL);

const Conversation = ({ user }) => {
  const [friends, setFriends] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [receiver, setReceiver] = useState({});
  const [message, setMessage] = useState("");
  // const [userStatus, setUserStatus] = useState([]);
  //............
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  // const [name, setName] = useState("");
  const [call, setCall] = useState({});
  // const [me, setMe] = useState("");

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    if (navigator.mediaDevices)
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setStream(currentStream);

          myVideo.current.srcObject = currentStream;
        })
        .catch((ex) => console.log(ex));

    // socket.on("me", (id) => setMe(id));

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: auth.getCurrentUser()._id,
        name: auth.getCurrentUser().name,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });
    socket.on("callDeclined", () => {
      window.location.reload();
      //  setCallAccepted(false);
      peer.destroy();
    });

    connectionRef.current = peer;
  };
  const declineCall = () => {
    socket.emit("declineCall", { to: call.from });
    window.location.reload();
  };
  const leaveCall = () => {
    setCallEnded(true);
    socket.emit("declineCall", { to: call.from });
    window.location.reload();
    connectionRef.current.destroy();
  };

  //...............
  // const {
  //   answerCall,
  //   call,
  //   callAccepted,
  //   name,
  //   myVideo,
  //   userVideo,
  //   callEnded,
  //   stream,
  //   leaveCall,
  // } = useContext(SocketContext);
  //..............
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
    // socket.on("userStatus", (data) => {
    //   console.log(socket);
    //   setUserStatus([...userStatus, data]);
    // });
    socket.on("receiveMessage", (data) => {
      setConversations([...conversations, data]);
    });
  }, [conversations]);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-4">
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
        <div className="col">
          {call.isReceivingCall && !callAccepted && (
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <h1>{call.name} is calling:</h1>
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#videoModal"
                onClick={answerCall}
              >
                Answer
              </button>
              <button className="btn btn-danger" onClick={declineCall}>
                Decline
              </button>
            </div>
          )}
          {receiver._id && (
            <Chat
              conversations={conversations}
              receiver={receiver}
              onSendMessage={handleSendMessage}
              onMessage={handleMessage}
              message={message}
              socket={socket}
              callUser={callUser}
            />
          )}
          <VideoModal
            callAccepted={callAccepted}
            myVideo={myVideo}
            userVideo={userVideo}
            callEnded={callEnded}
            stream={stream}
            call={call}
            leaveCall={leaveCall}
          />
        </div>
      </div>
    </div>
  );
};

export default Conversation;
