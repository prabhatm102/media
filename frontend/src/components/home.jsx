import React, { useEffect, useState, useContext } from "react";
import { getAllPosts } from "../services/postService";
import PostForm from "./postForm";
import PostsCard from "./postsCard";
import { PostContext } from "../context/postContext";

const Home = ({ user }) => {
  const [posts, setPosts] = useContext(PostContext);
  const handleLike = (post) => {
    const allPosts = [...posts];
    const index = allPosts.indexOf(post);
    allPosts[index] = { ...post };
    allPosts[index].liked = !allPosts[index].liked;
    setPosts(allPosts);
  };
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
  useEffect(() => {
    const allPosts = async () => {
      const { data } = await getAllPosts();
      setPosts(data);
    };
    allPosts();
  }, []);

  return (
    <div className="container-fluid p-0">
      {!user && <p className="alert alert-danger text-center">Login To Post</p>}
      {user && <PostForm user={user} />}
      <PostsCard onComment={handleComment} onLike={handleLike} />
    </div>
  );
};

export default Home;
