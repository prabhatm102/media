import { useState, useEffect, createContext } from "react";
import { getAllPosts } from "../services/postService";

export const PostContext = createContext();
PostContext.displayName = "PostContext";

export const PostProvider = (props) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const allPosts = async () => {
      const { data } = await getAllPosts();
      setPosts(data);
    };
    allPosts();
  }, []);

  return (
    <PostContext.Provider value={[posts, setPosts]}>
      {props.children}
    </PostContext.Provider>
  );
};
