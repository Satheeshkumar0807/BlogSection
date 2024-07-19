import React, { useEffect, useState } from 'react';
import { FaAngleDown } from "react-icons/fa6";
import { IoIosArrowUp } from "react-icons/io";

export default function Filter({setFilters,filters,onClose} ) {
  
  //const [isFilterVisible, setIsFilterVisible] = useState(false);

  
  // states to get the filter values
  const [dateFilter, setDateFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('');
  const [visibility, setVisibility] = useState('');
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');

  // states to manage the the filter options sre checked or not
  const [dateFilterEnabled, setDateFilterEnabled] = useState(false);
  const [categoryFilterEnabled, setCategoryFilterEnabled] = useState(false);
  const [statusFilterEnabled, setStatusFilterEnabled] = useState(false);
  const [visibilityFilterEnabled, setVisibilityFilterEnabled] = useState(false);
  const [authorFilterEnabled, setAuthorFilterEnabled] = useState(false);
  const [titleFilterEnabled, setTitleFilterEnabled] = useState(false);

  // states to manage the error messages for the filters i.e. if the filter is checked but the value is not filled 
  const [isDateNotFilled, setIsDateNotFilled] = useState(false);
  const [isCategoryNotFilled, setIsCategoryNotFilled] = useState(false);
  const [isVisibilityNotFilled, setIsVisibilityNotFilled] = useState(false);
  const [isAuthorNotFilled, setIsAuthorNotFilled] = useState(false);
  const [isTitleNotFilled, setIsTitleNotFilled] = useState(false);
  const [isStatusNotFilled, setIsStatusNotFilled] = useState(false);

  // states to expand the filter options
  const [openDate, setOpenDate] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openVisibility, setOpenVisibility] = useState(false);
  const [openAuthor, setOpenAuthor] = useState(false);
  const [openTitle, setOpenTitle] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  
  // state to manage the end date validation
  const [isEndDateValid, setIsEndDateValid] = useState(false);

  
  // set the filter values to the state
  useEffect(() => {
    if (filters) {
      setDateFilterEnabled(filters.dateFilterEnabled);
      setDateFilter(filters.dateFilter);
      setStartDate(filters.startDate);
      setEndDate(filters.endDate);
      setCategoryFilterEnabled(filters.categoryFilterEnabled);
      setCategories(filters.categories);
      setVisibilityFilterEnabled(filters.visibilityFilterEnabled);
      setVisibility(filters.visibility);
      setAuthorFilterEnabled(filters.authorFilterEnabled);
      setAuthor(filters.author);
      setTitleFilterEnabled(filters.titleFilterEnabled);
      setTitle(filters.title);
      setStatusFilterEnabled(filters.statusFilterEnabled);
      setStatus(filters.status);

    }
  }, [filters]);


  // function to handle the category filter
  const handleCategoryChange = (e) => {

    const { id, checked } = e.target;
    console.log(id, checked);

    // If the category is not empty
    if (categories){
      // If the category is checked, add the category to the list
      if (checked) {
        setCategories([...categories, id]);
      }
      // If the category is unchecked, remove the category from the list
      else {
        setCategories(categories.filter((category) => category !== id));
      }
    } 
    // If the category is empty
    else {
      if (checked) {
        setCategories([id]);
      }
      else{
        setCategories([]);
      }
    }
  };

  // function to handle the status filter
  const handleStatusChange = (e) => {
    setStatus(e.target.id);
  };

  // function to handle the visibility filter
  const handleVisibilityChange = (e) => {
    setVisibility(e.target.id);
  };

  // function to handle the date filter options
  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.id);
    setStartDate('');
    setEndDate('');
  };

  // function to apply the filters changes and close the filter
   const applyFilters = () => {
     // End date validation
     if (dateFilter === 'betweenDates') {
      console.log('Start Date , End Date:', startDate,endDate);
      if (new Date(startDate) > new Date(endDate)) {
        setIsEndDateValid(false);
        return;
      } else {
        setIsEndDateValid(true);
      }
    }
    // Check if the date filter is checked but the value is not filled
    if (dateFilterEnabled && dateFilter === 'byDate' && !startDate) {
      setOpenDate(true);
      setIsDateNotFilled(true);
      return;
    }
    // Check if the date filter is checked but the value is not filled
    if (dateFilterEnabled && dateFilter === 'betweenDates' && (!startDate || !endDate)) {
      setOpenDate(true);
      setIsDateNotFilled(true);
      return;
    }
    // Check if the category filter is checked but the option is not filled
    if (dateFilterEnabled && dateFilter !== 'betweenDates' && dateFilter !== 'byDate') {
      setOpenDate(true);
      setIsDateNotFilled(true);
      return;
    }
    // Check if the category filter is checked but the option is not filled
    if (categoryFilterEnabled && !categories) {
      setOpenCategory(true);
      setIsCategoryNotFilled(true);
      return;
    }
    // Check if the visibility filter is checked but the option is not filled
    if (visibilityFilterEnabled && !visibility) {
      setOpenVisibility(true);
      setIsVisibilityNotFilled(true);
      return;
    }
    // Check if the author filter is checked but the value is not filled
    if (authorFilterEnabled && !author) {
      setOpenAuthor(true);
      setIsAuthorNotFilled(true);
      return;
    }
    // Check if the title filter is checked but the value is not filled
    if (titleFilterEnabled && !title) {
      setOpenTitle(true);
      setIsTitleNotFilled(true);
      return;
    } 
    if (statusFilterEnabled && !status) {
      setOpenStatus(true);
      setIsStatusNotFilled(true);
      return;
    }

    // Set the filters to the state
    setFilters({
      dateFilterEnabled,
      dateFilter,
      startDate,
      endDate,
      categoryFilterEnabled,
      categories,
      visibilityFilterEnabled,
      visibility,
      authorFilterEnabled,
      author,
      titleFilterEnabled,
      title,
      statusFilterEnabled,
      status,
    });

    // Log the filter values
    console.log('Date Filter:', dateFilterEnabled);
    console.log('Date Filter:', dateFilter);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Category Filter:', categoryFilterEnabled);
    console.log('Categories:', categories);
    console.log('Visibility Filter:', visibilityFilterEnabled);
    console.log('Visibility:', visibility);
    console.log('Author Filter:', authorFilterEnabled);
    console.log('Author:', author);
    console.log('Title Filter:', titleFilterEnabled);
    console.log('Title:', title);
    console.log('Status Filter:', statusFilterEnabled);
    console.log('Status:', status);
    onClose();

    }

  // function to clear the filters
  const clearFilter = () => {

    setDateFilterEnabled(false);
    setDateFilter('');
    setStartDate('');
    setEndDate('');
    setCategoryFilterEnabled(false);
    setCategories([]);
    setVisibilityFilterEnabled(false);
    setVisibility('');
    setAuthorFilterEnabled(false);
    setAuthor('');
    setTitleFilterEnabled(false);
    setTitle('');
    setStatusFilterEnabled(false);
    setStatus('');

    setIsEndDateValid(true);

    setIsDateNotFilled(false);
    setIsCategoryNotFilled(false);
    setIsVisibilityNotFilled(false);
    setIsAuthorNotFilled(false);
    setIsTitleNotFilled(false);
    setIsStatusNotFilled(false);

    setFilters({});
    onClose();
  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center rounded-sm">
      {/* Blurred background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm"></div>
      {/* Popover content */}
      <div className="relative bg-white flex flex-col w-96 h-96 shadow-md py-3 z-10 rounded-sm">
        <div className="flex-1 overflow-y-auto no-scrollbar justify-center items-center w-[90%]">
          
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-semibold ml-5">Filters</h1>
          </div>
          {/* Date filter */}
          <div className="mb-4 ml-5 mt-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <input
                  type="checkbox"
                  id="dateFilterEnabled"
                  checked={dateFilterEnabled}
                  onChange={(e) => setDateFilterEnabled(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="dateFilterEnabled" className="cursor-pointer font-semibold">Date</label>
              </div>
              <button onClick={() => setOpenDate(!openDate)}>{openDate ? <IoIosArrowUp/> : <FaAngleDown/>}</button>
            </div>
            {/* Date filter options */}
            {openDate && (
              <div class="ml-5">
                <p className="mb-1 cursor-pointer hover:bg-slate-200 p-1 rounded">
                  <input 
                    type="radio" 
                    name="dateFilter" 
                    id="byDate" 
                    checked={dateFilter === 'byDate'} 
                    onChange={handleDateFilterChange} 
                  />
                  <label htmlFor="byDate" className="ml-2">By a date</label>
                </p>
                <p className="cursor-pointer hover:bg-slate-200 p-1 rounded">
                  <input 
                    type="radio" 
                    name="dateFilter" 
                    id="betweenDates" 
                    checked={dateFilter === 'betweenDates'} 
                    onChange={handleDateFilterChange} 
                  />
                  <label htmlFor="betweenDates" className="ml-2">Between Dates</label>
                </p>
                {dateFilter==='byDate' && (
                  <div className="mt-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 border rounded mb-2"
                    />
                  </div>
                )}
                {dateFilter === 'betweenDates' && (
                  <div className="flex justify-center items-center space-y-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-[44%] p-2 border rounded mt-2 "
                    />
                    <span className="mx-2">to</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={`w-[44%] p-2 border rounded ${!isEndDateValid ? 'border-red-500' : ''}`}
                    />
                  </div>
                )}  
                {/* Error message for date filter */}
                {openDate && isDateNotFilled && <p className="text-red-500 text-sm mt-1">Please select a date</p>}
                {openDate && isEndDateValid && <p className="text-red-500 text-sm mt-1">End date must be greater than start date</p>}
              </div>
            )}
          </div>
          {/* Category filter */}
          <div className="mb-4 ml-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <input
                  type="checkbox"
                  id="categoryFilterEnabled"
                  checked={categoryFilterEnabled}
                  onChange={(e) => setCategoryFilterEnabled(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="categoryFilterEnabled" className="cursor-pointer font-semibold">Category</label>
              </div>
              <button onClick={() => setOpenCategory(!openCategory)}>{openCategory ? <IoIosArrowUp/> : <FaAngleDown/>}</button>
            </div>
            {openCategory && (
              <div className="ml-5">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="technology"
                    checked={categories ? categories.includes("technology") : false}
                    onChange={handleCategoryChange}
                    className="mr-2"
                    value="technology"
                  />
                  <label htmlFor="technology" className="cursor-pointer">Technology</label>
                </div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="finance"
                    checked={categories ? categories.includes("finance") : false}
                    onChange={handleCategoryChange}
                    className="mr-2"
                    value="finance"
                  />
                  <label htmlFor="finance" className="cursor-pointer">Finance</label>
                </div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="nimitta"
                    checked={categories ? categories.includes("nimitta") : false}
                    onChange={handleCategoryChange}
                    className="mr-2"
                    value="nimitta"
                  />
                  <label htmlFor="nimitta" className="cursor-pointer">About Nimitta</label>
                </div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="news"
                    checked={categories ? categories.includes("news") : false}
                    onChange={handleCategoryChange}
                    className="mr-2"
                    value="news"
                  />
                  <label htmlFor="news" className="cursor-pointer">News</label>
                </div>
              </div>
            )}
            {openCategory && isCategoryNotFilled && <p className="text-red-500 text-sm mt-1">Please select a category</p>}
          </div>
          {/* Visibility filter */}
          <div className="mb-4 ml-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <input
                  type="checkbox"
                  id="visibilityFilterEnabled"
                  checked={visibilityFilterEnabled}
                  onChange={(e) => setVisibilityFilterEnabled(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="visibilityFilterEnabled" className="cursor-pointer font-semibold">Visibility</label>
              </div>
              <button onClick={() => setOpenVisibility(!openVisibility)}>{openVisibility ? <IoIosArrowUp/> : <FaAngleDown/>}</button>
            </div>
            {openVisibility && (
              <div className="ml-5">
                <div className="flex items-center mb-2">
                  <input type="radio" name="visibility" id="public" checked={visibilityFilterEnabled && visibility === 'public'} onChange={handleVisibilityChange} className="mr-2" />
                  <label htmlFor="public" className="cursor-pointer">Visible</label>
                </div>
                <div className="flex items-center mb-2">
                  <input type="radio" name="visibility" id="hidden" checked={visibilityFilterEnabled && visibility === 'hidden'} onChange={handleVisibilityChange} className="mr-2" />
                  <label htmlFor="hidden" className="cursor-pointer">Hidden</label>
                </div>
              </div>
            )}
            {openVisibility && isVisibilityNotFilled && <p className="text-red-500 text-sm mt-1">Please select a visibility</p>}
          </div>
          {/* Status filter */}
          <div className="mb-4 ml-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <input
                  type="checkbox"
                  id="statusFilterEnabled"
                  checked={statusFilterEnabled}
                  onChange={(e) => setStatusFilterEnabled(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="statusFilterEnabled" className="cursor-pointer font-semibold">Status</label>
              </div>
              <button onClick={() => setOpenStatus(!openStatus)}>{openStatus ? <IoIosArrowUp/> : <FaAngleDown/>}</button>
            </div>
            {openStatus && (
              <div className="ml-5">
                <div className="flex items-center mb-2">
                  <input type="radio" name="status" id="pending" checked={statusFilterEnabled && status === 'pending'} onChange={handleStatusChange} className="mr-2" />
                  <label htmlFor="pending" className="cursor-pointer">pending</label>
                </div>
                <div className="flex items-center mb-2">
                  <input type="radio" name="status" id="approved" checked={statusFilterEnabled && status === 'approved'} onChange={handleStatusChange} className="mr-2" />
                  <label htmlFor="approved" className="cursor-pointer">approved</label>
                </div>
                <div className="flex items-center mb-2">
                  <input type="radio" name="status" id="rework" checked={statusFilterEnabled && status === 'rework'} onChange={handleStatusChange} className="mr-2" />
                  <label htmlFor="rework" className="cursor-pointer">rework</label>
                </div>
              </div>
            )}
            {openStatus && isStatusNotFilled && <p className="text-red-500 text-sm mt-1">Please select a status</p>}
          </div>
          {/* Author filter */}
          <div className="mb-4 ml-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <input
                  type="checkbox"
                  id="authorFilterEnabled"
                  checked={authorFilterEnabled}
                  onChange={(e) => setAuthorFilterEnabled(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="authorFilterEnabled" className="cursor-pointer font-semibold">Author</label>
              </div>
              <button onClick={() => setOpenAuthor(!openAuthor)}>{openAuthor ? <IoIosArrowUp/> : <FaAngleDown/>}</button>
            </div>
            {openAuthor && (
              <input
                type="text"
                name="author"
                id="author"
                value={authorFilterEnabled ? author : ''}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Search by author"
                className="w-[90%] p-2 border rounded ml-5"
              />
            )}
            {openAuthor && isAuthorNotFilled && <p className="text-red-500 text-sm mt-1">Please enter an author</p>}
          </div>
          {/* Title filter */}
          <div className="mb-4 ml-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <input
                  type="checkbox"
                  id="titleFilterEnabled"
                  checked={titleFilterEnabled}
                  onChange={(e) => setTitleFilterEnabled(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="titleFilterEnabled" className="cursor-pointer font-semibold">Title</label>
              </div>
              <button onClick={() => setOpenTitle(!openTitle)}>{openTitle ? <IoIosArrowUp/> : <FaAngleDown/>}</button>
            </div>
            {openTitle && (
              <input
                type="text"
                name="title"
                id="title"
                value={titleFilterEnabled ? title:''}
                onChange={(e) => {
                  if(titleFilterEnabled)
                    setTitle(e.target.value);
                }}
                placeholder="Search by title"
                className="w-[90%] p-2 border rounded ml-5"
              />
              
            )}
            {openTitle && isTitleNotFilled && <p className="text-red-500 text-sm mt-1">Please enter a title</p>}
          </div>
          <div className={`${openTitle || openAuthor || openCategory || openDate || openVisibility ?'mt-5':'mt-16'} flex justify-center w-full space-x-1 `}>
            <button className="bg-orange-500 hover:bg-orange-700 w-[40%] ml-5 self-center text-white font-bold py-2 px-4 rounded" onClick={applyFilters}>Apply Filters</button>
            <button className="bg-red-500 hover:bg-red-700 w-[40%] ml-5 self-center text-white font-bold py-2 px-4 rounded" onClick={clearFilter}>Clear Filters</button>
          </div>
        </div>
      </div>
    </div>
        
  );
}

