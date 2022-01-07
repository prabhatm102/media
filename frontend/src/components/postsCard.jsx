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
  const getPostTimeStamp = (post) => {
    let createdAt = new Date(post.createdAt).toLocaleString();
    let updatedAt = new Date(post.updatedAt).toLocaleString();
    if (createdAt === updatedAt) {
      return createdAt;
    }

    return "Edited " + updatedAt;
  };
  return (
    <div className="container-fluid card shadow p-3 mb-3 bg-body rounded mt-5">
      {posts.length === 0 && (
        <strong className="text-center">There is no posts.....</strong>
      )}
      {posts.length > 0 &&
        posts
          .slice(0)
          .reverse()
          .map((post) => (
            <div className="row p-0" key={post._id}>
              <div className="m-auto  col-6 col-sm-* card shadow bg-body rounded p-0 position-relative">
                <div className="post-content p-0">
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
                <hr />
                <div className="post-footer bg-white mb-3 mx-3">
                  <Like onClick={() => onLike(post)} liked={post.liked} />

                  <Comment
                    onClick={() => onComment(post)}
                    toggleComments={toggleComments}
                  />

                  <div style={{ display: toggleComments }}>
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
    </div>
  );
}
