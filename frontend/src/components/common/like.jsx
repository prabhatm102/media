import React from "react";
import { toast } from "react-toastify";
import auth from "../../services/authService";

const Like = (props) => {
  let classes = " fa-2x  fa fa-thumbs-";
  if (!props.liked) classes += "o-up  text-secondary";
  else classes += "up text-primary";

  const handleLike = () => {
    toast.warning("Login to like post");
  };
  return (
    <i
      onClick={!auth.getCurrentUser() ? handleLike : props.onClick}
      className={classes}
      style={{ cursor: "pointer" }}
    ></i>
  );
};

export default Like;
