'use client';

import Image from "next/image";
import Login from "../../../../public/Login/Login.png";

export default function AuthLayout({ children }) {
  return (
    <>
   
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-20 md:py-28 mt-20 ">
      <div className="container mx-auto flex flex-col md:flex-row items-center md:gap-8 px-12 md:px-20">        
          <div className="flex flex-col items-start justify-center text-left md:w-1/2">
            <h1 className="text-3xl font-bold text-black mb-4">
              Welcome to <span className="text-primary">AmiCloud</span>
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Sign in and enjoy the ease of managing your links!
            </p>
            <div className="w-3/4 max-w-md h-auto flex justify-center text-center items-center">
             <Image src={Login} alt="Login" width="auto" height="auto" priority />
            </div>
          </div>
        
          <div className=" w-full md:w-1/2 py-10 px-10 bg-white rounded-3xl shadow-lg">        
            {children}        
          </div>
        </div> 
      </div>
     
    </>
  );
}
