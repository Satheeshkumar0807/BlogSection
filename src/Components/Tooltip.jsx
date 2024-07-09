import React, { useState } from 'react';
import '../utils/Tooltip.css'; // Import the CSS file for tooltip styling

const Tooltip = ({ children, message, position }) => {
  const [visible, setVisible] = useState(false);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  return (
    <div className="relative inline-block p-4 mt-16 hover:bg-slate-300 rounded-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"  onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      {children}
      {visible && (
        <div className={`absolute top-5 left-5 z-20 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip ${position}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
