import { auth, db } from "../../config/firebase";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// const MyBlogs = () => {
//   const navigate = useNavigate();

//   const [blogs, setBlogs] = useState([]);
//   const fetchUserData = async () => {
//     if (auth.currentUser) {
//       try {
//         const querySnapshot = await getDocs(collection(db, "blogs"));
//         const userDataArray = querySnapshot.docs.map((doc) => ({
//           ...doc.data(),
//         }));

//         console.log("All Doctors/patient data:", userDataArray);

//         const userWithUid = userDataArray.filter(
//           (user) => user.email === auth.currentUser.email
//         );
//         console.log("2");
//         setBlogs(userWithUid);
//         console.log(userWithUid);
//       } catch (error) {
//         console.error("Error fetching account type:", error.message);
//       }
//     } else {
//       navigate("/login");
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   if (blogs.length === 0) {
//     return <div>No Blogs Written</div>;
//   }

//   return (
//     <div className="w-[80%] mx-auto my-5">
//       <div className="flex flex-col gap-5">
//         {blogs?.map((item) => {
//           return (
//             <div className="flex flex-row items-center w-full bg-[#161D29] rounded-xl p-5 px-10 gap-24">
//               <img src={item.thumbnail} className="w-[30%]" />
//               <div className="text-xl font-semibold text-white flex flex-col gap-5">
//                 <p>
//                   Title: <span className="font-light"> {item.name}</span>
//                 </p>
//                 <p>
//                   Description: <span className="font-light"> {item.desc}</span>
//                 </p>
//                 <p>
//                   Tags:
//                   <div className="flex gap-2 my-2">
// {
//   JSON.parse(item.tag).map((tag, index) => (
//     <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
//       <HiClock size={14} />
//       Drafted
//     </p>
//   ));
// }
//                   </div>
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default MyBlogs;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Thead, Tr, Td, Th, Tbody } from "react-super-responsive-table";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/ConfirmationModal";

import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { setCourse, setEditCourse } from "../../slices/courseSlice";
import { formatDate } from "../../utils/formatDate";
import { FaHashtag } from "react-icons/fa";
import toast from "react-hot-toast";
import { deleteObject, getStorage, ref } from "firebase/storage";

const CourseTable = () => {
  const dispatch = useDispatch();

  //test

  const { course } = useSelector((state) => state.course);

  const [blogs, setBlogs] = useState([]);
  const fetchBlogData = async () => {
    if (auth.currentUser) {
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const userDataArray = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));

        console.log("All Doctors/patient data:", userDataArray);

        const userWithUid = userDataArray.filter(
          (user) => user.email === auth.currentUser.email
        );
        setBlogs(userWithUid);
        console.log(userWithUid);
      } catch (error) {
        console.error("Error fetching account type:", error.message);
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, []);

  //test

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleCourseDelete = async (createdAt) => {
    setLoading(true);

    const id = toast.loading("Deleting...");

    try {
      const q = query(
        collection(db, "blogs"),
        where("createdAt", "==", createdAt)
      );

      // Execute the query
      const querySnapshot = await getDocs(q);

      const BlogDataArray = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      console.log("All Doctors/patient data:", BlogDataArray);

      const blogEd = BlogDataArray.find((blog) => blog.createdAt === createdAt);

      console.log("this", blogEd);

      const storage = getStorage();

      // Create a reference to the file to delete
      const desertRef = ref(storage, blogEd.thumbnail);

      await deleteObject(desertRef);

      if (!querySnapshot.empty) {
        // Get the first document from the query result
        const blog = querySnapshot.docs[0].ref;

        // Delete the document using the obtained reference
        await deleteDoc(blog);
      }

      fetchBlogData();

      toast.dismiss(id);
      toast.success("Blog Deleted Successfully");
    } catch (error) {
      toast.dismiss(id);
      toast.error(error.message);
    }

    setConfirmationModal(null);
    setLoading(false);
    dispatch(setEditCourse(false));
    dispatch(setCourse(null));
  };

  return (
    <div className="w-[90%] mx-auto  text-white my-10">
      <Table className="rounded-xl border border-richblack-800 w-[100%]">
        {/* <Thead>
          <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
              Blogs
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Title
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Sub Title
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Actions
            </Th>
          </Tr>
        </Thead> */}
        <Tbody>
          {blogs?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No Blogs found
              </Td>
            </Tr>
          ) : (
            blogs?.map((blog, index) => (
              <Tr
                key={index}
                className="flex gap-x-10 border-b border-richblack-800 px-6 py-8 bg-[#161D29]"
              >
                <Td className="flex flex-1 gap-x-4">
                  <img
                    src={blog?.thumbnail}
                    alt={blog?.name}
                    className="h-[148px] w-[220px] rounded-lg object-cover"
                  />
                  <div className="flex flex-col justify-between">
                    <p className="text-lg font-semibold text-richblack-5">
                      {blog.name}
                    </p>
                    <p className="text-[12px] text-white">
                      Created: {formatDate(blog.createdAt)}
                    </p>
                    <p className="text-xs text-richblack-300">{blog.desc}</p>
                    {JSON.parse(blog.tag).map((tag, index) => (
                      <p
                        className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100"
                        key={index}
                      >
                        <FaHashtag size={14} />
                        {tag}
                      </p>
                    ))}
                  </div>
                </Td>
                <Td className="text-sm font-medium text-richblack-100 ">
                  <button
                    disabled={loading}
                    onClick={() => {
                      dispatch(setEditCourse(true));
                      dispatch(setCourse(blog));
                      navigate(`/dashboard/write-blog`);
                    }}
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-green-500"
                  >
                    <FiEdit2 size={20} />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Do you want to delete this blog?",
                        text2:
                          "All the data related to this blog will be deleted",
                        btn1Text: !loading ? "Delete" : "Loading...",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => {
                              handleCourseDelete(blog.createdAt);
                            }
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      });
                    }}
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CourseTable;
