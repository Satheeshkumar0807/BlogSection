import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import firebase auth functions
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import { getBlogs ,deleteBlog,approveBlog,reworkBlog } from '../utils/DataHandler';
import { auth } from '../utils/firebase';

// Import components
import DeletePopover from './ConfirmationDeletePopver';
import Popover from './Popover';
import Filter from './Filter';

// Import images
import Dashboard from '../assets/dashboard.png';
import Blog from '../assets/blog.png';
import Add from '../assets/add.png';
import Recent from '../assets/recent.png';
import Report from '../assets/report.png';
import Admin from '../assets/user.png';
import Logo from '../assets/logo.png';
import SmallLogo from '../assets/logo2.png';
import filter from '../assets/filter.png';
import Setting from '../assets/setting.png';
import Support from '../assets/support.png';
import Profile from '../assets/user-profile.png';
import logout from '../assets/exit.png';
import previous from '../assets/back.png';
import next from '../assets/next.png';
import check from '../assets/check.png';
import redo from '../assets/redo.png';


// Main component
const DisplayBlogs = () => {

  // for navigation
  const navigate = useNavigate();

  // state variable for blogs
  const [blogs, setBlogs] = useState([]);
  
  // state for filter clicked
  const [filterClicked, setFilterClicked] = useState(false);
  // state to hold the filters
  const [filters, setFilters] = useState({});
  // state to hold the filtered blogs
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 3;
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  // Sidebar state
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  // Popover state
  const [showEditPopover, setShowEditPopover] = useState(false);
  const [showAddPopover, setShowAddPopover] = useState(false);
  const [showDeletePopover, setShowDeletePopover] = useState(false);
  const [showDeletePopoverConfirmation, setShowDeletePopoverConfirmation] = useState(false);
  const [showApprovePopover, setShowApprovePopover] = useState(false);
  const [showReworkPopover, setShowReworkPopover] = useState(false);

  // Selected blog id to delete it
  const [selecteid, setSelectedId] = useState(-1);

  // User state
  const [user, setUser] = useState(null);

  // Functions

  // Function to toggle sidebar to expand or collapse
  const handleToggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Function to handle change in the active section of the sidebar
  const handleChange = (section) => {
    setActiveSection(section);
    if(section==='add'){
        navigate('/addblog');
    }
    else if(section==='blog'){
        navigate('/');
    }
    else if(section==='dashboard'){
        navigate('/');
    }
    else if(section==='recent'){
        navigate('/drafts');
    }
    else if(section==='reports'){
        navigate('/');
    }
    else if(section==='profile'){
        navigate('/');
    }
    else if(section==='settings'){
        navigate('/');
    }
    else if(section==='support'){
        navigate('/');
    }

  };
    
  const [User, loading] = useAuthState(auth);


    /*
    const unsubscribe = auth.onAuthStateChanged((User) => {
      //console.log('User:', User.email);
      console.log('User:', User.email);
      if (User) {
        setUser(User);

        const fetchBlogs = async () => {
          try {
            const Blogs = await getBlogs();
            // Sort blogs by date
            const sortedBlogs = [...Blogs].sort((a, b) => new Date(b.date) - new Date(a.date));
            // if user is admin, show all blogs not drafts without status rework
            if (true){
              const demoBlogs = sortedBlogs.filter((blog) => !blog.isDraft);
              const demoFilteredBlogs = sortedBlogs.filter((blog) => !blog.isDraft);
              setBlogs(demoBlogs.filter((blog) => blog.status!=='rework'));
              setFilteredBlogs(demoFilteredBlogs.filter((blog) => blog.status!=='rework'));
            }
            else{
            setBlogs(sortedBlogs.filter((blog) => !blog.isDraft));
            setFilteredBlogs(sortedBlogs.filter((blog) => !blog.isDraft));
            }
            //setLoading(false);
            console.log('Blogs:', Blogs);
          } catch (error) {
            console.error('Failed to fetch blogs:', error);
            //setLoading(false);
          }
        };
        fetchBlogs();
      } else {
        //setLoading(false); // Set loading to false if no user is logged in
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
    */
    useEffect(() => {
      if (loading) {
        // Optionally, show a loading indicator while the auth state is being determined
        console.log('Loading user...');
        return;
      }
  
      if (User) {
        setUser(User);
  
        const fetchBlogs = async () => {
          try {
            const Blogs = await getBlogs();
            const sortedBlogs = [...Blogs].sort((a, b) => new Date(b.date) - new Date(a.date));
  
            if (User.email === "priyab@technimitta.com") {
              const demoBlogs = sortedBlogs.filter((blog) => !blog.isDraft);
              const demoFilteredBlogs = sortedBlogs.filter((blog) => !blog.isDraft);
              setBlogs(demoBlogs.filter((blog) => blog.status !== 'rework'));
              setFilteredBlogs(demoFilteredBlogs.filter((blog) => blog.status !== 'rework'));
            } else {
              setBlogs(sortedBlogs.filter((blog) => !blog.isDraft));
              setFilteredBlogs(sortedBlogs.filter((blog) => !blog.isDraft));
            }
            console.log('Blogs:', Blogs);
          } catch (error) {
            console.error('Failed to fetch blogs:', error);
          }
        };
  
        fetchBlogs();
      } else {
        console.log('No user is logged in');
      }
    }, [User, loading]);
  
    useEffect(() => {
      filterBlogs(filters);
    }, [blogs, filters]);

  //getting username from email
  const getName = (email) => {
    const name = email.split('@')[0];
    return name;
  };

  

  const filterBlogs = (filters) => {
    // If no filters are applied, set filtered blogs to all blogs
    if (!filters) {
      setFilteredBlogs(blogs);
      return;
    }
    let filtereBlogs = [...blogs];  //temp blogs storage to initial state of blogs 

    // Filter blogs based on category filters
    if (filters.categoryFilterEnabled) {
      filtereBlogs = filtereBlogs.filter((blog) => filters.categories.includes(blog.blog));
    }
    // Filter blogs based on visibility filters
    if (filters.visibilityFilterEnabled) {
       filtereBlogs = filtereBlogs.filter((blog) => 
        blog.visibility === filters.visibility);
    }
    // Filter blogs based on status filters
    if (filters.statusFilterEnabled) {
      filtereBlogs = filtereBlogs.filter((blog) =>
        blog.status === filters.status
      );
    }
    // Filter blogs based on date filters
    if (filters.dateFilterEnabled) {
      if (filters.dateFilter==='betweenDates') {
        filtereBlogs = filtereBlogs.filter(
          (blog) =>{
           
            return new Date(blog.date) >= new Date(filters.startDate) && new Date(blog.date) <= new Date(filters.endDate)
          }
        );
      }
      else if (filters.dateFilter==='byDate') {
        filtereBlogs = filtereBlogs.filter((blog) =>{
          const blogDate = new Date(blog.date).setHours(0, 0, 0, 0); // Normalize blog date
          const filterStartDate = new Date(filters.startDate).setHours(0, 0, 0, 0); // Normalize filter start date
          return blogDate === filterStartDate;
        });
      }
    }
    // Filter blogs based on author filters
    if (filters.authorFilterEnabled) {
      filtereBlogs = filtereBlogs.filter((blog)=> blog.author.toLowerCase().trim().includes(filters.author.toLowerCase().trim()));
    }
    // Filter blogs based on title filters
    if (filters.titleFilterEnabled) {
      filtereBlogs = filtereBlogs.filter((blog)=> blog.title.toLowerCase().trim().includes(filters.title.toLowerCase().trim()));
    }
    setFilteredBlogs(filtereBlogs);
  };
  
  // Function to handle filter button click
  const handleFilter = () => {
    setFilterClicked(!filterClicked);
    console.log('Filter clicked');
  };

  // Function to handle pagination
  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to handle previous page
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to handle next page
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Get blogs to be displayed on the current page
  const currentBlogs = filteredBlogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  // Function to handle a blog
  const handleAdd = () => {
    navigate('/addblog');
  };
  // Function to handle edit a blog
  const handleEdit = (id) => {
    navigate('/editblog/'+id);
  };
  // Function to handle confirmation to delete a blog
  const handleDelete = (id) => {
    // set the selected id to delete
    setSelectedId(id);
    // show the delete popover confirmation
    setShowDeletePopoverConfirmation(true);
  };
  // Function to delete a blog
  const confirmDelete = async() => {

    /* filteredBlogs.splice(id,1);
    setFilteredBlogs([...filteredBlogs]);
    
    blogs.splice(id,1);
    setBlogs([...blogs]);

    await deleteBlog(selecteid);
    setShowDeletePopoverConfirmation(false);
    setShowDeletePopover(true);
    */
    setShowDeletePopoverConfirmation(false);
    setShowDeletePopover(true);
    console.log('Delete:', selecteid);
    // Delete the blog from the database
    await deleteBlog(selecteid);
    // Remove the blog from the filtered blogs
    setFilteredBlogs(filteredBlogs.filter((draft) => draft.id !== selecteid));
    // Remove the blog from the blogs
    setBlogs(blogs.filter((draft) => draft.id !== selecteid));
    // Reset the selected id to -1
    setSelectedId(-1);
    //setShowDeletePopoverConfirmation(false);
  };

  // Function to handle logout
  const handleLogout = async () => {
      try {
        await signOut(auth);
        navigate('/'); // Redirect to the login page after logout
      } catch (error) {
        console.error('Error signing out:', error);
      }
  };

  //Function to Handle Approval for a pending blog
  const handleApprove = async (id) => {
    setShowApprovePopover(true);
    console.log('Approve:', id);
    setFilteredBlogs(filteredBlogs.map(blog => blog.id === id ? { ...blog, status: 'approved' } : blog));
    setBlogs(blogs.map(blog => blog.id === id ? { ...blog, status: 'approved' } : blog));
    await approveBlog(id);
  }

  //Function to Handle Rework for a approved blog
  const handleRework = async (id) => {
    setShowReworkPopover(true);
    console.log('Rework:', id);
    setFilteredBlogs(filteredBlogs.map(blog => blog.id === id ? { ...blog, status: 'rework' } : blog));
    setBlogs(blogs.map(blog => blog.id === id ? { ...blog, status: 'rework' } : blog));
    await reworkBlog(id);
  }

  
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
      <div className="">
        {/* Popovers */}
        {showEditPopover && (<Popover message="Blog Post updated successfully..!" onClose={() => setShowEditPopover(false)} />)}
        {showAddPopover && (<Popover message="Blog Post added successfully..!" onClose={() => setShowAddPopover(false)} />)}
        {showDeletePopover && (<Popover message="Blog Post deleted successfully..!" onClose={() => setShowDeletePopover(false)} />)}
        {showDeletePopoverConfirmation && (<DeletePopover message="Are you sure you want to delete this blog post?" 
          onClose={() => {
            setShowDeletePopoverConfirmation(false);
            setSelectedId(-1);
            }
          } 
          onConfirm={confirmDelete} />)
        }
        {/* Filter Popover*/}
        {filterClicked && ( <Filter setFilters={setFilters} onClose={() => {
            setFilterClicked(false);
            console.log(filters);
            filterBlogs(filters);
          }} 
          filters={filters}
          />)
        }
        {showApprovePopover && (<Popover message="Blog Post approved successfully..!" onClose={() => setShowApprovePopover(false)} />)  }
        {showReworkPopover && (<Popover message="Blog Post sent for rework..!" onClose={() => setShowReworkPopover(false)} />)  }
        {/* Sidebar */}
        <div className={`fixed z-20 h-screen shadow-md bg-white transition-width duration-300 ${isSidebarExpanded ? 'w-56' : 'w-16'}`}>
          <div className="logo object-contain p-2 mt-3 flex justify-center items-center static">
            {isSidebarExpanded ? (
              <img src={Logo} className="h-10 w-30 object-contain mt-0 rounded-sm" alt="logo" />
            ) : (
              <div className="flex justify-center items-center">
                <img src={SmallLogo} className="h-6 w-6 object-contain mt-0 rounded-sm" alt="logo" />
              </div>
            )}
            <button
              onClick={handleToggleSidebar}
              className={`${isSidebarExpanded ? 'left-[96%]' : 'left-[90%]'} absolute z-30 bg-white w-5 h-5 border-1 border-gray-100 p-1 rounded-full shadow-md`}
            >
              {isSidebarExpanded ? <img src={previous} className="w-3 h-3" alt="collapse" /> : <img src={next} className="w-3 h-3" alt="expand" />}
            </button>
          </div>
          {/* Sidebar menu */}
          <div className="flex flex-col items-center mt-7 w-full">
            <ul className={`ml-0 w-full ${isSidebarExpanded ? '' : 'space-y-3 mt-5'}`}>
              <li id="dashboard" className={`py-2 px-3 rounded-sm ${activeSection === 'dashboard' ? 'bg-blue-500' : 'hover:bg-slate-100'} ${isSidebarExpanded ? '' : 'flex justify-center items-center'}`} onClick={() => handleChange('dashboard')}>
                {isSidebarExpanded ? 'Dashboard' : <img src={Dashboard} alt="dashboard" className="w-5 h-5 rounded-sm" />}
              </li>
              <li id="blog" className={`py-2 px-3 rounded-sm ${activeSection === 'blog' ? 'bg-blue-500' : 'hover:bg-slate-100'} ${isSidebarExpanded ? '' : 'flex justify-center items-center'}`} onClick={() => handleChange('blog')}>
                {isSidebarExpanded ? 'Blogs List' : <img src={Blog} alt="blog-list" className="w-5 h-5 rounded-sm" />}
              </li>
              <li id="add" className={`py-2 px-3 rounded-sm ${activeSection === 'add' ? 'bg-blue-500' : 'hover:bg-slate-100'} ${isSidebarExpanded ? '' : 'flex justify-center items-center'}`} onClick={() => handleChange('add')}>
                {isSidebarExpanded ? 'Add Blog Post' : <img src={Add} alt="add-blog" className="w-5 h-5 rounded-sm" />}
              </li>
              <li id="recent" className={`py-2 px-3 rounded-sm ${activeSection === 'recent' ? 'bg-blue-500' : 'hover:bg-slate-100'} ${isSidebarExpanded ? '' : 'flex justify-center items-center'}`} onClick={() => handleChange('recent')}>
                {isSidebarExpanded ? 'Recent Blog Post' : <img src={Recent} alt="recent-blog" className="w-5 h-5 rounded-sm" />}
              </li>
              <li id="reports" className={`py-2 px-3 rounded-sm ${activeSection === 'reports' ? 'bg-blue-500' : 'hover:bg-slate-100'} ${isSidebarExpanded ? '' : 'flex justify-center items-center'}`} onClick={() => handleChange('reports')}>
                {isSidebarExpanded ? 'Reports' : <img src={Report} alt="report" className="w-5 h-5 rounded-sm" />}
              </li>
            </ul>
          </div>
          <hr className="border border-gray-300 mt-4" />
          <div className="flex flex-col items-center mt-4 w-full">
            <ul className={`ml-0 w-full ${isSidebarExpanded ? '' : 'space-y-3 mt-2'}`}>
              <li id="profile" className={`py-2 px-3 rounded-sm ${activeSection === 'profile' ? 'bg-blue-500' : 'hover:bg-slate-100'} ${isSidebarExpanded ? '' : 'flex justify-center items-center'}`} onClick={() => handleChange('profile')}>
                {isSidebarExpanded ? 'My Profile' : <img src={Profile} alt="profile" className="w-5 h-5 rounded-sm" />}
              </li>
              <li id="settings" className={`py-2 px-3 rounded-sm ${activeSection === 'settings' ? 'bg-blue-500' : 'hover:bg-slate-100'} ${isSidebarExpanded ? '' : 'flex justify-center items-center'}`} onClick={() => handleChange('settings')}>
                {isSidebarExpanded ? 'Settings' : <img src={Setting} alt="settings" className="w-5 h-5 rounded-sm" />}
              </li>
              <li id="support" className={`py-2 px-3 rounded-sm ${activeSection === 'support' ? 'bg-blue-500' : 'hover:bg-slate-100'} ${isSidebarExpanded ? '' : 'flex justify-center items-center'}`} onClick={() => handleChange('support')}>
                {isSidebarExpanded ? 'Support' : <img src={Support} alt="support" className="w-5 h-5 rounded-sm" />}
              </li>
            </ul>
          </div>
          <div className={`mt-5 w-full`}>
            <li className={`list-none w-full hover:bg-slate-300 text-black text-left py-2 px-4 rounded-sm shadow-slate-100 flex ${isSidebarExpanded ? 'justify-start items-center' : 'justify-center items-center'}`} onClick={handleLogout}>
              {isSidebarExpanded ? 'Logout' : <img src={logout} className="flex w-5 h-5 rounded-sm justify-center" alt="logout" onClick={handleLogout} />}
            </li>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-margin duration-300 ml-${isSidebarExpanded ? '56' : '16'} md:ml-16`}>
          {/* Header */}
          <div className="p-3 h-15 shadow-md flex justify-end">
            <div className="flex space-x-2 mr-3">
              <div className="flex flex-col items-end justify-center">
                <h1 className="text-md font-bold text-right">{user && <span>{getName(user.email)}</span>}</h1>
                {user && user.email==="priyab@technimitta.com" && <p className="text-sm font-normal text-right">Admin</p>}
              </div>
              <img src={Admin} className="h-11 w-11 rounded-full" alt="admin" />
            </div>
          </div>
          {/* Below Header add blog,filter section*/}
          <div className="flex justify-between mt-3 px-3">
            <h1 className="font-bold text-2xl">Blog Posts</h1>
            <div className="flex items-center space-x-3">
              <a className="p-1 bg-blue-300 w-20 h-13 rounded-sm flex justify-center items-center" onClick={handleFilter}>
                <img src={filter} className="w-8 h-8  " alt="filter" onClick={handleFilter} />
              </a>
              <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-sm shadow-gray-400" onClick={handleAdd}>
                + Add Blog Post
              </button>
            </div>
          </div>

          <div className="px-3 mb-2">
            <div className="flex flex-col justify-center items-center mt-3 px-3 w-full h-full border border-gray-300 rounded-sm">
              <div className="flex justify-between px-3 py-3 w-full">
                <p className="text-sm font-thin">All</p>
                <p className="text-sm font-thin">Showing {blogsPerPage} Blog posts</p>
              </div>

              {/* Table view for large screens */}
              <div className="hidden lg:block mt-1 px-3 w-full  overflow-x-auto">
                <div className="min-w-full lg:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-t flex justify-start items-center bg-gray-300 w-full space-x-2">
                        <th className="text-left text-sm font-normal p-3 w-[15%]">Blog Image</th>
                        <th className={`text-left text-sm font-normal p-3 ${user && user.email==="priyab@technimitta.com"?'w-[23%]':'w-[38%]'}`}>Blog Title</th>
                        {user && user.email==="priyab@technimitta.com" && <th className="text-center text-sm font-normal p-3 w-[15%]">Update</th>}
                        <th className="text-center text-sm font-normal p-3 w-[9%]">Category</th>
                        <th className="text-center text-sm font-normal p-3 w-[10%]">Date Created</th>
                        <th className="text-center text-sm font-normal p-3 w-[9%]">Visibility</th>
                        <th className="text-center text-sm font-normal p-3 w-[9%]">Status</th>
                        <th className="text-center text-sm font-normal p-3 w-[10%]">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentBlogs.map((blog) => (
                        <tr key={blog.id} className="border border-gray-300 flex justify-start w-full space-x-2 items-center">
                          <td className="text-left text-sm font-normal p-3 w-[15%]">
                            <img src={blog.url} className="h-10 w-20 rounded-md object-contain" alt="blog" />
                          </td>
                          <td className={`${ user && user.email==="priyab@technimitta.com" ?'w-[23%]':'w-[38%]'} text-left text-sm font-normal p-3 flex flex-col justify-center`}>
                            <p className="text-blue-500">{blog.title.length > 50 ? `${blog.title.substring(0, 50)}...` : blog.title}</p>
                            <p className="text-sm font-thin"><span className="font-bold">Author: </span>{blog.author}</p>
                          </td>
                          { user && user.email==="priyab@technimitta.com" && <td className="text-center text-sm font-normal p-3 w-[15%]">
                            { blog.status==='pending' &&
                              (
                              <>
                                <button
                                  className="text-sm text-black h-full rounded-sm w-[25%]"
                                  onClick={() => handleApprove(blog.id)}
                                >
                                  <img src={check} className="w-8 h-8" alt="approve" />
                                </button>

                                <button 
                                  className="text-sm text-black h-full ml-1 rounded-sm w-[25%]"
                                  onClick={() => handleRework(blog.id)}
                                >
                                  <img src={redo} className="w-8 h-8" alt="rework"/>
                                </button>
                              </>
                              )
                            }
                            { blog.status==='approved' &&
                              <button
                                className="text-black bg-red-500   ml-1 p-1 rounded-sm "
                                onClick={() => handleRework(blog.id)}
                              >
                                Rework
                              </button>
                            }
                          </td>}
                          <td className="text-center text-sm font-normal p-3 w-[9%]">{blog.blog[0].toUpperCase() + blog.blog.slice(1)}</td>
                          <td className="text-center text-sm font-normal p-3 w-[10%]">{blog.date}</td>
                          <td className="text-center text-sm font-normal p-3 w-[9%]">
                            {blog.visibility === 'public' ? (
                              <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Visible</span>
                            ) : (
                              <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Hidden</span>
                            )}
                          </td>
                          <td className="text-center text-sm font-normal p-3 w-[9%]">
                            {blog.status === 'approved' && (
                              <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Approved</span>
                            ) }
                            {blog.status ==='pending' && (
                              <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Pending</span>
                            )}
                            {blog.status ==='rework' && (
                              <span className="bg-orange-100 text-orange-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-orange-900 dark:text-orange-300">Rework</span>  
                            )}
                          </td>
                          <td className="text-center text-sm font-normal w-[10%]">
                            <button className="text-black py-2 px-2 rounded-sm shadow-gray-400" onClick={() => handleEdit(blog.id)}>
                              Edit
                            </button>
                            <button className="text-red-500 py-2 px-2 rounded-sm shadow-gray-400" onClick={() => handleDelete(blog.id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Card view for small screens */}
              <div className="lg:hidden w-full">
                {currentBlogs.map((blog) => (
                  <div key={blog.id} className="border border-gray-300 rounded-sm p-3 mb-3 w-full">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <img src={blog.url} className="h-10 w-20 rounded-md object-contain mr-3" alt="blog" />
                        <div>
                          <p className="text-blue-500">{blog.title.length > 30 ? `${blog.title.substring(0, 30)}...` : blog.title}</p>
                          <p className="text-sm font-thin"><span className="font-bold">Author: </span>{blog.author}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-black py-2 px-2 rounded-sm shadow-gray-400" onClick={() => handleEdit(blog.id)}>
                          Edit
                        </button>
                        <button className="text-red-500 py-2 px-2 rounded-sm shadow-gray-400" onClick={() => handleDelete(blog.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-thin">Category : {blog.blog[0].toUpperCase() + blog.blog.slice(1)}</p>
                      <p className="text-sm font-thin">Date Created : {blog.date}</p>
                      <p className="text-sm font-thin">
                        Visibility : {' '}
                        {blog.visibility === 'public' ? (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Visible</span>
                        ) : (
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Hidden</span>
                        )}
                      </p>
                      <p className="text-sm font-thin mt-1">
                        Status  :{' '}
                        {blog.status === 'approved' ? (
                          <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Approved</span>
                        ) : (
                          <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Pending</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination */}
              <div className="flex justify-center items-center mt-2 mb-2">
                <div className="flex justify-center mt-2 space-x-2">
                  <button
                    className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                  >
                    <img src={previous} className="w-2 h-2" alt="previous" />
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                      onClick={() => handleClick(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                  >
                    <img src={next} className="w-2 h-2" alt="next" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>

  );
};

export default DisplayBlogs;
