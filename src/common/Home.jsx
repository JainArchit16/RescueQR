import React from "react";

import IconBtn from "./IconBtn";

import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Services from "../components/HomePage/Services";
import Blogs from "../components/HomePage/Blogs";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen">
      <div className="flex flex-row justify-between items-center mx-40 my-16 w-full">
        <div className="text-[#d3e3fd] w-[60%]">
          <p className="text-[50px]  font-semibold">
            Your Car - <br></br>
            <span className="font-bold text-[#032FF2]">Is Our Responsiblity</span> .
          </p>
          <p className="w-[70%] text-xl my-4">
            Welcome to our platform, where we're dedicated to reshaping the landscape of emergency medical response for car accident victims. Our mission is clear: to leverage cutting-edge technology to bridge the gap between accidents and immediate medical care. Through innovative AI-driven solutions, we're committed to revolutionizing the way medical information is accessed and utilized during critical moments.
          </p>
          <IconBtn
            text={"Get QR code"}
            outline={true}
            customClasses={"bg-[#032ff2] my-10"}
          ></IconBtn>
        </div>
        <div className="relative w-[50%]">
          <img
            src="https://nypost.com/wp-content/uploads/sites/2/2019/04/female-auto-worker.jpg?quality=75&strip=all"
            className="h-[400px] w-[450px] rounded-xl z-10 relative"
          ></img>
          <div className="absolute bg-[#032FF2] h-[400px] w-[450px] rounded-xl translate-x-4 -translate-y-[385px]"></div>
        </div>
      </div>
      <div className="flex flex-row  items-center my-24 w-full justify-center gap-5">
        <div className="w-[40%]">
          <img
            src="https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?cs=srgb&dl=pexels-mike-bird-170811.jpg&fm=jpg"
            className="h-[450px] w-[850px] rounded-xl z-10 relative"
          ></img>
        </div>
        <div className="w-[40%]">
          <p className="text-[#032FF2] text-[40px] font-semibold">About Us</p>
          <p className="text-[#d3e3fd] text-lg">
            At the heart of our platform lies a powerful system designed to deliver essential medical reports swiftly and efficiently. Through the seamless integration of AI and image analysis, we provide responders with instant access to vital information crucial for informed decision-making and targeted care. By simplifying the process through a QR code scan, we empower emergency personnel to make rapid, life-saving interventions when time is of the essence. Join us on our journey to redefine emergency medical response and make a tangible impact on the lives of car accident victims worldwide.
          </p>

        </div>
      </div>

      <Services />
      <div className="w-full">
        <p className="text-[#d3e3fd] text-3xl text-center font-semibold">
          Blogs
        </p>
        <Blogs />
      </div>

    </div>
  );
};

export default Home;
