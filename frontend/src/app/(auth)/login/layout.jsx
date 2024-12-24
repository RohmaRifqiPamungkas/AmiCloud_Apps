'use client';

import Navbar from "@/components/Navbar/Navbar"; 
import Footer from "@/components/Footer/Footer";

export default function AuthLayout({ children }) {
  return (
    <>
   
      <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      <div className="container mx-auto flex flex-col md:flex-row items-center md:gap-8 px-12">        
          <div className="flex flex-col items-start justify-center text-left md:w-1/2">
            <h1 className="text-3xl font-bold text-black mb-4">
              Welcome to <span className="text-primary">AmiCloud</span>
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Sign in and enjoy the ease of managing your links!
            </p>
            <div className="w-3/4 max-w-md h-auto">
              <img
                src="/path-to-illustration.png"
                alt="Illustration"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Right Side (Form) */}
          <div className=" w-full md:w-1/2 max-w-md p-8 bg-white rounded-md shadow-md">
        
            {children}
        
          </div>
        </div>
      </div>
     
    </>
  );
}
