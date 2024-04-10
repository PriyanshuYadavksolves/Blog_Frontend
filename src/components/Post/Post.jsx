import "./post.css";
import { NavLink } from "react-router-dom";
import parse from "html-react-parser";
import { useEffect, useState } from "react";


export default function Post({ post }) {
  const regex = /<body>(.*?)<\/body>/s;
  const match = post.htmlContent.match(regex);
  const [content,setContent] = useState("")

  useEffect(()=>{
    setContent(match[1])
  })

  return (
    <div key={post._id} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
    <div className="flex-shrink-0">
      <img
        className="h-48 w-full object-cover"
        src={post.coverPic}
        alt={post.coverPic}
      />
    </div>
    <div className="flex flex-1 flex-col justify-between bg-white p-6">
      <div className="flex-1">

        <NavLink to={"/blog/"+post._id} className="mt-2 block">
          <p className="text-xl font-semibold text-gray-900 post-title">
           {post.title}
          </p>
          <span className="mt-3 text-base text-gray-500 post-content ">
            {content}
          </span>
        </NavLink >
      </div>
      <div className="mt-6 flex items-center">
        <div className="flex-shrink-0">
          <NavLink>
            <span className="sr-only">Roel Aufderehar</span>
            <img
              className="h-10 w-10 rounded-full"
              src={post.userPic}
              alt={post.userPic}
            />
          </NavLink>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">
            <NavLink className="hover:underline">
              {post.username}
            </NavLink>
          </p>
          <div className="flex space-x-1 text-sm text-gray-500">
            <time dateTime="2020-03-16">{new Date(post.createdAt).toDateString()}</time>

          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
