

'use client';

import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/auth";
import {useRouter} from "next/navigation";



export default function VerificationPage() {
  const router = useRouter();
  const { logout, resendEmailVerification, verifyEmail } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/Dashboard",
  });

  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // const handleVerification = async () => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const id = urlParams.get("id");
  //   const hash = urlParams.get("hash");

  //   if (id && hash) {
  //     try {
  //       await verifyEmail({ id, hash, setStatus, setErrors });
  //     } catch (error) {
  //       console.error("Failed to verify email:", error);
  //       setErrors(["An unexpected error occurred during email verification."]);
  //     }
  //   } else {
  //     setErrors(["Invalid or missing verification link."]);
  //   }
  // };

  const handleVerification = async () => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");
      const hash = urlParams.get("hash");
      const expires = urlParams.get("expires");
      const signature = urlParams.get("signature");

      if (id && hash && expires && signature) {
        try {
          await verifyEmail({
            id,
            hash,
            setStatus,
            setErrors,
          });
          router.push("/Dashboard?verified=1");
        } catch (error) {
          console.error("Email verification failed:", error);
          setErrors(["Invalid or expired verification link."]);
        }
      } else {
        setErrors(["Verification link is incomplete or invalid."]);
      }
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true); 
    try {
      await resendEmailVerification({ setStatus });
    } catch (error) {
      console.error("Failed to resend email verification:", error);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleLogout = () => {
    console.log('Logging out from VerificationPage...');
    logout();
  };


  React.useEffect(() => {
    handleVerification();
  }, []);


  return (
    <>
    <div >
    <p className="mt-4 text-foreground text-left md:text-xl">
    Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn&apos;t receive the email, we will gladly send you another.
      </p>

      {status && (
        <p className="mt-4 text-green-600 text-justify">{status}</p>
      )}

      <div className="mt-6 flex justify-center">
      <button
            onClick={handleResendEmail}
            disabled={isLoading} 
            className={`w-full py-2 px-4 font-bold rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-secondary text-black hover:bg-primary hover:text-white'
          }`}
          >
            {isLoading ? 'Resend Verification Email' : 'Resend Verification Email'} 
          </button>
      </div>

      <p className="mt-6 text-center text-sm md:text-base text-gray-500">
      Not using your account anymore?&nbsp;
        <button onClick={handleLogout} className="text-blue-500 underline hover:underline">
          Log Out
        </button>
      </p>
    </div>     
      </>
  );
}