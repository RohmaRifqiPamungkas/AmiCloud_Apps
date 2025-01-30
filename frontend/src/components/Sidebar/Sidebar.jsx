
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "@/lib/axios";
import { FiLogOut } from "react-icons/fi";
import Image from "next/image";
import Logo from "../../../public/Navbar/Navbar.png";
import { MdOutlineUploadFile } from "react-icons/md";
import { RiFolderSettingsLine } from "react-icons/ri";
import { AiOutlineUserAdd } from "react-icons/ai";
import { LuUserRoundCog } from "react-icons/lu";
import { PiListDashesBold } from "react-icons/pi";
import { useAuth } from "@/hooks/auth";

export default function Sidebar({ isCollapsed }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/v1/profile");
        console.log("Fetched Profile Data:", response.data); 
        setUserRoles(response.data.roles || []); 
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Validasi roles
  const getMenuSections = (roles) => {
    if (!Array.isArray(roles)) {
      console.error("Roles is not a valid array:", roles);
      return [];
    }

    if (roles.includes("admin")) {
      return [
        {
          title: "Features App",
          items: [
            { name: "Features", href: "/Dashboard", icon: <MdOutlineUploadFile /> },
          ],
        },
        {
          title: "Configuration Admin",
          items: [
            {
              name: "Management File",
              href: "/Dashboard/management-file-admin",
              icon: <RiFolderSettingsLine />,
            },
          ],
        },
        {
          title: "Configuration User",
          items: [
            {
              name: "Add User",
              href: "/Dashboard/add-user",
              icon: <AiOutlineUserAdd />,
            },
            {
              name: "List User",
              href: "/Dashboard/list-user",
              icon: <PiListDashesBold />,
            },
            {
              name: "Management Role",
              href: "/Dashboard/management-role",
              icon: <LuUserRoundCog />,
            },
          ],
        },
      ];
    }

    return [
      {
        title: "Features App",
        items: [
          { name: "Features", href: "/Dashboard", icon: <MdOutlineUploadFile /> },
        ],
      },
      {
        title: "Configuration",
        items: [
          {
            name: "Management File",
            href: "/Dashboard/management-file",
            icon: <RiFolderSettingsLine />,
          },
        ],
      },
    ];
  };

  const menuSections = getMenuSections(userRoles);

  if (loading) {
    return <div>Loading Sidebar...</div>;
  }

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white min-h-screen transition-all duration-300 py-4 border-r border-gray-200 shadow-sm ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex justify-center items-center py-2">
        {isCollapsed ? (
          <span className="text-3xl font-bold text-primary">A</span>
        ) : (
          <Image src={Logo} alt="logo" className="w-1/2" />
        )}
      </div>

      <nav className="flex-grow mt-4">
        {menuSections.map((section, index) => (
          <div key={index} className="mb-4 px-5">
            {!isCollapsed && (
              <h2 className="text-sm font-semibold text-gray-600 mb-2">
                {section.title}
              </h2>
            )}

            {section.items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative group flex items-center gap-4 py-2 px-2 transition-colors rounded-lg overflow-hidden ${
                  pathname === item.href
                    ? "bg-tertiary-25 text-primary"
                    : "text-gray-600 hover:bg-tertiary-25 hover:text-primary"
                }`}
              >
                <span
                  className={`absolute left-0 top-0 bottom-0 w-2 bg-primary rounded-r-full transition-transform transform ${
                    pathname === item.href
                      ? "scale-y-100"
                      : "scale-y-0 group-hover:scale-y-100"
                  }`}
                  aria-hidden="true"
                ></span>

                <span className="text-lg z-10 relative pl-1 group-hover:text-primary">
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <span className="z-10 relative group-hover:text-primary">
                    {item.name}
                  </span>
                )}

                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                  aria-hidden="true"
                ></span>
              </Link>
            ))}

            {index < menuSections.length - 1 && (
              <div className="border-t border-gray-200 my-2"></div>
            )}
          </div>
        ))}
      </nav>

      <div className="mt-auto py-2 px-5">
        <button
          onClick={logout}
          className={`relative group flex items-center gap-4 py-2 px-2 transition-colors rounded-lg overflow-hidden w-full ${
            pathname === "/logout"
              ? "bg-tertiary-25 text-primary"
              : "text-foreground hover:bg-tertiary-25 hover:text-primary"
          }`}
        >
          <span
            className={`absolute left-0 top-0 bottom-0 w-2 bg-primary rounded-r-full transition-transform transform ${
              pathname === "/logout"
                ? "scale-y-100"
                : "scale-y-0 group-hover:scale-y-100"
            }`}
            aria-hidden="true"
          ></span>

          <span className="text-lg z-10 relative pl-1 group-hover:text-primary">
            <FiLogOut />
          </span>

          {!isCollapsed && (
            <span className="z-10 relative group-hover:text-primary">
              Log Out
            </span>
          )}

          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
            aria-hidden="true"
          ></span>
        </button>
      </div>
    </aside>
  );
}
