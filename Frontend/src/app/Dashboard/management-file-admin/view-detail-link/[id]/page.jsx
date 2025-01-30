"use client";

import withAuth from "@/components/AuthProvider";
import Notification from "@/components/Notification/Notification";
import useManagementFiles from "@/hooks/managementFile";
import { formatDate } from "@/lib/date";
import { formatFileSize, generateLink } from "@/lib/image";
import { showConfirmDialog, showShareDialog } from "@/lib/modal";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiShare2 } from "react-icons/fi";
import {
  MdDeleteOutline,
  MdOutlineDownload,
  MdOutlineFileCopy,
} from "react-icons/md";

const FileDetails = () => {
  const params = useParams()
  const fileId = params.id;
  const router = useRouter();

  const [notification, setNotification] = useState({
    message: "",
    show: false,
  });

  const { error, data, fetchFile, deleteFile } = useManagementFiles();

  useEffect(() => {
    if (fileId && !data) {
      fetchFile(fileId, "link");
    }
  }, [fileId, data,  fetchFile]);


  const handleDelete = () => {
    showConfirmDialog({
      alertContent: "Are you sure you want to delete this file?",
      onConfirm: () => {
        try {
          deleteFile(fileId, "link").then(() => {
            router.push("/Dashboard/management-file-admin?success=true&message=File deleted successfully");
          });
        }
        catch (error) {
          alert('Error Deleting File')
        }
      },
    });
  };


  const handleCopy = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      toggleNotification("Link copied to clipboard");
    });
  }

  const toggleNotification = (message) => {
    setNotification({ message, show: true });
    setTimeout(() => {
      setNotification({ message: "", show: false });
    }, 3000);
  }

  const handleShare = (url) => {
    showShareDialog(url, () => {
      toggleNotification("Link copied to clipboard");
    })
  }

  return (
    <>
      {notification?.show && <Notification message={notification.message} />}
      {data && (
        <div className="p-6 ">
          <div>
            <h1 className="text-lg font-bold text-foreground">Management Link Admin</h1>
            <p className="text-primary text-xl">View Detail</p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="flex justify-center my-4 pt-10">
              <div className="w-32 h-32 bg-purple-100 flex items-center justify-center rounded-lg">
                {/* Placeholder for image */}
                <Image
                  src={generateLink(data.file.file_path)}
                  alt="image"
                  className="w-full h-full object-cover rounded-lg"
                  width={200}
                  height={200} priority
                />
              </div>
            </div>

            <div className="flex justify-center space-x-3 mb-4">
              <div className="p-1 bg-white rounded-md shadow-md ">
                <div className="flex justify-center items-center">
                  <button className="text-foreground" onClick={handleDelete}>
                    <MdDeleteOutline size={20} />
                  </button>
                </div>
              </div>

              <div className="p-1 bg-white rounded-md shadow-md">
                <div className="flex justify-center items-center">
                  <button className="text-foreground" onClick={() => handleCopy(generateLink(data.file.file_path))}>
                    <MdOutlineFileCopy size={20} />
                  </button>
                </div>
              </div>
              <div className="p-1 bg-white rounded-md shadow-md">
                <div className="flex justify-center items-center">
                  <a target="_blank" href={generateLink(data.file.file_path)}>
                    <button className="text-foreground">
                      <MdOutlineDownload size={20} />
                    </button>
                  </a>
                </div>
              </div>
              <div className="p-1 bg-white rounded-md shadow-md">
                <div className="flex justify-center items-center">
                  <button className="text-foreground" onClick={() => handleShare(generateLink(data.file.file_path))}>
                    <FiShare2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="bg-white p-10  rounded-2xl shadow-xl py-6 max-w-4xl ">
              <h3 className="text-lg font-medium text-gray-800">
                Detailed Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-6">
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
                      <strong>{data.file.upload_type ?? '-'}</strong>
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
                        href={generateLink(data.file.file_path)}
                        className="text-primary hover:underline"
                        target="_blank"
                      >
                        <strong>{generateLink(data.file.file_path)}</strong>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>)
      }
    </>
  );
};

export default withAuth(FileDetails, 'admin');
