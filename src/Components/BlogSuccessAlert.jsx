import React, { useState, useEffect } from 'react';

const BlogSuccessAlert = ({ show, message,onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded" role="alert">
      
      <span className="block sm:inline">{message}</span>
      
    </div>
  );
};

export default BlogSuccessAlert;