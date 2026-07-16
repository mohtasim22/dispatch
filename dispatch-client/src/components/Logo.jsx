import { Link } from "react-router";

// Brand mark — teal rounded square + package icon + wordmark.
// Reused in the navbar and footer so branding stays consistent.
const Logo = ({ className = "" }) => {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <span className="grid place-items-center w-8 h-8 rounded-lg bg-teal-500 text-gray-950">
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      </span>
      <span className="text-xl font-extrabold tracking-tight text-teal-400">
        Dispatch
      </span>
    </Link>
  );
};

export default Logo;
