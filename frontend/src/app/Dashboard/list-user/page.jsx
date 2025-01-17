"use client";

import withAuth from "@/components/AuthProvider";
import { useUsers } from "@/hooks/users";
import { formatDate } from "@/lib/date";
import { showConfirmDialog } from "@/lib/modal";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import {
  MdDeleteOutline,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { VscSettings } from "react-icons/vsc";


function ListUser() {

  const [perPageLink, setPerPageLink] = useState(10);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");


  const [pagination, setPagination] = useState({
    data: [],
    currentPage: 1,
    perPage: 10,
    total: 0,
    totalPages: 1,
    firstIndex: 1,
    lastIndex: 1,
  });

  const { users, isLoading, isError, deleteUser, mutateUsers } = useUsers(pagination.currentPage, pagination.perPage, searchQuery);

  useEffect(() => {
    if (users) {
      setPagination({
        data: users.data,
        currentPage: users.current_page,
        perPage: users.per_page,
        total: users.total,
        totalPages: users.last_page,
        firstIndex: users.from,
        lastIndex: users.to,
      });
    }
  }, [users]); 

  useEffect(() => {
    if (users) {
      if (pagination.currentPage !== users.current_page || pagination.perPage !== users.per_page) {
        mutateUsers(`/api/v1/users?page=${pagination.currentPage}&perPage=${pagination.perPage}&search=${searchQuery}`);
      }
    }
  }, [pagination.currentPage, pagination.perPage, searchQuery, mutateUsers, users]);

  if (!user) {
    return null; 
  }

  // useEffect(() => {
  //   if (searchQuery || pagination.currentPage > 1) {
  //     mutateUsers(`/api/v1/users?page=${pagination.currentPage}&perPage=${pagination.perPage}&search=${searchQuery}`);
  //   }
  // }, [searchQuery]);



  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const changePageLink = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: pageNumber,
      }));
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
      alertContent: "Are you sure you want to delete this User?",
      onConfirm: () => {
        try {
          deleteUser(id).then(() => {
            toggleNotification('File successfully Deleted')
          });
        }
        catch (error) {
          alert('Error Deleting File')
        }
      },
    });
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="p-6">
      <div>
        <h1 className=" text-primary font-bold text-xl">List User</h1>
        <p className="text-lg  text-foreground">Manage all users here</p>
      </div>
      <div className="flex items-center justify-between mb-4 pt-6 pb-10">
        <div className="flex space-x-4">
          <h1 className="text-lg font-bold text-foreground">
            All Users <span className="text-primary">({pagination.total})</span>
          </h1>        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <AiOutlineSearch className="absolute left-3 top-3 text-foreground" />
            <input
              type="text"
              placeholder="Search"
              onChange={handleSearch}
              value={searchQuery}
              className="pl-8 pr-4 py-2 rounded-3xl bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-white rounded-3xl text-foreground hover:bg-primary hover:text-white">
            <VscSettings className="mr-2" />
            Filters
          </button>
          <Link href="/Dashboard/add-user" className="flex items-center px-4 py-2 bg-secondary rounded-3xl text-foreground hover:bg-primary hover:text-white">
            <IoMdAdd className="mr-2" />
            Add User
          </Link>
        </div>
      </div>

      <div>
        <div className="overflow-x-auto rounded-3xl shadow-lg">
          <table className="min-w-full bg-white border">
            <thead className="bg-tertiary-25 text-foreground">
              <tr>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Date Created</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {pagination.data && pagination.data.map((user, index) => (
                <tr
                  key={user?.id || index}
                  className={`border-t ${index % 2 === 1 ? "bg-tertiary-10" : ""
                    }`}
                >
                  <td className="px-4 py-2">{user?.username || "N/A"}</td>
                  <td className="px-4 py-2">{user?.email || "N/A"}</td>
                  <td className="px-4 py-2">
                    {user?.roles?.length ? user.roles : '-'}
                  </td>
                  <td className="px-4 py-2">{formatDate(user?.created_at) || "N/A"}</td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <Link href={`/Dashboard/list-user/edit-user/${user.id}`} className="text-sm text-primary hover:text-primary-2">
                        <RiEdit2Line className="inline-block mr-1 w-6 h-6" />
                      </Link>
                      <button className="text-sm text-primary hover:text-primary-2" onClick={() => handleDelete(user.id)}>
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
              Showing {pagination.firstIndex} to {pagination.lastIndex} of {pagination.total}
              results
            </span>

            <div className="flex items-center space-x-2">
              <button
                className={`w-10 h-10 rounded-full flex items-center justify-center ${pagination.currentPage === 1
                  ? "bg-white text-foreground"
                  : "bg-primary text-white"
                  }`}
                disabled={pagination.currentPage === 1}
                onClick={() => changePageLink(pagination.currentPage - 1)}
              >
                <MdNavigateBefore className="text-xl" />
              </button>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => changePageLink(i + 1)}
                  className={`w-8 h-8 rounded-full ${pagination.currentPage === i + 1
                    ? "bg-primary text-white"
                    : "bg-white border text-foreground"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className={`w-10 h-10 rounded-full flex items-center justify-center ${pagination.currentPage === pagination.totalPages
                  ? "bg-white text-foreground"
                  : "bg-primary text-white"
                  }`}
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => changePageLink(pagination.currentPage + 1)}
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

export default withAuth(ListUser, 'admin');