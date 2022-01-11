import React from "react";

const Comment = (props) => {
  let classes = "fa mx-5 fa-2x fa-comments";
  if (props.toggleComments === "none") classes += "-o text-secondary";
  else classes += " text-primary";

  return (
    <i
      onClick={props.onClick}
      className={classes}
      style={{ cursor: "pointer" }}
    ></i>
  );
};

export default Comment;
