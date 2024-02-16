import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import IconBtn from "./IconBtn";
import { LuLogIn } from "react-icons/lu";
import { SiGnuprivacyguard } from "react-icons/si";

import { useDispatch, useSelector } from "react-redux";
import { setsignupData } from "../slices/authSlice";
import ProfileDropDown from "../pages/ProfileDropDown";

const Navbar = () => {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const { signupData } = useSelector((state) => state.auth);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // useEffect(() => {
  //   if (menuOpen) {
  //     // Additional logic for handling menu open state
  //   }
  // }, [menuOpen]);

  return (
    <div className="w-full flex flex-col lg:flex-row justify-between p-5 px-10 items-center text-xl text-[#d3e3fd]">
      <div className="flex flex-row items-center sm:my-4 lg:my-0 md:my-2 lg:mb-0 mb-3">
        <img src={logo} alt="logo" className="w-[70px] px-4 md:my-4 lg:my-0" />
        <p className="mt-2 lg:mt-0">RescueQR</p>
      </div>
      <div
        className={`lg:flex lg:flex-row lg:gap-6 mt-2 lg:mt-0 ${
          menuOpen ? "flex gap-4 my-4 lg:my-0" : "hidden sm:my-4 lg:my-0"
        }`}
      >
        <Link to="/">
          <p>Home</p>
        </Link>
        <Link to="/qr">
          <p>QR generator</p>
        </Link>
      </div>
      <div className="flex flex-row gap-2 items-center">
        {!signupData && (
          <>
            <Link to={"/login"}>
              <IconBtn text={"Login"}>
                <LuLogIn></LuLogIn>
              </IconBtn>
            </Link>
            <Link to={"/signup"}>
              <IconBtn
                text={"SignUp"}
                outline={true}
                customClasses={"bg-[#032ff2]"}
              >
                <SiGnuprivacyguard></SiGnuprivacyguard>
              </IconBtn>
            </Link>
          </>
        )}
        {signupData && (
          <div className="flex flex-row gap-6 items-center">
            <ProfileDropDown />
          </div>
        )}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
