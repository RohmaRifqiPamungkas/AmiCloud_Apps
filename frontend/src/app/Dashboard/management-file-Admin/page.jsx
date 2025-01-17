"use client";

import withAuth from "@/components/AuthProvider";
import Notification from "@/components/Notification/Notification";
import { useAuth } from "@/hooks/auth";
import useManagementFiles from "@/hooks/managementFile";
import { formatDate } from "@/lib/date";
import { generateLink } from "@/lib/image";
import { showConfirmDialog } from "@/lib/modal";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { set } from "react-hook-form";
import { AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import {
  MdDeleteOutline,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { VscSettings } from "react-icons/vsc";
import DashboardCards from "./cardAdmin";
import Image from "next/image";

// image
const generateImageData = (count) => {
  const roles = ["admin", "user", "user public"];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    thumbnail: "https://via.placeholder.com",
    shortlink: `https://short.link/user${i + 1}`,
    role: roles[i % roles.length],
    dateCreated: `2025-01-${String(i + 1).padStart(2, "0")}`,
  }));
};

const imageData = generateImageData(5);

function FileManagement() {
  const { fetchFiles, uploads, links, deleteFile } = useManagementFiles();


  const [activeTab, setActiveTab] = useState("Image");
  const [currentImage, setCurrentImage] = useState([]);
  const [currentLink, setCurrentLink] = useState([]);
  const [notification, setNotification] = useState(null);

  const [totalPagesImage, setTotalPagesImage] = useState(1);
  const [firstIndexImage, setFirstIndexImage] = useState(1);
  const [lastIndexImage, setLastIndexImage] = useState(1);
  const [perPageImage, setPerPageImage] = useState(10);
  const [pageImage, setPageImage] = useState(1);
  const [totalImage, setTotalImage] = useState(0);

  const [totalPagesLink, setTotalPagesLink] = useState(1);
  const [firstIndexLink, setFirstIndexLink] = useState(1);
  const [lastIndexLink, setLastIndexLink] = useState(1);
  const [perPageLink, setPerPageLink] = useState(10);
  const [currentLinkPage, setCurrentLinkPage] = useState(1);
  const [totalLinks, setTotalLinks] = useState(0);

  const [pageLink, setPageLink] = useState(1);

  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    const message = searchParams.get("message");
    if (success === "true") {
      setNotification({
        show: true,
        type: "success",
        message: message ?? "Success update data",
      });
      const timeout = setTimeout(() => setNotification(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === "Image") {
      fetchFiles("upload");
    } else if (activeTab === "Link") {
      fetchFiles("link");
    }
  }, [activeTab, fetchFiles ]);


  const [currentImagePage, setCurrentImagePage] = useState(1);

 
  useEffect(() => {
    fetchFiles(activeTab === "Image" ? "upload" : "link", {
      page: pageImage,
      limit: perPageImage,
    });
  }, [pageImage, perPageImage, activeTab,  fetchFiles]);

  useEffect(() => {
    if (uploads) {
      setCurrentImage(uploads.data)
      setLastIndexImage(uploads.to);
      setFirstIndexImage(uploads.from);
      setCurrentImagePage(uploads.current_page);
      setTotalImage(uploads.total);
      setTotalPagesImage(Math.ceil(uploads.last_page));
    }

    if (links) {
      setCurrentLink(links.data);
      setLastIndexLink(links.to);
      setFirstIndexLink(links.from);
      setCurrentLinkPage(links.current_page);
      setTotalLinks(links.total);
    }
  }, [uploads, links]);

  const changePageImage = (pageNumber) => {
    // router.push('/Dashboard/management-file-Admin?tab=image?page=' + pageNumber);
    if (pageNumber >= 1 && pageNumber <= totalPagesImage) {
      setPageImage(pageNumber);
    }
  };

  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      setPageImage(Number(page));
    }
  }
    , [searchParams]);

  // links

  const changePageLink = (pageNumber) => {
    router.push('/Dashboard/management-file-admin?');
    if (pageNumber >= 1 && pageNumber <= totalPagesLink) {
      setPageLink(pageNumber);
    }
  };

  const toggleNotification = (message) => {
    setNotification({ message, show: true });
    setTimeout(() => {
      setNotification({ message: "", show: false });
    }, 3000);
  }

  const handleDelete = (fileId, type = "upload") => {
    showConfirmDialog({
      alertContent: "Are you sure you want to delete this file?",
      onConfirm: () => {
        try {
          deleteFile(fileId, type).then(() => {
            toggleNotification('File successfully Deleted')
            fetchFiles(type)
          });
        }
        catch (error) {
          alert('Error Deleting File')
        }
      },
    });
  };



  return (
    <div className="p-6">
      {notification && notification.show && (
        <Notification message={notification.message} />
      )}
      <div>
        <h1 className="text-lg font-bold text-foreground">Management File Admin</h1>
        <p className="text-primary text-xl">Categories</p>
      </div>
      <div className="flex items-center justify-between mb-4 pt-6 pb-10">
        <div className="flex space-x-4">
          <div className="px-1 py-2 rounded-2xl transition-all duration-300 bg-white">
            {["Image", "Link"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 mx-1 rounded-xl transition-all duration-300 ${activeTab === tab
                  ? "bg-primary text-white"
                  : "bg-white text-foreground"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <AiOutlineSearch className="absolute left-3 top-3 text-foreground" />
            <input
              type="text"
              placeholder="Search"
              className="pl-8 pr-4 py-2 rounded-3xl bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-white rounded-3xl text-foreground hover:bg-primary hover:text-white">
            <VscSettings className="mr-2" />
            Filters
          </button>
        </div>
      </div>
      <DashboardCards />


      {activeTab === "Image" ? (
        <div>
          <div className="overflow-x-auto rounded-3xl shadow-lg">
            <table className="min-w-full bg-white border">
              <thead className="bg-tertiary-25 text-foreground">
                <tr>
                  <th className="px-4 py-2 text-left">No</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Thumbnail</th>
                  <th className="px-4 py-2 text-left">Shortlink</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentImage.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-t ${index % 2 === 1 ? "bg-tertiary-10" : ""}`}
                  >
                    <td className="px-4 py-2">{firstIndexImage + index}</td>
                    <td className="px-4 py-2">{user.filename}</td>
                    <td className="px-4 py-2">
                      <Image
                        src={generateLink(user.file_path)}
                        alt="Thumbnail"
                        className="w-10 h-10 object-cover rounded-full"
                        height={40} width={40} priority
                      />
                    </td>
                    <td className="px-4 py-2">
                      <a
                        href={generateLink(user.file_path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:text-primary-2"
                      >
                        {generateLink(user.file_path)}
                      </a>
                    </td>
                    <td className="px-4 py-2">{formatDate(user.created_at)}</td>
                    <td className="px-4 py-2">{user.role ?? '-'}</td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <Link href={`/Dashboard/management-file-admin/edit-detail-image/${user.id}`} className="text-primary hover:text-primary-2">
                          <RiEdit2Line className="w-6 h-6" />
                        </Link>
                        <button className="text-primary hover:text-primary-2" onClick={() => handleDelete(user.id)}>
                          <MdDeleteOutline className="w-6 h-6" />
                        </button>
                        <Link href={`/Dashboard/management-file-admin/view-detail-image/${user.id}`} className="text-primary hover:text-primary-2">
                          <AiOutlineEye className="w-6 h-6" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          {/* Pagination for Image */}
          <div className="flex justify-between items-center py-10">
            <div className="flex items-center space-x-4">
              <label className="text-lg text-foreground">Show</label>
              <select
                value={perPageImage}
                onChange={(e) => setPerPageImage(Number(e.target.value))}
                className="px-4 py-2 rounded-lg border"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
              <label className="text-lg text-foreground">Entries</label>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-lg text-foreground">
                Showing {firstIndexImage} to {lastIndexImage} of {totalImage} results
              </span>

              <div className="flex items-center space-x-2">
                <button
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${pageImage === 1 ? "bg-white text-foreground" : "bg-primary text-white"
                    }`}
                  disabled={pageImage === 1}
                  onClick={() => changePageImage(pageImage - 1)}
                >
                  <MdNavigateBefore className="text-xl" />
                </button>
                {[...Array(totalPagesImage)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => changePageImage(i + 1)}
                    className={`w-8 h-8 rounded-full ${pageImage === i + 1
                      ? "bg-primary text-white"
                      : "bg-white border text-foreground"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${pageImage === totalPagesImage
                    ? "bg-white text-foreground"
                    : "bg-primary text-white"
                    }`}
                  disabled={pageImage === totalPagesImage}
                  onClick={() => changePageImage(pageImage + 1)}
                >
                  <MdNavigateNext className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto rounded-3xl shadow-lg">
            <table className="min-w-full bg-white border">
              <thead className="bg-tertiary-25 text-foreground">
                <tr>
                  <th className="px-4 py-2 text-left">No</th>
                  <th className="px-4 py-2 text-left">Short Link</th>
                  <th className="px-4 py-2 text-left">Original Link</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentLink && currentLink.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-t ${index % 2 === 1 ? "bg-tertiary-10" : ""
                      }`}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 max-w-xs truncate overflow-hidden text-ellipsis">
                      {item.parsed_link}
                    </td>
                    <td className="px-4 py-2 max-w-xs truncate overflow-hidden text-ellipsis">
                      {item.original_url}
                    </td>
                    <td className="px-4 py-2">{formatDate(item.date)}</td>
                    <td className="px-4 py-2">{item.role ?? '-'}</td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <Link href={`/Dashboard/management-file-admin/edit-detail-link/${item.id}`} className="text-primary hover:text-primary-2">
                          <RiEdit2Line className="w-6 h-6" />
                        </Link>
                        <button className="text-primary hover:text-primary-2" onClick={() => handleDelete(item.id, "link")}>
                          <MdDeleteOutline className="w-6 h-6" />
                        </button>
                        <Link href={`/Dashboard/management-file-admin/view-detail-link/${item.id}`} className="text-primary hover:text-primary-2">
                          <AiOutlineEye className="w-6 h-6" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {activeTab === "Link" && (
            <div className="flex justify-between items-center py-10">
              <div className="flex items-center space-x-4">
                <label className="text-lg text-foreground">Show</label>
                <select
                  value={perPageLink}
                  onChange={(e) => setPerPageLink(Number(e.target.value))}
                  className="px-4 py-2 rounded-lg border"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
                <label className="text-lg text-foreground">Entries</label>
              </div>

              <div className="flex items-center space-x-4">
                {links && (
                  <span className="text-lg text-foreground">
                    Showing {firstIndexLink} to {lastIndexLink} of {totalLinks}
                    results
                  </span>
                )}
                <div className="flex items-center space-x-2">
                  <button
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${pageLink === 1
                      ? "bg-white text-foreground"
                      : "bg-primary text-white"
                      }`}
                    disabled={pageLink === 1}
                    onClick={() => changePageLink(pageLink - 1)}
                  >
                    <MdNavigateBefore className="text-xl" />
                  </button>
                  {[...Array(totalPagesLink)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => changePageLink(i + 1)}
                      className={`w-8 h-8 rounded-full ${pageLink === i + 1
                        ? "bg-primary text-white"
                        : "bg-white border text-foreground"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${pageLink === totalPagesLink
                      ? "bg-white text-foreground"
                      : "bg-primary text-white"
                      }`}
                    disabled={pageLink === totalPagesLink}
                    onClick={() => changePageLink(pageLink + 1)}
                  >
                    <MdNavigateNext className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


export default withAuth(FileManagement, 'admin');