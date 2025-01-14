"use client";

import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import {
  MdOutlineFileCopy,
  MdDeleteOutline,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import { FiShare2 } from "react-icons/fi";
import { VscSettings } from "react-icons/vsc";
import { RiEdit2Line } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";
import DashboardCards  from "./cardAdmin";
import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/navigation";

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

// link
const generateLinkData = (count) => {
  const roles = ["admin", "user", "user public"];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    shortLink: `bit.ly/${100 + i}`,
    originalLink: `https://example.com/longlink${i + 1}`,
    role: roles[i % roles.length],
    date: `2025-01-${String(i + 1).padStart(2, "0")}`,
  }));
};

const linkData = generateLinkData(5);

export default function FileManagement() {
  const [activeTab, setActiveTab] = useState("Image");
  const {user} = useAuth();
  const router = useRouter();



  // image
  const [perPageImage, setPerPageImage] = useState(10);
  const [pageImage, setPageImage] = useState(1);

  const lastIndexImage = pageImage * perPageImage;
  const firstIndexImage = lastIndexImage - perPageImage;
  const currentImage = imageData.slice(firstIndexImage, lastIndexImage);
  const totalPagesImage = Math.ceil(imageData.length / perPageImage);

  const changePageImage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPagesImage) {
      setPageImage(pageNumber);
    }
  };

  //  links
  const [perPageLink, setPerPageLink] = useState(10);
  const [pageLink, setPageLink] = useState(1);

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
        <h1 className="text-lg font-bold text-foreground">Management File Admin</h1>
        <p className="text-primary text-xl">Categories</p>
      </div>
      <div className="flex items-center justify-between mb-4 pt-6 pb-10">
        <div className="flex space-x-4">
          <div className="px-1 py-2 rounded-2xl transition-all duration-300 bg-white">
            {["Image", "Link"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 mx-1 rounded-xl transition-all duration-300 ${
                  activeTab === tab
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
        <DashboardCards/>
    

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
                  <td className="px-4 py-2">{firstIndexImage + index + 1}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">
                    <img
                      src={user.thumbnail}
                      alt="Thumbnail"
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <a
                      href={user.shortlink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary-2"
                    >
                      {user.shortlink}
                    </a>
                  </td>
                  <td className="px-4 py-2">{user.dateCreated}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <Link href="/Dashboard/management-file-Admin/edit-detail-image" className="text-primary hover:text-primary-2">
                        <RiEdit2Line className="w-6 h-6" />
                      </Link>
                      <button className="text-primary hover:text-primary-2">
                        <MdDeleteOutline className="w-6 h-6" />
                      </button>
                      <Link href="/Dashboard/management-file-Admin/view-detail-image" className="text-primary hover:text-primary-2">
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
            Showing {firstIndexImage + 1} to {Math.min(lastIndexImage, imageData.length)} of {imageData.length} results
          </span>

          <div className="flex items-center space-x-2">
            <button
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                pageImage === 1 ? "bg-white text-foreground" : "bg-primary text-white"
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
                className={`w-8 h-8 rounded-full ${
                  pageImage === i + 1
                    ? "bg-primary text-white"
                    : "bg-white border text-foreground"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                pageImage === totalPagesImage
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
                {currentLink.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-t ${
                      index % 2 === 1 ? "bg-tertiary-10" : ""
                    }`}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{item.shortLink}</td>
                    <td className="px-4 py-2">{item.originalLink}</td>
                    <td className="px-4 py-2">{item.date}</td>
                    <td className="px-4 py-2">{item.role}</td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <button className="text-primary hover:text-primary-2">
                        <RiEdit2Line className="w-6 h-6" />
                      </button>
                      <button className="text-primary hover:text-primary-2">
                        <MdDeleteOutline className="w-6 h-6" />
                      </button>
                      <Link href="/Dashboard/management-file-Admin/view-detail-link" className="text-primary hover:text-primary-2">
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
                <span className="text-lg text-foreground">
                  Showing {pageLink} to {totalPagesLink} of {totalPagesLink}{" "}
                  results
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      pageLink === 1
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
                      className={`w-8 h-8 rounded-full ${
                        pageLink === i + 1
                          ? "bg-primary text-white"
                          : "bg-white border text-foreground"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      pageLink === totalPagesLink
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
