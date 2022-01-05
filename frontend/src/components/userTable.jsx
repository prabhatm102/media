import React from "react";
import auth from "../services/authService";
import Table from "./common/table";
import AddFriend from "./common/addFriend";
const UserTable = ({ users, onEdit, onDelete, onDetails, onAddFriend }) => {
  const currentUser = users.find((u) => u._id === auth.getCurrentUser()._id);
  const columns = [
    {
      key: "file",
      content: (user) => (
        <img
          src={process.env.REACT_APP_USER_IMAGE_URL + user.file}
          height="30"
          width="30"
          alt="user icon"
          className="img-fluid img-thumbnail"
        />
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
            currentUser
              ? currentUser.friends.indexOf(user._id) === -1
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
    <div>
      <div className="table-responsive shadow p-3 mb-5 bg-body rounded">
        <Table users={users} columns={columns} />
      </div>
    </div>
  );
};

export default UserTable;
