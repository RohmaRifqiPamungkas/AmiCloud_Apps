'use client';

import Navbar from "@/components/Navbar/Navbar"; 

export default function AuthLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-6 px-4 md:px-0">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-semibold mb-4 text-black">Welcome to AmiCloud</h1>
            <div className="w-3/4 h-64 border rounded-md flex items-center justify-center">
              <span className="text-gray-400">[Placeholder for Image]</span>
            </div>
          </div>
          <div className="bg-white p-8 shadow-md rounded-md w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
