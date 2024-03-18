import Link from 'next/link';
import React, { useState, useEffect } from 'react';


const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.clear()
    setIsLoggedIn(false);
  };

  return (
    <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-semibold text-xl tracking-tight">My App</span>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          {isLoggedIn ? (
            <>
              <Link className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-500 mr-4" href="/dashboard">
          
                  Dashboard
            
              </Link>
              <button
                className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-500 mr-4"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-500 mr-4" href="/signin">
                
                  Sign In
        
              </Link>
              <Link className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-500 mr-4" href="/signup">
              
                  Sign Up
              
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
