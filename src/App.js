import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Update imports

import TopBar from './components/topbar/TopBar';
import Register from './pages/Register/Register';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Settings from './pages/settings/Settings';
import Single from './pages/single/Single';
import Write from './pages/write/Write';
import SuperAdmin from './pages/super/SuperAdmin';
import SingleUser from './pages/singleUser/SingleUser'
import AllPoss from './pages/allPost/AllPoss'
import SingleBlog from './components/singleBlog/SingleBlog';

function App() {
  const { userData } = useSelector((store) => store.user);

  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/" element={userData ? <Home /> : <Login />} /> 
        <Route path="/register" element={userData ? <Home /> : <Register />} /> 
        <Route path="/login" element={userData ? <Home /> : <Login />} /> 
        <Route path="/write" element={userData ? <Write /> : <Register />} /> 
        <Route path="/settings" element={userData ? <Settings /> : <Register />} /> 
        <Route path="/post/:postId" element={ userData ? <Single /> : <Login/>} /> 
        <Route path="/blog/:blogId" element={ userData ? <SingleBlog /> : <Login/>} /> 
        <Route path="/post/title/" element={ userData ? <AllPoss /> : <Login/>} /> 
        <Route path="/super/user/" element={userData ? <SingleUser /> : <Login/>} />
        <Route path="/super/:id" element={userData ? <SuperAdmin /> : <Login/>} />
      </Routes>
    </Router>
  );
}

export default App;
