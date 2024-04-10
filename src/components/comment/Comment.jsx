import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./comment.css";
import Cookies from 'js-cookie'

const Comment = ({ Id }) => {
  const { userData } = useSelector((store) => store.user);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [updateMode, setUpdateMode] = useState("");
  const [updateComment, setUpdateComment] = useState("");
  const [editComment, setEditComment] = useState(null); 
  const token = Cookies.get('token')

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") {
      toast.warning("comment cant be empty");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/api/comment/createComment/`,
        {
          blogId: Id,
          userId: userData._id,
          username: userData.username,
          content: newComment,
          userPic: userData.profilePic,
        },{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, response.data]);
      setNewComment("");
      toast.success("Comment added");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = Cookies.get('token');
      const res = await axios.delete(
        `http://localhost:5000/api/comment/deleteComment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        }
      );
      setComments(comments.filter((com) => com._id !== id));
      toast.info('Comment deleted');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  const handleUpdateComment = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/comment/updateComment/${id}`,
        {
          content: updateComment,
        },{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(
        comments.map((comment) =>
          comment._id === id ? { ...comment, content: updateComment } : comment
        )
      );
      setUpdateMode(false);
      setEditComment(null);
      toast.success("Comment updated");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
    }
  };

  useEffect(() => {
    const getComment = async () => {
      const res = await axios.get(
        "http://localhost:5000/api/comment/getComment/" + Id,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(res.data);
    };
    getComment();
  }, [Id]);

  return (
    <>
      <div className="commentList">
        {comments.map((comment) => (
          <div key={comment._id} className="commentItem">
            <div className="commentimg">
              <img className="topImg" src={comment.userPic} alt="" />
            </div>
            <div className="commentcenter">
              <div className="com">
                <span className="commentusername">{comment.username}</span>
                <span className="commentdate">
                  {new Date(comment.createdAt).toDateString()}
                </span>
                
                {(userData?.isSuperAdmin ||
                  (comment.username === userData?.username &&
                    userData?.isAdmin)) && (
                  <div className="singlePostEdit">
                    
                    <i
                      className="singlePostIcon fa-regular fa-pen-to-square"
                      onClick={() => {
                        setUpdateMode(true);
                        setEditComment(comment);
                        setUpdateComment(comment.content)
                      }}
                    ></i>
                    <i
                      className="singlePostIcon fa-regular fa-trash-can"
                      onClick={() => handleDelete(comment._id)}
                    ></i>
                  </div>
                )}
              </div>
              {updateMode && editComment ? (
                editComment._id === comment._id ? (
                  <form
                    className="editcommentform"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleUpdateComment(comment._id);
                    }}
                  >
                    <textarea
                      className="commentTextarea"
                      value={updateComment}
                      onChange={(e) => setUpdateComment(e.target.value)}
                      placeholder={comment.content}
                      required
                    ></textarea>
                    <button className="updateCommentButton" type="submit">
                      Update
                    </button>
                  </form>
                ) : (
                  <p className="commentcontent">{comment.content}</p>
                )
              ) : (
                <p className="commentcontent">{comment.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <form className="newComment" onSubmit={handleAddComment}>
        <textarea
          value={newComment}
          className="commentTextarea"
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add your comment..."
          required
        ></textarea>
        <button type="submit">Add Comment</button>
      </form>
    </>
  );
};

export default Comment;
