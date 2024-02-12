import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebase";
import { toast } from "react-hot-toast";
import { setsignupData } from "../slices/authSlice";
import Loader from "../common/Loader";
import { provider } from "../config/firebase";

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const serializableUserData = result.user.toJSON();
      dispatch(setsignupData(serializableUserData));
      // dispatch(setsignupData(userData));
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const serializableUserData = userCredential.user.toJSON();
      dispatch(setsignupData(serializableUserData));
      console.log(serializableUserData);
      navigate("/");
    } catch (error) {
      const errorMessage = error.message;
      toast.error(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return !loading ? (
    <>
      <div className="flex flex-row justify-between items-center h-fit mx-32 my-auto">
        <div className="w-[30%] bg-[#0842a0] rounded-xl p-10">
          <form
            onSubmit={handleOnSubmit}
            className="flex w-full flex-col gap-y-4 rounded-xl text-[#d3e3fd]"
          >
            <label className="w-full">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[#d3e3fd]">
                Email Address <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type="text"
                name="email"
                value={formData.email}
                onChange={handleOnChange}
                placeholder="Enter email address"
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="w-full rounded-[0.5rem] bg-[#f1f8ff] p-[12px] text-black"
              />
            </label>
            <label className="relative">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[#d3e3fd]">
                Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleOnChange}
                placeholder="Enter Password"
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="w-full rounded-[0.5rem] bg-[#f1f8ff] p-[12px] pr-12 text-black"
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
              <Link to="/forgot-password">
                <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
                  Forgot Password
                </p>
              </Link>
            </label>
          </form>
          <div className="flex flex-col items-center text-[#d3e3fd] gap-y-2 mt-2">
            <button
              type="submit"
              onClick={handleOnSubmit}
              className="mt-6 rounded-[8px] bg-[#f1f8ff] text-black py-[8px] px-[12px] font-medium"
            >
              Login
            </button>
            <div className="text-center">- OR -</div>
            <button
              className="rounded-[8px] bg-[#f1f8ff] text-black py-[8px] px-[12px] font-medium flex flex-row justify-center items-center gap-3"
              onClick={handleGoogle}
            >
              <FaGoogle />
              Login Using Google
            </button>
          </div>
        </div>

        {/* <img
          src={image2}
          alt="doc"
          className="rounded-lg h-[400px] w-[650px] z-50 relative"
        /> */}
      </div>
    </>
  ) : (
    <Loader />
  );
}

export default LoginForm;
