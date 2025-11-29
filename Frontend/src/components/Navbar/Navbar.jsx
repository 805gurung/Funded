import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-l from-gray-900 via-gray-900 to-gray-900 shadow-md ">
      <div className="container mx-1 px-8 py-10">
        <div className="flex justify-between items-center pl-8">
          {/* Logo */}
          <div>
          <a href="/" className="text-4xl font-bold text-blue-600">
            Himalaya <span className='text-white'>Fund</span> 
          </a>
          </div>
          {/* Desktop Menu */}
          <div className=" relative hidden md:flex  space-x-6 items-center ml-auto ">
            <a href="/createcampaign" className="text-white text-2xl hover:text-blue-600">Start a Campaign</a>
            <a href="/login" className="text-white text-2xl hover:text-blue-600" >Login</a>
            <a href="/signup" className="text-white text-2xl hover:text-blue-600">Sign Up</a>
            <a href="/about" className="text-white text-2xl  hover:text-blue-600">About</a>
            <a href="/campaign" className=" flex text-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 hover:translate-x-4">Start Donating</a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu with Animation */}
        <div
          className={`md:hidden transform transition-all duration-300 ease-in-out overflow-hidden ${
            mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mt-3 space-y-2 pb-4">
            <a href="/createcampaign" className="block text-gray-700 hover:text-blue-600">Create Campaign</a>
            <a href="/login" className="block text-gray-700 hover:text-blue-600">Login</a>
            <a href="/signup" className="block text-gray-700 hover:text-blue-600">Sign Up</a>
            <a href="/about" className="block text-gray-700 hover:text-blue-600">About</a>
            <hr />
            <a href="/campaign" className="block text-gray-700 hover:text-blue-600">Start Donating</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
