import React from "react";
import Image from "next/image";
import Logo from "../../../../public/Navbar/Navbar.png";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-3xl shadow-lg max-w-xl w-full">      
        <div className="flex justify-center">
          <Image src={Logo} alt="logo" width="auto" height="auto" priority/>
        </div>
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
