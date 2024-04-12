import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  loadUserData,
  UPDATE_START,
  UPDATE_SUCCESS,
  UPDATE_FAILURE,
  LOGOUT
} from "../../features/user/userSlice";
import Cookies from "js-cookie";

const ProfileModal = ({handleCloseModal}) => {
  const { userData } = useSelector((store) => store.user);
  const token = Cookies.get('token')
  

  const navigate = useNavigate()
  const handleRequest = async () => {
      try {
        dispatch(UPDATE_START());
        const res = await axios.put(
          process.env.REACT_APP_BACKEND_URL +
            "api/users/request/" +
            userData._id,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data);
        dispatch(UPDATE_SUCCESS(res.data));
        dispatch(loadUserData());
        toast.success("Request Sent");
      } catch (error) {
        dispatch(UPDATE_FAILURE());
        console.log(error);
        toast.error("Something Went Wrong!");
      }
    
  };
  
  const dispatch = useDispatch();
  const handleLogout = () => {
    handleCloseModal()
    navigate("/login");
    dispatch(LOGOUT());
    toast.info("Logout Successfully");
  };
  return (
      <div className=" bg-white  border-slate-100 border-2 break-all absolute top-[100%] right-[17px]  shadow-xl rounded-xl p-10 w-full max-w-[350px] grid gap-8">
        <div className="">
          <div className="flex items-center gap-4">
            <img
              src={userData.profilePic}
              className="w-32 h-32 object-center object-cover rounded-full "
            />
            <div className=" grid gap-2">
              <h1 className="text-black font-bold post-title">
                {userData.username}
              </h1>
              <span >

              {userData.isAdmin ? <>{userData.isSuperAdmin ? <span className="text-gray-700">SuperAdmin</span> : <span className="text-gray-700">Admin</span>}</> : <>{userData.isRequested ? <span className="text-red-700">Requested</span> : <button onClick={handleRequest} className="text-start bg-blue-600 text-white px-2 py-1 cursor-pointer">Request</button>}</>}
              </span>

            </div>
          </div>
        </div>
        <div className=" grid gap-4 ">
          <Link to={'/settings'} onClick={handleCloseModal}  className="text-start hover:text-slate-700">Settings</Link>

          <hr />
          <Link onClick={handleLogout} className=" text-start mt-2 hover:text-slate-700">Log Out</Link>
        </div>
      </div>
    
  );
};

export default ProfileModal;
