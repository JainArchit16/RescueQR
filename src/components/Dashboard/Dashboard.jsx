import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  return (
    <div className="w-screen flex flex-row h-[100%] min-h-[100vh]">
      <Sidebar />
      <div className="w-full h-full min-h-[100vh]">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
