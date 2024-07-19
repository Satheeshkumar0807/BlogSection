import React from 'react';
import {useRef,useState,useEffect,useMemo} from 'react';
import { useNavigate } from 'react-router-dom';

import JoditEditor from 'jodit-react';
import { IoIosArrowRoundBack } from 'react-icons/io';

import { uploadBlog,uploadDraft } from '../utils/DataHandler';
import Popover from './Popover';

import upload from '../assets/upload.png';

export default function AddBlog() {
    // for navigation
    const navigate = useNavigate();
    // Jodit Editor Configuration
    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: '',
            showXPathInStatusbar: false,
            statusbar: false,
            toolbar: true,
            height: '555px',
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
    // Reference to the file input element and the editor and date input
    const fileInputRef = useRef(null);
    const editor = useRef(null);
    const dateInputRef = useRef(null);

    // State variables for the form fields of the blog post
    const [title, setTitle] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [author, setAuthor] = useState('');
    const [blog, setBlog] = useState('');
    const [tags, setTags] = useState([]);
    const [inputTag, setInputTag] = useState('');
    const [showAllTags, setShowAllTags] = useState(false);
    const [date, setDate] = useState('');
    const [showDate, setShowDate] = useState(false);
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    // State variables for the alert popovers
    const [showAddBlogAlert, setShowAddBlogAlert] = useState(false);
    const [showAddDraftAlert, setShowAddDraftAlert] = useState(false);

    /*
    const calculateReadTime = (text) => {
        const wordsPerMinute = 200; // average reading speed
        const words = text.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
      };

      const stripHtmlTags = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc.body.textContent || "";
      };
      */

    // Function to handle the save draft button click
    const handleAddDraft = async () => {
        // Check if all the fields are empty
        if(title==='' && content==='' && author==='' && blog==='' && tags.length===0 && date==='' && preview==null){
            alert('Please fill atleast one field to save the draft');
            return;
        }
        var data = {};
        // Check if the fields are empty and assign the values to the data object
        if (title) {
            data.title = title;
        }
        else{
            data.title = '';
        }
        if (content) {
            data.content = content;
        }
        else{
            data.content = '';
        }
        if (author) {
            data.author = author;
        }
        else{
            data.author = '';
        }

        if (blog) {
            data.blog = blog;
        }
        else{
            data.blog = '';
        }
        if (tags.length) {
            data.tags = tags;
        }
        else{
            data.tags = [];
        }
        if (visibility) {
            data.visibility = visibility;
        }
        if (date) {
            data.date = date;
        }
        else{
            data.date = '';
        }
        data.isDraft = true;
        data.status = 'pending';
        const response  = await uploadDraft(image, data);
        console.log(response);
        setShowAddDraftAlert(true);
        console.log('Title:', title);
        console.log('Content1:', content);
        console.log('Author:', author);
        console.log('Blog:', blog);
        console.log('Tags:', tags);
        console.log('Visibility:', visibility);
        console.log('Date:', date);
        console.log('Image:', image);
    }
        
    // Function to handle the save button click
    const handleAddBlog = async () => {
        console.log(title,content,author,blog,tags.length,date,image)
        // Check if all the fields are empty
        if (title==='' || content===''  || author==='' || blog==='' || tags.length===0 || date==='' || !image){
            alert('Please fill all the fields');
            return;
        }
        //const strippedContent = stripHtmlTags(content);
        // Calculate read time
        //const readTime = calculateReadTime(strippedContent);
        const isDraft = false;
        const status = 'pending';
        const additionalData = {
            title,
            content,
            visibility,
            date,
            author,
            blog,
            tags,
            status,
            isDraft,
            //readTime,
          };
        const downloadURL  = await uploadBlog(image, additionalData);
        console.log('Title:', title);
        console.log('Content1:', content);
        console.log('Author:', author);
        console.log('Blog:', blog);
        console.log('Tags:', tags);
        console.log('Visibility:', visibility);
        console.log('Date:', date);
        console.log('Image:', image);
        console.log('Download URL:', downloadURL);
        setShowAddBlogAlert(true);
        setTitle('');
        setContent('');
        setAuthor('');
        setBlog('');
        setTags([]);
        setInputTag('');
        setVisibility('public');
        setDate('');
        setImage(null);
        setPreview(null);
        setShowDate(false);
    };
    
    useEffect(() => {
        if (showDate && dateInputRef.current) {
            dateInputRef.current.focus();
            dateInputRef.current.click();
        }
    }, [showDate]);
    
    // Function to handle the image upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result);
          };
          reader.readAsDataURL(file);
          setImage(file);
        }
      };

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
    
    // Function to handle the update image click
    const handleUpdateImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger click on the file input element
        }
    };

    // Function to handle the visibility change
    const handleVisibilityChange = (event) => {
        setVisibility(event.target.value);
    };
    
    // Function to handle the category of blog change
    const handleBlogChange = (event) => {
        setBlog(event.target.value);
    };

    // Function to handle the tag input field key down
    const handleKeyDownTag = (e) => {
        if (e.key === "Enter" && inputTag.trim() !== "") {
            setTags([...tags, inputTag.trim()]);
            setInputTag("");
        }
    };
    // Function to remove a tag
    const removeTag = (index) => {
        const updatedTags = tags.filter((_, i) => i !== index);
        setTags(updatedTags);
    };
    // Function to toggle the show all tags
    const toggleShowAllTags = () => {
        setShowAllTags(!showAllTags);
    };
    /*
    const handleCancel = () => {
        setTitle('');
        setContent('');
        setSummary('');
        setAuthor('');
        setBlog('');
        setTags([]);
        setInputTag('');
        setVisibility('public');
        setDate('');
        setImage(null);
        setPreview(null);
        setShowDate(false);
        
    }*/

  return (
    <div className="w-[95%] h-[100%] flex flex-col justify-start  ml-8">
      {/* Popover */}
      {showAddBlogAlert && <Popover message='Blog added Successfully..!' onClose={() => {
        setShowAddBlogAlert(false);
        navigate('/');
        }
       }
       />}
      {showAddDraftAlert && <Popover message='Draft saved Successfully..!' onClose={() => {
        setShowAddDraftAlert(false);
        navigate('/');
        }
       }/>}
       {/* Header Section */}
       <div className="flex items-center mt-1 justify-between">
            <div className="flex items-center mt-3 justify-start">
                <a href="/"><IoIosArrowRoundBack  size={20} /></a>
                <span className="font-bold text-2xl">Add Blog Post</span>
            </div>
            {/* Save Section */}
            <div class="mt-5 grow space-x-1 flex justify-end items-center">
                <button onClick={handleAddDraft} className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-sm">Draft</button>
                <button onClick={handleAddBlog} className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-sm">Save</button>
                {/*<button onClick={handleCancel} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">Cancel</button>*/}
            </div>
       </div>
       {/*Main Section*/}
       <div class="w-full flex h-full  mt-2 mb-5">
            {/* Left Section */}
            <div className="flex flex-col w-8/12  mr-5">
                <div className="w-full bg-slate-300 rounded shadow-md flex-1 pt-3 pl-3 pr-3 pb-1">
                    {/* Title Content Section */}
                    <div>
                        <label htmlFor="title" className="ml-2 mt-2 block text-sm font-bold text-gray-700">Title</label>
                        <input type="text" name="title" id="title" autoComplete="title" 
                            value={title}
                            className="mt-1 ml-2 py-2 px-1 focus:ring-blue-300 focus:border-blue-300 block w-[99%] shadow-sm sm:text-sm border-gray-300 rounded-sm" 
                            placeholder="e.g. Blog about your latest products or deals" 
                            onChange={(e) => setTitle(e.target.value)} />       
                    </div>
                    {/* Content Section */}
                    <div className="mt-4 ml-2 flex-1 pb-3">
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
                {/*Empty Space*/}
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
                            <div class="">
                                <input type="radio" id="public" name="visibility" value="public" checked={visibility === 'public'} onChange={handleVisibilityChange} />
                                <label for="public" className="ml-2">Visible</label>
                            </div>
                            <div>
                                <input type="radio" id="hidden" name="visibility" value="hidden" checked={visibility === 'hidden'} onChange={handleVisibilityChange}/>
                                <label for="hidden" className="ml-2">Hidden</label>
                            </div>
                        </div>
                        {showDate === false ? (
                            <a className="block text-blue-500 mt-3 hover:underline" onClick={()=>setShowDate(true)}>Set the visibility date</a>
                            ):(
                            <input 
                                type="date" 
                                name="date" 
                                id="date" 
                                hidden
                                autoComplete="date" 
                                className="mt-3 ml-1 py-2 px-1 focus:ring-blue-300 focus:border-blue-300 block w-11/12 shadow-sm sm:text-sm border-gray-300 rounded-sm" 
                                onChange={(e) => setDate(e.target.value)} 
                                ref={dateInputRef}
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
                        <a
                            className="mr-4 text-blue-500 font-normal py-1 px-2 rounded hover:underline cursor-pointer"
                            onClick={handleUpdateImageClick}
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
                                setImage(file);
                            }
                            }}
                        >
                            <label htmlFor="image" className="flex justify-center items-center">
                                <img src={upload} alt="Upload" className="h-20 w-20" />
                            </label>
                            <p className="text-sm text-gray-400">Drag and drop a file or click to upload</p>
                        </div>)}
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
                <div class="mt-3 bg-slate-300 grow-0 h-[47%] mb-2 rounded shadow-md pb-5">
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
                    <select id="small" value={blog} onChange={handleBlogChange} class="block w-11/12 ml-4 py-2 px-1 mt-1 text-sm text-gray-900 border border-gray-300 rounded-sm bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
  );
}

