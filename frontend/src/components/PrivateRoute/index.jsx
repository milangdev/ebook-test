import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(Cookies.get("user"));

  useEffect(() => {
    const checkUser = () => {
      const currentUser = Cookies.get("user");
      if (currentUser !== user) {
        setUser(currentUser);
      }
    };

    checkUser();

    const intervalId = setInterval(checkUser, 10000);

    return () => clearInterval(intervalId);
  }, [user]);

  const isUserDeleted = !user;

  if (isUserDeleted) {
    return <Navigate to="/login" />;
  }

  return children;
};
