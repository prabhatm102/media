import { useState, createContext, useEffect } from "react";
import { getUsers } from "../services/userService";

export const AllUser = createContext();
AllUser.displayName = "AllUser";

export const UsersProvider = (props) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const allUsers = async () => {
      const { data } = await getUsers();
      setUsers(data);
    };
    allUsers();
  }, []);

  return (
    <AllUser.Provider value={[users, setUsers]}>
      {props.children}
    </AllUser.Provider>
  );
};
