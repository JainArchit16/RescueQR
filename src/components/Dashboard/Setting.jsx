import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BiCloudUpload } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { FiTrash2 } from "react-icons/fi";
import { getAuth, deleteUser } from "firebase/auth";
import { setAccountType, setsignupData } from "../../slices/authSlice";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { updateProfile } from "firebase/auth";
import { updateDoc, query, where, deleteDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import toast from "react-hot-toast";
import { setProfileData } from "../../slices/profileSlice";
import { logout } from "../../services/operations/authAPI";

const auth = getAuth();

const Setting = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);

  const { register, handleSubmit } = useForm();

  const { accountType, signupData } = useSelector((state) => state.auth);

  const { profileData } = useSelector((state) => state.profile);

  const user = profileData;

  const fetchData = async () => {
    if (auth.currentUser) {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userDataArray = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));

        console.log("All user data:", userDataArray);

        const userWithUid = userDataArray.find(
          (user) => user.id === auth.currentUser.uid
        );

        console.log("User with uid:", userWithUid);

        dispatch(setAccountType(userWithUid.accountType));
      } catch (error) {
        console.error("Error fetching account type:", error.message);
      }
    } else {
      navigate("/login");
    }
  };

  const fetchUserData = async () => {
    if (auth.currentUser) {
      try {
        const querySnapshot = await getDocs(
          collection(db, accountType.toLowerCase())
        );
        const userDataArray = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));

        console.log("All Doctors/patient data:", userDataArray);

        const userWithUid = userDataArray.find(
          (user) => user.email === auth.currentUser.email
        );

        console.log("Doctor/Patient with gmail:", userWithUid);

        dispatch(setProfileData(userWithUid));
      } catch (error) {
        console.error("Error fetching account type:", error.message);
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
    }
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

        await updateProfile(auth.currentUser, {
          photoURL: downloadURL,
        });

        toast.dismiss(toastid);
        toast.success("Upload Successful");

        dispatch(setsignupData(auth.currentUser.toJSON()));
      } else {
        toast.error("No file selected for upload.");
      }
    } catch (error) {
      toast.dismiss(toastid);
      console.error("ERROR MESSAGE - ", error.message);
      toast.error("Error uploading file");
    }
  };

  const handleProfileSubmit = async (data) => {
    const id = toast.loading("Saving...");

    try {
      const q = query(
        collection(db, accountType.toLowerCase()),
        where("email", "==", auth.currentUser.email)
      );

      // Execute the query
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Get the first document from the query result
        const docRef = querySnapshot.docs[0].ref;

        // Update the document with the new data

        const updateData = {
          FirstName: data.firstName === null ? null : data.firstName,
          LastName: data.lastName === null ? null : data.lastName,

          ContactNumber:
            data.contactNumber === null ? null : data.contactNumber,
          Gender: data.gender === null ? null : data.gender,
          about: data.about === null ? null : data.about,
        };
        if (accountType === "DOCTORS") {
          updateData.Speciality =
            data.speciality === null ? null : data.speciality;
          updateData.Qualification =
            data.qualification === null ? null : data.qualification;
          updateData.YearsOfExperience =
            data.yearsOfExperience === null ? null : data.yearsOfExperience;
        }
        if (accountType === "PATIENTS") {
          updateData.DateOfBirth =
            data.dateOfBirth === null ? null : data.dateOfBirth;
        }
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
  };

  const handleDeleteAccount = async () => {
    const id = toast.loading("Deleting...");
    try {
      const q = query(
        collection(db, accountType.toLowerCase()),
        where("email", "==", auth.currentUser.email)
      );

      // Execute the query
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Get the first document from the query result
        const docRef = querySnapshot.docs[0].ref;
        await deleteDoc(docRef);
      }

      const q1 = query(
        collection(db, "users"),
        where("id", "==", auth.currentUser.uid)
      );

      // Execute the query
      const querySnapshotNew = await getDocs(q1);

      if (!querySnapshotNew.empty) {
        // Get the first document from the query result
        const docRef1 = querySnapshotNew.docs[0].ref;
        await deleteDoc(docRef1);
      }

      if (
        auth.currentUser.photoURL.substring(0, 29) !==
        "https://api.dicebear.com/7.x/"
      ) {
        const storage = getStorage();

        // Create a reference to the file to delete
        const desertRef = ref(storage, auth.currentUser.photoURL);

        // console.log(imagePath);

        // Delete the file
        deleteObject(desertRef);
      }

      await deleteUser(auth.currentUser);

      toast.dismiss(id);
      toast.success("Account Deleted");

      dispatch(logout(navigate));

      navigate("/signup");
    } catch (error) {
      toast.dismiss(id);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col p-6 gap-10 w-[80%] mx-auto min-h-screen">
      <h1 className="text-white text-4xl font-inter">Edit Profile</h1>
      <div className="flex flex-col gap-8">
        <div className="flex flex-row gap-4 justify-between items-center text-white bg-[#161D29] p-8 rounded-lg">
          <div className="flex flex-row gap-8 items-center justify-between">
            <img
              src={`${auth.currentUser?.photoURL}`}
              alt="xyz"
              className="aspect-square w-[78px] rounded-full object-cover"
            />
            <div>
              <p className="text-lg my-1">Change Profile Picture</p>
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

        <form onSubmit={handleSubmit(handleProfileSubmit)}>
          <div className="flex flex-col gap-4 justify-between  text-white bg-[#161D29] p-8 rounded-lg">
            <div className="flex flex-row gap-8 items-center justify-between">
              <div>
                <p className="text-lg my-1 font-semibold font-inter">
                  Profile Information
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center justify-between mt-4 w-[70%]">
              <div className="flex flex-col gap-8">
                <label for="firstName">
                  <p className="text-[#F1F2FF]">First Name</p>
                  <input
                    required
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="Enter First Name"
                    defaultValue={user?.FirstName}
                    {...register("firstName", { required: true })}
                    className="bg-[#2C333F] p-2 rounded-md mt-3 focus:outline-none w-[120%]"
                  />
                </label>
                {accountType === "DOCTORS" ? (
                  <label for="speciality">
                    <p className="text-[#F1F2FF]">Date of Birth</p>
                    <input
                      type="text"
                      name="speciality"
                      id="speciality"
                      placeholder="Enter Speciality"
                      defaultValue={user?.Speciality}
                      {...register("speciality")}
                      className="bg-[#2C333F] p-2 rounded-md mt-3 focus:outline-none w-[120%]"
                    />
                  </label>
                ) : (
                  <label for="dateOfBirth">
                    <p className="text-[#F1F2FF]">Date of Birth</p>
                    <input
                      type="date"
                      name="dateOfBirth"
                      id="dateOfBirth"
                      placeholder="Enter DOB"
                      defaultValue={user?.DateOfBirth}
                      {...register("dateOfBirth")}
                      className="bg-[#2C333F] p-2 rounded-md mt-3 focus:outline-none w-[120%]"
                    />
                  </label>
                )}

                <label for="contact">
                  <p className="text-[#F1F2FF]">Contact Number</p>
                  <input
                    type="number"
                    name="contact"
                    id="contact"
                    placeholder="Enter Contact Number"
                    defaultValue={user?.ContactNumber}
                    {...register("contactNumber", {
                      maxLength: {
                        value: 12,
                        message: "Invalid Contact Number",
                      },
                      minLength: {
                        value: 10,
                        message: "Invalid Contact Number",
                      },
                    })}
                    className="bg-[#2C333F] p-2 rounded-md mt-3 focus:outline-none w-[120%]"
                  />
                </label>

                {accountType === "DOCTORS" && (
                  <label for="yearsOfExperience">
                    <p className="text-[#F1F2FF]">Years Of Experience</p>
                    <input
                      type="text"
                      name="yearsOfExperience"
                      id="yearsOfExperience"
                      placeholder="Enter Years Of Experience"
                      defaultValue={user?.YearsOfExperience}
                      {...register("yearsOfExperience")}
                      className="bg-[#2C333F] p-2 rounded-md mt-3 focus:outline-none w-[120%]"
                    />
                  </label>
                )}
              </div>

              <div className="flex flex-col gap-8">
                <label for="lastname">
                  <p className="text-[#F1F2FF]">Last Name</p>
                  <input
                    required
                    type="text"
                    name="lastname"
                    id="lastname"
                    placeholder="Enter Last Name"
                    defaultValue={user?.LastName}
                    {...register("lastName", { required: true })}
                    className="bg-[#2C333F] p-2 rounded-md mt-3 focus:outline-none w-[120%]"
                  />
                </label>

                <label for="gender">
                  <p className="text-[#F1F2FF]">Gender</p>
                  <input
                    type="text"
                    name="gender"
                    id="gender"
                    placeholder="Enter Gender"
                    defaultValue={user?.Gender}
                    {...register("gender")}
                    className="bg-[#2C333F] p-2 rounded-md mt-3 focus:outline-none w-[120%]"
                  />
                </label>

                <label for="about">
                  <p className="text-[#F1F2FF]">About</p>
                  <input
                    type="text"
                    name="about"
                    id="about"
                    placeholder="Enter Bio"
                    defaultValue={user?.about}
                    {...register("about")}
                    className="bg-[#2C333F] p-2 rounded-md mt-3 focus:outline-none w-[150%]"
                  />
                </label>

                {accountType === "DOCTORS" && (
                  <label for="qualification">
                    <p className="text-[#F1F2FF]">Date of Birth</p>
                    <input
                      type="text"
                      name="qualification"
                      id="qualification"
                      placeholder="Enter Qualification"
                      defaultValue={user?.qualification}
                      {...register("qualification")}
                      className="bg-[#2C333F] p-2 rounded-md mt-3 focus:outline-none w-[120%]"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-row-reverse gap-4 mt-6">
            {/* To be edited */}
            <button
              className="py-2 bg-richblack-700 text-[#C5C7D4] rounded-lg px-4 font-semibold"
              onClick={() => {
                navigate("/dashboard/my-profile");
              }}
            >
              Cancel
            </button>
            <button
              className="flex flex-row gap-2 items-center text-black bg-yellow-50 rounded-lg px-4 py-2 font-semibold"
              type="submit"
            >
              <p>Save</p>
            </button>
          </div>
        </form>

        <div className="mt-10 mb-2 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-12 text-white">
          <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
            <FiTrash2 className="text-3xl text-pink-200" />
          </div>
          <div className="flex flex-col space-y-2">
            <h2 className="text-lg font-semibold text-richblack-5">
              Delete Account
            </h2>
            <div className="w-3/5 text-pink-25">
              <p>Would you like to delete account?</p>
              <p>
                This account may contain Paid Courses. Deleting your account is
                permanent and will remove all the contain associated with it.
              </p>
            </div>
            <button
              type="button"
              className="w-fit cursor-pointer italic text-pink-300"
              onClick={handleDeleteAccount}
            >
              I want to delete my account.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
