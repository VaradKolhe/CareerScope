import { Link } from 'react-router-dom';

// A reusable styled button that acts as a router link
const LinkButton = ({ to, children, primary }) => {
  // Base styles for all buttons
  const baseStyle = "px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-1 shadow-md";
  
  // Specific styles for primary (blue) vs secondary (white/gray) buttons
  const colorStyle = primary 
    ? "bg-brandBlue text-white hover:bg-blue-700 hover:shadow-lg"
    : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100";

  return (
    <Link to={to} className={`${baseStyle} ${colorStyle}`}>
      {children}
    </Link>
  );
};

export default LinkButton;