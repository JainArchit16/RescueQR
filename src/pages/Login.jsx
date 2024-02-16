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
import image2 from "../assets/car_safety.jpg";

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
    <div className="flex flex-col items-center justify-center">
      <div className="lg:w-full lg:max-w-md bg-[#0842a0] rounded-xl p-6">
        <form
          onSubmit={handleOnSubmit}
          className="flex flex-col gap-4 text-[#d3e3fd]"
        >
          <label className="w-full">
            <p className="mb-1 text-sm text-[#d3e3fd]">
              Email Address <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="email"
              value={formData.email}
              onChange={handleOnChange}
              placeholder="Enter email address"
              className="w-full rounded-md bg-[#f1f8ff] p-2 text-black"
            />
          </label>
          <label className="relative">
            <p className="mb-1 text-sm text-[#d3e3fd]">
              Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              className="w-full rounded-md bg-[#f1f8ff] p-2 pr-10 text-black"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={20} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={20} fill="#AFB2BF" />
              )}
            </span>
            <Link to="/forgot-password">
              <p className="mt-1 text-xs text-blue-100">Forgot Password</p>
            </Link>
          </label>
          <button
            type="submit"
            onClick={handleOnSubmit}
            className="mt-4 rounded-md bg-[#f1f8ff] text-black py-2 px-4 font-medium"
          >
            Login
          </button>
        </form>
        <div className="flex flex-col items-center text-[#d3e3fd] gap-2 mt-4">
          <div className="text-center">- OR -</div>
          <button
            className="rounded-md bg-[#f1f8ff] text-black py-2 px-4 font-medium flex items-center gap-2"
            onClick={handleGoogle}
          >
            <FaGoogle />
            Login Using Google
          </button>
        </div>
      </div>
      <img
        src={image2}
        alt="doc"
        className="rounded-lg h-[200px] w-[300px] my-4 z-50 relative"
      />
    </div>
  ) : (
    <Loader />
  );
}

export default LoginForm;
