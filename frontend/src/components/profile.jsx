import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import auth from "../services/authService";
import { getPosts, deletePost } from "../services/postService";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";

import PostsCard from "./postsCard";
import PostForm from "./postForm";
import ProfileHeader from "./profileHeader";

//............
import { PostContext } from "../context/postContext";
//...........

const MySwal = withReactContent(Swal);

const Profile = () => {
  const [posts, setPosts] = useContext(PostContext);

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
  const handleEdit = async (post) => {};
  const handleDelete = async (post) => {
    const allPosts = [...posts];
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
        setPosts(allPosts.filter((p) => p._id !== post._id));
        await deletePost(post);
        Swal.fire("Deleted!", "Post has been deleted.", "success");
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400)
        toast.error("Post has already been deleted!");
      setPosts(allPosts);
    }
  };
  useEffect(() => {
    const allPosts = async () => {
      const { data } = await getPosts();

      setPosts(...posts, data);
    };
    if (Object.keys(posts).length === 0) allPosts();
  }, []);

  const user = auth.getCurrentUser();
  if (!user) return <Redirect to="/signin" />;
  return (
    <div className="container-fluid  p-0">
      <ProfileHeader user={user} />

      <PostForm user={user} />

      <PostsCard
        onDelete={handleDelete}
        onEdit={handleEdit}
        onComment={handleComment}
        onLike={handleLike}
      />
    </div>
  );
};

export default Profile;
