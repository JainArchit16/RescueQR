import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { signupData } = useSelector((state) => state.auth);

  if (signupData === null) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default PrivateRoute;
