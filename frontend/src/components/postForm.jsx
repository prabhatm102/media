import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Joi from "joi-browser";
import { savePost } from "../services/postService";
import { PostContext } from "../context/postContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const MySwal = withReactContent(Swal);

export default function PostForm({ user }) {
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
    // if (input.files) setImageUrl("");
    const newData = { ...data };
    if (input.files.length === 0) setImageUrl("");
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
      setImageUrl("");
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

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <div className="post-form  d-flex h-100">
            <Link to="/profile/" className="ms-auto">
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
              <div className="form-group me-2">
                {/* <input
                  type="text"
                  className="form-control"
                  id="message"
                  name="message"
                  placeholder="What's in your mind?"
                  value={data.message}
                  onChange={(e) => handleChange(e.currentTarget)}
                /> */}

                <CKEditor
                  editor={ClassicEditor}
                  data={data.message}
                  onReady={(editor) => {
                    // You can store the "editor" and use when it is needed.
                    // console.log("Editor is ready to use!", editor);
                  }}
                  onChange={(event, editor) => {
                    //const data = editor.getData();
                    //   console.log({ event, editor, data });
                    const newData = { ...data };
                    newData.message = editor.getData();
                    setData(newData);
                  }}
                  onBlur={(event, editor) => {
                    //    console.log("Blur.", editor);
                  }}
                  onFocus={(event, editor) => {
                    //   console.log("Focus.", editor);
                  }}
                />
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
                  className="btn-sm btn-primary me-auto mb-3  m-auto"
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
