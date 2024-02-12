import React, { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../App.css";

// Icons
import { FaStar } from "react-icons/fa";

// Import required modules
import { Autoplay, FreeMode, Pagination, Navigation } from "swiper/modules";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import IconBtn from "../../common/IconBtn";
import { useNavigate } from "react-router-dom";

function Blogs() {
  const [Blogs, setBlogs] = useState([]);
  const truncateWords = 15;

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const blogDataArray = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));

        console.log("All Doctors/patient data:", blogDataArray);

        setBlogs(blogDataArray);
      } catch (error) {
        console.error("Error fetching account type:", error.message);
      }
    })();
  }, []);

  return (
    <div className="text-white w-[80%] mx-auto">
      <div className="my-[50px]  max-w-maxContentTab lg:max-w-maxContent">
        <Swiper
          slidesPerView={3}
          spaceBetween={25}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full "
        >
          {Blogs.map((blog, i) => {
            return (
              <SwiperSlide key={i}>
                <div className=" flex flex-col gap-3 bg-[#161D29] p-3 text-[17px] text-richblack-25 rounded-lg items-center">
                  <div className="gap-4 flex flex-col items-center">
                    <img
                      src={blog.thumbnail}
                      alt={blog.name}
                      className="h-[150px] w-[240px] object-cover rounded-lg"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <h1 className="font-semibold text-richblack-5">{`${blog.name}`}</h1>
                      <h2 className="text-[15px] font-medium text-richblack-500">
                        by: {blog.by}
                      </h2>
                    </div>
                  </div>
                  <p className="font-medium text-richblack-25">
                    {blog?.desc.split(" ").length > truncateWords
                      ? `${blog?.desc
                          .split(" ")
                          .slice(0, truncateWords)
                          .join(" ")} ...`
                      : `${blog?.desc}`}
                  </p>
                  <IconBtn
                    text={"Read More..."}
                    onClick={() => navigate("/blog-page")}
                  />
                </div>
              </SwiperSlide>
            );
          })}
          {/* <SwiperSlide>Slide 1</SwiperSlide> */}
        </Swiper>
      </div>
    </div>
  );
}

export default Blogs;
