import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import auth from "../services/authService";
import PostForm from "./postComment";
import Like from "./common/like";
import Comment from "./common/comment";
import { PostContext } from "../context/postContext";
import LikedByModal from "./likedByModal";

export default function PostsCard({
  onDelete,
  onEdit,
  onComment,
  onLike,
  userId,
}) {
  let [posts, setPosts] = useContext(PostContext);
  let [post, setPost] = useState();

  if (onDelete || userId) {
    posts = posts.filter(
      (p) => p.user._id === (userId ? userId : auth.getCurrentUser()._id)
    );
  }

  const getPostTimeStamp = (post) => {
    let createdAt = new Date(post.createdAt).toLocaleString();
    let updatedAt = new Date(post.updatedAt).toLocaleString();
    if (createdAt === updatedAt) {
      return createdAt;
    }

    return "Edited " + updatedAt;
  };
  const showLikedBy = (post) => {
    setPost(post);
  };
  return (
    <div className="container-fluid  mb-3  mt-5">
      {posts.length === 0 && (
        <strong className="text-center">There is no posts.....</strong>
      )}
      {posts.length > 0 &&
        posts
          .slice(0)
          .reverse()
          .map((post) => (
            <div className="row p-0 mt-2" key={post._id}>
              <div className="m-auto offset-sm-3 col-sm-6 card shadow bg-body rounded p-0 position-relative">
                <div className="post-content p-0 ">
                  <div className="post-header p-1">
                    {onDelete && (
                      <div className="action float-end">
                        <i
                          className="fa fa-pencil mx-3 my-1"
                          onClick={() => onEdit(post)}
                          aria-hidden="true"
                        ></i>
                        <i
                          className="fa-lg fa fa-times"
                          aria-hidden="true"
                          onClick={() => onDelete(post)}
                        />
                      </div>
                    )}

                    <div className="card-title d-flex p-0">
                      <div className="profile-image">
                        <Link
                          to={
                            "/profile/" +
                            (post.user._id !==
                            (auth.getCurrentUser() && auth.getCurrentUser()._id)
                              ? post.user._id
                              : "")
                          }
                        >
                          <img
                            src={
                              post &&
                              process.env.REACT_APP_USER_IMAGE_URL +
                                post.user.file
                            }
                            className="img-fluid rounded-pill my-1"
                            alt="not found"
                            height="55"
                            width="55"
                          />
                        </Link>
                      </div>
                      <div
                        className="profile-content rounded-3 p-2 w-75"
                        // style={{ background: "#e5e4e2" }}
                      >
                        <strong> {post.user.name}</strong>
                        <p className="card-text text-wrap">
                          <small className="text-muted">
                            {getPostTimeStamp(post)}
                          </small>
                        </p>
                      </div>
                    </div>

                    <p className="card-text mx-2">{post.message}</p>
                  </div>
                  {post.postFile && (
                    <img
                      src={process.env.REACT_APP_POST_IMAGE_URL + post.postFile}
                      className="img img-responsive"
                      alt="..."
                      width="100%"
                    />
                  )}
                </div>
                {post.likes.length > 0 && (
                  <span className="mt-3 m-1 mb-0  ">
                    <i
                      // onClick={onClick}
                      className="fa fa-thumbs-up text-white bg-primary p-1 rounded-circle"
                      style={{ cursor: "pointer" }}
                      onClick={() => showLikedBy(post)}
                      data-bs-toggle="modal"
                      data-bs-target="#likedByModal"
                    ></i>
                    <span className="mx-1 text-muted">{post.likes.length}</span>
                  </span>
                )}
                <hr />
                <div className="post-footer bg-white mb-3 mx-3">
                  <Like
                    onClick={() => onLike(post)}
                    liked={
                      post.likes.findIndex(
                        (p) =>
                          p.toString() ===
                          (auth.getCurrentUser() && auth.getCurrentUser()._id)
                      ) === -1
                        ? false
                        : true
                    }
                  />

                  <Comment
                    onClick={() => onComment(post)}
                    toggleComments={post.toggleComments || "none"}
                  />

                  <div style={{ display: post.toggleComments || "none" }}>
                    <hr />
                    {post.comments.length === 0 && (
                      <p className="text-center">There is no comment.</p>
                    )}
                    {post.comments.length > 0 &&
                      post.comments.map((c) => (
                        <div key={c._id}>
                          <div className="comment d-flex my-4">
                            <div className="comment-image">
                              <img
                                src={
                                  c.user &&
                                  process.env.REACT_APP_USER_IMAGE_URL +
                                    c.user.file
                                }
                                className="img-fluid rounded-start img-thumbnail m-2"
                                alt="img"
                                height="25"
                                width="35"
                              />
                            </div>
                            <div
                              className="comment-content rounded-3 p-2 w-75"
                              style={{ background: "#e5e4e2" }}
                            >
                              <strong>{c.user.name}</strong>
                              <p className="card-text text-wrap">{c.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    {auth.getCurrentUser() && (
                      <PostForm post={post} posts={posts} setPosts={setPosts} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      <LikedByModal post={post} />
    </div>
  );
}
