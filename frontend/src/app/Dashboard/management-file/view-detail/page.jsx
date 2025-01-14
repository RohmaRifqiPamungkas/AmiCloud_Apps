"use client";

import { MdDelete, MdFileCopy, MdDownload, MdShare } from "react-icons/md";
import Image from "next/image";

const FileDetails = () => {
  // Sample data
  const fileData = {
    title: "Example Image.JPEG",
    format: "JPEG",
    size: "2.5 MB",
    uploadDateTime: "December 4, 2024 - 10:15 PM",
    resolution: "1920 × 1080 px",
    link: "https://amicloud.com/434bb",
  };

  return (
    <div className="p-6 ">
      <div>
        <h1 className="text-lg font-bold text-foreground">Management File</h1>
        <p className="text-primary text-xl">View Detail</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="flex justify-center my-4 pt-10">
          <div className="w-32 h-32 bg-purple-100 flex items-center justify-center rounded-lg">
            {/* Placeholder for image */}
            <Image
              src="https://via.placeholder.com/150"
              alt="image"
              className="w-full h-full object-cover rounded-lg"
              width={200}
              height={200}
            />
          </div>
        </div>

        <div className="flex justify-center space-x-3 mb-4">
          <div className="p-1 bg-white rounded-md shadow-md ">
            <div className="flex justify-center items-center">
              <button className="text-foreground">
                <MdDelete size={20} />
              </button>
            </div>
          </div>

          <div className="p-1 bg-white rounded-md shadow-md">
            <div className="flex justify-center items-center">
              <button className="text-foreground">
                <MdFileCopy size={20} />
              </button>
            </div>
          </div>
          <div className="p-1 bg-white rounded-md shadow-md">
            <div className="flex justify-center items-center">
              <button className="text-foreground">
                <MdDownload size={20} />
              </button>
            </div>
          </div>
          <div className="p-1 bg-white rounded-md shadow-md">
            <div className="flex justify-center items-center">
              <button className="text-foreground">
                <MdShare size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="bg-gray-100 p-10  rounded-2xl shadow-xl py-6 max-w-4xl ">
          <h3 className="text-lg font-medium text-gray-800">
            Detailed Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-6">
            <div className="space-y-5">
              <div className="space-y-1">
                <p>Title/File Name:</p>
                <p>
                  <strong>{fileData.title}</strong>
                </p>
              </div>
              <div className="space-y-1">
                <p>File Size:</p>
                <p>
                  <strong>{fileData.size}</strong>
                </p>
              </div>
              <div className="space-y-1">
                <p>Resolution:</p>
                <p>
                  <strong>{fileData.resolution}</strong>
                </p>
              </div>
            </div>
            <div className="space-y-5">
              <div className="space-y-1">
                <p>File Format:</p>
                <p>
                  <strong>{fileData.format}</strong>
                </p>
              </div>
              <div className="space-y-1">
                <p>Upload Date and Time:</p>
                <p>
                  <strong>{fileData.uploadDateTime}</strong>
                </p>
              </div>
              <div className="space-y-1">
                <p>Generated Link:</p>
                <p>
                  <a
                    href={fileData.link}
                    className="text-primary hover:underline"
                  >
                    <strong>{fileData.link}</strong>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetails;
