import React from "react";
// import { useState } from 'react';
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
// import { AiOutlineCaretDown } from "react-icons/ai";
import { VscDashboard, VscSignOut } from "react-icons/vsc";

import { setsignupData } from "../slices/authSlice";
import { logout } from "../services/operations/authAPI";

const ProfileDropDown = () => {
  const { signupData } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the dropdown state
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Function to close the dropdown when a click is detected outside of it
  const handleClickOutside = (event) => {
    if (isOpen && !event.target.closest(".profile-dropdown")) {
      setIsOpen(false);
    }
  };

  // Effect to add click event listener when the component mounts
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]); // Re-run the effect when isOpen changes

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef(null);

  const handleLogout = () => {
    dispatch(logout(navigate));
    setIsOpen(false);
  };

  return (
    <button className="relative profile-dropdown">
      <img
        src={`${signupData?.photoURL}`}
        alt="xyz"
        className="aspect-square w-[40px] rounded-full object-cover"
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[118%] right-0 z-[1000]  divide-blue-600 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-white"
          ref={ref}
        >
          <Link to="/dashboard/my-profile" onClick={() => setIsOpen(false)}>
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-black hover:bg-gray-300 ">
              <VscDashboard className="text-xl" />
              Profile
            </div>
          </Link>
          <div
            onClick={handleLogout}
            className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-black hover:bg-gray-300 "
          >
            <VscSignOut className="text-lg" />
            Logout
          </div>
        </div>
      )}
    </button>
  );
};

export default ProfileDropDown;
