// NavBar.jsx
import React from 'react';

import home from '../assets/home.png';
import blog from '../assets/blog.png';
import image from '../assets/image.png';
import logo from '../assets/logo.png';
import add from '../assets/add.png';
import logout from '../assets/logout.png';
import Tooltip from './Tooltip';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to the login page after logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <div>
      <nav className="flex flex-col justify-start items-center h-full w-16 bg-white text-black fixed top-0 left-0 shadow-lg font-mono border-r-2">
        <img src={logo} className="h-20 w-20 mt-5 object-contain mt-0 hover:bg-slate-300 rounded-lg" alt="logo" />
        {/*<a href="/" className="p-4  hover:bg-slate-300 rounded-full"><img src={home} alt="home" /></a>*/}
        <div class="flex flex-col justify-around items-center mt-20 h-full">
          <a href="/addblog" className="p-4 mt-5 mb-10 hover:bg-slate-300 rounded-full"><img src={add} alt="blog" /></a>
          
          {/*<a href="/image" className="p-4 mt-5 hover:bg-slate-300 rounded-full"><img src={image} alt="image" /></a>*/}
          
          <a  className="hover:bg-slate-300 rounded-full p-4 mt-5 mb-10"
            onClick={handleLogout}
          >
            <img src={logout} alt="logout" class="w-8 h-8" /> {/* Adjust size as needed */}
          </a>
        </div>
      
      </nav>
    </div>
  );
}
