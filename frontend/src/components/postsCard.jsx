import React from "react";
import auth from "../services/authService";
import PostForm from "./postComment";
import Like from "./common/like";
import Comment from "./common/comment";

export default function PostsCard({
  posts,
  setPosts,
  onDelete,
  onEdit,
  onComment,
  onLike,
  toggleComments,
}) {
  return (
    <div className="container-fluid card shadow p-3 mb-3 bg-body rounded mt-5">
      {posts.length > 0 &&
        posts
          .slice(0)
          .reverse()
          .map((post) => (
            <div className="row" key={post._id}>
              <div className="m-auto  col-lg-5 col-md-5 col-sm-6 card shadow p-3 bg-body rounded">
                <div className="card-body">
                  {onDelete && (
                    <div className="acion">
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => onDelete(post)}
                      ></button>
                      <button
                        type="button"
                        className="btn mb-2 mx-2"
                        onClick={() => onEdit(post)}
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </button>
                    </div>
                  )}
                  <h5 className="card-title">
                    <img
                      src={
                        post &&
                        process.env.REACT_APP_USER_IMAGE_URL + post.user.file
                      }
                      className="img-fluid rounded-start img-thumbnail m-2"
                      alt="not found"
                      height="25"
                      width="25"
                    />
                    {post.user.name}
                  </h5>
                  <p className="card-text">{post.message}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      Created at
                      {" " + new Date(post.createdAt).toLocaleTimeString() ||
                        " few seconds "}
                    </small>
                    <br />
                    <small className="text-muted">
                      Last updated at
                      {" " + new Date(post.updatedAt).toLocaleTimeString() ||
                        " few seconds "}
                    </small>
                  </p>

                  {post.postFile && (
                    <img
                      src={process.env.REACT_APP_POST_IMAGE_URL + post.postFile}
                      className="card-img-bottom"
                      alt="..."
                    />
                  )}
                </div>
                <div className="card-footer bg-white">
                  <Like onClick={() => onLike(post)} liked={post.liked} />
                  <Comment onClick={() => onComment(post)} />

                  <hr />
                  <div style={{ display: toggleComments }}>
                    {post.comments.length === 0 && <p>There is no comment.</p>}
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
    </div>
  );
}
