import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Joi from "joi-browser";
import { saveComment } from "../services/commentService";
import auth from "../services/authService";
import { PostContext } from "../context/postContext";

export default function PostComment({ post }) {
  const [posts, setPosts] = useContext(PostContext);
  const user = auth.getCurrentUser();
  const [data, setData] = useState({
    comment: "",
    postId: "",
  });
  const [errors, setErrors] = useState({});
  const schema = {
    comment: Joi.string().required().min(1).label("Comment"),
    postId: Joi.string().required(),
  };
  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const singleSchema = {
      [name]: schema[name],
    };

    const { error } = Joi.validate(obj, singleSchema);
    return error ? error.details[0].message : null;
  };
  const handleChange = (input) => {
    const allErrors = { ...errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) allErrors[input.name] = errorMessage;
    else delete allErrors[input.name];

    setErrors(allErrors);

    const newData = { ...data };

    newData[input.name] = input.value;
    newData.postId = post._id;
    setData(newData);
  };
  const validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(data, schema, options);

    if (!error) return null;
    const errors = {};

    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    setErrors(errors || {});

    if (errors) return;
    doSubmit();
  };
  const doSubmit = async () => {
    try {
      const response = await saveComment(data);
      response.data.toggleComments = "block";
      const prevPosts = [...posts];
      const index = prevPosts.findIndex((p) => p._id === post._id);
      prevPosts[index] = response.data;

      setPosts(prevPosts);
      delete data.userId;
      setData({ comment: "" });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errorMessage = { ...errors };
        errorMessage.email = ex.response.data;
        setErrors(errorMessage);
      }
    }
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <div className="comment">
            <form
              className="d-flex"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              <div className="input-group mb-3">
                <span
                  className="input-group-text p-0" /*</div>id="basic-addon1"*/
                >
                  <Link to="/profile/">
                    <img
                      src={process.env.REACT_APP_USER_IMAGE_URL + user.file}
                      className="img-fluid p-0"
                      alt="..."
                      height="10"
                      width="30"
                    />
                  </Link>
                </span>
                <input
                  type="text"
                  aria-label="comment"
                  className="form-control"
                  id="comment"
                  name="comment"
                  placeholder="Write comment..."
                  value={data.comment}
                  onChange={(e) => handleChange(e.currentTarget)}
                />

                <button
                  className="btn btn-outline-primary"
                  type="submit"
                  disabled={validate()}
                >
                  <i className="fa-lg fa fa-paper-plane" aria-hidden="true"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
