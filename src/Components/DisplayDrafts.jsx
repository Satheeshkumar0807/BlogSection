import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';

//importing utils
import { deleteBlog, getBlogs,updateBlogWithoutImage } from '../utils/DataHandler';

//importing components
import Popover from './Popover';
import DeletePopover from './ConfirmationDeletePopver';

//importing assets
import next from '../assets/next.png';
import previous from '../assets/back.png';
import photo from '../assets/photo.png';



// Display all the drafts
const DisplayDrafts = () => {

  // for navigation
  const navigate = useNavigate();

  // State variables to manage the drafts
  const [drafts, setDrafts] = useState([]);

  const [loading, setLoading] = useState(true);

  // state variables to manage the pagination
  const [currentPage, setCurrentPage] = useState(1);
  const draftsPerPage = 5;
  const totalPages = Math.ceil(drafts.length / draftsPerPage);

  // State variables to manage the popovers
  const [showDeletePopover, setShowDeletePopover] = useState(false);
  const [showDeletePopoverConfirmation, setShowDeletePopoverConfirmation] = useState(false);
  const [showPublishPopover, setShowPublishPopover] = useState(false);

  // State variable to manage the selected draft id for deletion
  const [selecteid, setSelectedId] = useState(-1);

  
  useEffect(() => {
    const getDrafts = async () => {
      try {
        const drafts = await getBlogs();
        //Filtering the drafts
        setDrafts(drafts.filter((draft) => draft.isDraft === true));
        setLoading(false);
        console.log('Drafts:', drafts);
      } catch (error) {
        console.error('Failed to fetch drafts:', error);
        setLoading(false);
      }
    };
    getDrafts();
  },[]);

  // Function to handle the pagination to the selected page
  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to handle the previous paginated page 
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to handle the next paginated page
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // display the drafts of the current page
  const currentdrafts = drafts.slice(
    (currentPage - 1) * draftsPerPage,
    currentPage * draftsPerPage
  );

  // Function to publish the seleceted draft
  const handlePublish = async (event,id) => {
    console.log('Publish:', id);
    //event.preventDefault();
    drafts.map(async (draft) => {
      if (draft.id === id) {
        // Check if all the fields are filled
        if (draft.title==='' || draft.content==='' || draft.blog===''||draft.author===''||draft.preview===''||draft.tags.length===0||draft.date==='') {
          alert('Please fill all the fields');
          return ;
        }else{
          draft.isDraft = false;
          const blogData = {
              title: draft.title,
              content: draft.content,
              visibility: draft.visibility,
              date: draft.date,
              author: draft.author,
              blog: draft.blog,
              tags: draft.tags,
              isDraft:draft.isDraft,
          }
          setShowPublishPopover(true);
          console.log('Blog Data:', blogData);
          await updateBlogWithoutImage(id, blogData);
          setDrafts(drafts.filter((draft)=>draft.id!==id));
        }
      }
    }); 
  }

  // Function to handle the edit of the selected blog
  const handleEdit = (id) => {
    navigate('/editdraft/'+id);
    console.log('Edit:', id);
  }

  // Function to handle the delete confirmation of the selected blog
  const handleDelete = (id) => {
    setSelectedId(id);
    setShowDeletePopoverConfirmation(true);
  };
  
  const confirmDelete = async() => {
    /* filteredBlogs.splice(id,1);
    setFilteredBlogs([...filteredBlogs]);
    
    blogs.splice(id,1);
    setBlogs([...blogs]);
    deleteBlog(selecteid);
    setShowDeletePopoverConfirmation(false);
    setShowDeletePopover(true);
    */
    setShowDeletePopoverConfirmation(false);
    setShowDeletePopover(true);
    console.log('Delete:', selecteid);
    await deleteBlog(selecteid);
    setDrafts(drafts.filter((draft) => draft.id !== selecteid));
    setSelectedId(-1);
  };

  // Function to strip the html tags from the content
  const stripHtmlTags = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <div className="p-3">
      <div className="flex justify-start items-center space-x-1 mt-3 px-3">
        <a href="/"><IoIosArrowRoundBack  size={20} /></a>
        <span className="font-bold text-2xl">Drafts</span>
      </div>

      {/* Popovers */}
      {showDeletePopover && ( <Popover onClose={()=>setShowDeletePopover(false)} message="Draft Deleted Successfully..!" />)}
      {showPublishPopover && ( <Popover onClose={()=>setShowPublishPopover(false)} message="Draft Published Successfully..!" />)}

      {showDeletePopoverConfirmation && (<DeletePopover message="Are you sure you want to delete this blog post?" onClose={() => {
        setShowDeletePopoverConfirmation(false);
        setSelectedId(-1);
        }
        } onConfirm={confirmDelete} />
      )}
    <div className="px-3 mb-2">
      <div className="flex flex-col justify-center items-center mt-3 px-3 w-full h-full border border-gray-300 rounded-sm">
        <div className="flex justify-between px-3 py-3 w-full">
          <p className="text-sm font-thin">All</p>
          <p className="text-sm font-thin">Showing {draftsPerPage} Blog posts</p>
        </div>

        {/* Table view for large screens */}
        <div className="hidden lg:block mt-1 px-3 w-full  overflow-x-auto">
          <div className="min-w-full lg:block">
            <table className="w-full">
              <thead>   
                <tr className="border-t flex justify-start items-center bg-gray-300 w-full space-x-2">
                  <th className="text-left text-sm font-normal p-3 w-[15%]">Blog Image</th>
                  <th className="text-left text-sm font-normal p-3 w-[20%]">Blog Title</th>
                  <th className="text-left text-sm font-normal p-3 w-[22%]">Blog Description</th>
                  <th className="text-center text-sm font-normal p-3 w-[9%]">Category</th>
                  <th className="text-center text-sm font-normal p-3 w-[10%]">Date Created</th>
                  <th className="text-center text-sm font-normal p-3 w-[9%]">Visibility</th>
                  <th className="text-center text-sm font-normal p-3 w-[15%]">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentdrafts.map((blog) => (
                  <tr key={blog.id} className="border border-gray-300 flex justify-start w-full space-x-2 items-center">
                    <td className="text-left text-sm font-normal p-3 w-[15%]">
                      <img src={blog.url?blog.url:photo} className="h-10 w-20 rounded-md object-contain" alt="blog" />
                    </td>
                    <td className="text-left text-sm font-normal p-3 w-[20%] flex flex-col justify-center">
                      <p className="text-blue-500">{blog.title?(blog.title.length > 50 ? `${blog.title.substring(0, 50)}...` : blog.title):'----------'}</p>
                      <p className="text-sm font-thin"><span className="font-bold">Author: </span>{blog.author?blog.author:"------"}</p>
                    </td>
                    <td className="text-left text-sm font-normal p-3 w-[22%]">
                      <p className="text-black">{blog.content?(stripHtmlTags(blog.content).length > 50 ? `${stripHtmlTags(blog.content).substring(0, 50)}...` : stripHtmlTags(blog.content)):'------------'}</p>
                    </td>
                    <td className="text-center text-sm font-normal p-3 w-[9%]">{blog.blog?(blog.blog[0].toUpperCase() + blog.blog.slice(1)):"------"}</td>
                    <td className="text-center text-sm font-normal p-3 w-[10%]">{blog.date?blog.date:"------"}</td>
                    <td className="text-center text-sm font-normal p-3 w-[9%]">
                      {blog.visibility ? ( blog.visibility === 'public' ? (
                        <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Visible</span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Hidden</span>
                      ) ): '------'}
                    </td>
                    <td className="text-center text-sm font-normal w-[15%]">
                      <button className="text-black py-2 px-2 rounded-sm shadow-gray-400" onClick={(e) => handlePublish(e,blog.id)}>
                        Post
                      </button>
                      <button className="text-blue-500 py-2 px-2 rounded-sm shadow-gray-400" onClick={() => handleEdit(blog.id)}>
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
          {currentdrafts.map((blog) => (
            <div key={blog.id} className="border border-gray-300 rounded-sm p-3 mb-3 w-full">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img src={blog.url?blog.url:photo} className="h-10 w-20 rounded-md object-contain mr-3" alt="blog" />
                  <div>
                    <p className="text-blue-500">{blog.title?(blog.title.length > 50 ? `${blog.title.substring(0, 50)}...` : blog.title):'-------'}</p>
                    <p className="text-blue-500">{blog.content?(stripHtmlTags(blog.content).length > 30 ? `${stripHtmlTags(blog.content).substring(0, 30)}...` : stripHtmlTags(blog.content)):'-----'}</p>
                    <p className="text-sm font-thin"><span className="font-bold">Author: </span>{blog.author?blog.author:'-----'}</p>
                  </div>
                </div>
                <div className="flex space-x-2">

                  <button className="text-black py-2 px-2 rounded-sm shadow-gray-400" onClick={(e) => handlePublish(e,blog.id)}>
                    Post
                  </button>
                  <button className="text-blue-500 py-2 px-2 rounded-sm shadow-gray-400" onClick={() => handleEdit(blog.id)}>
                    Edit
                  </button>
                  <button className="text-red-500 py-2 px-2 rounded-sm shadow-gray-400" onClick={() => handleDelete(blog.id)}>
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm font-thin">Category: {blog.blog?(blog.blog[0].toUpperCase() + blog.blog.slice(1)):'-----'}</p>
                <p className="text-sm font-thin">Date Created: {blog.date?blog.date:'-----'}</p>
                <p className="text-sm font-thin">
                  Visibility:{' '}
                  {blog.visibility?(blog.visibility === 'public' ? (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Visible</span>
                  ) : (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Hidden</span>
                  )):'-----'}
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
  );
};

export default DisplayDrafts;
