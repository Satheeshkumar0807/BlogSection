// NavBar.jsx
import React from 'react';

import home from '../assets/home.png';
import blog from '../assets/blog.png';
import image from '../assets/image.png';
import logo from '../assets/logo.png';
import logout from '../assets/logout.png';
export default function NavBar() {
  return (
    <div>
      <nav className="flex flex-col justify-start items-center h-full w-16 bg-white text-black fixed top-0 left-0 shadow-sm font-mono border-r-2">
        <img src={logo} className="h-20 w-20 mt-5 object-contain hover:bg-slate-300 rounded-lg" alt="logo" />
        <a href="/" className="p-4 mt-16 hover:bg-slate-300 rounded-full"><img src={home} alt="home" /></a>
        <a href="/blog" className="p-4 mt-5 hover:bg-slate-300 rounded-full"><img src={blog} alt="blog" /></a>
        <a href="/image" className="p-4 mt-5 hover:bg-slate-300 rounded-full"><img src={image} alt="image" /></a>
        <a href="/logout" className="p-4 mt-16 hover:bg-slate-300 rounded-full"><img src={logout} alt="logout" /></a>
      </nav>
    </div>
  );
}
