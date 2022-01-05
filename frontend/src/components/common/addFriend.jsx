import React from "react";

const AddFriend = (props) => {
  let classes = "fa fa-";
  if (!props.friend) classes += "user-plus";
  else classes += "check-circle";
  return (
    <i
      onClick={props.onClick}
      className={classes}
      style={{ cursor: "pointer" }}
    ></i>
  );
};

export default AddFriend;
