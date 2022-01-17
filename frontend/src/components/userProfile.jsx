import React, { useState, useEffect, useContext } from "react";
// import { Redirect } from "react-router-dom";
import auth from "../services/authService";
import { getPosts } from "../services/postService";

// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";

import PostsCard from "./postsCard";
import ProfileHeader from "./profileHeader";
import AddFriend from "./common/addFriend";

//............
import { PostContext } from "../context/postContext";
import { AllUser } from "../context/usersContext";
import { getUserById, getFriends, addFriend } from "../services/userService";
import { toggleLike } from "../services/postService";

import ProfileNavigation from "./profileNavigation";

//...........

// const MySwal = withReactContent(Swal);

const UserProfile = ({ match }) => {
  const [posts, setPosts] = useContext(PostContext);
  const [users, setUsers] = useContext(AllUser);
  const [user, setUser] = useState();
  const [friends, setFriends] = useState([]);

  const handleComment = (post) => {
    const allPosts = [...posts];
    const index = allPosts.indexOf(post);
    allPosts[index] = { ...post };
    allPosts[index].toggleComments =
      allPosts[index].toggleComments &&
      allPosts[index].toggleComments === "block"
        ? "none"
        : "block";
    setPosts(allPosts);
  };
  const handleLike = async (post) => {
    const allPosts = [...posts];
    const index = allPosts.indexOf(post);
    allPosts[index] = { ...post };

    const isLiked = allPosts[index].likes.find(
      (p) => p.toString() === auth.getCurrentUser()._id
    );
    if (!isLiked) {
      allPosts[index].likes.push(auth.getCurrentUser()._id);
    } else {
      const likedBy = allPosts[index].likes.filter(
        (p) => p !== auth.getCurrentUser()._id
      );
      allPosts[index].likes = likedBy;
    }

    setPosts(allPosts);

    try {
      const { data } = await toggleLike(post._id);
      //  toast.success(data);
    } catch (ex) {
      if (ex.response && ex.response.status === 401) {
        toast.error("Login to like posts.");
      }
    }
  };

  const handleAddFriend = async () => {
    try {
      const userProfile = { ...user };
      const friendIndex = userProfile.friends.indexOf(
        auth.getCurrentUser()._id
      );

      if (friendIndex === -1)
        userProfile.friends.push(auth.getCurrentUser()._id);
      else {
        const friends = [...userProfile.friends];
        const updatedFriends = friends.filter(
          (f) => f !== auth.getCurrentUser()._id
        );
        userProfile.friends = updatedFriends;
      }
      const allUsers = [...users];
      const index = allUsers.indexOf(user);

      allUsers[index] = userProfile;
      setUsers(allUsers);
      setUser(userProfile);
      const { data } = await addFriend(user);
      toast.success(data);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error("Friend Already Exists");
        setUsers(users);
        setUser(user);
      }
    }
  };
  useEffect(() => {
    const index = users.findIndex((u) => u._id === match.params.id);

    if (index !== -1) {
      // const getAllFriends = async () => {
      //   try {
      //     const { data } = await getFriends(users[index]._id);

      //     setFriends(data);
      //   } catch (ex) {
      //     if (ex.response && ex.response.status === 400)
      //       console.error(ex.message);
      //   }
      // };
      // getAllFriends();
      setUser(users[index]);
    }
    // const getUser = async () => {
    //   try {
    //     const { data } = await getUserById(match.params.id);
    //     setUser(data);
    //   } catch (ex) {
    //     toast.error("There is no user of id:" + match.params.id);
    //   }
    // };
    // if (!user) getUser();
  }, [user, users]);
  useEffect(() => {
    const allPosts = async () => {
      const { data } = await getPosts(user._id);
      setPosts(...posts, data);
    };
    if (posts.length === 0 && user) allPosts();
  }, [user]);
  // if (!user) return <Redirect to="/signin" />;
  return (
    <div className="container-fluid  p-0">
      {!user ? (
        <strong>There is no user of id:{match.params.id}</strong>
      ) : (
        <>
          <ProfileHeader user={user} />

          <AddFriend
            onClick={() => handleAddFriend()}
            friend={
              user && auth.getCurrentUser()
                ? user.friends.indexOf(auth.getCurrentUser()._id) === -1
                  ? false
                  : true
                : false
            }
          />

          <ProfileNavigation
            user={user}
            onProfileView={setUser}
          ></ProfileNavigation>
          <PostsCard
            onComment={handleComment}
            onLike={handleLike}
            userId={user._id}
          />
        </>
      )}
    </div>
  );
};

export default UserProfile;
