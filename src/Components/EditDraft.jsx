import React,{useState,useRef,useEffect,useMemo} from 'react'
import {useParams,useNavigate} from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';

import JoditEditor from 'jodit-react';

import {  getBlogById , updateBlog , updateBlogWithoutImage } from '../utils/DataHandler';
import Popover from './Popover';

import upload from '../assets/upload.png';

export default function EditDraft() {

    // Get the id from the URL
    let { id } = useParams();
    // Reference for the editor
    const editor = useRef(null);

    // State variables to manage the form fields of the blog post
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [date, setDate] = useState('');
    const [showDate, setShowDate] = useState(true);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [author, setAuthor] = useState('');
    const [blog, setBlog] = useState('');
    const [inputTag, setInputTag] = useState('');
    const [tags, setTags] = useState([]);
    const [showAllTags, setShowAllTags] = useState(false);
    const [blogData, setBlogData] = useState(null);

    // Hook to navigate to a different route
    const navigate = useNavigate();
    // Reference for the file input element
    const fileInputRef = useRef(null);
    // State for the Popover 
    const [showDraftEditAlert, setShowDraftEditAlert] = useState(false);

    // Configuration for the Jodit editor
    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: '',
        // options that we defined in above step.
            showXPathInStatusbar: false,
            statusbar: false,
            toolbar: true,
            height: '600px',
            width: '100%',
            allowResizeX: true,
            allowResizeY: true,
            enableDragAndDropFileToEditor: true,
            uploader: {
                insertImageAsBase64URI: true
            },
        }),
        [],
    );
    

    useEffect(() => {
        // Async function to fetch a draft and set state
        const getBlogs = async () => {
            try {
                id = parseInt(id);
                console.log(id);
                await getBlogById(id).then((data) => {
                    console.log(data);
                    setBlogData(data);
                    setTitle(data.title);
                    setContent(data.content);
                    setVisibility(data.visibility);
                    setDate(data.date);
                    setPreview(data.url);
                    setAuthor(data.author);
                    setBlog(data.blog);
                    setTags(data.tags);
                });
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };
        getBlogs();
    }, []);

    // Function to handle the visibility change
    const handleVisibilityChange = (e) => {
        setVisibility(e.target.value);
    }

    // Function to handle the image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setImage(file);
        }
    } 
    /*   
      const handleDragOver = (event) => {
        event.preventDefault();
      };
    
      const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result);
          };
          reader.readAsDataURL(file);
        }
    };*/

    // Function to handle the click on the update image button
    const handleUpdateImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger click on the file input element
        }
    };
    // Function to handle the category of blog change
    const handleBlogChange = (e) => {
        setBlog(e.target.value);
    }
    // Function to handle the tag input field key down event
    const handleKeyDownTag = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setTags([...tags, inputTag]);
            setInputTag('');
        }
    }
    // Function to remove a tag from the list
    const removeTag = (index) => {
        const newTags = [...tags];
        newTags.splice(index, 1);
        setTags(newTags);
    }
    // Function to toggle the visibility of all tags
    const toggleShowAllTags = () => {
        setShowAllTags(!showAllTags);
    }
    // Function to calculate the read time of the draft 
    const calculateReadTime = (text) => {
        const wordsPerMinute = 200; // average reading speed
        const words = text.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes;
    };
    // Function to strip HTML tags from the content
    const stripHtmlTags = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };
      
    // Function to handle the edit draft 
    const handleEditBlog = () => {

        id = parseInt(id);
        // Check if all the fields are filled
        if (title === '' || content === ''  || author === '' || blog === '' || tags.length === 0 || date === '' || preview === null) {
            alert('Please fill in all the fields');
            return;
        }
        // Strip HTML tags from the content
        const strippedContent = stripHtmlTags(content);
        // Calculate read time
        const readTime = calculateReadTime(strippedContent);
        console.log(strippedContent);
        console.log(readTime);
        // Check if the umage is already uploaded or not
        if (preview[0]=='h') {
            console.log(title, content, visibility, date, preview, author, blog, tags);
            console.log('Image uploaded');
            const blogData = {
                title: title,
                content: content,
                visibility: visibility,
                date: date,
                author: author,
                blog: blog,
                tags: tags,
                //readTime: readTime,
            }
            updateBlogWithoutImage(id, blogData);
        } else {
            const blogData = {
                title: title,
                content: content,
                visibility: visibility,
                date: date,
                author: author,
                blog: blog,
                tags: tags,
                //url: preview,
                //readTime: readTime,
            }
            updateBlog(id, image, blogData);
            console.log(title, content, visibility, date, preview, author, blog, tags);
        }
        setShowDraftEditAlert(true);
    }

    /*
    const handleCancelBlog = () => {
        setTitle(blogData.title);
        setContent(blogData.content);
        setVisibility(blogData.visibility);
        setDate(blogData.date);
        setPreview(blogData.url);
        setAuthor(blogData.author);
        setBlog(blogData.blog);
        setTags(blogData.tags);
    }
    */

  return (
    <div>
        {/* Popover*/}
        {showDraftEditAlert && <Popover message='Draft edited Successfully..!' onClose={() => {
            setShowDraftEditAlert(false);
            navigate("/drafts");
            }
        }/>}
        {blogData?  (
            <div className="w-[95%] h-full flex flex-col justify-start  ml-8">
            {/* Header */}
            <div className="flex items-center mt-1 justify-between">
                <div className="w-[66%] flex items-center mt-3 justify-start">
                    <a href="/" className="font-bold text-xl"><IoIosArrowRoundBack  size={20} /></a>
                    <span className="font-bold text-xl ml-1">{title}</span>
                </div>
                <div class="w-[33%] mt-5 grow  flex justify-end items-center">
                    <button onClick={handleEditBlog} className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-sm">UPDATE</button>                    
                    {/*<button onClick={handleCancelBlog} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">Cancel</button>*/}
                </div>
            </div>
            {/* Content */}
            <div class="w-full flex h-full  mt-2 mb-5">
                {/* Left Section */}
                <div className="flex flex-col w-8/12  mr-5">
                    <div className="w-full bg-slate-300 rounded shadow-md flex-1 p-4">
                        {/* Title Content Section */}
                        <div>                            
                            <label htmlFor="title" className="ml-2 mt-2 block text-sm font-bold text-gray-700">Title</label>
                            <input type="text" name="title" id="title" autoComplete="title" 
                                    value={title}
                                    className="mt-1 ml-2 py-2 px-1 focus:ring-blue-300 focus:border-blue-300 block w-[99%] shadow-sm sm:text-sm border-gray-300 rounded-sm" 
                                    placeholder="e.g. Blog about your latest products or deals" 
                                    onChange={(e) => setTitle(e.target.value)} 
                            />
                        </div>
                        {/* Content Section */}
                        <div className="mt-5 ml-2 flex-1">
                            <label htmlFor="content" className="block mb-2 text-sm font-bold text-gray-700">Description</label>
                            <JoditEditor
                                ref={editor}
                                value={content }
                                config={config}
                                tabIndex={2}
                                onChange={newContent =>setContent(newContent)}
                            />
                        </div>   
                    </div>
                    {/* Empty Space */}
                    <div class="grow h-full  flex justify-center items-center"></div>
                </div>
        
                {/* Right Section */}
                <div class="flex flex-col w-2/6 ">
                    {/* Publish Section */}
                    <div class="bg-slate-300 grow-0 h-[20%] rounded shadow-md pb-2">
                        <div class="mt-4 ml-2">
                            <label htmlFor="visibility" className="ml-2 mt-2 block text-sm font-bold text-gray-700">Visibility</label>
                        </div>
                        <div class="mt-5 ml-4"> 
                            <div class="flex justify-start gap-10">
                                <div>
                                    <input type="radio" id="public" name="visibility" value="public" checked={visibility === 'public'} onChange={handleVisibilityChange} />
                                    <label for="public" className="ml-2">Visible</label>
                                </div>
                                <div>
                                    <input type="radio" id="hidden" name="visibility" value="hidden" checked={visibility === 'hidden'} onChange={handleVisibilityChange}/>
                                    <label for="hidden" className="ml-2">Hidden</label>
                                </div>
                            </div>
                            {showDate === false ? (
                                <a className="block text-blue-500 mt-5 hover:underline" onClick={()=>setShowDate(true)}>Set the visibility date</a>
                                ):(
                                <input 
                                type="date" 
                                name="date" 
                                id="date" 
                                hidden
                                value={date}
                                autoComplete="date" 
                                className="mt-3 ml-1 py-2 px-1 focus:ring-blue-300 focus:border-blue-300 block w-11/12 shadow-sm sm:text-sm border-gray-300 rounded-sm" 
                                onChange={(e) => setDate(e.target.value)} 
                                />
                            )}
                        </div>
                    </div>
                    {/* Image Section */}
                    <div className="mt-3 bg-slate-300 grow-0 h-[33%] rounded shadow-md">
                        <div className="mt-2 ml-2 flex justify-between">
                            <label htmlFor="image" className="ml-2 mt-2 block text-sm font-bold text-gray-700">
                                Featured Image
                            </label>
                            {preview && (
                            <a className="mr-4 text-blue-500 font-normal py-1 px-2 rounded hover:underline cursor-pointer" onClick={handleUpdateImageClick}
                            >
                                Update Image
                            </a>
                            )}
                        </div>
                        <div className="mt-1 ml-6 h-[85%] w-[85%] flex justify-center items-center pb-5">
                            {preview ? (
                            <img src={preview} alt="Uploaded" className="h-full w-full object-contain" />
                            ) : (
                            <div
                                className="flex flex-col justify-center items-center space-y-6  rounded-lg p-10"
                                onClick={() => fileInputRef.current && fileInputRef.current.click()} // Trigger file input click on drop zone click
                                onDragOver={(event) => event.preventDefault()}
                                onDrop={(event) => {
                                event.preventDefault();
                                const file = event.dataTransfer.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                    setPreview(reader.result);
                                    };
                                    reader.readAsDataURL(file);
                                }
                                }}
                            >
                                <label htmlFor="image" className="flex justify-center items-center">
                                    <img src={upload} alt="Upload" className="h-20 w-20" />
                                </label>
                                <p className="text-sm text-gray-400">Drag and drop a file or click to upload</p>
                            </div>
                            )}
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                hidden
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                            />
                        </div>
                    </div>
    
                    {/* Organisation Section */}
                    <div class="mt-3 bg-slate-300 grow-0 h-[47%] mb-2 rounded shadow-md pb-5 ">
                        <div class="mt-4 ml-2">
                            <label htmlFor="Organisation" className="ml-2 mt-2 block text-sm font-bold text-gray-700">Organisation</label>
                        </div>
                        <label htmlFor="author" className="ml-4 mt-4 block text-sm font-medium text-gray-700">Author</label>
                        <input type="text" name="author" id="author" autoComplete="author" 
                            className="mt-1 ml-4 py-2 px-1 focus:ring-blue-300 focus:border-blue-300 block w-11/12 shadow-sm sm:text-sm border-gray-300 rounded-sm" 
                            placeholder="" 
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)} 
                        />
                        <label htmlFor="blog" className="ml-4 mt-4 block text-sm font-medium text-gray-700">Blog</label>
                        <select id="small" value={blog} onChange={handleBlogChange} class="block w-11/12 ml-4 p-2 mt-1 text-sm text-gray-900 border border-gray-300 rounded-sm bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="">Choose a Blog</option>
                            <option value="news">News</option>
                            <option value="technology">Technology</option>
                            <option value="nimitta">About Nimitta</option>
                            <option value="finance">Finance</option>
                        </select>
                        <hr class="mt-4" />
                        <div class="mt-2 ml-2 flex justify-between">
                            <label htmlFor="Tags" className="ml-2  block text-sm font-medium text-gray-700">Tags</label>
                            <a  className="ml-2 mr-4  block text-sm font-normal text-blue-500" onClick={toggleShowAllTags}>
                                {showAllTags ? "Hide all tags" : "Show all tags"}
                            </a>
                        </div>
                        <input type="text" name="tags" id="tags" autoComplete="tags"
                            className="mt-2 ml-4 py-2 px-1 focus:ring-blue-300 focus:border-blue-300 block w-11/12 shadow-sm sm:text-sm border-gray-300 rounded-sm" 
                            placeholder="Enter the tag and press enter." 
                            value={inputTag}
                            onKeyDown={handleKeyDownTag}
                            onChange={(e) => setInputTag(e.target.value)} 
                        />
                        <div class="relative">
                            <div className="ml-4 mt-1 w-11/12">
                                {!showAllTags && tags.slice(0, showAllTags ? tags.length : 3).map((tag, index) => (
                                    <div key={index} className="inline-flex items-center px-2 py-1 mr-2 mt-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md">
                                        {tag}
                                        <button 
                                            className="ml-2 text-red-500 hover:text-red-700" 
                                            onClick={() => removeTag(index)}
                                        >
                                        x
                                        </button>
                                    </div>
                                ))}
                                {tags.length > 3 && !showAllTags && (
                                    <div className="inline-flex items-center px-2 py-1 mt-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md">
                                        + {tags.length - 3} more
                                    </div>
                                )}
                            </div>
                            {showAllTags && (
                                <div className="absolute left-4 top-1 w-11/12 z-10 max-h-40 overflow-y-auto border-t border-gray-300 bg-gray-200 rounded-md">
                                    {tags.map((tag, index) => (
                                        <div key={index} className="flex justify-between items-center px-2 py-1 border-b border-gray-300 text-sm font-medium text-gray-700">
                                            {tag}
                                            <button 
                                                className="ml-2 text-red-500 hover:text-red-700 "
                                                onClick={() => removeTag(index)}
                                            >
                                            x
                                            </button>
                                        </div>
                                    ))}
                            </div>
                            )}
                        </div>                          
                    </div>
                    {/* Empty Space */}
                    <div class="grow h-full flex justify-center items-center"></div>    
                </div>
            </div>
        </div>
        ) : (
            <p></p>
        )}
    </div>
  )
}
