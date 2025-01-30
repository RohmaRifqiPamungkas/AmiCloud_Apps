"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function LayoutHandler({ children }) {
  const pathname = usePathname();

  const globalLayoutRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];
  const useGlobalLayout = globalLayoutRoutes.includes(pathname);
  return (
    <>
      {useGlobalLayout && <Navbar />}
      <main className={`bg-tertiary-5 ${useGlobalLayout ? "py-20" : ""}`}>
        {children}
      </main>
      {useGlobalLayout && <Footer />}
    </>
  );
}
