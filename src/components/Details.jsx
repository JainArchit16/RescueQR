import React, { useEffect } from "react";

const Details = ({
  personName,
  emergencyContact,
  allergy,
  bloodType,
  contact,
}) => {
  return (
    <div className="">
      <div className="bg-white rounded-lg w-[80%] mx-[150px] px-8 py-2 text-center">
        <div className="font-bold text-xl mb-2">Email Sent!</div>
        <p className="text-gray-700 text-base">
          An email has been sent to {personName}'s emergency contact:{" "}
          {emergencyContact}
        </p>
      </div>
      <div className="text-white my-5 text-lg mx-5">
        <strong className="text-3xl ">Additional Details -</strong>
        <ul className=" w-fit h-fit my-8 ">
          <li className="my-6">Allergy : {allergy}</li>
          <li className="my-6">Blood Type : {bloodType}</li>
          <li className="my-6">Contact : {contact}</li>
        </ul>
      </div>
    </div>
  );
};

export default Details;
