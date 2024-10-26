import  { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 text-white ">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-lg font-bold">WeatherApp</div>
        <div className="hidden md:flex space-x-4">
          <Link to="/" className="hover:text-gray-400">Home</Link>
          <Link to="/summary" className="hover:text-gray-400">Summary</Link>
          <Link to="/chart" className="hover:text-gray-400">Chart</Link>
         
          
        </div>
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded focus:outline-none focus:ring"
          aria-label="Toggle Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="flex flex-col items-center space-y-2 bg-gray-700 py-2">
            <Link to="/" className="w-full text-center py-2 hover:bg-gray-600">Home</Link>
            <Link to="/summary" className="w-full text-center py-2 hover:bg-gray-600">Summary</Link>
            <Link to="/chart" className="hover:text-gray-400">Chart</Link>
        
          
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
