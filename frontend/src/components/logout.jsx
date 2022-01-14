import auth from "../services/authService";
import { Redirect } from "react-router-dom";
import { useContext, useEffect } from "react";
import CurrentUser from "../context/currentUser";

const Logout = () => {
  const { setUser } = useContext(CurrentUser);
  auth.logout();
  useEffect(() => {
    setUser(null);
  }, []);
  return <Redirect to="/" />;
};

export default Logout;
