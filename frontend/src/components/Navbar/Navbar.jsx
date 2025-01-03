'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GiHamburgerMenu } from 'react-icons/gi';
import Image from 'next/image';
import Logo from "../../../public/Navbar/Navbar.png";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-tertiary-25  shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6 md:px-20">
        <div className="text-lg font-bold text-black">
          <Image src={Logo} alt="logo" />
        </div>

        {/* Nav dekstop */}
        <div className="hidden md:flex md:space-x-8 text-reguler text-black font-semibold justify-center">
          <Link className="hover:text-blue-500" href="/">
            Home
          </Link>
          <Link className="hover:text-blue-500" href="/about">
            About Us
          </Link>
          <Link className="hover:text-blue-500" href="/contact">
            Contact Us
          </Link>
        </div>

        {/* Buttons dekstop */}
        <div className="hidden md:flex space-x-4">
          <Link href="/register" className="bg-primary text-reguler text-white py-2 px-4 rounded-lg hover:bg-tertiary-25 hover:text-primary">
            Create Account
          </Link>
          <Link href="/login" className="border border-primary text-reguler text-primary py-2 px-4 rounded-lg hover:bg-primary hover:text-white">
            Sign In
          </Link>
        </div>

      
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-black text-2xl focus:outline-none"
          >
            <GiHamburgerMenu />
          </button>
        </div>
      </div>

      {/* hp */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } fixed inset-0 bg-white p-6 z-40 md:hidden`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-black text-2xl"
        >
          ×
        </button>

        <ul className="space-y-4 text-black text-sm font-semibold">
          <li>
            <Link className="hover:text-blue-500" href="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="hover:text-blue-500" href="/about">
              About Us
            </Link>
          </li>
          <li>
            <Link className="hover:text-blue-500" href="/contact">
              Contact Us
            </Link>
          </li>
        </ul>
     
        <div className="mt-6 flex flex-col space-y-4">
          <Link href="/register" className="bg-primary hover:bg-tertiary-25  text-white text-center py-2 px-4 rounded hover:text-primary">
            Create Account
          </Link>
          <Link href="/login" className="border border-primary text-primary hover:text-white text-center py-2 px-4 rounded hover:bg-purple-800">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
