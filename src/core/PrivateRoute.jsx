import React from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { signupData } = useSelector((state) => state.auth);

  if (signupData === null) {
    toast.error("Login Required");
    return <Navigate to="/login" />;
  }
  return children;
};

export default PrivateRoute;
