import React, { useEffect, useState } from "react";
import { getAllPosts } from "../services/postService";
import PostForm from "./postForm";
import PostsCard from "./postsCard";

const Home = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [toggleComments, setToggleComments] = useState("none");
  const handleLike = (post) => {
    const allPosts = [...posts];
    const index = allPosts.indexOf(post);
    allPosts[index] = { ...post };
    allPosts[index].liked = !allPosts[index].liked;
    setPosts(allPosts);
  };
  const handleComment = (post) => {
    let display;
    if (toggleComments === "none") display = "block";
    else display = "none";
    setToggleComments(display);
  };
  useEffect(() => {
    const allPosts = async () => {
      const { data } = await getAllPosts();
      setPosts(data);
    };
    allPosts();
  }, []);

  return (
    <div className="container-fluid shadow p-3 mb-5 bg-body rounded">
      {!user && <p className="alert alert-danger text-center">Login To Post</p>}
      {user && <PostForm user={user} posts={posts} setPosts={setPosts} />}
      <PostsCard
        posts={posts}
        setPosts={setPosts}
        onComment={handleComment}
        onLike={handleLike}
        toggleComments={toggleComments}
      />
    </div>
  );
};

export default Home;
