import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { getUsers, deleteUser, addFriend } from "../services/userService";
import UserTable from "./userTable";
import UserModel from "./userModel";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import auth from "../services/authService";
import { AllUser } from "../context/usersContext";
// import auth from "../services/authService";

const MySwal = withReactContent(Swal);

const Users = () => {
  const [users, setUsers] = useContext(AllUser);
  const [user, setUser] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const allUsers = async () => {
      const { data } = await getUsers();
      setUsers(data);
      setTotalCount(data.length);
    };
    allUsers();
  }, []);
  const handleAddFriend = async (user) => {
    try {
      const allUsers = [...users];
      const index = allUsers.findIndex((u) => u._id === user._id);
      const friendIndex = allUsers[index].friends.indexOf(
        auth.getCurrentUser()._id
      );

      if (friendIndex === -1)
        allUsers[index].friends.push(auth.getCurrentUser()._id);
      else {
        const friends = [...allUsers[index].friends];
        const updatedFriends = friends.filter(
          (f) => f !== auth.getCurrentUser()._id
        );
        allUsers[index].friends = updatedFriends;
      }

      setUsers(allUsers);

      const { data } = await addFriend(user);
      toast.success(data);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error("Friend Already Exists");
        setUsers(users);
      }
    }
  };
  const handleEdit = (user) => {
    setUser(user);
  };
  const handleDelete = async (user) => {
    const allUsers = [...users];
    try {
      //Sweet Alert...............
      const result = await MySwal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        setUsers(allUsers.filter((u) => u._id !== user._id));
        await deleteUser(user);
        Swal.fire("Deleted!", "User has been deleted.", "success");
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400)
        toast.error("User has already been deleted!");
      setUsers(allUsers);
    }
  };
  const handleDetails = (user) => {
    Swal.fire({
      title: "User Profile",
      html: `<div>
      <div><strong>Name  :</strong>  ${user.name}</div>
      <div><strong> Email :</strong> ${user.email} </div>
      <div><strong>Status  :</strong>  ${
        user.isActive ? "Active" : "Deactive"
      } </div>
      <div><strong> Role  :<strong/>  ${user.isAdmin ? "Admin" : "User"}</div>
      </div>`,
      imageUrl: process.env.REACT_APP_USER_IMAGE_URL + user.file,
      imageWidth: 250,
      imageHeight: 200,
      imageAlt: "Custom image",
    });
    setUser(users.find((u) => u._id === user._id));
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const pagedUsers = paginate(users, currentPage, pageSize);

  return (
    <div>
      <div>
        <UserTable
          users={pagedUsers}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onDetails={handleDetails}
          onAddFriend={handleAddFriend}
        />
        <Pagination
          itemCount={totalCount}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          currentPage={currentPage}
          errMsg="users"
        />
        <UserModel user={user} users={users} setUsers={setUsers} />
      </div>
    </div>
  );
};

export default Users;
