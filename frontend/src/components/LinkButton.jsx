import { Link } from "react-router-dom";

// A reusable styled button that acts as a router link
const LinkButton = ({ to, children, primary }) => {
  // Base styles for all buttons
  const baseStyle =
    "px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-1 shadow-md";

  const colorStyle = primary
    ? "bg-cyan-500 text-slate-900 hover:bg-cyan-400 hover:shadow-lg" // Updated for Dark Theme
    : "bg-transparent text-slate-300 border border-slate-600 hover:bg-slate-800 hover:text-white";

  return (
    <Link to={to} className={`${baseStyle} ${colorStyle}`}>
      {children}
    </Link>
  );
};

export default LinkButton;
