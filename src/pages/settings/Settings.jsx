import "./settings.css";
import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  UPDATE_FAILURE,
  UPDATE_START,
  UPDATE_SUCCESS,
  loadUserData,
} from "../../features/user/userSlice";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";
export default function Settings() {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { userData } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const token = Cookies.get("token");
  // const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(UPDATE_START());
    setSuccess(false);
    setLoading(true);
  
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
  
    if (file) {
      formData.append("image", file); // Append file if selected
    }
  
    try {
      const res = await axios.patch(
        "http://localhost:5000/api/users/" + userData._id,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Set Content-Type for multipart data
          },
        }
      );
      console.log(res.data)
      setSuccess(true);
      setFile(null);
      setError(false);
      setUsername('')
      setEmail('')
      setPassword('')
      dispatch(UPDATE_SUCCESS(res.data));
      dispatch(loadUserData()); // Update user data locally
      setTimeout(() => {
        setSuccess(false);
      }, 4000);
    } catch (err) {
      console.error(err);
      toast.error(err.response.data);
      dispatch(UPDATE_FAILURE());
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 4000);
    } finally {
      setLoading(false); // Always set loading to false after the request completes
    }
  };
  // const handleDelete = async() =>{
  //   try {
  //     await axios.delete("http://localhost:5000/api/users/"+userData._id)
  //     dispatch(LOGOUT())
  //     toast.info("accoutn delete Successfully")
  //     navigate('/super/'+userData._id)
  //     // window.location.replace("/register");
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  return (
    <div className="settings">
      <div className="settingWrapper">
        <div className="settingTitle">
          <span className="settingsUpdateTitle">Update your account</span>
          {/* {userData.isSuperAdmin && (
            <span className="settingsDeleteTitle" onClick={handleDelete}>Delete account</span>
          )} */}
        </div>
        <form className="settingsForm" onSubmit={handleSubmit}>
          <label>Profile picture</label>
          <div className="settingsPP">
            <img
              src={file ? URL.createObjectURL(file) : userData.profilePic}
              alt=""
            />
            <label htmlFor="fileInput">
              <i className="settingsPPIcon fa-regular fa-circle-user"></i>
            </label>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div className="flex ml-10 gap-10">
              <div className="flex flex-col items-center">
                <span>{userData.followers.length}</span>
                <button className="hover:text-slate-700">Followers</button>
              </div>
              <div className="flex flex-col items-center">
                <span>{userData.following.length}</span>
                <button className="hover:text-slate-700">Followings</button>
              </div>
            </div>
          </div>
          <label>UserName</label>
          <input
            type="text"
            placeholder={userData.username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
            placeholder={userData.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="settingsSubmit" type="submit" disabled={loading}>
            Update
          </button>
          {success && (
            <span
              style={{ color: "green", textAlign: "center", marginTop: "20px" }}
            >
              Profile has been updated..
            </span>
          )}
          {error && (
            <span
              style={{ color: "red", textAlign: "center", marginTop: "20px" }}
            >
              Something Went Wrong...
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
