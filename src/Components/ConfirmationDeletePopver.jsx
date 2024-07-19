import React from 'react'
export default function DeletePopover({message,onConfirm,onClose}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm"></div>
      
      {/* Popover content */}
      <div className="relative bg-white flex flex-col justify-center items-center space-y-7 w-96 h-56 shadow-md py-3 ml-20 z-10">
        <h1 className="text-xl font-normal text-black text-center">{message}</h1>
        <div class="flex justify-center space-x-2 w-full">
            <button 
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-sm shadow-gray-400"
              onClick={onConfirm}
            >
              Yes
            </button>
            <button 
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-sm shadow-gray-400"
              onClick={onClose}
            >
              No
            </button>
        </div>
      </div>
    </div>
  )
}
