import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from 'axios'

const Verify = () => {
//   const params = useLocation()
//   const token = params.pathname.split('/')[2]
  const url = useParams().id.split('+')
  const token = url[0]
  const email = url[1]

  console.log(token)
  const [falt,setFalt] = useState('')
  const [msg,setMsg] = useState("")

  const verifyEmail= async() =>{
    try { 
      const res = await axios.post(process.env.REACT_APP_BACKEND_URL+'api/auth/verify',{token,email})
      console.log(res.data)
      setMsg(res.data.message)
    } catch (err) {
      console.log(err)
      setFalt(err.response.data.message)    
    }
  }

  useEffect(()=>{
    verifyEmail()
  },[token])
    
  return (
    <>
      <div className="flex items-center justify-center flex-col mt-10">
        <p className="font-bold text-3xl text-[#365CCE]">Tridium</p>
        <section className="w-full mx-auto">
          <header className="py-8 flex justify-center w-full">
          </header>

          <div className="h-[200px] bg-[#365CCE] w-full text-white flex items-center justify-center flex-col gap-5">
            <div className="flex flex-col gap-3 items-center">
              <div className="text-center text-sm sm:text-xl tracking-widest font-normal">
                {falt ?falt: "THANKS FOR SIGNING UP!"  }
              </div>
              <div className="text-xl sm:text-3xl tracking-wider font-bold capitalize">
                {!falt ? msg : "Go and check your email link again"}
              </div>
              {!falt ? <Link to='/login' className="w-fit px-6 py-2 mt-6 text-center text-sm font-bold tracking-wider text-white transition-colors duration-300 transform bg-orange-600 rounded-lg hover:bg-orange-500">
            Go Login Page
          </Link> : <Link to='/' className="w-fit px-6 py-2 mt-6 text-center text-sm font-bold tracking-wider text-white transition-colors duration-300 transform bg-orange-600 rounded-lg hover:bg-orange-500">
            Go Signup Page
          </Link>  }
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Verify;