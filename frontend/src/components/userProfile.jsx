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
import { getUserById, addFriend } from "../services/userService";
import ProfileNavigation from "./profileNavigation";

//...........

// const MySwal = withReactContent(Swal);

const UserProfile = ({ match }) => {
  const [posts, setPosts] = useContext(PostContext);
  const [user, setUser] = useState();

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
  const handleLike = (post) => {
    const allPosts = [...posts];
    const index = allPosts.indexOf(post);
    allPosts[index] = { ...post };
    allPosts[index].liked = !allPosts[index].liked;
    setPosts(allPosts);
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

      setUser(userProfile);

      const { data } = await addFriend(user);
      toast.success(data);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error("Friend Already Exists");
        setUser(user);
      }
    }
  };
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await getUserById(match.params.id);
        setUser(data);
      } catch (ex) {
        toast.error("There is no user of id:" + match.params.id);
      }
    };
    if (!user) getUser();
  }, [user]);
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
          <button
            className="btn btn-primary d-flex mx-auto p-2"
            disabled={!auth.getCurrentUser() && true}
          >
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
          </button>
          <ProfileNavigation
            userId={user._id}
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
