import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { useState } from "react";
import { useEffect } from "react";

import ChipInput from "./ChipInput";

import IconBtn from "../../common/IconBtn";

import toast from "react-hot-toast";
import Upload from "./Upload";
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { setCourse, setEditCourse } from "../../slices/courseSlice";

const Writeblog = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const { editCourse, course } = useSelector((state) => state.course);

  const navigate = useNavigate();

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.courseTitle !== course.name ||
      currentValues.courseShortDesc !== course.desc ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseImage !== course.thumbnail
    ) {
      return true;
    }
    return false;
  };

  const onSubmit = async (data) => {
    if (editCourse) {
      const toastid = toast.loading("Saving Changes");
      if (isFormUpdated()) {
        const currentValues = getValues();
        const formData = {};

        if (currentValues.courseTitle !== course.name) {
          formData.name = data.courseTitle;
        }
        if (currentValues.courseShortDesc !== course.desc) {
          formData.desc = data.courseShortDesc;
        }

        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.tag = JSON.stringify(data.courseTags);
        }

        if (currentValues.courseImage !== course.thumbnail) {
          formData.thumbnail = data.courseImage;
        }

        if (currentValues.courseShort !== course.subName) {
          formData.subName = data.courseShort;
        }
        formData.updatedAt = Date.now();

        setLoading(true);

        // const result = await editCourseDetails(token, formData);

        const q = query(
          collection(db, "blogs"),
          where("createdAt", "==", course.createdAt)
        );

        // Execute the query
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Get the first document from the query result
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, formData);
        }
        toast.dismiss(toastid);
        toast.success("Saved Changes");
        navigate("/dashboard/my-blogs");
        setLoading(false);
        dispatch(setEditCourse(false));
        dispatch(setCourse(null));
      } else {
        toast.dismiss(toastid);
        toast.error("No changes made to the form");
      }
      return;
    }

    //Not by me
    const toastid = toast.loading("Uploading...");
    try {
      const formData = {
        name: data.courseTitle,
        subName: data.courseShort,
        desc: data.courseShortDesc,
        tag: JSON.stringify(data.courseTags),
        email: auth.currentUser.email,
        uid: auth.currentUser.uid,
        createdAt: Date.now(),
        by: auth.currentUser.displayName,
        updatedAt: null,
      };

      //test
      const imageFile = data.courseImage;

      if (imageFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${imageFile.name}`);

        const uploadTask = await uploadBytesResumable(storageRef, imageFile);

        console.log(uploadTask);
        const downloadURL = await getDownloadURL(uploadTask.ref);

        formData.thumbnail = downloadURL;

        console.log(downloadURL);
      } else {
        toast.error("No file selected for upload.");
      }

      //test

      setLoading(true);

      const docRef = await addDoc(collection(db, "blogs"), formData);
      console.log("Document written with ID: ", docRef.id);
      toast.dismiss(toastid);
      setLoading(false);
      toast.success("Uploaded");
      navigate("/dashboard/my-blogs");
    } catch (error) {
      toast.dismiss(toastid);
      console.error("ERROR MESSAGE - ", error.message);
      toast.error("Error uploading file");
    }
  };

  useEffect(() => {
    if (editCourse) {
      setValue("courseTitle", course.name);

      setValue("courseShort", course.subName);

      setValue("courseShortDesc", course.desc);

      setValue("courseTags", course.tag);

      setValue("courseImage", course.thumbnail);
    }
    console.log("hello", course);
  }, []);

  return (
    <div className="w-[70%] mx-auto bg-[#161D29] text-white rounded-md">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 my-12"
      >
        {/* Course Title */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="courseTitle">
            Blog Title <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="courseTitle"
            placeholder="Enter Blog Title"
            {...register("courseTitle", { required: true })}
            className="form-style w-full bg-[#D3E3FD] text-black py-2 px-3 rounded-lg focus:outline-none"
          />
          {errors.courseTitle && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Blog title is required
            </span>
          )}
        </div>

        {/* Course Title */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="courseTitle">
            Blog Sub Title <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="courseShort"
            placeholder="Enter Blog Subtitle"
            {...register("courseShort", { required: true })}
            className="form-style w-full bg-[#D3E3FD] text-black py-2 px-3 rounded-lg focus:outline-none"
          />
          {errors.courseShort && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Blog Subtitle is required
            </span>
          )}
        </div>
        {/* Course Short Description */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
            Blog Description <sup className="text-pink-200">*</sup>
          </label>
          <textarea
            id="courseShortDesc"
            placeholder="Enter Description"
            {...register("courseShortDesc", { required: true })}
            className="form-style resize-x-none min-h-[130px] w-full bg-[#D3E3FD] text-black py-2 px-3 rounded-lg focus:outline-none"
          />
          {errors.courseShortDesc && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Blog Description is required
            </span>
          )}
        </div>

        <ChipInput
          label="Tags"
          name="courseTags"
          placeholder="Enter Tags"
          register={register}
          error={errors}
          setValue={setValue}
          getValues={getValues}
        />

        <Upload
          name="courseImage"
          label="Blog Thumbnail"
          register={register}
          setValue={setValue}
          errors={errors}
          editData={editCourse ? course?.thumbnail : null}
          placeholder="Enter Blog Thumbnail"
        />

        <div className="flex gap-5 w-[100%] flex-row-reverse">
          {!editCourse ? (
            <IconBtn
              text={"Upload"}
              type="submit"
              customClasses={"bg-[white] text-black font-semibold"}
            />
          ) : (
            <IconBtn
              text={"Save Changes"}
              type="submit"
              customClasses={"bg-[white] text-black font-semibold"}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default Writeblog;
