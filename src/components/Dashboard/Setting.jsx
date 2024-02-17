import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BiCloudUpload } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { FiTrash2 } from "react-icons/fi";
import { getAuth, deleteUser } from "firebase/auth";
import { setsignupData } from "../../slices/authSlice";
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
  const [medicalHistory, setMedicalHistory] = useState("");
  const { register, handleSubmit } = useForm();

  const { signupData } = useSelector((state) => state.auth);

  const { profileData } = useSelector((state) => state.profile);

  const user = profileData;

  // const fetchData = async () => {
  //   if (auth.currentUser) {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "users"));
  //       const userDataArray = querySnapshot.docs.map((doc) => ({
  //         ...doc.data(),
  //       }));

  //       console.log("All user data:", userDataArray);

  //       const userWithUid = userDataArray.find(
  //         (user) => user.id === auth.currentUser.uid
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
        const querySnapshot = await getDocs(collection(db, "users"));
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

  // useEffect(() => {
  //   fetchData();
  // }, []);

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
        collection(db, "users"),
        where("email", "==", auth.currentUser.email)
      );

      // Execute the query
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Get the first document from the query result
        const docRef = querySnapshot.docs[0].ref;

        // Update the document with the new data
        // FirstName: firstName,
        // LastName: lastName,
        // email: email,
        // phoneNumb:null,
        // model: null,
        // emergContact:null,carNumb:null,allergy:null,bloodType:null,carPic:null
        const updateData = {
          FirstName: data.firstName === null ? null : data.firstName,
          LastName: data.lastName === null ? null : data.lastName,

          phoneNumb: data.phoneNumb === null ? null : data.phoneNumb,
          model: data.model === null ? null : data.model,
          emergContact: data.emergContact === null ? null : data.emergContact,
        };

        updateData.carNumb = data.carNumb === null ? null : data.carNumb;
        updateData.allergy = data.allergy === null ? null : data.allergy;
        updateData.bloodType = data.bloodType === null ? null : data.bloodType;
        updateData.medicalHistory =
          data.medicalHistory === null ? null : data.medicalHistory;
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
        collection(db, "users"),
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
            {/* // FirstName: firstName,
LastName: lastName,
email: email,
phoneNumb:null,
model: null,
emergContact:null,carNumb:null,allergy:null,bloodType:null,carPic:null */}
            <div>
              <label
                htmlFor="medicalHistory"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Medical History
              </label>
              <textarea
                id="medicalHistory"
                rows="4"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Describe here..."
                {...register("medicalHistory", { required: true })}
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
              ></textarea>
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
                <label for="lastname">
                  <p className="text-[#F1F2FF]">Last Name</p>
                  <input
                    required
                    type="text"
                    name="LastName"
                    id="lastname"
                    placeholder="Enter Last Name"
                    defaultValue={user?.LastName}
                    {...register("lastName", { required: true })}
                    className="bg-[#2C333F] p-2 rounded-md mt-3 focus:outline-none w-[120%]"
                  />
                </label>
                <label for="about">
                  <p className="text-[#F1F2FF]">Model</p>
                  <input
                    type="text"
                    name="model"
                    id="about"
                    placeholder="Enter model"
                    defaultValue={user?.model}
                    {...register("model")}
                    className="bg-[#2C333F] p-2 rounded-md mt-3 focus:outline-none w-[150%]"
                  />
                </label>

                <label for="contact">
                  <p className="text-[#F1F2FF]">Contact Number</p>
                  <input
                    type="number"
                    name="phoneNumb"
                    id="contact"
                    placeholder="Enter Contact Number"
                    defaultValue={user?.phoneNumb}
                    {...register("phoneNumb")}
                    className="bg-[#2C333F] p-2 rounded-md mt-3 focus:outline-none w-[120%]"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-8">
                <label for="emergContact">
                  <p className="text-[#F1F2FF]">Emergency contact</p>
                  <input
                    type="text"
                    name="emergContact"
                    id="about"
                    placeholder="Enter emergency contact"
                    defaultValue={user?.emergContact}
                    {...register("emergContact")}
                    className="bg-[#2C333F] p-2 rounded-md mt-3 focus:outline-none w-[150%]"
                  />
                </label>
                <label for="carNumb">
                  <p className="text-[#F1F2FF]">Car Number</p>
                  <input
                    type="text"
                    name="carNumb"
                    id="carNumb"
                    placeholder="Enter car number"
                    defaultValue={user?.carNumb}
                    {...register("carNumb")}
                    className="bg-[#2C333F] p-2 rounded-md mt-3 focus:outline-none w-[150%]"
                  />
                </label>
                <label for="allergy">
                  <p className="text-[#F1F2FF]">Allergy</p>
                  <input
                    type="text"
                    name="allergy"
                    id="allergy"
                    placeholder="Enter type of allergy"
                    defaultValue={user?.allergy}
                    {...register("allergy")}
                    className="bg-[#2C333F] p-2 rounded-md mt-3 focus:outline-none w-[150%]"
                  />
                </label>
                <label for="bloodType">
                  <p className="text-[#F1F2FF]">Blood type</p>
                  <input
                    type="text"
                    name="bloodType"
                    id="bloodType"
                    placeholder="Enter Bloodtype"
                    defaultValue={user?.bloodType}
                    {...register("bloodType")}
                    className="bg-[#2C333F] p-2 rounded-md mt-3 focus:outline-none w-[150%]"
                  />
                </label>
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
            <div className=" text-pink-25">
              <p>Would you like to delete account?</p>
              <p>
                Deleting your account is permanent and will remove all the
                contain associated with it.
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
