import React, { useEffect, useState, useMemo, useRef } from "react";
import QuillEditor from "react-quill";
import parse from "html-react-parser";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.css";
import { Oval } from "react-loader-spinner";

import axios from "axios";
import Cookies from "js-cookie";
import "./singleBlog.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  UPDATE_FAILURE,
  UPDATE_START,
  UPDATE_SUCCESS,
  loadUserData,
} from "../../features/user/userSlice";

const SingleBlog = () => {
  const [title, setTitle] = useState("");

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image","code-block"],
        ],
        handlers: {
          // image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: true,
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "code-block"
  ];

  const quill = useRef();

  const { blogId } = useParams();
  const token = Cookies.get("token");
  const [value, setValue] = useState("");

  const [comment, setComment] = useState([]);
  const [updateMode, setUpdateMode] = useState("");
  const [loading, setloading] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(null);
  const [followed, setFollowed] = useState(false);

  const navigate = useNavigate();

  const { userData } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    const newpost = {
      content: value,
      id: comment._id,
    };
    try {
      const res = await axios.delete(
        "http://localhost:5000/api/blogs/delete-images",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: newpost, // Pass data as 'data' property
        }
      );
      console.log(res.data);
      toast.success("Blog Deleted");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateComment = async () => {
    if (!userData.isAdmin && !userData.isSuperAdmin) {
      toast.error("Sorry! You Are Not Admin");
      return;
    }
    setloading(true);
    const newPost = {
      username: comment.username,
      title: title,
      content: value,
      userPic: comment.userPic,
      id: comment._id,
    };
    try {
      const res = await axios.patch(
        "http://localhost:5000/api/blogs/update-images",
        newPost,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(res.data)
      toast.success("Blog updated");
      console.log(res.data);

      const regex = /<body>(.*?)<\/body>/s;
      const match = res.data.htmlContent.match(regex);
      setTitle(res.data.title);
      setValue(match[1]);
      console.log(match[1]);
      setComment(res.data);
      setloading(false);
      setUpdateMode(false);
    } catch (error) {
      setloading(false);
      console.error("Error uploading images:", error);
      // Handle errors appropriately
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/blogs/blog/" + blogId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data);
        if(res.data === null){
          navigate("/")
        }
        const regex = /<body>(.*?)<\/body>/s;
        const match = res.data.htmlContent.match(regex);
        setTitle(res.data.title);
        setValue(match[1]);
        setComment(res.data);
        console.log(res.data)
        setLikeCount(res.data.likes.length);
        setLiked(res.data.likes.includes(userData._id));
        setFollowed(userData.following.includes(res.data.userId));
      } catch (error) {
        console.log(error);
      }
    };
    fetchBlog();
  }, []);

  const handleLike = async () => {
    try {
      const userId = userData._id;
      const response = await axios.put(
        `http://localhost:5000/api/blogs/like/${blogId}`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setLiked(response.data.blog.likes.includes(userData._id));
        setLikeCount(response.data.blog.likes.length);
        if (!liked) {
          toast.success("Post liked");
        } else {
          toast.info("Post unliked");
        }
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleFollow = async (e) => {
    e.preventDefault();
    dispatch(UPDATE_START());
    try {
      const followindId = comment.userId;
      const res = await axios.put(
        "http://localhost:5000/api/users/follow/" + followindId,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(res.data)
      dispatch(UPDATE_SUCCESS(res.data));
      dispatch(loadUserData()); // Update user data locally
      toast.success("Followed Successfully");
      // setFollowed(res.data.following.includes(comment.userId));
      setFollowed(!followed);
    } catch (error) {
      console.log(error);
      dispatch(UPDATE_FAILURE());
    } finally {
    }
  };

  const handleUnfollow = async (e) => {
    e.preventDefault();
    dispatch(UPDATE_START());
    try {
      const followindId = comment.userId;
      const res = await axios.put(
        "http://localhost:5000/api/users/unfollow/" + followindId,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(UPDATE_SUCCESS(res.data));
      dispatch(loadUserData()); // Update user data locally
      toast.info("Unfollowed");
      setFollowed(!followed);
    } catch (error) {
      console.log(error);
      dispatch(UPDATE_FAILURE());
    }
  };

  return (
    <div className="singleblogWrapper">
      <div className="desc overscroll-auto">
        {updateMode ? (
          <input
            type="text"
            placeholder="Title"
            className="writeInput"
            value={title}
            disabled={!userData.isAdmin && !userData.isSuperAdmin}
            autoFocus={true}
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className=" text-3xl font-semibold">{title}</h1>
        )}

        <div className="flex p-2.5 justify-between border-b-2">
          <div className="left  flex gap-5 items-center">
            <img
              src={comment.userPic}
              alt={comment.userPic}
              className="h-12 w-12 rounded-[50%]"
            />
            <div className="flex flex-col gap-1">
              <div className="flex gap-5 items-center ">
                <p className=" font-semibold text-lg">{comment.username}</p>
                {userData._id !== comment.userId && <>{followed ? (
                  <button className="text-red-600" onClick={handleUnfollow}>
                    Unfollow
                  </button>
                ) : (
                  <button className="text-green-600" onClick={handleFollow}>
                    Follow
                  </button>
                )}</>}

                
              </div>
              <p className="flex gap-2 items-center">
                <span className=" text-slate-600 text-xs">
                  {new Date(comment.createdAt).toDateString()}
                </span>
                {liked ? (
                  <i
                    className="fas fa-heart cursor-pointer"
                    onClick={handleLike}
                  ></i>
                ) : (
                  <i
                    className="far fa-heart cursor-pointer"
                    onClick={handleLike}
                  ></i>
                )}
                {likeCount}
              </p>
            </div>
          </div>
          {(userData?.isSuperAdmin ||
            (comment.username === userData?.username && userData?.isAdmin)) && (
            <span className="flex items-center">
              <i
                className="singlePostIcon fa-regular fa-pen-to-square"
                onClick={() => {
                  setUpdateMode(!updateMode);
                }}
              ></i>
              {!updateMode && (
                <i
                  className="singlePostIcon fa-regular fa-trash-can"
                  onClick={() => handleDelete(comment._id)}
                ></i>
              )}
            </span>
          )}
        </div>

        {loading && (
          <span>
            <Oval
              visible={true}
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </span>
        )}

        {updateMode ? (
          <QuillEditor
            ref={(el) => (quill.current = el)}
            className={styles.editor}
            theme="snow"
            value={value}
            formats={formats}
            modules={modules}
            onChange={(value) => setValue(value)}
          />
        ) : (
          <span className="htmlcontent flex flex-col gap-2.5">

          <>{parse(value)}</>
          </span>
        )}
        {updateMode && (
          <button onClick={handleUpdateComment} className="updateCommentButton">
            update
          </button>
        )}
      </div>
    </div>
  );
};

export default SingleBlog;
