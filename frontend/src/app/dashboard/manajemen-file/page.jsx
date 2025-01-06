"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function FileManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Data sample
  const data = Array.from({ length: 24 }, (_, index) => ({
    id: index + 1,
    title: `Title Image ${index + 1}`,
    image: `https://via.placeholder.com/150?text=Image+${index + 1}`,
  }));

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const displayedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-purple-800">
            Management File
          </h1>
          <p className="text-sm text-gray-600">Categories</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800">
            Image
          </button>
          <button className="px-4 py-2 bg-white border border-purple-700 text-purple-700 rounded-md hover:bg-purple-100">
            Link
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-4 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
        />
        <button className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
          Filters
        </button>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-4 gap-6">
        {displayedData.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white rounded-md shadow-md flex flex-col items-center"
          >
            <Image
              src={item.image}
              alt={item.title}
              className="w-32 h-32 rounded-md object-cover mb-4"
              width={40}
              height={40}
            />
            <h3 className="text-sm font-semibold text-center">{item.title}</h3>
            <div className="flex justify-between w-full mt-4">
              <button className="text-gray-500 hover:text-purple-700">
                👁️
              </button>
              <button className="text-gray-500 hover:text-purple-700">
                🖊️
              </button>
              <button className="text-gray-500 hover:text-purple-700">
                🗑️
              </button>
              <button className="text-gray-500 hover:text-purple-700">
                ⬇️
              </button>
              <button className="text-gray-500 hover:text-purple-700">
                🔗
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 gap-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`px-3 py-1 rounded-md ${
              currentPage === index + 1
                ? "bg-purple-700 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
