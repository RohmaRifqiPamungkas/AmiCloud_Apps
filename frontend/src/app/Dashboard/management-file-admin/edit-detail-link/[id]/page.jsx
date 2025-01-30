
"use client";

import withAuth from "@/components/AuthProvider";
import useManagementFiles from "@/hooks/managementFile";
import { formatDate } from "@/lib/date";
import { formatFileSize, generateLink } from "@/lib/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RiEdit2Line } from "react-icons/ri";

const FileDetails = () => {
  const params = useParams()
  const fileId = params.id;
  const router = useRouter();

  const { error, data, fetchFile, deleteFile } = useManagementFiles();

  useEffect(() => {
    if (fileId && !data) {
      fetchFile(fileId, "link");
    }
  }, [fileId, data, fetchFile]);
  const {
    register,
    formState: { errors },
  } = useForm();

  return (
    <>
      {data && (
        <div className="p-6 ">
          <div>
            <h1 className=" text-primary text-xl">Management File Admin</h1>
            <p className="text-lg font-bold text-foreground">Edit Detail Image</p>
          </div>

          <div className="flex mt-10 w-full">
            <div className="bg-white p-10  rounded-2xl shadow-xl py-6 min-w-full ">
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
                    <p class="max-w-sm truncate">
                      <strong>{data.file.original_url}</strong>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p>File Size:</p>
                    <p>
                      <strong>{formatFileSize(data.file.file_size)}</strong>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p>Resolution:</p>
                    <p>
                      <strong>{data.imageResolution ?? '-'}</strong>
                    </p>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="space-y-1">
                    <p>File Format:</p>
                    <p>
                      <strong>{data.file.upload_type}</strong>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p>Upload Date and Time:</p>
                    <p>
                      <strong>{formatDate(data.file.created_at)}</strong>
                    </p>
                  </div>
                  <div className="space-y-1 truncate">
                    <p>Generated Link:</p>
                    <p>
                      <a
                        href={data.file.link}
                        className="text-primary hover:underline"
                      >
                        <strong>{generateLink(data.file.file_path)}</strong>
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
      )}
    </>
  );
};

export default withAuth(FileDetails, 'admin');
