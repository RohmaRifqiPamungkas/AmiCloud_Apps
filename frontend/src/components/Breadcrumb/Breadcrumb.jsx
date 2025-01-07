"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Breadcrumb() {
  const pathname = usePathname();

  const paths = pathname
    .split("/")
    .filter((segment) => segment) // Hapus elemen kosong
    .map((segment, index, arr) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: "/" + arr.slice(0, index + 1).join("/"),
    }));

  return (
    <nav aria-label="breadcrumb">
      <ol className="flex space-x-2">
        {paths.map((path, index) => (
          <li key={index} className="flex items-center">
              <Link
              href={path.href}
              className={`${
                pathname === path.href
                  ? "text-black font-semibold" 
                  : "text-gray-600 hover:underline hover:text-gray-800"
              }`}
            >
              {path.label}
            </Link>
            {index < paths.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
