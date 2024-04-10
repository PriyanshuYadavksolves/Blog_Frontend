import { useState,useEffect } from "react"
import Posts from "../../components/posts/Posts"
import "./singleuser.css"
import axios from "axios"
import { useLocation } from "react-router"
import Cookies from "js-cookie"

export default function Home() {
  const [posts,setPosts] = useState([]);
  const {search} = useLocation()
  const token = Cookies.get('token')

  useEffect(()=>{
    const fetchPosts = async()=>{
        try {
            const res = await axios.get("http://localhost:5000/api/posts/user/"+search,        {
              headers: {
                Authorization: `Bearer ${token}`
              },
            })
            setPosts(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    fetchPosts()
  },[search])
  
  return (
    <>
    {posts.length === 0 ? <h1 style={{textAlign:"center"}}>No Post To desplay</h1> : <h1 style={{textAlign:"center"}}>{search.split('=')[1]}'s Post</h1>}
      <div className="home">
        <Posts posts={posts}/>
      </div>
    </>
  )
}