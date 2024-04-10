import { useLocation } from "react-router";
import "./singlepost.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Comment from "../comment/Comment";
import Cookies from "js-cookie";

export default function SinglePost() {
  const token = Cookies.get('token')
  const location = useLocation();
  const navigate = useNavigate();
  const Id = location.pathname.split("/")[2];
  const [post, setPost] = useState({});
  const [name, setName] = useState("");

  const { userData } = useSelector((store) => store.user);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(null);
  const [updateMode, setUpdateMode] = useState(false);


  const handleLike = async () => {
    try {
      const userId = userData._id;
      const response = await axios.put(
        `http://localhost:5000/api/posts/like/${Id}`,
        { userId },{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setLiked(response.data.likes.includes(userData._id));
        setLikeCount(response.data.likes.length);
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

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get("http://localhost:5000/api/posts/" + Id,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPost(res.data);
      setTitle(res.data.title);
      setDesc(res.data.desc);
      setName(res.data.username);
      setImageUrl(res.data.photo);
      setLikeCount(res.data.likes.length);
      setLiked(res.data.likes.includes(userData._id));
      console.log(res.data)
    };
    getPost();
  }, [Id, userData._id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          username: userData.isSuperAdmin ? name : userData.username
        }
      });
      // window.location.replace("/");
      toast.success("Blog Deleted");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error(err.response.data);
    }
  };
  

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/posts/${post._id}`, {
        username: userData.isSuperAdmin ? name : userData.username,
        title,
        desc,
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUpdateMode(false);
      toast.success("Blog Updated");
    } catch (err) {}
  };



  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        {post.photo && <img className="singlePostImg" src={imageUrl} alt="" />}
        {updateMode ? (
          <input
            type="text"
            value={title}
            className="singlePostTitleInput"
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className="singlePostTitle">
            <span className="singlePostLikeIcon" onClick={handleLike}>
              {liked ? (
                <i className="fas fa-heart"></i>
              ) : (
                <i className="far fa-heart"></i>
              )}
              {likeCount}
            </span>
            {title}
            {(userData?.isSuperAdmin ||
              (post.username === userData?.username && userData?.isAdmin)) && (
              <div className="singlePostEdit">
                <i
                  className="singlePostIcon fa-regular fa-pen-to-square"
                  onClick={() => setUpdateMode(true)}
                ></i>
                <i
                  className="singlePostIcon fa-regular fa-trash-can"
                  onClick={handleDelete}
                ></i>
              </div>
            )}
          </h1>
        )}
        <div className="singlePostInfo">
          <span className="singlePostAuthor">
            Author:
              <b>{post.username}</b>
          </span>
          <span className="singlePostDate">
            {new Date(post.createdAt).toDateString()}
          </span>
        </div>
        {updateMode ? (
          <textarea
            className="singlePostDescInput"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        ) : (
          <p className="singlePostDesc">{desc}</p>
        )}
        {updateMode && (
          <button className="singlePostButton" onClick={handleUpdate}>
            Update
          </button>
        )}

        <Comment Id={Id}/>

      </div>
    </div>
  );
}
