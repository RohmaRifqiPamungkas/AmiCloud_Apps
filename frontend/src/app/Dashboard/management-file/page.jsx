"use client";


import AlertDanger from "@/components/Alert/DangerAlert";
import ShareAlert from "@/components/Alert/ShareAlert";
import withAuth from "@/components/AuthProvider";
import Notification from "@/components/Notification/Notification";
import useManagementFiles from "@/hooks/managementFile";
import { BASE_URL } from "@/lib/constant";
import { copyImageUrl, downloadImage } from "@/lib/image";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom/client';
import ReactDOMServer from "react-dom/server";
import { AiOutlineSearch } from "react-icons/ai";
import { FiShare2 } from "react-icons/fi";
import {
  MdDeleteOutline,
  MdNavigateBefore,
  MdNavigateNext,
  MdOutlineFileCopy,
} from "react-icons/md";
import { RiDownloadLine, RiEyeLine } from "react-icons/ri";
import { VscSettings } from "react-icons/vsc";
import Swal from "sweetalert2";

function FileManagement() {
  const [activeTab, setActiveTab] = useState("Image");
  const { data, fetchFiles, deleteFile } = useManagementFiles();
  const [notification, setNotification] = useState({
    message: "",
    show: false,
  });


  const handleDelete = async (id, type = "upload") => {
    const alertContent = ReactDOMServer.renderToString(<AlertDanger />);

    Swal.fire({
      html: alertContent,
      showConfirmButton: true,
      confirmButtonText: "OK",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton:
          "bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600",
        cancelButton:
          "bg-gray-300 text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-400", 
        popup: "rounded-3xl p-6 shadow-lg",
      },
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFile(id, type)
          .then(() => {
            fetchFiles({ type: activeTab === "Image" ? "upload" : "link" });
          })
          .catch((error) => {
            console.error("Error deleting file:", error);
          });
      }
    });
  };

  const handleCopy = (url) => {
    copyImageUrl(`${url}`, () => toggleNotification("Link Copied to Clipboard!"))
  }

  const handleShare = (url) => {
    Swal.fire({
      html: `<div id="alert-share"></div>`, 
      showConfirmButton: true,
      confirmButtonText: "OK",
      customClass: {
        confirmButton:
          "bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-500",
        popup: "rounded-3xl p-6 shadow-lg",
      },
      showCloseButton: true,
      didOpen: () => {
        const onCopy = () => {
          handleCopy(url)
          Swal.close();
        };

        const onShare = () => {
          const whatsappUrl = `https://wa.me/`;
          window.open(whatsappUrl, '_blank');
        };

        const root = ReactDOM.createRoot(document.getElementById('alert-share'));
        root.render(
          <ShareAlert link={url} onCopy={onCopy} onShare={onShare} />
        );
      },
    });
  };



  const toggleNotification = (message) => {
    setNotification({ message, show: true });
    setTimeout(() => {
      setNotification({ message: "", show: false });
    }, 3000);
  }

  useEffect(() => {
    if (activeTab === "Image") {
      fetchFiles({ type: "upload" });
    } else if (activeTab === "Link") {
      fetchFiles({ type: "link" });
    }
  }, [activeTab, fetchFiles]);

  // image
  const imageData = data?.uploads.data || [];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPageImage = 8;
  const paginatedImageData = imageData.slice(
    (currentPage - 1) * itemsPerPageImage,
    currentPage * itemsPerPageImage
  );
  const totalPagesImage = Math.ceil(imageData.length / itemsPerPageImage);
  const handlePrevPageImage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPageImage = () => {
    if (currentPage < totalPagesImage) setCurrentPage(currentPage + 1);
  };

  // links
  const [perPageLink, setPerPageLink] = useState(10);
  const [pageLink, setPageLink] = useState(1);
  const linkData = data?.links.data || [];
  const lastIndexLink = pageLink * perPageLink;
  const firstIndexLink = lastIndexLink - perPageLink;
  const currentLink = linkData.slice(firstIndexLink, lastIndexLink);
  const totalPagesLink = Math.ceil(linkData.length / perPageLink);

  const changePageLink = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPagesLink) {
      setPageLink(pageNumber);
    }
  };



  return (
    <div className="p-6">
      <div>
        {notification.show && <Notification message={notification.message} />}
        <h1 className="text-lg font-bold text-foreground">Management File</h1>
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


      {activeTab === "Image" ? (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {paginatedImageData.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow p-4 flex flex-col items-center"
              >
                <Image
                  src={`${BASE_URL}${item.file_path}`}
                  alt={item.filename}
                  className="w-full h-32 object-cover rounded-lg"
                  width={100}
                  height={100} priority
                />
                <h3 className="mt-2 text-sm font-medium text-center truncate max-w-full">
              {item.filename}
                </h3>
                <div className="flex flex-wrap justify-center sm:justify-start space-x-2 space-y-2 sm:space-y-0 mt-4 text-foreground">
                  <Link
                    className=" hover:text-primary flex items-center justify-center "
                    href={"/Dashboard/management-file/view-detail/" + item.id}
                  >
                    <RiEyeLine />
                  </Link>
                  <button className="hover:text-primary flex items-center justify-center " onClick={() => handleDelete(item.id)}>
                    <MdDeleteOutline />
                  </button>
                  <button className=" hover:text-primary flex items-center justify-center " onClick={() => copyImageUrl(`${BASE_URL}${item.file_path}`, () => toggleNotification("Link Copied to Clipboard!"))}>
                    <MdOutlineFileCopy />
                  </button>
                  <a href={`${BASE_URL}${item.file_path}`} target="_blank">
                    <button className=" hover:text-primary flex items-center justify-center " onClick={() => toggleNotification("Image Downloaded!")} >
                      <RiDownloadLine />
                    </button>
                  </a>
                  <button className="hover:text-primary flex items-center justify-center " onClick={() => handleShare(`${BASE_URL}${item.file_path}`)}>
                    <FiShare2 />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination for Image */}
          <div className="flex justify-center items-center mt-10 space-x-4">
            <button
              className={`w-10 h-10 rounded-full flex items-center justify-center ${currentPage === 1
                ? "bg-white text-foreground"
                : "bg-primary text-white"
                }`}
              disabled={currentPage === 1}
              onClick={handlePrevPageImage}
            >
              <MdNavigateBefore className="text-xl" />
            </button>
            {[...Array(totalPagesImage)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-full ${currentPage === i + 1
                  ? "bg-primary text-white"
                  : "bg-white border"
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              className={`w-10 h-10 rounded-full flex items-center justify-center ${currentPage === totalPagesImage
                ? "bg-white text-foreground"
                : "bg-primary text-white"
                }`}
              disabled={currentPage === totalPagesImage}
              onClick={handleNextPageImage}
            >
              <MdNavigateNext className="text-xl" />
            </button>
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
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentLink.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-t ${index % 2 === 1 ? "bg-tertiary-10" : ""
                      }`}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">
                      <a
                        href={item.parsed_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {item.parsed_link}
                      </a>
                    </td>
                    <td className="px-4 py-2">
                      <a
                        href={item.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {item.original_url}
                      </a>
                    </td>
                    <td className="px-4 py-2">{item.date}</td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <button
                          className="text-sm text-primary hover:text-primary-2"
                          onClick={() => handleDelete(item.id, "link")}
                        >
                          <MdDeleteOutline className="inline-block mr-1 w-5 h-5" />
                        </button>
                        <button
                          className="text-sm text-primary hover:text-primary-2"
                          onClick={() => handleCopy(`${BASE_URL}${item.file_path}`)}
                        >
                          <MdOutlineFileCopy className="inline-block mr-1 w-5 h-5" />
                        </button>
                        <button
                          className="text-sm text-primary hover:text-primary-2"
                          onClick={() => handleShare(`${BASE_URL}${item.file_path}`)}
                        >
                          <FiShare2 className="inline-block mr-1 w-5 h-5" />
                        </button>
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
                <span className="text-lg text-foreground">
                  Showing {pageLink} to {totalPagesLink} of {totalPagesLink}{" "}
                  results
                </span>

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
      )
      }
    </div >
  );
}


export default withAuth(FileManagement);