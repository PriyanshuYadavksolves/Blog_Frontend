import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";

import "react-toastify/dist/ReactToastify.css";

import "./super.css";
import Cookies from 'js-cookie'

const SuperAdmin = () => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const id = location.pathname.split("/")[2];
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setloading] = useState(false);
  const token = Cookies.get('token')

  const handleCheckboxChange = async (id, isAdmin) => {
    try {
      await axios.put("http://localhost:5000/api/super/" + id, {
        isAdmin,
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, isAdmin: !user.isAdmin } : user
        )
      );
      if (isAdmin) {
        toast.error("Removed from Admin Role");
      } else {
        toast.success("User is Admin Now");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete("http://localhost:5000/api/super/" + id,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      toast.success("User deleted Successfully");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/super/getUsers?pageNumber=" + pageNumber,
        {
          id,
        },{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers((prevUsers) => [...prevUsers, ...res.data.data]);
      console.log(res.data);
      setPageNumber(pageNumber + 1);
      console.log(pageNumber);
      if (!res.data.next) {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
   fetchUsers();
  }, []);

  const handleScroll = async (e) => {
    const bottom =
      e.target.scrollHeight - Math.ceil(e.target.scrollTop) <=
      e.target.clientHeight;
    if (bottom && hasMore && !loading) {
      setloading(true); 
      try {
        await fetchUsers(); 
      } finally {
        setloading(false); 
      }
    }
  };
  

  return (
    <div className="center" onScroll={handleScroll}>
      <h1>All Users</h1>
      {users.map(
        (user) =>
          !user.isSuperAdmin && (
            <ul
              key={user._id}
              className={`ul ${user.isRequested ? "requested" : "default"} ${
                user.isAdmin ? "admin" : "default"
              }`}
            >
              <li className="li">
                <img
                  className="img"
                  src={user.profilePic}
                  alt={user.username}
                />
                <span className="username">
                  <Link
                    to={`/super/user/?user=${user.username}`}
                    className="link"
                  >
                    <b>{user.username}</b>
                  </Link>
                </span>
                <span className="email">{user.email}</span>
                <input
                  className="input"
                  type="checkbox"
                  checked={user.isAdmin}
                  onChange={() => handleCheckboxChange(user._id, user.isAdmin)}
                />
                <i
                  className="singlePostIcon fa-regular fa-trash-can"
                  onClick={() => handleDelete(user._id)}
                ></i>
              </li>
            </ul>
          )
      )}
      {loading && (
        <>
          <Oval
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </>
      )}
    </div>
  );
};

export default SuperAdmin;
