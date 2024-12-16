'use client';

import Navbar from "@/components/Navbar/Navbar"; 

export default function AuthLayout({ children }) {
  return (
    <>    
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="container mx-auto">          
          <div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
