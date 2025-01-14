"use client";

import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import {
  MdDeleteOutline,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { VscSettings } from "react-icons/vsc";
import { RiEdit2Line } from "react-icons/ri";
import Link from "next/link";



const generateUserData = (count) => {
    const roles = ["admin", "user", "user public"];
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      access: `user${i + 1}`,
      role: roles[i % roles.length],
    }));
  };
  
  const userData = generateUserData(2);

export default function ListManajemenRole() {

  //  links
  const [perPageLink, setPerPageLink] = useState(10);
  const [pageLink, setPageLink] = useState(1);

  const lastIndexLink = pageLink * perPageLink;
  const firstIndexLink = lastIndexLink - perPageLink;
  const currentUsers = userData.slice(firstIndexLink, lastIndexLink);
  const totalPagesLink = Math.ceil(userData.length / perPageLink);

  const changePageLink = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPagesLink) {
      setPageLink(pageNumber);
    }
  };

  return (
    <div className="p-6">
      <div>
        <h1 className=" text-primary font-bold text-xl">Management Role</h1>
        <p className="text-lg  text-foreground">Manage role here</p>
      </div>
      <div className="flex items-center justify-between mb-4 pt-6 pb-10">
        <div className="flex space-x-4">
        <h1 className="text-lg font-bold text-foreground">Role & Permission </h1>
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
          <Link href="/Dashboard/management-role/add-role" className="flex items-center px-4 py-2 bg-secondary rounded-3xl text-foreground hover:bg-primary hover:text-white">
            <IoMdAdd className="mr-2" />
            Add Role
          </Link>
        </div>
      </div>

        <div>
          <div className="overflow-x-auto rounded-3xl shadow-lg">
            <table className="min-w-full bg-white border">
              <thead className="bg-tertiary-25 text-foreground">
                <tr>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Access</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
              {currentUsers.map((user, index) => (
              <tr
                key={user.id}
                className={`border-t ${
                  index % 2 === 1 ? "bg-tertiary-10" : ""
                }`}
              >
               
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">{user.access}</td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                  <Link href="/Dashboard/management-role/edit-role" className="text-sm text-primary hover:text-primary-2">
                      <RiEdit2Line  className="inline-block mr-1 w-6 h-6" />
                    </Link>
                    <button className="text-sm text-primary hover:text-primary-2">
                      <MdDeleteOutline className="inline-block mr-1 w-6 h-6" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
              </tbody>
            </table>
          </div>
        
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
        </div>
    </div>
  );
}
