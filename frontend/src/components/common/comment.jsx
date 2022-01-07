import React from "react";

const Comment = (props) => {
  let classes = "fa mx-5 text-secondary fa-2x fa-comments";
  if (props.toggleComments === "none") classes += "-o";

  return (
    <i
      onClick={props.onClick}
      className={classes}
      style={{ cursor: "pointer" }}
    ></i>
  );
};

export default Comment;
