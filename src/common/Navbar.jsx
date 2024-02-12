import React, { useEffect } from "react";
import logo from "../assets/RescueQR_logo.png";
import { Link } from "react-router-dom";
import IconBtn from "./IconBtn";
import { LuLogIn } from "react-icons/lu";
import { SiGnuprivacyguard } from "react-icons/si";

import { useDispatch, useSelector } from "react-redux";
import { setsignupData } from "../slices/authSlice";
import ProfileDropDown from "../pages/ProfileDropDown";

const Navbar = () => {
  const dispatch = useDispatch();

  const { signupData } = useSelector((state) => state.auth);

  return (
    <div className="w-full flex flex-row justify-between p-5 px-10 items-center text-xl text-[#d3e3fd]">
      <div className="flex flex-row items-center">
        <img src={logo} alt="logo" className="w-[70px] px-4" />
        <p>RescueQR</p>
      </div>
      <div className="flex flex-row gap-6">
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
      </div>
    </div>
  );
};

export default Navbar;
