import React, { useState, useEffect } from 'react';
import { fetchBlogs } from '../utils/DataHandler';
import '../utils/DisplayBlogs.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import Tooltip from './Tooltip';
import {deleteDocumentById} from '../utils/DataHandler';
import BlogSuccessAlert from './BlogSuccessAlert';


export default function DisplayBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const Blogs = await fetchBlogs();
        setBlogs(Blogs);
        setLoading(false);
        console.log('Blogs:', Blogs);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
        setLoading(false);
      }
    };

    getBlogs();
  }, []);

  const navigate = useNavigate();

  const categories = ['news', 'technology', 'nimitta','finance'];

  const getBlogsByCategory = (category) => {
    return blogs.filter((blog) => blog.blog === category);
  };

  const toggleExpandCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleEdit = (id) => {
    console.log('Edit:', id);
    navigate('/editblog/'+id);
  };


  const formatDate = (date) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [year, month, day] = date.split('-');
    return `${monthNames[parseInt(month) - 1]} ${day}, ${year}`;
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async() => {
    if (blogToDelete) {
      // Perform delete operation here, e.g., call an API to delete the blog
      console.log('Deleting blog:', blogToDelete.id);

      // Delete the blog from Firestore
      await deleteDocumentById(blogToDelete.id);

      // After deletion, refresh the blogs list or update state accordingly
      setBlogs((prevBlogs) => prevBlogs.filter(blog => blog.id !== blogToDelete.id));
    }
    setShowDeleteConfirmation(false);
    setShowAlert(true);
    setBlogToDelete(null);

  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setBlogToDelete(null);
  };

  


  return (
    <div>
      <NavBar/>
      <div className="container mx-auto p-4">
        {loading ? (
          <h1>Loading...</h1>
        ) : (
          categories.map((category) => (
            getBlogsByCategory(category).length > 0 && (
              <div key={category} className="mb-8 w-full">
                <div className="flex justify-between">
                  <h2 className="text-2xl font-bold mb-4">{category.toUpperCase()}</h2>
                  <div className="w-64 flex-shrink-0 flex items-center justify-end">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => toggleExpandCategory(category)}
                    >
                      {expandedCategories[category] ? 'Hide Some' : 'See More Blogs'}
                    </button>
                  </div>
                </div>
                <div className="flex overflow-x-auto justify-left space-x-4 custom-scrollbar">
                  {getBlogsByCategory(category)
                    .slice(0, expandedCategories[category] ? undefined : 4)
                    .map((blog) => (
                      <div key={blog.id} className="w-64 flex-shrink-0 bg-white p-4">
                        <img src={blog.url} alt={blog.title} className="w-full h-36 object-contain rounded-lg border border-1" />
                        <h3 className="text-xl font-semibold mb-2 mt-3 text-center">{blog.title}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col ml-3 mt-1">
                            <p className="text-gray-700 text-sm font-bold">{blog.author}</p>
                            <p className="text-gray-700 text-sm font-normal">{formatDate(blog.date)}</p>
                          </div>
                          <p className="font-light self-start text-sm text-center mt-1">{blog.readTime} mins read</p>
                        </div>
                        <div class="flex justify-around">
                          <button class="  text-white font-bold py-2 px-4 rounded-full mt-2 "
                            onClick={()=>handleEdit(blog.id)}>
                            <MdEdit style={{ color: 'blue', fontSize: '25px' }} />
                            </button>
                          <button class=" text-white font-bold py-2 px-4 rounded-full mt-2"
                            onClick={() => handleDeleteClick(blog)}
                          ><MdDelete style={{ color: 'red', fontSize: '25px' }} /></button>
                        </div>
                      </div>
                    ))}
                    
                </div>
              </div>
            )
          ))
        )}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <p className="text-center text-lg mb-4">Are you sure you want to delete this blog?</p>
              <div className="flex justify-around">
                <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">Yes</button>
                <button onClick={cancelDelete} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">No</button>
              </div>
            </div>
          </div>
        )}

        {showAlert && <BlogSuccessAlert show={showAlert} message='Blog deleted Successfully..!' onClose={() => setShowAlert(false)} />}
        
      </div>
    </div>
  );
}
