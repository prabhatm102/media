import React from "react";

const Like = (props) => {
  let classes = "fa-2x  fa fa-thumbs-";
  if (!props.liked) classes += "o-up";
  else classes += "up";
  return (
    <i
      onClick={props.onClick}
      className={classes}
      style={{ cursor: "pointer" }}
    ></i>
  );
};

export default Like;
