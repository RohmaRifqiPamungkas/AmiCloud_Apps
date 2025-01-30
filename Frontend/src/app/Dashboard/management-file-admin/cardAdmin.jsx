'use client';

import { useEffect, useState } from 'react';
import { FaRegFile } from "react-icons/fa";
import { FaRegFolder } from "react-icons/fa6";
import { PiUsersThree } from "react-icons/pi";


const DashboardCards = () => {
  const [data, setData] = useState({
    userUpload: { count: 0, size: '0 GB' },
    fileLatest: { count: 0, size: '0 GB' },
    userPublic: { count: 0, status: 'Not Log in' },
  });

  // Sample API fetch simulation
  useEffect(() => {
    async function fetchData() {
      // Simulating an API response
      const apiResponse = {
        userUpload: { count: 12732, size: '1.32 GB' },
        fileLatest: { count: 12732, size: '1.32 GB' },
        userPublic: { count: 127, status: 'Not Log in' },
      };

      setData(apiResponse);
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col justify-center space-y-2 md:space-y-0 md:flex-row md:justify-between md:space-x-6 mb-8">
      {/* User Upload Card */}
      <div className="flex flex-row space-x-4 items-center w-full h-24 bg-primary-50 rounded-2xl p-4">
        <div>
          <FaRegFolder className="w-16 h-16 text-primary"/>
        </div>
        <div className='text-left'>
        <div className="text-xl font-bold text-white">User Upload</div>
        <div className="text-white">
          {data.userUpload.count} File | {data.userUpload.size}
        </div>
        </div>       
      </div>

      {/* File Latest Card */}
      <div className="flex flex-row space-x-4 items-center w-full h-24 bg-primary-50 rounded-2xl p-4">
        <div>
          <FaRegFile className="w-16 h-16 text-primary"/>
        </div>
        <div className='text-left'>
        <div className="text-xl font-semibold text-white">File Latest</div>
        <div className="text-white">
          {data.fileLatest.count} File | {data.fileLatest.size}
        </div>
        </div>       
      </div>


      {/* User Public Card */}
      <div className="flex flex-row space-x-4 items-center w-full h-24 bg-primary-50 rounded-2xl p-4">
        <div>
          <PiUsersThree className="w-16 h-16 text-primary"/>
        </div>
        <div className='text-left'>
        <div className="text-xl font-bold text-white">User Public</div>
        <div className="text-white">
          {data.userPublic.count} Account | {data.userPublic.status}
        </div>
        </div>       
      </div>

    </div>
  );
};

export default DashboardCards;
