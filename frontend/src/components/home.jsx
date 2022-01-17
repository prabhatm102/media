import React, { useEffect, useContext } from "react";
import { getAllPosts } from "../services/postService";
import PostForm from "./postForm";
import PostsCard from "./postsCard";
import { PostContext } from "../context/postContext";
import { toggleLike } from "../services/postService";
import { toast } from "react-toastify";

const Home = ({ user }) => {
  const [posts, setPosts] = useContext(PostContext);

  const handleLike = async (post) => {
    const allPosts = [...posts];
    const index = allPosts.indexOf(post);
    allPosts[index] = { ...post };

    const isLiked = allPosts[index].likes.find(
      (p) => p.toString() === user._id
    );
    if (!isLiked) {
      allPosts[index].likes.push(user._id);
    } else {
      const likedBy = allPosts[index].likes.filter((p) => p !== user._id);
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
