import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
    UPDATE_FAILURE,
    UPDATE_START,
    UPDATE_SUCCESS,
    loadUserData,
  } from "../../features/user/userSlice";
import { toast } from "react-toastify";

const Followings = () => {
  const { id } = useParams();
  console.log(id);
  const token = Cookies.get("token");
  const [followings, setFollowings] = useState([]);
  const dispatch = useDispatch()
  const { userData } = useSelector((store) => store.user);

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "api/users/followings/" + id,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data);
        setFollowings(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFollowings();
  }, [userData]);

  const handleFollow = async (e,id) => {
    e.preventDefault();
    dispatch(UPDATE_START());
    const followindId = id
    try {
      const res = await axios.put(process.env.REACT_APP_BACKEND_URL+
        "api/users/follow/" + followindId,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data)
      dispatch(UPDATE_SUCCESS(res.data));
      dispatch(loadUserData()); // Update user data locally
      toast.success("Followed Successfully");
      // setFollowed(res.data.following.includes(comment.userId));
    //   setFollowed(!followed);
    } catch (error) {
      console.log(error);
      dispatch(UPDATE_FAILURE());
    } finally {
    }
  };

  const handleUnfollow = async (e,id) => {
    e.preventDefault();
    // dispatch(UPDATE_START());
    try {
      const followindId = id;
      
      console.log(id)
      const res = await axios.put(process.env.REACT_APP_BACKEND_URL+
        "api/users/unfollow/" + followindId,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data)
      dispatch(UPDATE_SUCCESS(res.data));
      dispatch(loadUserData()); // Update user data locally
      toast.info("Unfollowed");
    //   setFollowed(!followed);
    } catch (error) {
      console.log(error);
      dispatch(UPDATE_FAILURE());
    }
  };




  return (
    <section className="">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6">
        <div className="mx-auto mb-8 max-w-screen-sm lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 ">
            Followings
          </h2>
        </div>
            {followings.length === 0 && <>
                <h1>No Following</h1>
            </>}
        <div className="grid gap-8 lg:gap-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {followings.map((f) => (
            
              <div key={f._id} className="text-center text-gray-500 dark:text-gray-400 flex sm:grid">
                <img
                  className="mb-4 w-36 h-36 rounded-full"
                  src={f.profilePic}
                  alt={f.username} 
                  />
                <div className="flex flex-col items-start px-4 py-2 gap-2 ">
                  <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 ">
                    <Link className="post-title text-start sm:text-center">
                      {f.username}  
                    </Link>
                  </h3>
                  <p>{f.isAdmin ? "Admin" : "User"}</p>
                </div>
                <div className="grid place-items-start px-4 py-2">
                {userData.followers.includes(f._id) ? (
                  <button onClick={(e)=>handleFollow(e,f._id)} className="text-start bg-teal-600 text-white px-8 py-1 rounded-md cursor-pointer">
                    Follow
                  </button>
                ) : (
                  <button onClick={(e)=>handleUnfollow(e,f._id)} className="text-start bg-black text-white px-8 py-1 rounded-md cursor-pointer">
                    Following
                  </button>
                )}
              </div>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Followings;
