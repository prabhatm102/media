import React from "react";
import { Link } from "react-router-dom";
import auth from "../services/authService";
import Table from "./common/table";
import AddFriend from "./common/addFriend";
const UserTable = ({ users, onEdit, onDelete, onDetails, onAddFriend }) => {
  const columns = [
    {
      key: "file",
      content: (user) => (
        <Link
          to={
            "/profile/" +
            (user._id !== (auth.getCurrentUser() && auth.getCurrentUser()._id)
              ? user._id
              : "")
          }
        >
          <img
            src={process.env.REACT_APP_USER_IMAGE_URL + user.file}
            height="30"
            width="30"
            alt="user icon"
            className="img rounded-circle"
          />
        </Link>
      ),
    },
    { path: "name", label: "Name" },
    { path: "email", label: "Email" },
    { path: "isActive", label: "Active" },
    { path: "isAdmin", label: "Admin" },
    {
      key: "addFriend",
      content: (user) => (
        <AddFriend
          onClick={() => onAddFriend(user)}
          friend={
            auth.getCurrentUser()
              ? user.friends.indexOf(auth.getCurrentUser()._id) === -1
                ? false
                : true
              : false
          }
        />
      ),
    },
    {
      key: "edit",
      content: (user) => (
        <button
          onClick={() => onEdit(user)}
          className="btn btn-sm btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#updateUser"
        >
          <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
        </button>
      ),
    },
    {
      key: "view",
      content: (user) => (
        <button
          onClick={() => onDetails(user)}
          className="btn btn-sm btn-primary"
        >
          <i className="fa fa-info-circle" aria-hidden="true"></i>
        </button>
      ),
    },
  ];

  const deleteUser = {
    key: "delete",
    content: (user) => (
      <button onClick={() => onDelete(user)} className="btn btn-sm btn-danger">
        <i className="fa fa-trash" aria-hidden="true"></i>
      </button>
    ),
  };
  if (auth.getCurrentUser().isAdmin) {
    columns.push(deleteUser);
  }

  return (
    <div className="table-responsive table-scrollable shadow m-md-5 p-3 mb-5 bg-body rounded ">
      <Table users={users} columns={columns} />
    </div>
  );
};

export default UserTable;
