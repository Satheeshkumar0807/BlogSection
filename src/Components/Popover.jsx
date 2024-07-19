import React, { useEffect, useState } from 'react';
import check from '../assets/check.png';
import close from '../assets/close.png';

export default function Popover({ message, onClose }) {

  // State to manage the visibility of the popover
  const [isVisible, setIsVisible] = useState(true);

  // Close the popover automatically after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose(); // Call onClose handler after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Clear timeout on unmount or when isVisible changes
  }, [onClose]);

  // Function to handle user click on the close button
  const handleCloseClick = () => {
    setIsVisible(false);
    onClose();
  };

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center rounded-sm">
          {/* Blurred background overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm"></div>
          {/* Popover content */}
          <div className="relative bg-white flex flex-col justify-center items-center w-96 h-56 shadow-md py-3 ml-20 z-10 rounded-sm">
            <img
              src={close}
              className="absolute top-2 right-2 h-6 w-6 cursor-pointer"
              alt="close"
              onClick={handleCloseClick}
            />
            {/* Checkmark image and message */}
            <img src={check} className="h-8 w-8" alt="check" />
            <h1 className="text-xl font-normal mt-5 text-black text-center">{message}</h1>
          </div>
        </div>
      )}
    </>
  );
}
