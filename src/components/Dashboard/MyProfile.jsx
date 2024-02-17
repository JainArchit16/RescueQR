import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import { AiFillEdit } from "react-icons/ai";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { auth } from "../../config/firebase";

import { setProfileData } from "../../slices/profileSlice";
import Loader from "../../common/Loader";
import { BiCloudUpload } from "react-icons/bi";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { toast } from "react-hot-toast";
import { setsignupData } from "../../slices/authSlice";

const MyProfile = () => {
  const [imageFile, setImageFile] = useState(null);
  const { signupData } = useSelector((state) => state.auth);

  const { profileData } = useSelector((state) => state.profile);

  const user = profileData;

  const [loading, setLoading] = useState(true);

  // console.log(profileData);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const fetchData = async () => {
  //   if (auth.currentUser) {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "users"));
  //       const userDataArray = querySnapshot.docs.map((doc) => ({
  //         ...doc.data(),
  //       }));

  //       console.log("All user data:", userDataArray);

  //       const userWithUid = userDataArray.find(
  //         (user) => user.id === auth.currentUser?.uid
  //       );

  //       console.log("User with uid:", userWithUid);
  //     } catch (error) {
  //       console.error("Error fetching account type:", error.message);
  //     }
  //   } else {
  //     navigate("/login");
  //   }
  // };

  const fetchUserData = async () => {
    if (auth.currentUser) {
      try {
        console.log("1");

        const querySnapshot = await getDocs(collection(db, "users"));
        const userDataArray = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));

        // console.log("All Doctors/patient data:", userDataArray);

        const userWithUid = userDataArray.find(
          (user) => user.email === auth.currentUser.email
        );

        console.log("Doctor/Patient with gmail:", userWithUid);

        dispatch(setProfileData(userWithUid));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching account type:", error.message);
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fileInputRef = useRef(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
    }
  };
  const handleClick = () => {
    fileInputRef.current.click();
  };
  const handleFileUpload = async () => {
    const toastid = toast.loading("Uploading");

    try {
      if (imageFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${imageFile.name}`);

        const uploadTask = await uploadBytesResumable(storageRef, imageFile);

        console.log(uploadTask);
        const downloadURL = await getDownloadURL(uploadTask.ref);

        console.log(downloadURL);

        const id = toast.loading("Saving...");

        try {
          const q = query(
            collection(db, "users"),
            where("email", "==", auth.currentUser.email)
          );

          // Execute the query
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // Get the first document from the query result
            const docRef = querySnapshot.docs[0].ref;

            // Update the document with the new data

            const updateData = {
              // FirstName: data.firstName === null ? null : data.firstName,
              // LastName: data.lastName === null ? null : data.lastName,

              // ContactNumber:
              //   data.contactNumber === null ? null : data.contactNumber,
              // Gender: data.gender === null ? null : data.gender,
              // about: data.about === null ? null : data.about,
              carPic: downloadURL,
            };

            // updateData.Speciality =
            //   data.speciality === null ? null : data.speciality;
            // updateData.Qualification =
            //   data.qualification === null ? null : data.qualification;
            // updateData.YearsOfExperience =
            //   data.yearsOfExperience === null ? null : data.yearsOfExperience;

            // updateData.DateOfBirth =
            //   data.dateOfBirth === null ? null : data.dateOfBirth;

            await updateDoc(docRef, updateData);
          }

          fetchUserData();

          console.log("Document updated successfully!");

          toast.dismiss(id);
          toast.success("Profile updated successfully!");
        } catch (error) {
          toast.dismiss(id);
          console.error("ERROR MESSAGE - ", error.message);
          toast.error("Error updating profile");
        }

        toast.dismiss(toastid);
        toast.success("Upload Successful");
      } else {
        toast.error("No file selected for upload.");
      }
    } catch (error) {
      toast.dismiss(toastid);
      console.error("ERROR MESSAGE - ", error.message);
      toast.error("Error uploading file");
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="flex flex-col p-6 gap-10 w-[80%] mx-auto">
      <h1 className="text-white text-4xl font-inter">My Profile</h1>
      <div className="flex flex-col gap-8">
        <div className="flex flex-row gap-4 justify-between items-center text-white bg-[#161D29] p-8 rounded-lg">
          <div className="flex flex-row gap-8 items-center justify-between">
            <img
              src={`${auth.currentUser?.photoURL}`}
              alt="xyz"
              className="aspect-square w-[78px] rounded-full object-cover"
            />
            <div>
              <p className="text-lg">{user.FirstName + " " + user.LastName}</p>
              <p className="text-[#838894] text-md">
                {auth.currentUser?.email}
              </p>
            </div>
          </div>
          <IconBtn
            text="Edit"
            onClick={() => {
              navigate("/dashboard/settings");
            }}
          >
            <AiFillEdit />
          </IconBtn>
        </div>
        <div className="flex flex-row gap-4 justify-between items-center text-white bg-[#161D29] p-8 rounded-lg">
          <div className="flex flex-row gap-8 items-center justify-between">
            <img
              src={
                user?.carPic
                  ? user.carPic
                  : "https://blog.snappymob.com/wp-content/uploads/2020/12/8-Tips-for-Designing-Empty-Placeholder-Pages-Leni-Featured.png"
              }
              alt="xyz"
              className="aspect-square w-[150px] object-cover"
            />

            <div>
              <p className="text-lg my-1">Upload Car Picture</p>
              <div className="flex flex-row gap-4 mt-2">
                <button
                  className="py-2 bg-richblack-700 text-[#C5C7D4] rounded-lg px-4 font-semibold"
                  onClick={handleClick}
                >
                  Select
                </button>
                <button
                  className="flex flex-row gap-2 items-center text-black bg-yellow-50 rounded-lg px-4 py-2 font-semibold"
                  onClick={handleFileUpload}
                >
                  <p>Upload</p>
                  <BiCloudUpload className="text-lg" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept="image/png, image/gif, image/jpeg"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4 justify-between items-center text-white bg-[#161D29] p-8 rounded-lg">
          <div className="flex flex-col gap-10  justify-between">
            <p className="text-lg">Medical History</p>
            <p className="text-[#838894] text-md">
              {user?.medicalHistory === null
                ? "Write About YOur Medical History"
                : `${user?.medicalHistory}`}
            </p>
          </div>
          <IconBtn
            text="Edit"
            onClick={() => {
              navigate("/dashboard/settings");
            }}
          >
            <AiFillEdit />
          </IconBtn>
        </div>
        <div className="flex flex-row gap-4 justify-between items-center text-white bg-[#161D29] p-8 rounded-lg w-full">
          <div className="flex flex-col gap-10  justify-between w-full">
            <div className="flex flex-row w-full justify-between items-center">
              <p className="text-lg">Profile Details</p>

              <IconBtn
                text="Edit"
                onClick={() => {
                  navigate("/dashboard/settings");
                }}
              >
                <AiFillEdit />
              </IconBtn>
            </div>

            <div className="flex flex-row gap-40 w-[80%]">
              <div className="flex flex-col gap-8 w-[55%]">
                <div>
                  <p>Email</p>
                  <p className="text-[#838894]">{auth.currentUser?.email}</p>
                </div>

                <div>
                  <p>Car Model</p>
                  <p className="text-[#838894]">
                    {user?.model ? `${user?.model}` : "Add Model"}
                  </p>
                </div>
                <div>
                  <p>Car Number</p>
                  <p className="text-[#838894]">
                    {user?.carNumb ? `${user?.carNumb}` : "Add Car Number"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between w-[55%]">
                <div>
                  <p>Contact </p>
                  <p className="text-[#838894]">
                    {user?.phoneNumb ? `${user?.phoneNumb}` : "Add Contact"}
                  </p>
                </div>
                <div>
                  <p>Emergency Contact</p>
                  <p className="text-[#838894]">
                    {user?.emergContact
                      ? `${user?.emergContact}`
                      : "Add Emergency Contact"}
                  </p>
                </div>
                <div>
                  <p>Allergy</p>
                  <p className="text-[#838894]">
                    {user?.allergy ? `${user?.allergy}` : "Add Allergy"}
                  </p>
                </div>
                <div>
                  <p>Blood Type</p>
                  <p className="text-[#838894]">
                    {user?.bloodType ? `${user?.bloodType}` : "Add Blood Type"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
