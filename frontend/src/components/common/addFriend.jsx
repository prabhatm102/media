import React from "react";

const AddFriend = (props) => {
  let classes = "m-1 fa fa-";
  let btnClasses = "d-flex mx-auto p-2 btn btn-sm btn-outline-";
  let btnText = "AddFriend";
  if (!props.friend) {
    classes += "user-plus";
    btnClasses += "primary";
  } else {
    classes += "minus-circle";
    btnClasses += "danger";
    btnText = "Remove Friend";
  }
  return (
    <button
      className={btnClasses}
      onClick={props.onClick}
      style={{ width: "140px" }}
    >
      <i className={classes} style={{ cursor: "pointer" }}></i>
      <span className="text-center"> {btnText}</span>
    </button>
  );
};

export default AddFriend;
