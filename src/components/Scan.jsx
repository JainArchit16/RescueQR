import React, { useRef, useState } from "react";
import image from "../assets/upload_image.png";
import { BiCloudUpload } from "react-icons/bi";
import upload from "../assets/upload.png";

const Scan = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(image);
  const [imageFile, setImageFile] = useState(null);
  //   const fileInputRef = useRef(null);
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
  //   const handleFileChange = (e) => {
  //     const file = e.target.files[0];
  //     setSelectedFile(file);
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setPreviewUrl(reader.result);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };

  const handleFileUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      console.log("Uploading file:", selectedFile);
    } else {
      console.log("No file selected");
    }
  };

  return (
    <div className="flex flex-col justify-between items-center">
      <div className="text-white flex flex-row items-center gap-16">
        <div className="text-white mx-[100px]  my-[50px] w-[40%] text-lg">
          <ul className="list-disc">
            <li className="my-6">
              <strong>Image Upload Feature : </strong>
              <span>
                This is a feature on the website that allows you to upload
                images for scanning via an advanced AI system.
              </span>
            </li>
            <li className="my-6">
              <strong>Comprehensive Analysis : </strong>
              <span>
                Once you've submitted your image, it undergoes comprehensive
                analysis by the AI algorithm.
              </span>
            </li>
            <li className="my-6">
              <strong>Access Granted : </strong>
              <span>
                If your uploaded image meets the acceptance criteria set by the
                AI, you'll gain access to the required information.
              </span>
            </li>
            <li className="my-6">
              <strong>Redirection on Failure : </strong>
              <span>
                However, if your uploaded image doesn't meet the acceptance
                criteria, you'll be automatically redirected to an alternative
                page.
              </span>
            </li>
          </ul>
        </div>
        {/* <div className="flex mx-[30px] my-[100px] w-fit  h-fit border border-white py-10 rounded-lg">
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="mx-8"
            style={{ maxWidth: "100%", maxHeight: "200px" }}
          />
        )}
        <div>
          <input type="file" onChange={handleFileChange} className="my-10" />
          <button
            onClick={handleUpload}
            className="mx-5 bg-blue-700 p-2 rounded-lg"
          >
            Upload
          </button>
        </div>
      </div> */}

        <div className="flex flex-row gap-4 justify-between items-center text-white bg-[#161D29] p-8 rounded-lg">
          <div className="flex flex-row gap-8 items-center justify-between">
            <img
              src={upload}
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
      </div>
    </div>
  );
};

export default Scan;
