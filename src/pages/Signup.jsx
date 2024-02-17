import React, { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import image from "../assets/happy_family.jpg";
import { FaGoogle } from "react-icons/fa";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, provider } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setsignupData } from "../slices/authSlice";
import Loader from "../common/Loader";
import { signInWithPopup, updateProfile } from "firebase/auth";

import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const serializableUserData = result.user.toJSON();

      dispatch(setsignupData(serializableUserData));

      addData();
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  // console.log(auth.currentUser);

  const handleOnSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password does not match");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
        photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`,
      });

      const serializableUserData = userCredential.user.toJSON();

      dispatch(setsignupData(serializableUserData));

      addData();

      setLoading(false);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      navigate("/");
    } catch (error) {
      const { code, message } = error;
      toast.error(message);
      console.error(code, message);
      setLoading(false);
    }
  };

  const addData = async () => {
    try {
      const data = {
        FirstName: firstName,
        LastName: lastName,
        email: email,
        phoneNumb: null,
        model: null,
        emergContact: null,
        carNumb: null,
        allergy: null,
        bloodType: null,
        carPic: null,
        medicalHistory: null,
      };

      const docRef = await addDoc(collection(db, "users"), data);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  return !loading ? (
    <>
      <div className="flex flex-row justify-between items-center mx-32 rounded-xl h-fit my-auto">
        <div className="bg-[#0842a0] rounded-xl p-10 ">
          {/* Form */}
          <form className="flex w-full flex-col gap-y-4  text-[#d3e3fd]">
            <div className="flex gap-x-4 w-full">
              <label className="w-[50%]">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem]">
                  First Name <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={handleOnChange}
                  placeholder="Enter first name"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-full rounded-[0.5rem] bg-[#f1f8ff] text-black p-[12px] "
                />
              </label>
              <label className="w-[50%]">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem]">
                  Last Name <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={handleOnChange}
                  placeholder="Enter Last Name"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-[100%] rounded-[0.5rem] bg-[#f1f8ff] text-black p-[12px] "
                />
              </label>
            </div>
            <label className="w-full">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem]">
                Email Address <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type="text"
                name="email"
                value={email}
                onChange={handleOnChange}
                placeholder="Enter email address"
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="w-full rounded-[0.5rem] bg-[#f1f8ff] text-black p-[12px]"
              />
            </label>
            <div className="flex gap-x-4">
              <label className="relative">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem]">
                  Create Password <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleOnChange}
                  placeholder="Enter Password"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-full rounded-[0.5rem] bg-[#f1f8ff] text-black p-[12px] pr-10"
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                  ) : (
                    <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                  )}
                </span>
              </label>
              <label className="relative">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem]">
                  Confirm Password <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleOnChange}
                  placeholder="Confirm Password"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-full rounded-[0.5rem] bg-[#f1f8ff] text-black p-[12px] pr-10"
                />
                <span
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                  ) : (
                    <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                  )}
                </span>
              </label>
            </div>
          </form>
          <div className="flex flex-col items-center text-[#d3e3fd] gap-y-2 mt-2">
            <button
              type="submit"
              onClick={handleOnSubmit}
              className="mt-6 rounded-[8px] bg-[#f1f8ff] text-black py-[8px] px-[12px] font-medium "
            >
              Create Account
            </button>
            <div className="text-center">- OR -</div>
            <button
              className=" rounded-[8px] bg-[#f1f8ff] text-black py-[8px] px-[12px] font-medium flex flex-row justify-center items-center gap-3"
              onClick={handleGoogle}
            >
              <FaGoogle />
              SignUp Using Google
            </button>
          </div>
        </div>
        <div className="relative">
          <img
            src={image}
            alt="doc"
            className="rounded-lg h-[400px] w-[450px] z-50 relative"
          />
          <div className="absolute w-[450px] h-[400px] bg-[#032ff2] -translate-y-[380px] translate-x-5 rounded-lg"></div>
        </div>
      </div>
    </>
  ) : (
    <Loader />
  );
};

export default Signup;
