import auth from "./authService";
import http from "./httpServices";

const apiEndpoint = "/posts";

export const toggleLike = (postId) => {
  return http.post(apiEndpoint + "/toggleLike", { post: postId });
};

export const getAllPosts = () => {
  return http.get(apiEndpoint);
};
export const getPosts = (userId) => {
  return http.get(apiEndpoint + "/" + userId);
};

export const savePost = (post) => {
  return http.post(apiEndpoint + "/" + auth.getCurrentUser()._id, post, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updatePost = (post) => {};

export const deletePost = (post) => {
  return http.delete(apiEndpoint + "/" + post._id);
};
