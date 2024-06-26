import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loadUserData,
  UPDATE_START,
  UPDATE_SUCCESS,
  UPDATE_FAILURE,
} from "../../features/user/userSlice";
import { toast } from "react-toastify";
import "./topbar.css";
import axios from "axios";
import Cookies from "js-cookie";
import ProfileModal from "../profileCard/ProfileModal";

export default function Topbar() {
  const { userData } = useSelector((store) => store.user);
  const [isHover, setIsHover] = useState(false);

  const dispatch = useDispatch();

  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const token = Cookies.get("token");

  const handleCloseModal = () => {
    setTimeout(() => {
      setIsHover(false);
    }, [600]);
  };

  const handleRequest = async () => {
    if (userData.isSuperAdmin) {
      toast.info("You Are SuperAdmin");
    } else if (userData.isAdmin) {
      toast.info("Yor Are Admin");
    } else if (userData.isRequested) {
      toast.info("You Have Allready Requested For Admin");
    } else {
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
    }
  };

  const handleSearch = (e) => {
    console.log("Search term:", searchTerm);
    toast.success(`Search for : ${searchTerm}`);
    navigate(`/post/title/?title=${searchTerm}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="top">
      <div className="topLeft">
        <ul className="topList">
          <li className="topListItem">
            <NavLink to="/" className="link">
              HOME
            </NavLink>
          </li>
          {userData && userData.isSuperAdmin && (
            <li className="topListItem">
              <Link to={`/super/${userData._id}`} className="link">
                DASHBOARD
              </Link>
            </li>
          )}
          <li className="topListItem">
            <NavLink to="/write" className="link">
              WRITE
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="topRight">
        {userData ? (
          <div className="right">
            <div className="topCenter">
              <input
                type="text"
                placeholder="Search..."
                className="topSearchInput"
                value={searchTerm}
                onKeyDown={handleKeyDown}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i
                className="topSearchIcon fas fa-search"
                onClick={handleSearch}
              ></i>
            </div>
            <div onClick={() => setIsHover(!isHover)}>
              <img className="topImg" src={userData.profilePic} alt="" />
            </div>
            <div onMouseLeave={handleCloseModal}>
              {isHover && <ProfileModal handleCloseModal={handleCloseModal}/>}
            </div>

            {/* <li className="logout" onClick={handleRequest}>
              {userData.isAdmin ? (userData.isSuperAdmin ? "SUPERADMIN" : "ADMIN") : (userData.isRequested ? "REQUESTED" : "REQUEST")}
            </li>
            <li className="logout" onClick={handleLogout}>
              LOGOUT
            </li> */}
          </div>
        ) : (
          <ul className="topList">
            <li className="topListItem">
              <NavLink to="/login" className="link">
                LOGIN
              </NavLink>
            </li>
            <li className="topListItem">
              <NavLink to="/register" className="link">
                REGISTER
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
