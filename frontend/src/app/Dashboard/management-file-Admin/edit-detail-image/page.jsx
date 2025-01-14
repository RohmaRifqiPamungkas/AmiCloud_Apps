"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { RiEdit2Line } from "react-icons/ri";

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

  const {
    register,
    formState: { errors },
  } = useForm();

  return (
    <div className="p-6 ">
      <div>
        <h1 className=" text-primary text-xl">Management File Admin</h1>
        <p className="text-lg font-bold text-foreground">Edit Detail Image</p>
      </div>

      <div className="flex mt-10">
        <div className="bg-gray-100 p-10  rounded-2xl shadow-xl py-6 min-w-screen ">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium text-gray-800">
              Detailed Information
            </h3>
            <button className=" text-black bg-secondary rounded-lg px-4 py-2 flex items-center hover:bg-primary hover:text-white">
              <RiEdit2Line className="mr-2" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mt-6">
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
            <div className="space-y-5">
              <div className="space-y-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role Name
                  </label>
                  <select
                    className="w-full px-4 py-2 mt-2 border rounded-2xl bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500"
                    {...register("role", {
                      required: "Role name is required",
                    })}
                  >
                    <option value="">Select a role</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                    <option value="Manager">Manager</option>
                  </select>
                  {errors.role && (
                    <p className="text-sm text-red-500">
                      {errors.role.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetails;
