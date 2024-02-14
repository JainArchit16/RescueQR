import React, { useState } from "react";
import { sidebarLinks } from "../../data/sidebarLinks";

import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";

import SidebarLinks from "./SidebarLinks";
import { useNavigate } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";
import ConfirmationModal from "../../common/ConfirmationModal";
import toast from "react-hot-toast";
import { setsignupData } from "../../slices/authSlice";
import { logout } from "../../services/operations/authAPI";

const Sidebar = () => {
  //   const { user, loading: profileLoading } = useSelector(
  //     (state) => state.profile
  //   );

  const [confirmationModal, setConfirmationModal] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

 

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  return (
    <div className="w-[20%]  min-h-[100%]">
      <div className="flex flex-col border-r-[1px] border-white h-[100%] bg-[#071a2b] py-10 text-white gap-4 w-full min-h-screen">
        <div className="flex flex-col gap-3 h-full">
          {sidebarLinks.map((element) => {
            
              return (
                <SidebarLinks
                  key={element.id}
                  e={element}
                  iconName={element.icon}
                />
              );
            
          })}
        </div>

        <div className="mx-auto my-4 h-[1px] w-10/12 bg-richblack-600"></div>

        <div className="flex flex-col gap-2">
          <SidebarLinks
            e={{ name: "Settings", path: "/dashboard/settings" }}
            iconName={"VscSettingsGear"}
          />

          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: handleLogout,
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="px-8 py-2 text-lg font-medium text-[#96a7bf]"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default Sidebar;
