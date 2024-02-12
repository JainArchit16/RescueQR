import { setsignupData } from "../../slices/authSlice";
import { auth } from "../../config/firebase";
import { toast } from "react-hot-toast";
import { signOut } from "firebase/auth";
import { setProfileData } from "../../slices/profileSlice";

export const logout = (navigate) => {
  return async (dispatch) => {
    signOut(auth)
      .then(() => {
        toast.success("Logged out successfully");
        dispatch(setsignupData(null));

        dispatch(setProfileData(null));
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
};
