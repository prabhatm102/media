import http from "./httpServices";

const apiEndpoint = "/users";

export const getUserById = (userId) => {
  return http.get(apiEndpoint + "/" + userId);
};
export const getUsers = () => {
  return http.get(apiEndpoint);
};
export const saveUser = (user) => {
  return http.post(apiEndpoint, user, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateUser = (user, id) => {
  if (user.get("file")) {
    return http.put(apiEndpoint + "/" + id, user, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return http.put(apiEndpoint + "/" + id, user);
};

export const deleteUser = (user) => {
  return http.delete(apiEndpoint + "/" + user._id);
};

export const getFriends = () => {
  return http.get(apiEndpoint + "/getFriends");
};
export const addFriend = (friend) => {
  return http.put(apiEndpoint + "/addFriend", { friend: friend._id });
};
