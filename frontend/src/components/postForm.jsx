import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Joi from "joi-browser";
import { savePost } from "../services/postService";
import { PostContext } from "../context/postContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// import { EditorState } from "draft-js";
// import { Editor } from "react-draft-wysiwyg";

const MySwal = withReactContent(Swal);

export default function PostForm({ user }) {
  // const [editorState, setEditorState] = useState(() =>
  //   EditorState.createEmpty()
  // );
  const [imageUrl, setImageUrl] = useState("");
  const [posts, setPosts] = useContext(PostContext);
  const [data, setData] = useState({
    message: "",
    postFile: undefined,
  });
  const [errors, setErrors] = useState({});
  const schema = {
    message: Joi.string().required().min(1).label("Name"),
    postFile: Joi.any().label("Image"),
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

    if (input.files && input.files.length > 0) {
      const allowedExt = [
        "image/png",
        "image/jpeg",
        "image/vnd.microsoft.icon",
      ];
      if (allowedExt.indexOf(input.files[0].type) === -1) {
        allErrors.postFile = "Please upload only .png/.jpg/.jpeg/.ico images.";
        setErrors(allErrors);
        data.postFile = undefined;
        return;
      }
      newData[input.name] = input.files[0];
      setImageUrl(URL.createObjectURL(input.files[0]));
    } else newData[input.name] = input.value;
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
      const formData = new FormData();
      formData.append("message", data.message);
      formData.append("postFile", data.postFile);

      const response = await savePost(formData);

      const prevPosts = [...posts];
      prevPosts.push(response.data);
      setPosts(prevPosts);
      setData({ message: "", postFile: undefined });
      await MySwal.fire({
        position: "center",
        icon: "success",
        title: "Posted Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errorMessage = { ...errors };
        errorMessage.email = ex.response.data;
        setErrors(errorMessage);
      }
    }
  };
  // const editor = React.useRef(null);
  // function focusEditor() {
  //   editor.current.focus();
  // }
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <div className="post-form  d-flex h-100">
            <Link to="/profile/" className=" ms-auto">
              <img
                src={process.env.REACT_APP_USER_IMAGE_URL + user.file}
                className="img-fluid rounded-pill"
                alt="..."
                width="45"
              />
            </Link>
            <form
              className="d-flex me-auto"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              {/* <div
                className="me-2"
                style={{
                  border: "1px solid black",
                  minHeight: "6em",
                  //cursor: "text",

                  minWidth: "12em",
                }}
                //  onClick={focusEditor}
              // > */}
              <div className="form-group me-2">
                <input
                  type="text"
                  className="form-control"
                  id="message"
                  name="message"
                  placeholder="What's in your mind?"
                  value={data.message}
                  onChange={(e) => handleChange(e.currentTarget)}
                />
                {/* <Editor
                  ref={editor}
                  editorState={editorState}
                  onChange={setEditorState}
                /> */}
              </div>
              <div className="form-group">
                <label className="btn btn-outline-success">
                  <span>
                    <i className=" fa fa-file-image-o"></i>
                  </span>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    className="form-control"
                    id="postFile"
                    name="postFile"
                    onChange={(e) => handleChange(e.currentTarget)}
                  />
                </label>
              </div>
              {data.message.length > 0 && (
                <button
                  className="btn-sm btn-primary mx-2 mb-3  m-auto"
                  type="submit"
                  disabled={validate()}
                >
                  <i className=" fa fa-paper-plane" aria-hidden="true"></i>
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
      <div className="row">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="..."
            className="mx-auto img-fluid img-thumbnail rounded h-50 w-25"
          />
        )}
      </div>
    </div>
  );
}
