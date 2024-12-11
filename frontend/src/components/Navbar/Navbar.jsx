'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6 ">
   
        <div className="text-lg font-bold text-black">
          <Link href="/">
            AmiCloud Logo
          </Link>
        </div>

     
        <div className="flex space-x-6 text-sm text-black">
        <Link className="hover:text-blue-500" href="/about">
            Home
          </Link>
          <Link className="hover:text-blue-500" href="/about">
            About Us
          </Link>
          <Link className="hover:text-blue-500" href="/contact">
            Contact Us
          </Link>
        </div>

      
        <div className="flex space-x-4">
          <button className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800">
            Create Account
          </button>
          <button className="bg-primary text-white py-2 px-4 rounded hover:bg-purple-800">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}