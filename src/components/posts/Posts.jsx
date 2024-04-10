import { NavLink } from "react-router-dom";
import Post from "../Post/Post";
import "./posts.css";

export default function Posts({ posts }) {
  return (
    // <div classNameName="posts">
    //   {posts.map((p)=>(
    //     <Post key={p._id} post={p}/>
    //   ))}

    // </div>
    <div className="relative bg-gray-50 px-6 pt-16 pb-20 lg:px-8 lg:pt-24 lg:pb-28">
      <div className="absolute inset-0">
        <div className="h-1/3 bg-white sm:h-2/3"></div>
      </div>
      <div className="relative mx-auto max-w-7xl">
       
        <div className="mx-auto mt-12 grid max-w-lg gap-20 lg:max-w-none lg:grid-cols-3">
          
          {posts.map((p)=>(
           <Post key={p._id} post={p}/>
          ))}
              
        </div>
      </div>
    </div>
  );
}
