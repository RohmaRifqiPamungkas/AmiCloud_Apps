
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GiHamburgerMenu } from 'react-icons/gi';
import Image from 'next/image';
import Logo from "../../../public/Navbar/Navbar.png";
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-tertiary-25 shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6 md:px-20">
        <div className="text-lg font-bold text-black">
          <Image src={Logo} alt="logo" priority/>
        </div>

        {/* Nav Desktop */}
        <div className="hidden lg:flex lg:space-x-8 text-reguler text-black font-semibold justify-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative hover:text-primary ${
                pathname === link.href
                  ? "text-primary  after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2px] after:bg-primary"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex space-x-4">
          <Link
            href="/register"
            className="bg-primary text-reguler text-white py-2 px-4 rounded-lg hover:bg-secondary hover:text-black"
          >
            Create Account
          </Link>
          <Link
            href="/login"
            className="border border-primary text-reguler text-primary py-2 px-4 rounded-lg hover:bg-primary hover:text-white"
          >
            Sign In
          </Link>
        </div>

        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-black text-2xl focus:outline-none"
          >
            <GiHamburgerMenu />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } fixed inset-0 bg-white p-6 z-40 lg:hidden`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-black text-2xl"
        >
          ×
        </button>

        <ul className="space-y-4 text-black text-sm font-semibold">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block ${
                  pathname === link.href ? "text-foreground" : "hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col space-y-4">
          <Link
            href="/register"
            className="bg-primary hover:bg-secondary text-white text-center py-2 px-4 rounded hover:text-black"
          >
            Create Account
          </Link>
          <Link
            href="/login"
            className="border border-primary text-primary hover:text-white text-center py-2 px-4 rounded hover:bg-purple-800"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
