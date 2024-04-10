import { useMemo, useRef, useState } from "react";
import QuillEditor from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./styles.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";


import Cookies from "js-cookie";
import "./write.css";

const Write = () => {
  // Editor state
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const { userData } = useSelector((store) => store.user);
  const [loading, setloading] = useState(false);
  const [file, setFile] = useState(null);

  const token = Cookies.get("token");

  const [value, setValue] = useState("");

  // Editor ref
  const quill = useRef();

  // Handler to handle button clicked
  const handler = async(e) => {
    e.preventDefault(); // Prevent default form submission

    if(title == ""){
      toast.warning("Please give Title")
      return 
    }
    else if(value== ""){
      toast.warning('Please Write Something About Blog')
      return
    }
  
    if (!userData.isAdmin && !userData.isSuperAdmin) {
      toast.error("Sorry! You Are Not Admin");
      return;
    }
    setloading(true);
    const newPost = {
      username: userData.username,
      title: title,
      content: value,
      userPic: userData.profilePic,
      coverPic : file || "https://img.freepik.com/free-vector/blogging-fun-content-creation-online-streaming-video-blog-young-girl-making-selfie-social-network-sharing-feedback-self-promotion-strategy-vector-isolated-concept-metaphor-illustration_335657-855.jpg"
    };
    const formData = new FormData();
    formData.append("username",userData.username)
    formData.append("title",title)
    formData.append("content",value)
    formData.append("userPic",userData.profilePic)
    formData.append("coverPic",file || "https://img.freepik.com/free-vector/blogging-fun-content-creation-online-streaming-video-blog-young-girl-making-selfie-social-network-sharing-feedback-self-promotion-strategy-vector-isolated-concept-metaphor-illustration_335657-855.jpg")

    console.log(formData)
    try {
      const res = await axios.post(
        "http://localhost:5000/api/blogs/upload-images",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Set Content-Type for multipart data
          },
        }
      );
      console.log(res.data)
      toast.success("Blog Created");

      // setValue(res.data.htmlContent); // Update the editor with the modified content
      setloading(false);
      navigate("/blog/" + res.data._id);
    } catch (error) {
      setloading(false);
      console.error("Error uploading images:", error);
      // Handle errors appropriately
    }
  }

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline"],
          [{ color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image","code-block"],
          ["clean"],

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
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "clean",
    "code-block"
  ];

  return (
    <>
      <div className={styles.wrapper}>
        <form className="flex flex-col gap-5" onSubmit={handler}>
          <input
            type="text"
            placeholder="Title"
            className="writeInput"
            name="title"
            disabled={!userData.isAdmin && !userData.isSuperAdmin}
            autoFocus={true}
            required
            onChange={(e) => setTitle(e.target.value)}
          />

          {file && (
            <div className="imagePreview">
              <img
                src={file && URL.createObjectURL(file)}
                alt="selected image"
              />
            </div>
          )}

            <div className="flex gap-2.5 items-center">

          <label htmlFor="fileInput">
            <span> Cover Photo :</span>
          </label>
          <input
            type="file"
            id="fileInput"
            name="file"
            required
            placeholder="asdfs"
            onChange={(e) => setFile(e.target.files[0])}
            />
            </div>

        <QuillEditor
          ref={(el) => (quill.current = el)}
          theme="snow"
          value={value}
          formats={formats}
          modules={modules}
          onChange={(value) => setValue(value)}
          />
        <button type="submit" className=" self-start bg-blue-700 text-white py-2 px-8 rounded-md">
          Submit
        </button>
         </form>

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
    </>
  );
};

export default Write;
