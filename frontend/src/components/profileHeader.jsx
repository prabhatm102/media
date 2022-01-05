import React from "react";

export default function ProfileHeader({ user }) {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <div className="profile-header text-center">
            <img
              src={process.env.REACT_APP_USER_IMAGE_URL + user.file}
              className="img-fluid rounded-start img-thumbnail h-25 w-25 mx-auto d-block"
              alt="userDetails"
            />
            <h1>{user.name}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
