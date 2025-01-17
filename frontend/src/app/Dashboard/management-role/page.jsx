"use client";

import withAuth from "@/components/AuthProvider";
import Notification from "@/components/Notification/Notification";
import useRoleManagement from "@/hooks/role";
import { showConfirmDialog } from "@/lib/modal";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import {
  MdDeleteOutline,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { VscSettings } from "react-icons/vsc";


const formatAccess = (data) => {
  if (!data || data == "") {
    return []
  }

  return data.split(',').map((item) => item.trim());
}

function ListManagementRole() {

  const { roleList, deleteRole, isLoading, error } = useRoleManagement();
  const [notification, setNotification] = useState(null);

  //  links
  const [perPageLink, setPerPageLink] = useState(10);
  const [pageLink, setPageLink] = useState(1);

  const totalPagesLink = 1

  const changePageLink = (pageNumber) => {
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

  const handleDelete = (id) => {
    showConfirmDialog({
      alertContent: "Are you sure you want to delete this Role?",
      onConfirm: async () => {
        try {
          await deleteRole(id);
          toggleNotification("Role Deleted Successfully");
        }
        catch (error) {
          alert('Error Deleting File')
        }
      },
    });
  };

  return (
    <div className="p-6">
      {notification?.show && (
        <Notification message={notification.message} />
      )}
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
              {roleList?.data.map((role, index) => (
                <tr
                  key={role.id}
                  className={`border-t ${index % 2 === 1 ? "bg-tertiary-10" : ""
                    }`}
                >
                  <td className="px-4 py-2">{role.name}</td>
                  <td className="px-4 py-2">
                    <div className="max-w-full overflow-x-auto">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {formatAccess(role.access).map((accessItem, index) => (
                          <span
                            key={index}
                            className="inline-block text-center py-[0.3rem] text-sm text-white bg-tertiary-75 rounded-full"
                          >
                            {accessItem}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <Link href={`/Dashboard/management-role/edit-role/${role.id}`} className="text-sm text-primary hover:text-primary-2">
                        <RiEdit2Line className="inline-block mr-1 w-6 h-6" />
                      </Link>
                      <button className="text-sm text-primary hover:text-primary-2" onClick={() => handleDelete(role.id)}>
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
      </div>
    </div>
  );
}


export default withAuth(ListManagementRole, 'admin')