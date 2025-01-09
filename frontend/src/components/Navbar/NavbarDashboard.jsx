// "use client";

// import { useState } from "react";
// import { FiMenu, FiChevronDown } from "react-icons/fi";
// import Breadcrumb from "../Breadcrumb/Breadcrumb";
// import Image from "next/image";
// import profile from "../../../public/Navbar/Profile.png";

// export default function NavbarDashboard({ toggleSidebar }) {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const toggleDropdown = () => {
//     setIsDropdownOpen((prevState) => !prevState);
//   };

 

//   return (
//     <header className="bg-tertiary-25 px-6 py-4 flex justify-between items-center">
//       <div className="flex items-center space-x-4">
//         <button
//           onClick={toggleSidebar}
//           className="text-gray-600 hover:text-gray-800 focus:outline-none"
//         >
//           <FiMenu size={24} className="text-black" />
//         </button>
//         <Breadcrumb  />
//       </div>
//       <div className="relative">
//         <button
//           onClick={toggleDropdown}
//           className="flex items-center gap-2 sm:gap-4 focus:outline-none"
//         >
//           <span className="text-gray-800 font-semibold">Lalapow</span>
//           <Image
//             src={profile}
//             alt="profile"
//             width={40}
//             height={40}
//             className="rounded-full"
//           />
//           <FiChevronDown size={20} className="text-gray-600" />
//         </button>

//         {/* Dropdown Menu */}
//         {isDropdownOpen && (
//           <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
//             <a
//               href="/Dashboard/profile"
//               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//             >
//               My Profile
//             </a>          
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }

"use client";

import { useState } from "react";
import { FiMenu, FiChevronDown } from "react-icons/fi";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import Image from "next/image";
import defaultProfile from "../../../public/Navbar/Profile.png"; 
import { useAuth } from "@/hooks/auth"; 

export default function NavbarDashboard({ toggleSidebar }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useAuth(); 

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  return (
    <header className="bg-tertiary-25 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <FiMenu size={24} className="text-black" />
        </button>
        <Breadcrumb />
      </div>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 sm:gap-4 focus:outline-none"
        >
          <span className="text-gray-800 font-semibold">
            {user?.name || "Guest"} 
          </span>
          <Image
            src={user?.profileImage || defaultProfile} 
            alt="profile"
            width={40}
            height={40}
            className="rounded-full"
          />
          <FiChevronDown size={20} className="text-gray-600" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
            <a
              href="/Dashboard/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              My Profile
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
