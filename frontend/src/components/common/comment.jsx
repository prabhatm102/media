import React from "react";

const Comment = (props) => {
  return (
    <i
      onClick={props.onClick}
      className="fa fa-comments-o mx-5 fa-2x"
      style={{ cursor: "pointer" }}
    ></i>
  );
};

export default Comment;
