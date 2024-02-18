import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../config/firebase";

const Details = () => {
  const { email: routeEmail } = useParams();
  const [emaily, setEmail] = useState(routeEmail);
  const fetchUserData = async (mail) => {
    if (mail) {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userDataArray = querySnapshot.docs.map((doc) => doc.data());
        console.log(emaily);
        const userWithUid = userDataArray.find((user) => user.email === emaily);
        console.log(userWithUid);
        setData(userWithUid);
      } catch (error) {
        console.error("Error fetching account type:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchUserData(emaily);
  }, [emaily]);

  const [userData, setData] = useState({});

  return (
    <div className="">
      <div className="bg-white rounded-lg w-[80%] mx-[150px] px-8 py-2 text-center">
        <div className="font-bold text-xl mb-2">Email Sent!</div>
        <p className="text-gray-700 text-base">
          An email has been sent to{" "}
          {userData.FirstName + " " + userData.LastName}'s emergency contact:{" "}
          {userData?.emergContact}
        </p>
      </div>
      <div className="text-white my-5 text-lg mx-5">
        <strong className="text-3xl ">Additional Details -</strong>
        <ul className=" w-fit h-fit my-8 ">
          <li className="my-6">Allergy : {userData?.allergy}</li>
          <li className="my-6">Blood Type : {userData?.bloodType}</li>
          <li className="my-6">Contact : {userData?.phoneNumb}</li>
          {/* <li className="my-6">Contact : {contact}</li> */}
        </ul>
      </div>
    </div>
  );
};

export default Details;
