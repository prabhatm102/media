import React, { createContext, useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import auth from "../services/authService";

const SocketContext = createContext();
const socket = io.connect(process.env.REACT_APP_SOCKET_URL);
export { socket };
const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [call, setCall] = useState({});

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    if (auth.getCurrentUser())
      socket.emit("joinRoom", auth.getCurrentUser()._id);

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
    setCall({ from: id });
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
      console.log("vcefvre");
      window.location.reload();
      setCallAccepted(false);
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
  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        callEnded,
        callUser,
        leaveCall,
        answerCall,
        declineCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
