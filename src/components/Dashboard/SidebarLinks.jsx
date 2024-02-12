import React from "react";
import * as Icons from "react-icons/vsc";

import { NavLink, matchPath, useLocation } from "react-router-dom";

const SidebarLinks = ({ e, iconName }) => {
  const Icon = Icons[iconName];
  const location = useLocation();

  //See OnClick function Not Done by me

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };
  const getIcon = () => {
    return <Icon className="text-lg" />;
  };

  return (
    <NavLink
      to={e.path}
      // onClick={() => dispatch(resetCourseState())}
      className={` py-2 px-4 relative md:px-8 md:py-2 text-lg font-medium transition-all duration-300 ${
        matchRoute(e.path)
          ? "text-white bg-[#0842a0]"
          : "bg-opacity-0 text-[#96a7bf]"
      }`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-1 bg-yellow-50 
    ${matchRoute(e.path) ? "opacity-100" : "opacity-0"}`}
      ></span>
      <div className="flex flex-row gap-2 items-center">
        {getIcon()}
        <p>{e.name}</p>
      </div>
    </NavLink>
  );
};

export default SidebarLinks;
