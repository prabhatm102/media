import React, { useContext, useEffect, useState } from "react";
import ModalHeader from "./common/modalHeader";
import Input from "./common/input";
import Joi from "joi-browser";
import auth from "../services/authService";
import { updateUser } from "../services/userService";
import { toast } from "react-toastify";
import CurrentUser from "../context/currentUser";

export default function UserModel({ user, users, setUsers }) {
  const currentUserContext = useContext(CurrentUser);

  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [imageUrl, setImageUrl] = useState();
  useEffect(() => {
    user &&
      setData({
        //  _id: user._id,
        name: user.name,
        email: user.email,
        //    password: user.password,
        file: "",
        isActive: user.isActive,
        isAdmin: user.isAdmin,
      });
  }, [user]);

  const schema = {
    name: Joi.string().required().min(3).label("Name"),
    email: Joi.string().email().required().label("Email"),

    file: Joi.any().label("Image"),
    isActive: Joi.boolean(),
    isAdmin: Joi.boolean(),
  };
  const validateProperty = (input) => {
    if (input.type === "checkbox") input.value = Boolean(input.checked);
    const obj = { [input.name]: input.value };

    const singleSchema = {
      [input.name]: schema[input.name],
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
        allErrors.file = "Please upload only .png/.jpg/.jpeg/.ico images.";
        setErrors(allErrors);
        data.file = undefined;
        return;
      }

      newData[input.name] = input.files[0];
      setImageUrl(URL.createObjectURL(input.files[0]));
    } else if (input.type === "checkbox") {
      newData[input.name] = Boolean(input.checked);
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
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.file !== "") formData.append("file", data.file);
      formData.append("isAdmin", data.isAdmin);
      formData.append("isActive", data.isActive);

      const res = await updateUser(formData, user._id);
      if (res.status === 202) toast.success("User has been updated");
      else {
        toast.success("Your information has been updated!");
        auth.loginWithJwt(res.headers["x-auth-token"]);
        currentUserContext.setUser(res.data);
      }
      const allUsers = [...users];
      const index = allUsers.indexOf(user);
      allUsers[index] = { ...res.data };
      setUsers(allUsers);
    } catch (ex) {
      if (ex.response && ex.response.status === 409) {
        const errorMessage = { ...errors };
        errorMessage.email = ex.response.data;
        setErrors(errorMessage);
      }
    }
  };

  return (
    <div>
      <div
        className="modal fade"
        id="updateUser"
        tabIndex="-1"
        aria-labelledby="updateUserLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <ModalHeader title="Update User" />
            <div className="modal-body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <Input
                  type="text"
                  label="Name"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <Input
                  type="email"
                  label="Email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                {/* <Input
                    type="password"
                    label="Password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    error={errors.password}
                  /> */}
                <div className="form-group offset-3 col-6 my-2">
                  Profile Picture
                  <label className="btn">
                    <span>
                      {user && (
                        <div className="text-center m-2">
                          {" "}
                          <img
                            src={
                              imageUrl ||
                              process.env.REACT_APP_USER_IMAGE_URL + user.file
                            }
                            alt="..."
                            className="img-fluid img-thumbnail rounded h-75 w-75"
                          />
                        </div>
                      )}
                    </span>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      className="form-control"
                      id="file"
                      name="file"
                      onChange={(e) => handleChange(e.currentTarget)}
                    />
                  </label>
                </div>

                <div className="form-check offset-3 col-6 my-2">
                  <input
                    type="checkbox"
                    label="Active"
                    id="isActive"
                    name="isActive"
                    onChange={(e) => handleChange(e.currentTarget)}
                    checked={data.isActive}
                    className="form-check-input"
                  />
                  <label className="form-check-label">isActive</label>
                </div>
                <div className="form-check offset-3 col-6 my-2">
                  <input
                    type="checkbox"
                    label="Admin"
                    name="isAdmin"
                    id="isAdmin"
                    onChange={(e) => handleChange(e.currentTarget)}
                    checked={data.isAdmin}
                    className="form-check-input"
                  />
                  <label className="form-check-label" htmlFor="">
                    isAdmin
                  </label>
                </div>

                <div className="offset-3 col-6 my-2">
                  <button
                    type="button"
                    className="btn btn-secondary "
                    data-bs-dismiss="modal"
                    onClick={() => setImageUrl()}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary mx-3"
                    disabled={validate()}
                    data-bs-dismiss="modal"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
